export type Locale = 'en' | 'ar'

export interface TranslationShape {
  nav: {
    dashboard: string; greenInventory: string; roasting: string
    roastedInventory: string; sales: string; movements: string
    signOut: string; language: string; settings: string
  }
  settings: {
    title: string; language: string; settings: string; theme: string; english: string; arabic: string; lightMode: string; darkMode: string
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
    low: string; process: string; region: string; variety: string; altitude: string
    cupScore: string; tastingNotes: string
  }
  roasting: {
    title: string; newBatch: string; editBatch: string
    greenLot: string; roastDate: string; inputKg: string; outputKg: string
    yieldPct: string; notes: string; exportCsv: string
  }
  roastedInventory: {
    title: string; addStock: string; editStock: string
    state: string; channel: string; quantity: string; packageSize: string
    unitCount: string; status: string; producedDate: string; notes: string
    importCsv: string; exportCsv: string
    bulk: string; packed: string; unallocated: string; bar: string
    b2c: string; b2b: string; inStock: string; shipped: string
    sold: string; consumed: string; batch: string; roastBatch: string; selectBatch: string
    packageType: string; bag1kg: string; bag250g: string; dripBox: string; customPackage: string
    quickAdjust: string; packFromBulk: string; transferStock: string; totalUnits: string
    totalWeight: string; boxes: string; bags: string; units: string; sourceBulk: string
    targetChannel: string; packUnitsCount: string; lotMatrix: string; stockUpdated: string
    transferSuccess: string; packSuccess: string; insufficientBulk: string; dripSachetsPerBox: string
  }
  sales: {
    title: string; addSale: string; date: string; channel: string
    productDescription: string; quantity: string; unit: string; revenue: string
    source: string; filterByChannel: string; all: string
    importCsv: string; exportCsv: string
    manual: string; salla: string; rewaa: string; kg: string; units: string
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
    received: string; roasted_out: string; roasted_in: string
    packed: string; allocated: string; transferred: string
    sold: string; consumed: string; adjusted: string
  }
}

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
    settings:        'Settings',
  },
  dashboard: {
    title:           'Operations Dashboard',
    totalGreenStock: 'Total Green Stock',
    roastedStock:    'Roasted Stock',
    lowStockAlerts:  'Low-Stock Alerts',
    avgYield:        'Avg. Roast Yield',
    recentActivity:  'Recent Activity',
    noAlerts:        'No low stock alerts',
    viewAll:         'View All',
    bulk:            'Bulk',
    packed:          'Packed',
    kg:              'kg',
    greenCoffeeStock: 'Green Coffee Stock',
    averageYield: 'Average Yield',
    alerts: 'Alerts',
    noAlertsMsg: 'No alerts.',
    noDataMsg: 'No data.',
  },
  greenInventory: {
    title:         'Green Inventory',
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
    confirmDelete: 'Are you sure you want to delete this lot? This cannot be undone.',
    importCsv:     'Import CSV',
    exportCsv:     'Export CSV',
    actions:       'Actions',
    low: 'Low',
    process:       'Process',
    region:        'Region',
    variety:       'Variety',
    altitude:      'Altitude',
    cupScore:      'Cupping Score',
    tastingNotes:  'Tasting Notes',
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
    outputExceedsInput: 'Output cannot exceed input.',
    selectGreenLot: 'Select a green lot...',
    available: 'available',
    availableShort: 'Available:',
    confirmDeleteBatch: 'Are you sure you want to delete this batch?',
  },
  roastedInventory: {
    title:        'Roasted Inventory',
    addStock:     'Add Stock',
    editStock:    'Edit Stock',
    state:        'State',
    channel:      'Channel',
    quantity:     'Quantity',
    packageSize:  'Package Size (g)',
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
    batch: 'Batch',
    roastBatch: 'Roast Batch',
    selectBatch: 'Select batch...',
    packageType:   'Packaging Format',
    bag1kg:        '1kg Bag',
    bag250g:       '250g Bag',
    dripBox:       'Drip Filter Box',
    customPackage: 'Custom',
    quickAdjust:   'Quick Adjust',
    packFromBulk:  'Pack from Bulk',
    transferStock: 'Transfer / Allocate',
    totalUnits:    'Total Units',
    totalWeight:   'Total Coffee Weight',
    boxes:         'boxes',
    bags:          'bags',
    units:         'units',
    sourceBulk:    'Source Bulk',
    targetChannel: 'Target Channel',
    packUnitsCount:'Units to Pack',
    lotMatrix:     'Stock by Channel & Package',
    stockUpdated:  'Stock updated successfully',
    transferSuccess:'Stock transferred successfully',
    packSuccess:   'Packed successfully',
    insufficientBulk:'Insufficient bulk stock available',
    dripSachetsPerBox:'Sachets per Box',
  },
  sales: {
    title:             'Sales Log',
    addSale:           'Add Sale',
    date:              'Date',
    channel:           'Channel',
    productDescription:'Product Description',
    quantity:          'Quantity',
    unit:              'Unit',
    revenue:           'Revenue (SAR)',
    source:            'Source',
    filterByChannel:   'Filter by Channel',
    all:               'All',
    importCsv:         'Import CSV',
    exportCsv:         'Export CSV',
    manual:            'Manual',
    salla:             'Salla',
    rewaa:             'Rewaa',
    kg:                'kg',
    units:             'Units',
    entries: 'entries',
    revenuePrefix: 'Revenue:',
    externalOrderId: 'External Order ID (optional)',
    confirmDeleteSale: 'Delete this sale record?',
  },
  movements: {
    title:          'Stock Movements',
    date:           'Date',
    category:       'Category',
    action:         'Action',
    quantity:       'Quantity',
    fromChannel:    'From Channel',
    toChannel:      'To Channel',
    note:           'Note',
    filterCategory: 'Filter Category',
    filterAction:   'Filter Action',
    filterDateFrom: 'Date From',
    filterDateTo:   'Date To',
    green:          'Green',
    roasted:        'Roasted',
    all:            'All',
    records: 'records',
    filters: 'filters',
  },
  common: {
    save:    'Save',
    cancel:  'Cancel',
    delete:  'Delete',
    edit:    'Edit',
    add:     'Add',
    loading: 'Loading...',
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
    fillRequired: 'Please fill all required fields.',
    importSuccess: 'Imported successfully.',
    confirmDeleteGeneric: 'Are you sure you want to delete this record?',
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
  settings: {
    title:      'Settings',
    language:   'Language',
    settings:   'Settings',
    theme:      'Theme',
    english:    'English',
    arabic:     'Arabic',
    lightMode:  'Light Mode',
    darkMode:   'Dark Mode',
  },
}

