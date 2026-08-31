-- DEMO DATA: Clear before production use
-- =============================================================
-- Moreine Coffee Roastery – Ops Dashboard
-- Seed: Realistic demo data for development / staging
-- =============================================================

-- =============================================================
-- GREEN INVENTORY  (5 lots)
-- =============================================================
-- UUIDs: 11111111-1111-1111-1111-111111000001 .. 000005

INSERT INTO green_inventory
    (id, lot_name, origin, supplier, arrival_date, initial_kg, remaining_kg, cost_per_kg, notes)
VALUES
    (
        '11111111-1111-1111-1111-111111000001',
        'ETH-001',
        'Ethiopia',
        'Nordic Approach',
        CURRENT_DATE - INTERVAL '165 days',
        200,
        145,
        28.50,
        'Yirgacheffe, washed. Floral and citrus notes. Grade 1.'
    ),
    (
        '11111111-1111-1111-1111-111111000002',
        'ETH-002',
        'Ethiopia',
        'Trabocca',
        CURRENT_DATE - INTERVAL '130 days',
        150,
        150,
        26.00,
        'Sidama, natural. Berry-forward. Grade 1.'
    ),
    (
        '11111111-1111-1111-1111-111111000003',
        'COL-001',
        'Colombia',
        'Falcon Coffees',
        CURRENT_DATE - INTERVAL '100 days',
        250,
        180,
        24.75,
        'Huila, washed. Red apple and caramel. Excelso EP.'
    ),
    (
        '11111111-1111-1111-1111-111111000004',
        'COL-002',
        'Colombia',
        'Nordic Approach',
        CURRENT_DATE - INTERVAL '60 days',
        120,
        60,
        31.00,
        'Nariño, washed. Bright acidity, blackcurrant. Micro-lot.'
    ),
    (
        '11111111-1111-1111-1111-111111000005',
        'BRZ-001',
        'Brazil',
        'Trabocca',
        CURRENT_DATE - INTERVAL '45 days',
        300,
        240,
        18.50,
        'Cerrado Mineiro, natural/pulped. Chocolate, nuts, low acidity.'
    );

-- =============================================================
-- ROAST BATCHES  (6 batches)
-- =============================================================
-- UUIDs: 22222222-2222-2222-2222-222222000001 .. 000006

INSERT INTO roast_batches
    (id, green_lot_id, roast_date, input_kg, output_kg, notes)
VALUES
    (
        '22222222-2222-2222-2222-222222000001',
        '11111111-1111-1111-1111-111111000001',  -- ETH-001 Yirgacheffe
        CURRENT_DATE - INTERVAL '85 days',
        30,
        ROUND(30 * 0.857, 2),   -- ~14.3% loss -> 25.71 kg
        'Light roast – filter. Target development 22%.'
    ),
    (
        '22222222-2222-2222-2222-222222000002',
        '11111111-1111-1111-1111-111111000001',  -- ETH-001 Yirgacheffe
        CURRENT_DATE - INTERVAL '50 days',
        25,
        ROUND(25 * 0.858, 2),   -- ~14.2% loss -> 21.45 kg
        'Light roast – filter. Second batch for bar channel.'
    ),
    (
        '22222222-2222-2222-2222-222222000003',
        '11111111-1111-1111-1111-111111000003',  -- COL-001 Huila
        CURRENT_DATE - INTERVAL '70 days',
        45,
        ROUND(45 * 0.880, 2),   -- 12% loss -> 39.60 kg
        'Medium roast – espresso. Bar blend component.'
    ),
    (
        '22222222-2222-2222-2222-222222000004',
        '11111111-1111-1111-1111-111111000003',  -- COL-001 Huila
        CURRENT_DATE - INTERVAL '35 days',
        25,
        ROUND(25 * 0.875, 2),   -- 12.5% loss -> 21.88 kg
        'Medium-light roast – filter. Batch for b2b order.'
    ),
    (
        '22222222-2222-2222-2222-222222000005',
        '11111111-1111-1111-1111-111111000004',  -- COL-002 Nariño
        CURRENT_DATE - INTERVAL '28 days',
        20,
        ROUND(20 * 0.842, 2),   -- ~15.8% loss -> 16.84 kg
        'Light roast – filter. Micro-lot. Limited release.'
    ),
    (
        '22222222-2222-2222-2222-222222000006',
        '11111111-1111-1111-1111-111111000005',  -- BRZ-001 Cerrado
        CURRENT_DATE - INTERVAL '18 days',
        50,
        ROUND(50 * 0.884, 2),   -- ~11.6% loss -> 44.20 kg
        'Medium roast – espresso. House espresso blend base.'
    );

-- =============================================================
-- ROASTED STOCK  (8 rows)
-- =============================================================
-- UUIDs: 33333333-3333-3333-3333-333333000001 .. 000008

INSERT INTO roasted_stock
    (id, roast_batch_id, state, package_size_g, unit_count, quantity_kg, channel, status, produced_date, notes)
