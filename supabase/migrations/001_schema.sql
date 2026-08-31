-- =============================================================
-- Moreine Coffee Roastery – Ops Dashboard
-- Migration 001: Initial Schema
-- =============================================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- TABLES
-- =============================================================

-- ------------------------------------------------------------
-- green_inventory
-- Tracks raw green coffee lots arriving at the roastery
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS green_inventory (
    id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_name      text         NOT NULL,
    origin        text         NOT NULL,
    supplier      text         NOT NULL,
    arrival_date  date         NOT NULL,
    initial_kg    numeric      NOT NULL CHECK (initial_kg > 0),
    remaining_kg  numeric      NOT NULL CHECK (remaining_kg >= 0),
    cost_per_kg   numeric      NULL,
    notes         text         NULL,
    created_at    timestamptz  NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- roast_batches
-- Each row represents one roast run consuming a green lot
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roast_batches (
    id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    green_lot_id  uuid         NOT NULL REFERENCES green_inventory(id) ON DELETE RESTRICT,
    roast_date    date         NOT NULL,
    input_kg      numeric      NOT NULL CHECK (input_kg > 0),
    output_kg     numeric      NOT NULL CHECK (output_kg > 0),
    yield_pct     numeric      GENERATED ALWAYS AS (
                                    ROUND((output_kg / input_kg * 100)::numeric, 2)
                               ) STORED,
    notes         text         NULL,
    created_at    timestamptz  NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- roasted_stock
-- Inventory of roasted coffee, bulk or packed, by channel
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roasted_stock (
    id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    roast_batch_id  uuid         NOT NULL REFERENCES roast_batches(id) ON DELETE RESTRICT,
    state           text         NOT NULL CHECK (state IN ('bulk', 'packed')),
    package_size_g  int          NULL,
    unit_count      int          NULL,
    quantity_kg     numeric      NOT NULL CHECK (quantity_kg >= 0),
    channel         text         NOT NULL CHECK (channel IN ('unallocated', 'bar', 'b2c', 'b2b')),
    status          text         NOT NULL CHECK (status IN ('in_stock', 'shipped', 'sold', 'consumed'))
                                 DEFAULT 'in_stock',
    produced_date   date         NOT NULL,
    notes           text         NULL,
    created_at      timestamptz  NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- stock_movements
-- Append-only ledger; populated exclusively by triggers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_movements (
    id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    date          timestamptz  NOT NULL DEFAULT now(),
    category      text         NOT NULL CHECK (category IN ('green', 'roasted')),
    ref_id        uuid         NOT NULL,
    action        text         NOT NULL CHECK (action IN (
                                    'received',
                                    'roasted_out',
                                    'roasted_in',
                                    'packed',
                                    'allocated',
                                    'transferred',
                                    'sold',
                                    'consumed',
                                    'adjusted'
                               )),
    quantity_kg   numeric      NOT NULL,
    from_channel  text         NULL,
    to_channel    text         NULL,
    note          text         NULL
);

-- ------------------------------------------------------------
-- sales_log
-- Records every sale event, manual or from integrations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales_log (
    id                  uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    date                date         NOT NULL,
    channel             text         NOT NULL CHECK (channel IN ('b2c', 'b2b')),
    product_description text         NOT NULL,
    quantity            numeric      NOT NULL,
    unit                text         NOT NULL CHECK (unit IN ('kg', 'units')) DEFAULT 'units',
    revenue             numeric      NULL,
    source              text         NOT NULL CHECK (source IN ('manual', 'salla', 'rewaa'))
                                     DEFAULT 'manual',
    external_order_id   text         NULL,
    created_at          timestamptz  NOT NULL DEFAULT now()
);

-- =============================================================
-- INDEXES
-- =============================================================

CREATE INDEX IF NOT EXISTS idx_green_inventory_remaining_kg
    ON green_inventory (remaining_kg);

CREATE INDEX IF NOT EXISTS idx_roast_batches_green_lot_id
    ON roast_batches (green_lot_id);

CREATE INDEX IF NOT EXISTS idx_roasted_stock_batch_channel_status
    ON roasted_stock (roast_batch_id, channel, status);

CREATE INDEX IF NOT EXISTS idx_stock_movements_date_cat_action
    ON stock_movements (date DESC, category, action);

CREATE INDEX IF NOT EXISTS idx_sales_log_date_channel
    ON sales_log (date DESC, channel);

-- =============================================================
-- TRIGGER FUNCTIONS
-- =============================================================

-- ------------------------------------------------------------
-- 1. After INSERT on green_inventory
--    -> log a 'received' movement for the new green lot
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_green_inventory_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO stock_movements (
        category,
        action,
        quantity_kg,
        ref_id,
        note
    ) VALUES (
        'green',
        'received',
        NEW.initial_kg,
        NEW.id,
        'Green lot received: ' || NEW.lot_name
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_green_inventory_insert
    AFTER INSERT ON green_inventory
    FOR EACH ROW
    EXECUTE FUNCTION trg_green_inventory_after_insert();

-- ------------------------------------------------------------
-- 2. After INSERT on roasted_stock
--    -> log a 'roasted_in' movement for the new roasted stock
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_roasted_stock_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO stock_movements (
        category,
        action,
        quantity_kg,
        ref_id,
        to_channel,
        note
    ) VALUES (
        'roasted',
        'roasted_in',
        NEW.quantity_kg,
        NEW.id,
        NEW.channel,
        'Roasted stock created'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_roasted_stock_insert
    AFTER INSERT ON roasted_stock
    FOR EACH ROW
    EXECUTE FUNCTION trg_roasted_stock_after_insert();

-- ------------------------------------------------------------
-- 3. After UPDATE on roasted_stock when status -> 'sold'/'consumed'
--    -> log the disposition movement
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_roasted_stock_after_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only fire when status has actually changed to sold or consumed
    IF OLD.status IS DISTINCT FROM NEW.status
       AND NEW.status IN ('sold', 'consumed')
    THEN
        INSERT INTO stock_movements (
            category,
            action,
            quantity_kg,
            ref_id,
            from_channel
        ) VALUES (
            'roasted',
            NEW.status,   -- 'sold' or 'consumed' are both valid action values
            NEW.quantity_kg,
            NEW.id,
            OLD.channel
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_roasted_stock_update
    AFTER UPDATE ON roasted_stock
    FOR EACH ROW
    EXECUTE FUNCTION trg_roasted_stock_after_update();

-- ------------------------------------------------------------
-- 4. After INSERT on sales_log
--    -> log a 'sold' movement; quantity_kg = quantity when unit='kg', else 0
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_sales_log_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO stock_movements (
        category,
        action,
        quantity_kg,
        ref_id,
        to_channel,
        note
    ) VALUES (
        'roasted',
        'sold',
        CASE WHEN NEW.unit = 'kg' THEN NEW.quantity ELSE 0 END,
        NEW.id,
        NEW.channel,
        NEW.product_description
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sales_log_insert
    AFTER INSERT ON sales_log
    FOR EACH ROW
    EXECUTE FUNCTION trg_sales_log_after_insert();
