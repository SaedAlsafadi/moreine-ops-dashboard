// =========================================================
// Moreine Ops Dashboard — i18n translations
// =========================================================

export type Locale = 'en' | 'ar'

// Flat dot-notation union of every leaf key
export type TranslationKey =
  // nav
  | 'nav.dashboard' | 'nav.greenInventory' | 'nav.roasting'
  | 'nav.roastedInventory' | 'nav.sales' | 'nav.movements'
  | 'nav.signOut' | 'nav.language'
  // dashboard
  | 'dashboard.title' | 'dashboard.totalGreenStock' | 'dashboard.roastedStock'
  | 'dashboard.lowStockAlerts' | 'dashboard.avgYield' | 'dashboard.recentActivity'
  | 'dashboard.noAlerts' | 'dashboard.viewAll' | 'dashboard.bulk'
  | 'dashboard.packed' | 'dashboard.kg'
  // greenInventory
  | 'greenInventory.title' | 'greenInventory.addLot' | 'greenInventory.editLot'
  | 'greenInventory.deleteLot' | 'greenInventory.lotName' | 'greenInventory.origin'
  | 'greenInventory.supplier' | 'greenInventory.arrivalDate'
  | 'greenInventory.initialKg' | 'greenInventory.remainingKg'
  | 'greenInventory.costPerKg' | 'greenInventory.notes'
  | 'greenInventory.confirmDelete' | 'greenInventory.importCsv'
  | 'greenInventory.exportCsv' | 'greenInventory.actions'
  // roasting
  | 'roasting.title' | 'roasting.newBatch' | 'roasting.editBatch'
  | 'roasting.greenLot' | 'roasting.roastDate' | 'roasting.inputKg'
  | 'roasting.outputKg' | 'roasting.yieldPct' | 'roasting.notes'
  | 'roasting.exportCsv'
  // roastedInventory
  | 'roastedInventory.title' | 'roastedInventory.addStock'
  | 'roastedInventory.editStock' | 'roastedInventory.state'
  | 'roastedInventory.channel' | 'roastedInventory.quantity'
  | 'roastedInventory.packageSize' | 'roastedInventory.unitCount'
  | 'roastedInventory.status' | 'roastedInventory.producedDate'
  | 'roastedInventory.notes' | 'roastedInventory.importCsv'
  | 'roastedInventory.exportCsv' | 'roastedInventory.bulk'
  | 'roastedInventory.packed' | 'roastedInventory.unallocated'
  | 'roastedInventory.bar' | 'roastedInventory.b2c' | 'roastedInventory.b2b'
  | 'roastedInventory.inStock' | 'roastedInventory.shipped'
  | 'roastedInventory.sold' | 'roastedInventory.consumed'
  // sales
  | 'sales.title' | 'sales.addSale' | 'sales.date' | 'sales.channel'
  | 'sales.productDescription' | 'sales.quantity' | 'sales.unit'
  | 'sales.revenue' | 'sales.source' | 'sales.filterByChannel'
  | 'sales.all' | 'sales.importCsv' | 'sales.exportCsv'
  | 'sales.manual' | 'sales.salla' | 'sales.rewaa'
  | 'sales.kg' | 'sales.units'
  // movements
  | 'movements.title' | 'movements.date' | 'movements.category'
  | 'movements.action' | 'movements.quantity' | 'movements.fromChannel'
  | 'movements.toChannel' | 'movements.note' | 'movements.filterCategory'
  | 'movements.filterAction' | 'movements.filterDateFrom'
  | 'movements.filterDateTo' | 'movements.green' | 'movements.roasted'
  | 'movements.all'
  // common
  | 'common.save' | 'common.cancel' | 'common.delete' | 'common.edit'
  | 'common.add' | 'common.loading' | 'common.error' | 'common.success'
  | 'common.noData' | 'common.search' | 'common.filter' | 'common.clear'
  | 'common.close' | 'common.confirm' | 'common.yes' | 'common.no'
  // channels
  | 'channels.unallocated' | 'channels.bar' | 'channels.b2c' | 'channels.b2b'
  // actions
  | 'actions.received' | 'actions.roasted_out' | 'actions.roasted_in'
  | 'actions.packed' | 'actions.allocated' | 'actions.transferred'
  | 'actions.sold' | 'actions.consumed' | 'actions.adjusted'

