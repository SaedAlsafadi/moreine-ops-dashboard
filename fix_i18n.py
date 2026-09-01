import re

# 1. Update translations.ts
with open('src/lib/i18n/translations.ts', 'r', encoding='utf-8') as f:
    t_content = f.read()

# Add to English common
t_content = t_content.replace(
    "no:      'No',\n  },",
    "no:      'No',\n    fillRequired: 'Please fill all required fields.',\n    importSuccess: 'Imported successfully.',\n    confirmDeleteGeneric: 'Are you sure you want to delete this record?',\n  },"
)
# Add to English dashboard
t_content = t_content.replace(
    "kg:              'kg',\n  },",
    "kg:              'kg',\n    greenCoffeeStock: 'Green Coffee Stock',\n    averageYield: 'Average Yield',\n    alerts: 'Alerts',\n    noAlertsMsg: 'No alerts.',\n    noDataMsg: 'No data.',\n  },"
)
# Add to English greenInventory
t_content = t_content.replace(
    "actions:       'Actions',\n  },",
    "actions:       'Actions',\n    low: 'Low',\n  },"
)
# Add to English roasting
t_content = t_content.replace(
    "exportCsv:  'Export CSV',\n  },",
    "exportCsv:  'Export CSV',\n    outputExceedsInput: 'Output cannot exceed input.',\n    selectGreenLot: 'Select a green lot...',\n    available: 'available',\n    availableShort: 'Available:',\n    confirmDeleteBatch: 'Are you sure you want to delete this batch?',\n  },"
)
# Add to English roastedInventory
t_content = t_content.replace(
    "consumed:     'Consumed',\n  },",
    "consumed:     'Consumed',\n    batch: 'Batch',\n    roastBatch: 'Roast Batch',\n    selectBatch: 'Select batch...',\n  },"
)
# Add to English sales
t_content = t_content.replace(
    "units:             'Units',\n  },",
    "units:             'Units',\n    entries: 'entries',\n    revenuePrefix: 'Revenue:',\n    externalOrderId: 'External Order ID (optional)',\n    confirmDeleteSale: 'Delete this sale record?',\n  },"
)
# Add to English movements
t_content = t_content.replace(
    "all:            'All',\n  },",
    "all:            'All',\n    records: 'records',\n    filters: 'filters',\n  },"
)

# Arabic additions
t_content = t_content.replace(
    "no:      'لا',\n  },",
    "no:      'لا',\n    fillRequired: 'يرجى ملء جميع الحقول المطلوبة.',\n    importSuccess: 'تم الاستيراد بنجاح.',\n    confirmDeleteGeneric: 'هل أنت متأكد من حذف هذا السجل؟',\n  },"
)
t_content = t_content.replace(
    "kg:              'كجم',\n  },",
    "kg:              'كجم',\n    greenCoffeeStock: 'مخزون البن الأخضر',\n    averageYield: 'متوسط نسبة التحميص',\n    alerts: 'تنبيهات',\n    noAlertsMsg: 'لا توجد تنبيهات.',\n    noDataMsg: 'لا توجد بيانات.',\n  },"
)
t_content = t_content.replace(
    "actions:       'الإجراءات',\n  },",
    "actions:       'الإجراءات',\n    low: 'منخفض',\n  },"
)
t_content = t_content.replace(
    "exportCsv:  'تصدير CSV',\n  },",
    "exportCsv:  'تصدير CSV',\n    outputExceedsInput: 'الناتج لا يمكن أن يتجاوز المدخل.',\n    selectGreenLot: 'اختر دفعة خضراء...',\n    available: 'متاح',\n    availableShort: 'المتاح:',\n    confirmDeleteBatch: 'هل أنت متأكد من حذف هذه الدفعة؟',\n  },"
)
t_content = t_content.replace(
    "consumed:     'مستهلك',\n  },",
    "consumed:     'مستهلك',\n    batch: 'دفعة',\n    roastBatch: 'دفعة التحميص',\n    selectBatch: 'اختر دفعة...',\n  },"
)
t_content = t_content.replace(
    "units:             'وحدات',\n  },",
    "units:             'وحدات',\n    entries: 'سجل',\n    revenuePrefix: 'الإيرادات:',\n    externalOrderId: 'رقم الطلب الخارجي (اختياري)',\n    confirmDeleteSale: 'هل أنت متأكد من حذف هذا السجل؟',\n  },"
)
t_content = t_content.replace(
    "all:            'الكل',\n  },",
    "all:            'الكل',\n    records: 'سجل',\n    filters: 'فلاتر',\n  },"
)

with open('src/lib/i18n/translations.ts', 'w', encoding='utf-8') as f:
    f.write(t_content)

