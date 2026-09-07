-- ============================================================
-- Moreine Coffee Roastery — Real Stock Seed
-- Source: محمصة مورين.xlsx (Stock Adjustment) + Moreine Bag Label
-- Date recorded: 2026-09-01
-- ============================================================
-- Compatible with Migration 001 and Migration 002.
-- All quantities in KG match the roastery stock Excel file.
-- Arabic lot names and coffee profile attributes are accurate.
-- ============================================================

BEGIN;

-- 1. GREEN INVENTORY
-- 15 active lots with qty > 0
-- Includes specialty coffee profile: process, region, variety, altitude, cup_score, tasting_notes

INSERT INTO green_inventory
  (id, lot_name, origin, supplier, arrival_date, initial_kg, remaining_kg, cost_per_kg,
   process, region, variety, altitude, cup_score, tasting_notes, notes)
VALUES

  -- 1. بن اثيوبي شيلشلي اخضر | Ethiopian Shilshili Green
  ('a1000001-0000-0000-0000-000000000001',
   'بن اثيوبي شيلشلي اخضر',
   'اثيوبيا / Ethiopia',
   'غير محدد / Unspecified',
   '2026-09-01',
   119.0, 119.0, 47.43,
   'مغسول / Washed', 'شيلشلي / Shilshili, Yirgacheffe', 'هيرلوم / Heirloom', '1900-2100m', 86.5,
   'ياسمين، خوخ، شاي أسود، حمضيات خفيفة',
   'Barcode: 382693123536 | شيلشلي / Shilshili — Ethiopian washed process'),

  -- 2. اوغندا ماما بيتي مجفف اخضر | Uganda Mama Betty Dried Green
  ('a1000001-0000-0000-0000-000000000002',
   'اوغندا ماما بيتي مجفف اخضر',
   'اوغندا / Uganda',
   'غير محدد / Unspecified',
   '2026-09-01',
   221.1, 221.1, 42.0,
   'مجفف / Natural', 'روينزوري / Rwenzori', 'SL14, SL28', '1600-1900m', 85.0,
   'توت بري، شوكولاتة داكنة، عنب أسود',
   'Barcode: 986482772415 | ماما بيتي مجففة / Mama Betty natural dry process'),

  -- 3. بن كوستاريكا - لابيتينا مجفف اخضر | Costa Rica La Petina Dried Green
  ('a1000001-0000-0000-0000-000000000003',
   'بن كوستاريكا - لابيتينا مجفف اخضر',
   'كوستاريكا / Costa Rica',
   'غير محدد / Unspecified',
   '2026-09-01',
   148.0, 148.0, 62.0,
   'مجفف / Natural', 'تارازو / Tarrazú', 'كاتوي / Catuai', '1600-1750m', 86.0,
   'كراميل، تفاح أحمر، شوكولاتة بالحليب',
   'Barcode: 324618595458 | لابيتينا مجففة / La Petina natural'),

  -- 4. بن اندونيسيا - مانديري مجفف اخضر | Indonesia Mandiri Dried Green
  ('a1000001-0000-0000-0000-000000000004',
   'بن اندونيسيا - مانديري مجفف اخضر',
   'اندونيسيا / Indonesia',
   'غير محدد / Unspecified',
   '2026-09-01',
   77.9, 77.9, 52.60,
   'مجفف / Natural', 'سومطرة / Sumatra', 'اتينا / Ateng, Typica', '1400-1600m', 84.5,
   'توابل شرقية، سكر بني، كاكاو، قوام ثقيل',
   'Barcode: 281242137959 | مانديري مجفف / Mandiri natural dry process'),

  -- 5. بن اليمن - سهيل معزز اخضر | Yemen Suhail Enhanced Green
  ('a1000001-0000-0000-0000-000000000005',
   'بن اليمن - سهيل معزز اخضر',
   'اليمن / Yemen',
   'غير محدد / Unspecified',
   '2026-09-01',
   42.6, 42.6, NULL,
   'معزز لاهوائي / Enhanced Anaerobic', 'حراز / Haraaz', 'عديني، دوائري / Udaini', '1900-2200m', 88.0,
   'فواكه استوائية، أناناس، زبيب، حلاوة معقدة',
   'Barcode: 790895419289 | سهيل معزز / Suhail enhanced — cost not yet recorded'),

  -- 6. كولومبيا إل بومبو عضوي مجفف اخضر | Colombia El Bombo Organic Dried Green
  ('a1000001-0000-0000-0000-000000000006',
   'كولومبيا إل بومبو عضوي مجفف اخضر',
   'كولومبيا / Colombia',
   'غير محدد / Unspecified',
   '2026-09-01',
   42.5, 42.5, 39.04,
   'مجفف عضوي / Organic Natural', 'هويلا / Huila', 'كاستيو، كاتورا / Castillo, Caturra', '1700-1950m', 85.5,
   'برتقال، كرز، قصب السكر، لوز',
   'Barcode: N/A | إل بومبو عضوي مجفف / El Bombo organic natural'),

  -- 7. بن اليمن - اصيل مجفف اخضر | Yemen Asil Dried Green
  ('a1000001-0000-0000-0000-000000000007',
   'بن اليمن - اصيل مجفف اخضر',
   'اليمن / Yemen',
   'غير محدد / Unspecified',
   '2026-09-01',
   22.2, 22.2, NULL,
   'مجفف / Natural', 'بني مطر / Bani Matar', 'مطر / Matari', '2000-2300m', 87.5,
   'هيل، توابل خفيفة، مشمش مجفف، عسل',
   'Barcode: 103151785170 | اصيل مجفف / Asil natural — cost not yet recorded'),

  -- 8. بن يمني عقيق اخضر | Yemeni Aqeeq Green
  ('a1000001-0000-0000-0000-000000000008',
   'بن يمني عقيق اخضر',
   'اليمن / Yemen',
   'غير محدد / Unspecified',
   '2026-09-01',
   24.7, 24.7, NULL,
   'مجفف / Natural', 'إب / Ibb', 'عديني / Udaini', '1800-2100m', 87.0,
   'تين مجفف، شوكولاتة داكنة، قرفة',
   'Barcode: N/A | عقيق / Aqeeq — cost not yet recorded'),

  -- 9. يمني - سله فروالة لاهوائي اخضر | Yemeni Strawberry Basket Anaerobic Green
  ('a1000001-0000-0000-0000-000000000009',
   'يمني - سله فروالة لاهوائي اخضر',
   'اليمن / Yemen',
   'غير محدد / Unspecified',
   '2026-09-01',
   27.6, 27.6, NULL,
   'لاهوائي / Anaerobic Natural', 'حراز / Haraaz', 'جعدي / Jaadi', '2100-2400m', 89.0,
   'فراولة طازجة، حلوى التوت، فانيلا، حمضية ساطعة',
   'Barcode: N/A | سلة فراولة لاهوائي / Strawberry basket anaerobic — cost not yet recorded'),

  -- 10. بن يمني سلة فواكه اخضر | Yemeni Mixed Fruit Basket Green
  ('a1000001-0000-0000-0000-000000000010',
   'بن يمني سلة فواكه اخضر',
   'اليمن / Yemen',
   'غير محدد / Unspecified',
   '2026-09-01',
   23.9, 23.9, NULL,
   'مجفف / Natural', 'حراز / Haraaz', 'أصناف يمنية قديمة', '1900-2200m', 88.0,
   'مانجو، أناناس، دراق، سكر بني',
   'Barcode: N/A | سلة فواكه / Mixed fruit basket — cost not yet recorded'),

  -- 11. بن أوغندي - كيتوما لاهوائي اخضر | Uganda Kitoma Anaerobic Green
  ('a1000001-0000-0000-0000-000000000011',
   'بن أوغندي - كيتوما لاهوائي اخضر',
   'اوغندا / Uganda',
   'غير محدد / Unspecified',
   '2026-09-01',
   26.5, 26.5, 45.5,
   'لاهوائي / Anaerobic', 'كيتوما / Kitoma', 'SL28, SL34', '1500-1800m', 85.5,
   'كرز أسود، نبيذ التوت، كاكاو مر',
   'Barcode: 485705911808 | كيتوما لاهوائي / Kitoma anaerobic'),

  -- 12. بن يمني معين اخضر | Yemeni Maeen Green
  ('a1000001-0000-0000-0000-000000000012',
   'بن يمني معين اخضر',
   'اليمن / Yemen',
   'غير محدد / Unspecified',
   '2026-09-01',
   13.7, 13.7, NULL,
   'مجفف / Natural', 'صنعاء / Sanaa highlands', 'دوائري / Dawairi', '2000-2200m', 86.5,
   'شوكولاتة، تمر، فواكه مجففة',
   'Barcode: N/A | معين / Maeen — cost not yet recorded'),

  -- 13. بن سلفادور ينكا اخضر | El Salvador Yinca Green
  ('a1000001-0000-0000-0000-000000000013',
   'بن سلفادور ينكا اخضر',
   'السلفادور / El Salvador',
   'غير محدد / Unspecified',
   '2026-09-01',
   11.6, 11.6, NULL,
   'مجفف / Natural', 'أبانيكا / Apaneca', 'باكاس، بوربون / Pacas, Bourbon', '1400-1650m', 84.5,
   'شوكولاتة بالحليب، بندق، كراميل',
   'Barcode: 890400776136 | ينكا / Yinca — cost not yet recorded'),

  -- 14. كولومبيا كاوكا مغسول اخضر | Colombia Cauca Washed Green
  ('a1000001-0000-0000-0000-000000000014',
   'كولومبيا كاوكا مغسول اخضر',
   'كولومبيا / Colombia',
   'غير محدد / Unspecified',
   '2026-09-01',
   1.5, 1.5, 42.0,
   'مغسول / Washed', 'كاوكا / Cauca', 'كاستيو / Castillo', '1750-2000m', 85.0,
   'حمضيات متوازنة، حلاوة القصب، تفاح أخضر',
   'Barcode: N/A | كاوكا مغسول / Cauca washed process'),

  -- 15. برازيلي سيرادو مجفف اخضر | Brazilian Cerrado Dried Green (from Bag Label)
  ('a1000001-0000-0000-0000-000000000015',
   'برازيلي سيرادو مجفف اخضر',
   'البرازيل / Brazil',
   'غير محدد / Unspecified',
   '2026-09-01',
   10.0, 10.0, 35.25,
   'مجفف / Natural', 'سيرادو / Cerrado', 'بوربون / Bourbon', '1200-1800m', 84.0,
   'سكر بني ، جوز ، كاكاو ، ليمون / Brown sugar, walnuts, cocoa, lemon',
   'Barcode: 180838594938 | سيرادو مجفف / Cerrado natural dry process — Label specs verified');


