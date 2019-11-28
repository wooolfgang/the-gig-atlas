import fs from 'fs';
import path from 'path';

export default async function ensureDirectoryExists(relativePath) {
  try {
    const filePath = path.dirname(__dirname) + relativePath;
    await fs.promises.mkdir(filePath, { recursive: true });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
