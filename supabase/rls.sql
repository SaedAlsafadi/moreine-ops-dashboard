-- =============================================================
-- Moreine Coffee Roastery – Ops Dashboard
-- Row Level Security (RLS) Policies
-- Single-org internal tool: all authenticated users have full access
-- stock_movements is a read-only ledger (SELECT only)
-- =============================================================

-- =============================================================
-- SCHEMA & ROLE GRANTS
-- =============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- =============================================================
-- green_inventory – full access for authenticated users
-- =============================================================

ALTER TABLE green_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "green_inventory: authenticated select"
    ON green_inventory
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "green_inventory: authenticated insert"
    ON green_inventory
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "green_inventory: authenticated update"
    ON green_inventory
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "green_inventory: authenticated delete"
    ON green_inventory
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================
-- roast_batches – full access for authenticated users
-- =============================================================

ALTER TABLE roast_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roast_batches: authenticated select"
    ON roast_batches
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "roast_batches: authenticated insert"
    ON roast_batches
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "roast_batches: authenticated update"
    ON roast_batches
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "roast_batches: authenticated delete"
    ON roast_batches
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================
-- roasted_stock – full access for authenticated users
-- =============================================================

ALTER TABLE roasted_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roasted_stock: authenticated select"
    ON roasted_stock
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "roasted_stock: authenticated insert"
    ON roasted_stock
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "roasted_stock: authenticated update"
    ON roasted_stock
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "roasted_stock: authenticated delete"
    ON roasted_stock
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================
-- sales_log – full access for authenticated users
-- =============================================================

ALTER TABLE sales_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_log: authenticated select"
    ON sales_log
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "sales_log: authenticated insert"
    ON sales_log
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "sales_log: authenticated update"
    ON sales_log
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "sales_log: authenticated delete"
    ON sales_log
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================
-- stock_movements – READ-ONLY ledger; no INSERT/UPDATE/DELETE
-- Rows are written exclusively by database triggers.
-- Authenticated users may only SELECT.
-- =============================================================

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_movements: authenticated select"
    ON stock_movements
    FOR SELECT
    TO authenticated
    USING (true);

-- NOTE: No INSERT/UPDATE/DELETE policies are created for stock_movements.
-- The trigger functions run as the table owner (definer security) and
-- bypass RLS, so triggers can still write rows while app-layer clients
-- cannot mutate the ledger directly.