-- 2. ROAST BATCHES
-- Opening-balance placeholders linked to each green lot

INSERT INTO roast_batches
  (id, green_lot_id, roast_date, input_kg, output_kg, notes)
VALUES
  ('b2000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000004', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000002', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000015', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000007', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000005', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000003', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000006', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000014', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000010', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry'),
  ('b2000001-0000-0000-0000-000000000011', 'a1000001-0000-0000-0000-000000000012', '2026-09-01', 0.001, 0.001, 'رصيد افتتاحي / Opening balance entry');


-- 3. ROASTED STOCK
-- Seeded as bulk beans in unallocated backstock so staff can pack into 1kg, 250g, and drip boxes

INSERT INTO roasted_stock
  (id, roast_batch_id, state, package_type, package_size_g, unit_count, quantity_kg, channel, status, produced_date, notes)
VALUES
  -- اثيوبي شيلشلي محمص | 109.2 kg
  ('c3000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001',
   'bulk', 'bulk', NULL, NULL, 109.2, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: 674268285607 | اثيوبي شيلشلي محمص | Cost: 66 SAR/kg'),

  -- اندنوسي - مانديري مجفف محمص | 69.3 kg
  ('c3000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000002',
   'bulk', 'bulk', NULL, NULL, 69.3, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: 675901032713 | اندنوسي مانديري محمص | Cost: 61 SAR/kg'),

  -- اوغندى ماما بيتي مجفف محمص | 38.05 kg
  ('c3000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000003',
   'bulk', 'bulk', NULL, NULL, 38.05, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: 989846611418 | اوغندى ماما بيتي محمص | Cost: 49 SAR/kg'),

  -- برازيلي سيرادو مجفف محمص | 42.8 kg
  ('c3000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000004',
   'bulk', 'bulk', NULL, NULL, 42.8, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: 721179487567 | برازيلي سيرادو محمص | Cost: 42 SAR/kg'),

  -- بن اليمن - اصيل مجفف محمص | 1.1 kg
  ('c3000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000005',
   'bulk', 'bulk', NULL, NULL, 1.1, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: 149884133545 | اليمن اصيل محمص | Cost: 161 SAR/kg'),

  -- بن اليمن - سهيل معزز محمص | 11.7 kg
  ('c3000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000006',
   'bulk', 'bulk', NULL, NULL, 11.7, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: 973186506901 | اليمن سهيل معزز محمص | Cost: 107 SAR/kg'),

  -- كوستاريكا - لابيتينا مجفف محمص | 133.6 kg
  ('c3000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000007',
   'bulk', 'bulk', NULL, NULL, 133.6, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: 324618595458 | كوستاريكا لابيتينا محمص | Cost: 84 SAR/kg'),

  -- كولومبيا إل بومبو عضوي مجفف محمص | 51.2 kg
  ('c3000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000008',
   'bulk', 'bulk', NULL, NULL, 51.2, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: N/A | كولومبيا إل بومبو عضوي محمص | Cost: 46 SAR/kg'),

  -- كولومبيا كاوكا مغسول محمص | 0.25 kg
  ('c3000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000009',
   'bulk', 'bulk', NULL, NULL, 0.25, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: N/A | كولومبيا كاوكا مغسول محمص'),

  -- يمني سلة فواكه محمص | 0.75 kg
  ('c3000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000010',
   'bulk', 'bulk', NULL, NULL, 0.75, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: N/A | يمني سلة فواكه محمص | Cost: 140 SAR/kg'),

  -- يمني معين محمص | 1.1 kg
  ('c3000001-0000-0000-0000-000000000011', 'b2000001-0000-0000-0000-000000000011',
   'bulk', 'bulk', NULL, NULL, 1.1, 'unallocated', 'in_stock', '2026-09-01',
   'Barcode: N/A | يمني معين محمص | Cost: 72 SAR/kg');

COMMIT;