# 2. Update components
files = [
    'src/app/admin/dashboard/page.tsx',
    'src/app/admin/green-inventory/GreenInventoryClient.tsx',
    'src/app/admin/roasted-inventory/RoastedInventoryClient.tsx',
    'src/app/admin/roasting/RoastingClient.tsx',
    'src/app/admin/sales/SalesClient.tsx',
    'src/app/admin/movements/MovementsClient.tsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dashboard
    content = re.sub(r"title=\{locale === 'ar' \? '[^']*' : 'Green Coffee Stock'\}", "title={t('dashboard.greenCoffeeStock')}", content)
    content = re.sub(r"title=\{locale === 'ar' \? '[^']*' : 'Roasted Stock'\}", "title={t('dashboard.roastedStock')}", content)
    content = re.sub(r"title=\{locale === 'ar' \? '[^']*' : 'Average Yield'\}", "title={t('dashboard.averageYield')}", content)
    content = re.sub(r"title=\{locale === 'ar' \? '[^']*' : 'Low Stock Alerts'\}", "title={t('dashboard.lowStockAlerts')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Alerts'\}", "{t('dashboard.alerts')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'No alerts\.'\}", "{t('dashboard.noAlertsMsg')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Recent Activity'\}", "{t('dashboard.recentActivity')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'No data\.'\}", "{t('dashboard.noDataMsg')}", content)

    # Green Inventory
    content = re.sub(r"setError\(locale === 'ar' \? '[^']*' : 'Please fill all required fields\.'\)", "setError(t('common.fillRequired'))", content)
    content = re.sub(r"setImportResult\(locale === 'ar' \? `[^`]*` : `Successfully imported \$\{count\} rows\.`\)", "setImportResult(t('common.importSuccess') + ' ' + count)", content)
    content = re.sub(r"label=\{locale === 'ar' \? '[^']*' : 'Low'\}", "label={t('greenInventory.low')}", content)

    # Movements
    content = re.sub(r"\{locale === 'ar' \? `\$\{filtered\.length\} [^`]*` : `\$\{filtered\.length\} records`\}", "{filtered.length} {t('movements.records')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'filters'\}", "{t('movements.filters')}", content)
    content = re.sub(r"locale === 'ar' \? '[^']*' : 'Green'", "t('movements.green')", content)
    content = re.sub(r"locale === 'ar' \? '[^']*' : 'Roasted'", "t('movements.roasted')", content)

    # Roasted Inventory
    content = re.sub(r"setError\(locale === 'ar' \? '[^']*' : 'Please fill all required fields\.'\)", "setError(t('common.fillRequired'))", content)
    content = re.sub(r"setImportResult\(locale === 'ar' \? `[^`]*` : `Imported \$\{count\} rows\.`\)", "setImportResult(t('common.importSuccess') + ' ' + count)", content)
    content = re.sub(r"locale === 'ar' \? '[^']*' : 'Batch'", "t('roastedInventory.batch')", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Roast Batch'\}", "{t('roastedInventory.roastBatch')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Select batch\.\.\.'\}", "{t('roastedInventory.selectBatch')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Are you sure you want to delete this record\?'\}", "{t('common.confirmDeleteGeneric')}", content)

    # Roasting
    content = re.sub(r"setError\(locale === 'ar' \? '[^']*' : 'Please fill all required fields\.'\)", "setError(t('common.fillRequired'))", content)
    content = re.sub(r"setError\(locale === 'ar' \? '[^']*' : 'Output cannot exceed input\.'\)", "setError(t('roasting.outputExceedsInput'))", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Select a green lot\.\.\.'\}", "{t('roasting.selectGreenLot')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'available'\}", "{t('roasting.available')}", content)
    content = re.sub(r"\{locale === 'ar' \? `[^`]*` : `Available: \$\{selectedLot\.remaining_kg\} kg`\}", "{t('roasting.availableShort')} {selectedLot.remaining_kg} {t('dashboard.kg')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Are you sure you want to delete this batch\?'\}", "{t('roasting.confirmDeleteBatch')}", content)

    # Sales
    content = re.sub(r"setError\(locale === 'ar' \? '[^']*' : 'Please fill all required fields\.'\)", "setError(t('common.fillRequired'))", content)
    content = re.sub(r"setImportResult\(locale === 'ar' \? `[^`]*` : `Imported \$\{count\} rows\.`\)", "setImportResult(t('common.importSuccess') + ' ' + count)", content)
    content = re.sub(r"\{locale === 'ar' \? `[^`]*` : `\$\{filteredSales\.length\} entries`\}", "{filteredSales.length} {t('sales.entries')}", content)
    content = re.sub(r"\{locale === 'ar' \? `[^`]*` : `Revenue: \$\{totalRevenue\.toLocaleString\(\)\}`\}", "{t('sales.revenuePrefix')} {totalRevenue.toLocaleString()}", content)
    content = re.sub(r"\(locale === 'ar' \? '[^']*' : 'units'\)", "(t('sales.units'))", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'External Order ID \(optional\)'\}", "{t('sales.externalOrderId')}", content)
    content = re.sub(r"\{locale === 'ar' \? '[^']*' : 'Delete this sale record\?'\}", "{t('sales.confirmDeleteSale')}", content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