// Deeply-nested structure type (mirrors the translation objects below)
export type TranslationShape = {
  nav: {
    dashboard: string; greenInventory: string; roasting: string
    roastedInventory: string; sales: string; movements: string
    signOut: string; language: string
  }
  dashboard: {
    title: string; totalGreenStock: string; roastedStock: string
    lowStockAlerts: string; avgYield: string; recentActivity: string
    noAlerts: string; viewAll: string; bulk: string; packed: string; kg: string
  }
  greenInventory: {
    title: string; addLot: string; editLot: string; deleteLot: string
    lotName: string; origin: string; supplier: string; arrivalDate: string
    initialKg: string; remainingKg: string; costPerKg: string; notes: string
    confirmDelete: string; importCsv: string; exportCsv: string; actions: string
  }
  roasting: {
    title: string; newBatch: string; editBatch: string; greenLot: string
    roastDate: string; inputKg: string; outputKg: string; yieldPct: string
    notes: string; exportCsv: string
  }
  roastedInventory: {
    title: string; addStock: string; editStock: string; state: string
    channel: string; quantity: string; packageSize: string; unitCount: string
    status: string; producedDate: string; notes: string; importCsv: string
    exportCsv: string; bulk: string; packed: string; unallocated: string
    bar: string; b2c: string; b2b: string; inStock: string; shipped: string
    sold: string; consumed: string
  }
  sales: {
    title: string; addSale: string; date: string; channel: string
    productDescription: string; quantity: string; unit: string; revenue: string
    source: string; filterByChannel: string; all: string; importCsv: string
    exportCsv: string; manual: string; salla: string; rewaa: string
    kg: string; units: string
  }
  movements: {
    title: string; date: string; category: string; action: string
    quantity: string; fromChannel: string; toChannel: string; note: string
    filterCategory: string; filterAction: string; filterDateFrom: string
    filterDateTo: string; green: string; roasted: string; all: string
  }
  common: {
    save: string; cancel: string; delete: string; edit: string; add: string
    loading: string; error: string; success: string; noData: string
    search: string; filter: string; clear: string; close: string
    confirm: string; yes: string; no: string
  }
  channels: {
    unallocated: string; bar: string; b2c: string; b2b: string
  }
  actions: {
    received: string; roasted_out: string; roasted_in: string; packed: string
    allocated: string; transferred: string; sold: string; consumed: string
    adjusted: string
  }
}

