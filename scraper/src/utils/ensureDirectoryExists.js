import fs from 'fs';
import path from 'path';

export default async function ensureDirectoryExists(relativePath) {
  const filePath = path.dirname(__dirname) + relativePath;
  try {
    const res = await fs.promises.mkdir(filePath, { recursive: true });
    return res;
  } catch (e) {
    throw new Error(`Error making directory at ${filePath}`);
  }
}
