import re

with open('src/components/sidebar/components/Links.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r"\{route\.path === 'green-inventory'[^}]*\}", "{route.path === 'green-inventory' ? t('nav.greenInventory') : route.path === 'roasted-inventory' ? t('nav.roastedInventory') : t('nav.' + route.path)}", content)

with open('src/components/sidebar/components/Links.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