// =========================================================
// English translations
// =========================================================
const en: TranslationShape = {
  nav: {
    dashboard:       'Dashboard',
    greenInventory:  'Green Inventory',
    roasting:        'Roasting',
    roastedInventory:'Roasted Inventory',
    sales:           'Sales',
    movements:       'Movements',
    signOut:         'Sign Out',
    language:        'Language',
  },
  dashboard: {
    title:           'Operations Dashboard',
    totalGreenStock: 'Total Green Stock',
    roastedStock:    'Roasted Stock',
    lowStockAlerts:  'Low-Stock Alerts',
    avgYield:        'Avg. Roast Yield',
    recentActivity:  'Recent Activity',
    noAlerts:        'No low-stock alerts',
    viewAll:         'View all',
    bulk:            'Bulk',
    packed:          'Packed',
    kg:              'kg',
  },
  greenInventory: {
    title:         'Green Coffee Inventory',
    addLot:        'Add Lot',
    editLot:       'Edit Lot',
    deleteLot:     'Delete Lot',
    lotName:       'Lot Name',
    origin:        'Origin',
    supplier:      'Supplier',
    arrivalDate:   'Arrival Date',
    initialKg:     'Initial (kg)',
    remainingKg:   'Remaining (kg)',
    costPerKg:     'Cost / kg',
    notes:         'Notes',
    confirmDelete: 'Are you sure you want to delete this lot? This action cannot be undone.',
    importCsv:     'Import CSV',
    exportCsv:     'Export CSV',
    actions:       'Actions',
  },
  roasting: {
    title:      'Roasting Batches',
    newBatch:   'New Batch',
    editBatch:  'Edit Batch',
    greenLot:   'Green Lot',
    roastDate:  'Roast Date',
    inputKg:    'Input (kg)',
    outputKg:   'Output (kg)',
    yieldPct:   'Yield %',
    notes:      'Notes',
    exportCsv:  'Export CSV',
  },
  roastedInventory: {
    title:        'Roasted Coffee Inventory',
    addStock:     'Add Stock',
    editStock:    'Edit Stock',
    state:        'State',
    channel:      'Channel',
    quantity:     'Quantity',
    packageSize:  'Package Size (kg)',
    unitCount:    'Unit Count',
    status:       'Status',
    producedDate: 'Produced Date',
    notes:        'Notes',
    importCsv:    'Import CSV',
    exportCsv:    'Export CSV',
    bulk:         'Bulk',
    packed:       'Packed',
    unallocated:  'Unallocated',
    bar:          'Bar',
    b2c:          'B2C',
    b2b:          'B2B',
    inStock:      'In Stock',
    shipped:      'Shipped',
    sold:         'Sold',
    consumed:     'Consumed',
  },
  sales: {
    title:             'Sales',
    addSale:           'Add Sale',
    date:              'Date',
    channel:           'Channel',
    productDescription:'Product Description',
    quantity:          'Quantity',
    unit:              'Unit',
    revenue:           'Revenue (SAR)',
    source:            'Source',
    filterByChannel:   'Filter by channel',
    all:               'All',
    importCsv:         'Import CSV',
    exportCsv:         'Export CSV',
    manual:            'Manual',
    salla:             'Salla',
    rewaa:             'Rewaa',
    kg:                'kg',
    units:             'units',
  },
  movements: {
    title:          'Inventory Movements',
    date:           'Date',
    category:       'Category',
    action:         'Action',
    quantity:       'Quantity',
    fromChannel:    'From Channel',
    toChannel:      'To Channel',
    note:           'Note',
    filterCategory: 'Filter by category',
    filterAction:   'Filter by action',
    filterDateFrom: 'From date',
    filterDateTo:   'To date',
    green:          'Green',
    roasted:        'Roasted',
    all:            'All',
  },
  common: {
    save:    'Save',
    cancel:  'Cancel',
    delete:  'Delete',
    edit:    'Edit',
    add:     'Add',
    loading: 'Loading…',
    error:   'An error occurred.',
    success: 'Saved successfully.',
    noData:  'No data to display.',
    search:  'Search',
    filter:  'Filter',
    clear:   'Clear',
    close:   'Close',
    confirm: 'Confirm',
    yes:     'Yes',
    no:      'No',
  },
  channels: {
    unallocated: 'Unallocated',
    bar:         'Bar',
    b2c:         'B2C',
    b2b:         'B2B',
  },
  actions: {
    received:   'Received',
    roasted_out:'Roasted Out',
    roasted_in: 'Roasted In',
    packed:     'Packed',
    allocated:  'Allocated',
    transferred:'Transferred',
    sold:       'Sold',
    consumed:   'Consumed',
    adjusted:   'Adjusted',
  },
}

