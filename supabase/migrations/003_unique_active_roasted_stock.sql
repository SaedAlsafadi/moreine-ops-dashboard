-- =============================================================
-- Moreine Coffee Roastery – Ops Dashboard
-- Migration 003: Prevent Duplicate Active Roasted Stock & RLS Trigger Safeguards
-- =============================================================

-- 1. Create Unique Index for Active Roasted Stock
-- Prevents race conditions and duplicate rows for the same coffee, packaging, and channel
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_roasted_stock 
ON roasted_stock (roast_batch_id, channel, package_type) 
WHERE status = 'in_stock';

-- 2. Ensure stock_movements allows INSERT for authenticated users
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stock_movements: authenticated select" ON stock_movements;
CREATE POLICY "stock_movements: authenticated select"
    ON stock_movements FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "stock_movements: authenticated insert" ON stock_movements;
CREATE POLICY "stock_movements: authenticated insert"
    ON stock_movements FOR INSERT TO authenticated WITH CHECK (true);

-- 3. Ensure trigger functions run as SECURITY DEFINER to bypass RLS errors
CREATE OR REPLACE FUNCTION trg_green_inventory_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO stock_movements (
        category, action, quantity_kg, ref_id, note
    ) VALUES (
        'green', 'received', NEW.initial_kg, NEW.id, 'Green lot received: ' || NEW.lot_name
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trg_roasted_stock_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO stock_movements (
        category, action, quantity_kg, ref_id, to_channel, note
    ) VALUES (
        'roasted', 'roasted_in', NEW.quantity_kg, NEW.id, NEW.channel,
        'Roasted stock added: ' || COALESCE(NEW.package_type, 'bulk') ||
        CASE WHEN NEW.unit_count IS NOT NULL THEN ' (' || NEW.unit_count || ' units)' ELSE '' END
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trg_roasted_stock_after_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status
       AND NEW.status IN ('sold', 'consumed')
    THEN
        INSERT INTO stock_movements (
            category, action, quantity_kg, ref_id, from_channel
        ) VALUES (
            'roasted', NEW.status, NEW.quantity_kg, NEW.id, OLD.channel
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trg_sales_log_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO stock_movements (
        category, action, quantity_kg, ref_id, to_channel, note
    ) VALUES (
        'roasted', 'sold', CASE WHEN NEW.unit = 'kg' THEN NEW.quantity ELSE 0 END,
        NEW.id, NEW.channel, NEW.product_description
    );
    RETURN NEW;
END;
$$;
