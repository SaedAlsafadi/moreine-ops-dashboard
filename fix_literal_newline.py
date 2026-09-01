import os
import re

files = [
    'src/app/admin/green-inventory/GreenInventoryClient.tsx',
    'src/app/admin/roasted-inventory/RoastedInventoryClient.tsx',
    'src/app/admin/roasting/RoastingClient.tsx',
    'src/app/admin/sales/SalesClient.tsx',
    'src/app/admin/movements/MovementsClient.tsx'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace("'use client'\\nimport { Button } from '@/components/ui/Button'", "'use client'\nimport { Button } from '@/components/ui/Button'")
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
