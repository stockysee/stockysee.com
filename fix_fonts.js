const fs = require('fs');
let code = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8');

code = code.replaceAll('defaultFontSize={30}', 'defaultFontSize={22}');
code = code.replaceAll('prefix=""\n                                              label="Judul Grid"\n                                              defaultFontSize={20}', 'prefix=""\n                                              label="Judul Grid"\n                                              defaultFontSize={14}');
code = code.replaceAll('prefix="productName"\n                                              label="Nama Produk"\n                                              defaultFontSize={13}', 'prefix="productName"\n                                              label="Nama Produk"\n                                              defaultFontSize={17}');

// Clean up messed up stock label from my bad parallel replace:
code = code.replaceAll('prefix="stock"\n                                          label="Label Stok"\n                                          defaultFontSize={22}', 'prefix="stock"\n                                          label="Label Stok"\n                                          defaultFontSize={9}');
code = code.replaceAll('prefix="stock"\n                                          label="Label Stok"\n                                          defaultFontSize={14}', 'prefix="stock"\n                                          label="Label Stok"\n                                          defaultFontSize={9}');
code = code.replaceAll('prefix="stock"\n                                              label="Label Stok"\n                                              defaultFontSize={22}', 'prefix="stock"\n                                              label="Label Stok"\n                                              defaultFontSize={9}');
code = code.replaceAll('prefix="stock"\n                                              label="Label Stok"\n                                              defaultFontSize={14}', 'prefix="stock"\n                                              label="Label Stok"\n                                              defaultFontSize={9}');

fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', code, 'utf8');
console.log('Fixed');