const ar: TranslationShape = {
  nav: {
    dashboard:       'لوحة القيادة',
    greenInventory:  'مخزون البن الأخضر',
    roasting:        'التحميص',
    roastedInventory:'مخزون البن المحمص',
    sales:           'المبيعات',
    movements:       'حركة المخزون',
    signOut:         'تسجيل الخروج',
    language:        'اللغة',
    settings:        'الإعدادات',
  },
  dashboard: {
    title:           'لوحة العمليات',
    totalGreenStock: 'إجمالي البن الأخضر',
    roastedStock:    'البن المحمص',
    lowStockAlerts:  'تنبيهات نقص المخزون',
    avgYield:        'متوسط نسبة التحميص',
    recentActivity:  'النشاط الأخير',
    noAlerts:        'لا توجد تنبيهات نقص مخزون',
    viewAll:         'عرض الكل',
    bulk:            'جملة',
    packed:          'معبأ',
    kg:              'كجم',
    greenCoffeeStock: 'مخزون البن الأخضر',
    averageYield: 'متوسط نسبة التحميص',
    alerts: 'تنبيهات',
    noAlertsMsg: 'لا توجد تنبيهات.',
    noDataMsg: 'لا توجد بيانات.',
  },
  greenInventory: {
    title:         'مخزون البن الأخضر',
    addLot:        'إضافة دفعة',
    editLot:       'تعديل الدفعة',
    deleteLot:     'حذف الدفعة',
    lotName:       'اسم الدفعة',
    origin:        'المصدر',
    supplier:      'المورد',
    arrivalDate:   'تاريخ الوصول',
    initialKg:     'الكمية الأولية (كجم)',
    remainingKg:   'الكمية المتبقية (كجم)',
    costPerKg:     'التكلفة / كجم',
    notes:         'ملاحظات',
    confirmDelete: 'هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء.',
    importCsv:     'استيراد CSV',
    exportCsv:     'تصدير CSV',
    actions:       'الإجراءات',
    low: 'منخفض',
      process:       'المعالجة',
    region:        'المنطقة',
    variety:       'السلالة',
    altitude:      'الارتفاع',
    cupScore:      'التقييم',
    tastingNotes:  'الإيحاءات',
},
  roasting: {
    title:      'دفعات التحميص',
    newBatch:   'دفعة جديدة',
    editBatch:  'تعديل الدفعة',
    greenLot:   'الدفعة الخضراء',
    roastDate:  'تاريخ التحميص',
    inputKg:    'الكمية المدخلة (كجم)',
    outputKg:   'الكمية الناتجة (كجم)',
    yieldPct:   'نسبة الإنتاج %',
    notes:      'ملاحظات',
    exportCsv:  'تصدير CSV',
    outputExceedsInput: 'الناتج لا يمكن أن يتجاوز المدخل.',
    selectGreenLot: 'اختر دفعة خضراء...',
    available: 'متاح',
    availableShort: 'المتاح:',
    confirmDeleteBatch: 'هل أنت متأكد من حذف هذه الدفعة؟',
  },
  roastedInventory: {
    title:        'مخزون البن المحمص',
    addStock:     'إضافة مخزون',
    editStock:    'تعديل المخزون',
    state:        'الحالة الفيزيائية',
    channel:      'القناة',
    quantity:     'الكمية',
    packageSize:  'حجم العبوة (جم)',
    unitCount:    'عدد الوحدات',
    status:       'الحالة',
    producedDate: 'تاريخ الإنتاج',
    notes:        'ملاحظات',
    importCsv:    'استيراد CSV',
    exportCsv:    'تصدير CSV',
    bulk:         'جملة',
    packed:       'معبأ',
    unallocated:  'غير مخصص',
    bar:          'البار',
    b2c:          'أفراد / قطاع التجزئة',
    b2b:          'مبيعات الجملة',
    inStock:      'في المخزون',
    shipped:      'تم الشحن',
    sold:         'مباع',
    consumed:     'مستهلك',
    batch: 'دفعة',
    roastBatch: 'دفعة التحميص',
    selectBatch: 'اختر دفعة...',
      packageType:   'نوع التعبئة',
    bag1kg:        'كيس 1 كجم',
    bag250g:       'كيس 250 جرام',
    dripBox:       'علبة أظراف فلتر',
    customPackage: 'مخصص',
    quickAdjust:   'تعديل سريع',
    packFromBulk:  'تعبئة من الحبوب',
    transferStock: 'تحويل / تخصيص',
    totalUnits:    'إجمالي الوحدات',
    totalWeight:   'إجمالي وزن البن',
    boxes:         'علب',
    bags:          'أكياس',
    units:         'وحدات',
    sourceBulk:    'البن المحمص الخام',
    targetChannel: 'القناة المستهدفة',
    packUnitsCount:'الكمية المراد تعبئتها',
    lotMatrix:     'المخزون حسب القنوات ونوع التعبئة',
    stockUpdated:  'تم تحديث المخزون بنجاح',
    transferSuccess:'تم تحويل المخزون بنجاح',
    packSuccess:   'تمت التعبئة بنجاح',
    insufficientBulk:'الكمية غير المعبأة غير كافية',
    dripSachetsPerBox:'عدد الأظراف بالعلبة',
},
  sales: {
    title:             'المبيعات',
    addSale:           'إضافة عملية بيع',
    date:              'التاريخ',
    channel:           'القناة',
    productDescription:'وصف المنتج',
    quantity:          'الكمية',
    unit:              'الوحدة',
    revenue:           'الإيرادات (ر.س)',
    source:            'المصدر',
    filterByChannel:   'تصفية حسب القناة',
    all:               'الكل',
    importCsv:         'استيراد CSV',
    exportCsv:         'تصدير CSV',
    manual:            'يدوي',
    salla:             'سلة',
    rewaa:             'رواء',
    kg:                'كجم',
    units:             'وحدات',
    entries: 'سجل',
    revenuePrefix: 'الإيرادات:',
    externalOrderId: 'رقم الطلب الخارجي (اختياري)',
    confirmDeleteSale: 'هل أنت متأكد من حذف هذا السجل؟',
  },
  movements: {
    title:          'حركة المخزون',
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
    records: 'سجل',
    filters: 'فلاتر',
  },
  common: {
    save:    'حفظ',
    cancel:  'إلغاء',
    delete:  'حذف',
    edit:    'تعديل',
    add:     'إضافة',
    loading: 'جاري التحميل...',
    error:   'حدث خطأ.',
    success: 'تم الحفظ بنجاح.',
    noData:  'لا توجد بيانات لعرضها.',
    search:  'بحث',
    filter:  'تصفية',
    clear:   'مسح',
    close:   'إغلاق',
    confirm: 'تأكيد',
    yes:     'نعم',
    no:      'لا',
    fillRequired: 'يرجى ملء جميع الحقول المطلوبة.',
    importSuccess: 'تم الاستيراد بنجاح.',
    confirmDeleteGeneric: 'هل أنت متأكد من حذف هذا السجل؟',
  },
  channels: {
    unallocated: 'غير مخصص',
    bar:         'البار',
    b2c:         'أفراد / قطاع التجزئة',
    b2b:         'مبيعات الجملة',
  },
  actions: {
    received:   'مستلم',
    roasted_out:'مستهلك للتحميص',
    roasted_in: 'ناتج من التحميص',
    packed:     'مُعبأ',
    allocated:  'مُخصص',
    transferred:'منقول',
    sold:       'مُباع',
    consumed:   'مُستهلك',
    adjusted:   'مُعدل',
  },
  settings: {
    title:      'الإعدادات',
    language:   'اللغة',
    settings:   'الإعدادات',
    theme:      'المظهر',
    english:    'الإنجليزية',
    arabic:     'العربية',
    lightMode:  'الوضع الفاتح',
    darkMode:   'الوضع الداكن',
  },
}

export const translations: Record<Locale, TranslationShape> = { en, ar }

export function t(locale: Locale, key: string): string {
  const keys = key.split('.')
  let current: any = translations[locale]
  for (const k of keys) {
    if (current === undefined || current === null) return key
    current = current[k]
  }
  return typeof current === 'string' ? current : key
}