// =========================================================
// Arabic translations
// =========================================================
const ar: TranslationShape = {
  nav: {
    dashboard:       'لوحة التحكم',
    greenInventory:  'مخزون البن الأخضر',
    roasting:        'التحميص',
    roastedInventory:'مخزون البن المحمص',
    sales:           'المبيعات',
    movements:       'حركات المخزون',
    signOut:         'تسجيل الخروج',
    language:        'اللغة',
  },
  dashboard: {
    title:           'لوحة العمليات',
    totalGreenStock: 'إجمالي مخزون البن الأخضر',
    roastedStock:    'مخزون البن المحمص',
    lowStockAlerts:  'تنبيهات نقص المخزون',
    avgYield:        'متوسط نسبة التحميص',
    recentActivity:  'آخر الأنشطة',
    noAlerts:        'لا توجد تنبيهات نقص مخزون',
    viewAll:         'عرض الكل',
    bulk:            'سائب',
    packed:          'معبأ',
    kg:              'كغ',
  },
  greenInventory: {
    title:         'مخزون البن الأخضر',
    addLot:        'إضافة دفعة',
    editLot:       'تعديل الدفعة',
    deleteLot:     'حذف الدفعة',
    lotName:       'اسم الدفعة',
    origin:        'المنشأ',
    supplier:      'المورد',
    arrivalDate:   'تاريخ الوصول',
    initialKg:     'الكمية الأولية (كغ)',
    remainingKg:   'الكمية المتبقية (كغ)',
    costPerKg:     'التكلفة / كغ',
    notes:         'ملاحظات',
    confirmDelete: 'هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء.',
    importCsv:     'استيراد CSV',
    exportCsv:     'تصدير CSV',
    actions:       'الإجراءات',
  },
  roasting: {
    title:      'دفعات التحميص',
    newBatch:   'دفعة جديدة',
    editBatch:  'تعديل الدفعة',
    greenLot:   'دفعة البن الأخضر',
    roastDate:  'تاريخ التحميص',
    inputKg:    'الكمية المُدخلة (كغ)',
    outputKg:   'الكمية الناتجة (كغ)',
    yieldPct:   'نسبة الناتج %',
    notes:      'ملاحظات',
    exportCsv:  'تصدير CSV',
  },
  roastedInventory: {
    title:        'مخزون البن المحمص',
    addStock:     'إضافة مخزون',
    editStock:    'تعديل المخزون',
    state:        'الحالة الفيزيائية',
    channel:      'القناة',
    quantity:     'الكمية',
    packageSize:  'حجم العبوة (كغ)',
    unitCount:    'عدد الوحدات',
    status:       'الحالة',
    producedDate: 'تاريخ الإنتاج',
    notes:        'ملاحظات',
    importCsv:    'استيراد CSV',
    exportCsv:    'تصدير CSV',
    bulk:         'سائب',
    packed:       'معبأ',
    unallocated:  'غير مخصص',
    bar:          'البار',
    b2c:          'أون لاين / تجزئة',
    b2b:          'عملاء الجملة',
    inStock:      'في المخزون',
    shipped:      'تم الشحن',
    sold:         'مباع',
    consumed:     'مستهلك',
  },
  sales: {
    title:             'المبيعات',
    addSale:           'إضافة عملية بيع',
    date:              'التاريخ',
    channel:           'القناة',
    productDescription:'وصف المنتج',
    quantity:          'الكمية',
    unit:              'الوحدة',
    revenue:           'الإيراد (ر.س)',
    source:            'المصدر',
    filterByChannel:   'تصفية حسب القناة',
    all:               'الكل',
    importCsv:         'استيراد CSV',
    exportCsv:         'تصدير CSV',
    manual:            'يدوي',
    salla:             'سلة',
    rewaa:             'رِواء',
    kg:                'كغ',
    units:             'وحدات',
  },
  movements: {
    title:          'حركات المخزون',
    date:           'التاريخ',
    category:       'الفئة',
    action:         'الإجراء',
    quantity:       'الكمية',
    fromChannel:    'من القناة',
    toChannel:      'إلى القناة',
    note:           'ملاحظة',
    filterCategory: 'تصفية حسب الفئة',
    filterAction:   'تصفية حسب الإجراء',
    filterDateFrom: 'من تاريخ',
    filterDateTo:   'إلى تاريخ',
    green:          'أخضر',
    roasted:        'محمص',
    all:            'الكل',
  },
  common: {
    save:    'حفظ',
    cancel:  'إلغاء',
    delete:  'حذف',
    edit:    'تعديل',
    add:     'إضافة',
    loading: 'جارٍ التحميل…',
    error:   'حدث خطأ.',
    success: 'تم الحفظ بنجاح.',
    noData:  'لا توجد بيانات للعرض.',
    search:  'بحث',
    filter:  'تصفية',
    clear:   'مسح',
    close:   'إغلاق',
    confirm: 'تأكيد',
    yes:     'نعم',
    no:      'لا',
  },
  channels: {
    unallocated: 'غير مخصص',
    bar:         'البار',
    b2c:         'أون لاين / تجزئة',
    b2b:         'عملاء الجملة',
  },
  actions: {
    received:   'استُلم',
    roasted_out:'خرج للتحميص',
    roasted_in: 'دخل من التحميص',
    packed:     'عُبِّئ',
    allocated:  'خُصِّص',
    transferred:'نُقِل',
    sold:       'بِيع',
    consumed:   'استُهلك',
    adjusted:   'عُدِّل',
  },
}

// =========================================================
// Exports
// =========================================================
export const translations: Record<Locale, TranslationShape> = { en, ar }

/**
 * Look up a dot-notation translation key for the given locale.
 * Falls back to returning the key itself if not found.
 *
 * @example t('en', 'nav.dashboard') // => 'Dashboard'
 */
export function t(locale: Locale, key: string): string {
  const keys = key.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = translations[locale]
  for (const k of keys) {
    if (current === undefined || current === null) return key
    current = current[k]
  }
  return typeof current === 'string' ? current : key
}
