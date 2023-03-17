export function formatSheetData(sheetData = [], sheetsSchema = []) {
  return sheetData.map(sheet => {
    const sheetWithSchema = sheetsSchema.find(e => e.name === sheet.name);

    return {
      ...sheet,
      schema: sheetWithSchema.schema || [],
      sheet: sheet.sheet,
      row: 0,
      col: 0,
    };
  });
}

export function sanitizeColumnName(name = '') {
  let updatedName = name.toString();
  updatedName = name || '';

  if (updatedName.charAt(0) === '"' && updatedName.charAt(updatedName.length - 1) === '"') {
    updatedName = updatedName.replace(/^"(.*)"$/, '$1');
  }
  updatedName = updatedName.replace(/\W/g, '_');
  if (/^[^a-zA-Z]/.test(updatedName)) {
    updatedName = `c_${updatedName}`;
  }

  return updatedName;
}
