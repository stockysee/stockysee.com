import os

file_path = r"c:\Users\HYPE\project\villa-engine\engine\BACKUP-ENGINE\BUILD\stockysee\app\dashboard\storefront\builder\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

if "</div>" in lines[696] and ")}" in lines[697]:
    print("Found target lines. Removing...")
    new_lines = lines[:696] + lines[698:]
    with open(file_path, "w", encoding="utf-8") as f_out:
        f_out.writelines(new_lines)
    print("Success.")
else:
    print(f"Content mismatch at lines 697-698: '{lines[696].strip()}' and '{lines[697].strip()}'")