VALUES
    (
        '33333333-3333-3333-3333-333333000001',
        '22222222-2222-2222-2222-222222000001',  -- Batch 1 – ETH-001 light
        'bulk',
        NULL,
        NULL,
        10.00,
        'bar',
        'consumed',
        CURRENT_DATE - INTERVAL '84 days',
        'Used in bar pour-overs.'
    ),
    (
        '33333333-3333-3333-3333-333333000002',
        '22222222-2222-2222-2222-222222000001',  -- Batch 1 – ETH-001 light
        'packed',
        250,
        60,
        15.00,
        'b2c',
        'sold',
        CURRENT_DATE - INTERVAL '83 days',
        'Packed 250 g bags for online store.'
    ),
    (
        '33333333-3333-3333-3333-333333000003',
        '22222222-2222-2222-2222-222222000002',  -- Batch 2 – ETH-001 light
        'bulk',
        NULL,
        NULL,
        8.00,
        'bar',
        'in_stock',
        CURRENT_DATE - INTERVAL '49 days',
        'Bar filter stock.'
    ),
    (
        '33333333-3333-3333-3333-333333000004',
        '22222222-2222-2222-2222-222222000002',  -- Batch 2 – ETH-001 light
        'packed',
        250,
        50,
        12.50,
        'b2c',
        'in_stock',
        CURRENT_DATE - INTERVAL '49 days',
        '250 g bags – b2c online.'
    ),
    (
        '33333333-3333-3333-3333-333333000005',
        '22222222-2222-2222-2222-222222000003',  -- Batch 3 – COL-001 espresso
        'bulk',
        NULL,
        NULL,
        20.00,
        'bar',
        'consumed',
        CURRENT_DATE - INTERVAL '69 days',
        'Bar espresso shots.'
    ),
    (
        '33333333-3333-3333-3333-333333000006',
        '22222222-2222-2222-2222-222222000004',  -- Batch 4 – COL-001 medium-light
        'packed',
        500,
        40,
        20.00,
        'b2b',
        'shipped',
        CURRENT_DATE - INTERVAL '34 days',
        'Packed 500 g bags. Shipped to café client B2B-07.'
    ),
    (
        '33333333-3333-3333-3333-333333000007',
        '22222222-2222-2222-2222-222222000005',  -- Batch 5 – COL-002 Nariño light
        'packed',
        250,
        60,
        15.00,
        'b2c',
        'in_stock',
        CURRENT_DATE - INTERVAL '27 days',
        '250 g bags – limited micro-lot release.'
    ),
    (
        '33333333-3333-3333-3333-333333000008',
        '22222222-2222-2222-2222-222222000006',  -- Batch 6 – BRZ-001 espresso
        'unallocated',
        NULL,
        NULL,
        44.00,
        'unallocated',
        'in_stock',
        CURRENT_DATE - INTERVAL '17 days',
        'Freshly roasted. Pending channel allocation.'
    );

-- =============================================================
-- SALES LOG  (6 entries)
-- =============================================================
-- UUIDs: 44444444-4444-4444-4444-444444000001 .. 000006

INSERT INTO sales_log
    (id, date, channel, product_description, quantity, unit, revenue, source, external_order_id)
VALUES
    (
        '44444444-4444-4444-4444-444444000001',
        CURRENT_DATE - INTERVAL '55 days',
        'b2c',
        'Ethiopian Yirgacheffe ETH-001 – 250 g bag',
        24,
        'units',
        984.00,
        'manual',
        NULL
    ),
    (
        '44444444-4444-4444-4444-444444000002',
        CURRENT_DATE - INTERVAL '45 days',
        'b2b',
        'Colombian Huila COL-001 – 500 g bags (wholesale)',
        20,
        'units',
        1400.00,
        'manual',
        'B2B-2024-007'
    ),
    (
        '44444444-4444-4444-4444-444444000003',
        CURRENT_DATE - INTERVAL '32 days',
        'b2c',
        'Ethiopian Yirgacheffe ETH-001 – 250 g bag',
        36,
        'units',
        1476.00,
        'salla',
        'SALLA-10234'
    ),
    (
        '44444444-4444-4444-4444-444444000004',
        CURRENT_DATE - INTERVAL '20 days',
        'b2b',
        'Colombian Nariño COL-002 – bulk 1 kg bags',
        5.0,
        'kg',
        775.00,
        'manual',
        'B2B-2024-012'
    ),
    (
        '44444444-4444-4444-4444-444444000005',
        CURRENT_DATE - INTERVAL '12 days',
        'b2c',
        'Colombian Nariño COL-002 – 250 g limited bag',
        20,
        'units',
        1100.00,
        'salla',
        'SALLA-10381'
    ),
    (
        '44444444-4444-4444-4444-444444000006',
        CURRENT_DATE - INTERVAL '4 days',
        'b2b',
        'Brazilian Cerrado BRZ-001 – 500 g espresso bags',
        30,
        'units',
        1650.00,
        'rewaa',
        'REWAA-20241'
    );
