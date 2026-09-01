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
    
    content = re.sub(r'import \{ Button \} from \'@/components/ui/Button\'[\r\n]*', '', content)
    
    if 'use client' in content:
        content = content.replace("'use client'", "'use client'\\nimport { Button } from '@/components/ui/Button'")
    else:
        content = "import { Button } from '@/components/ui/Button'\\n" + content
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
