import os

file_path = r"c:\Users\HYPE\project\villa-engine\engine\BACKUP-ENGINE\BUILD\stockysee\app\dashboard\storefront\builder\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Remove lines 698 to 755 (1-indexed)
# 698 is index 697, 755 is index 754
if "{editingSection.type === \"HERO\" && (" in lines[697]:
    print("Found duplicate block. Removing...")
    new_lines = lines[:697] + lines[755:]
    with open(file_path, "w", encoding="utf-8") as f_out:
        f_out.writelines(new_lines)
    print("Success.")
else:
    print(f"Content mismatch at line 698: '{lines[697].strip()}'")
