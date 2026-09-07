-- =============================================================
-- Moreine Coffee Roastery – Ops Dashboard
-- Migration 002: Roasted Packaging Formats & Coffee Lot Profiles
-- =============================================================

-- 1. Extend green_inventory with specialty coffee profile fields
ALTER TABLE green_inventory
    ADD COLUMN IF NOT EXISTS process text NULL,          -- e.g. مجفف / Natural, مغسول / Washed
    ADD COLUMN IF NOT EXISTS region text NULL,           -- e.g. سيرادو / Cerrado
    ADD COLUMN IF NOT EXISTS variety text NULL,          -- e.g. بوربون / Bourbon
    ADD COLUMN IF NOT EXISTS altitude text NULL,         -- e.g. 1200-1800m
    ADD COLUMN IF NOT EXISTS cup_score numeric NULL,     -- e.g. 84
    ADD COLUMN IF NOT EXISTS tasting_notes text NULL;    -- e.g. سكر بني، جوز، كاكاو، ليمون

-- 2. Extend roasted_stock with packaging formats
-- Formats:
--   'bulk': loose roasted beans in kg
--   'bag_1kg': 1kg bag (1000g)
--   'bag_250g': 250g retail bag
--   'drip_box': fast brew filter box (counted in boxes)
--   'custom': other customized pack
ALTER TABLE roasted_stock
    ADD COLUMN IF NOT EXISTS package_type text NOT NULL DEFAULT 'bulk',
    ADD COLUMN IF NOT EXISTS box_sachets_count int NULL DEFAULT 5,
    ADD COLUMN IF NOT EXISTS net_weight_per_unit_g numeric NULL;

-- Ensure constraint on package_type
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_roasted_stock_package_type'
    ) THEN
        ALTER TABLE roasted_stock
            ADD CONSTRAINT chk_roasted_stock_package_type
            CHECK (package_type IN ('bulk', 'bag_1kg', 'bag_250g', 'drip_box', 'custom'));
    END IF;
END $$;

-- 3. Update stock_movements trigger to capture packaging type and units
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
        'Roasted stock added: ' || COALESCE(NEW.package_type, 'bulk') ||
        CASE WHEN NEW.unit_count IS NOT NULL THEN ' (' || NEW.unit_count || ' units)' ELSE '' END
    );
    RETURN NEW;
END;
$$;