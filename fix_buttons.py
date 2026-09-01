import os
import re

files = [
    'src/app/admin/green-inventory/GreenInventoryClient.tsx',
    'src/app/admin/roasted-inventory/RoastedInventoryClient.tsx',
    'src/app/admin/roasting/RoastingClient.tsx',
    'src/app/admin/sales/SalesClient.tsx',
    'src/app/admin/movements/MovementsClient.tsx'
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add import if missing
    if 'import { Button }' not in content:
        content = content.replace("import Modal from '@/components/ui/Modal'", "import Modal from '@/components/ui/Modal'\nimport { Button } from '@/components/ui/Button'")
        content = content.replace("import CsvExport", "import { Button } from '@/components/ui/Button'\nimport CsvExport")

    # Replace Add button
    content = re.sub(
        r'<button\s+onClick=\{openAdd\}\s+className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg text-sm font-medium transition\s*shadow-sm"\s*>',
        '<Button onClick={openAdd} variant="primary" size="md">',
        content
    )
    # Add sale button in SalesClient
    content = re.sub(
        r'<button onClick=\{.*?\}\s+className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg text-sm font-medium transition\s*shadow-sm"\s*>',
        lambda m: '<Button onClick=' + m.group(0).split('onClick=')[1].split('className')[0].strip() + ' variant="primary" size="md">',
        content,
        flags=re.DOTALL
    )

    # Edit button
    content = re.sub(
        r'<button\s+onClick=\{([^}]+)\}\s+className="text-xs px-3 py-1.5 rounded-md bg-cream hover:bg-cream-dark text-olive\s*font-medium transition"\s*>',
        r'<Button onClick={\1} variant="secondary" size="sm">',
        content
    )
    # Delete table row button
    content = re.sub(
        r'<button\s+onClick=\{([^}]+)\}\s+className="text-xs px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600\s*font-medium transition"\s*>',
        r'<Button onClick={\1} variant="danger" size="sm">',
        content
    )

    # Save/Add modal button
    content = re.sub(
        r'<button\s+onClick=\{handleSave\}\s+disabled=\{isPending\}\s+className="flex-1 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg font-medium text-sm transition\s*disabled:opacity-60"\s*>',
        r'<Button onClick={handleSave} disabled={isPending} variant="primary" className="flex-1">',
        content
    )
    
    # Cancel modal button
    content = re.sub(
        r'<button\s+onClick=\{([^}]+)\}\s+className="flex-1 py-2 bg-cream hover:bg-cream-dark text-olive rounded-lg font-medium text-sm\s*transition"\s*>',
        r'<Button onClick={\1} variant="secondary" className="flex-1">',
        content
    )

    # Confirm delete modal button
    content = re.sub(
        r'<button\s+onClick=\{([^}]+)\}\s+disabled=\{isPending\}\s+className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition\s*disabled:opacity-60"\s*>',
        r'<Button onClick={\1} disabled={isPending} variant="danger" className="flex-1">',
        content
    )
    
    # Clear filters button in movements
    content = re.sub(
        r'<button onClick=\{clearFilters\}\s+className="px-4 py-2 bg-cream hover:bg-cream-dark text-olive rounded-lg text-sm font-medium transition"\s*>',
        r'<Button onClick={clearFilters} variant="secondary">',
        content
    )

    # Replace closing tags ONLY for tags we opened as Button!
    # A safer way is to just do a smart replace where <button becomes <Button if we changed it, and </button> becomes </Button> if it matches.
    # Actually, let's just do a blanket replace and fix the alert button.
    content = re.sub(r'</button>', r'</Button>', content)
    
    # Revert the alert close button which has class ms-2 text-xs underline
    content = re.sub(r'<button className="ms-2 text-xs underline"(.*?)</Button>', r'<button className="ms-2 text-xs underline"\1</button>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in files:
    process_file(f)
