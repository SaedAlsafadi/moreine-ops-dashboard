-- =============================================================
-- Moreine Coffee Roastery – Ops Dashboard
-- Row Level Security (RLS) Policies & Trigger Fixes
-- Idempotent: 100% safe to run multiple times without errors
-- =============================================================

-- 1. SCHEMA & ROLE GRANTS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================================
-- green_inventory
-- =============================================================
ALTER TABLE green_inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "green_inventory: authenticated select" ON green_inventory;
CREATE POLICY "green_inventory: authenticated select"
    ON green_inventory FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "green_inventory: authenticated insert" ON green_inventory;
CREATE POLICY "green_inventory: authenticated insert"
    ON green_inventory FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "green_inventory: authenticated update" ON green_inventory;
CREATE POLICY "green_inventory: authenticated update"
    ON green_inventory FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "green_inventory: authenticated delete" ON green_inventory;
CREATE POLICY "green_inventory: authenticated delete"
    ON green_inventory FOR DELETE TO authenticated USING (true);


-- =============================================================
-- roast_batches
-- =============================================================
ALTER TABLE roast_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roast_batches: authenticated select" ON roast_batches;
CREATE POLICY "roast_batches: authenticated select"
    ON roast_batches FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "roast_batches: authenticated insert" ON roast_batches;
CREATE POLICY "roast_batches: authenticated insert"
    ON roast_batches FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "roast_batches: authenticated update" ON roast_batches;
CREATE POLICY "roast_batches: authenticated update"
    ON roast_batches FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "roast_batches: authenticated delete" ON roast_batches;
CREATE POLICY "roast_batches: authenticated delete"
    ON roast_batches FOR DELETE TO authenticated USING (true);


-- =============================================================
-- roasted_stock
-- =============================================================
ALTER TABLE roasted_stock ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roasted_stock: authenticated select" ON roasted_stock;
CREATE POLICY "roasted_stock: authenticated select"
    ON roasted_stock FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "roasted_stock: authenticated insert" ON roasted_stock;
CREATE POLICY "roasted_stock: authenticated insert"
    ON roasted_stock FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "roasted_stock: authenticated update" ON roasted_stock;
CREATE POLICY "roasted_stock: authenticated update"
    ON roasted_stock FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "roasted_stock: authenticated delete" ON roasted_stock;
CREATE POLICY "roasted_stock: authenticated delete"
    ON roasted_stock FOR DELETE TO authenticated USING (true);


-- =============================================================
-- sales_log
-- =============================================================
ALTER TABLE sales_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sales_log: authenticated select" ON sales_log;
CREATE POLICY "sales_log: authenticated select"
    ON sales_log FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "sales_log: authenticated insert" ON sales_log;
CREATE POLICY "sales_log: authenticated insert"
    ON sales_log FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "sales_log: authenticated update" ON sales_log;
CREATE POLICY "sales_log: authenticated update"
    ON sales_log FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "sales_log: authenticated delete" ON sales_log;
CREATE POLICY "sales_log: authenticated delete"
    ON sales_log FOR DELETE TO authenticated USING (true);


-- =============================================================
-- stock_movements
-- Ledger: Authenticated users can SELECT and INSERT (for quick adjust/pack/transfer logs)
-- =============================================================
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stock_movements: authenticated select" ON stock_movements;
CREATE POLICY "stock_movements: authenticated select"
    ON stock_movements FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "stock_movements: authenticated insert" ON stock_movements;
CREATE POLICY "stock_movements: authenticated insert"
    ON stock_movements FOR INSERT TO authenticated WITH CHECK (true);


-- =============================================================
-- TRIGGER FUNCTIONS (SECURITY DEFINER to avoid RLS violation when triggers fire)
-- =============================================================

CREATE OR REPLACE FUNCTION trg_green_inventory_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION trg_roasted_stock_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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
            category,
            action,
            quantity_kg,
            ref_id,
            from_channel
        ) VALUES (
            'roasted',
            NEW.status,
            NEW.quantity_kg,
            NEW.id,
            OLD.channel
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