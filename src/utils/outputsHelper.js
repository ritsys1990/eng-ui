/*
 * Cheks if the file extension is .csv, .parquet, .enc, or .delta only
 */
const validFileExt = ['.csv', '.pqt', '.parquet', '.enc', '.delta'];
export const checkFileExtension = filePath => {
  if (!validFileExt.some(eachEXT => filePath?.toLowerCase()?.endsWith(eachEXT))) {
    throw new Error('invalid extension');
  }
};
