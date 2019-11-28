import fs from 'fs';
import path from 'path';

export default async function getFilenamesFromDirectory(directory) {
  try {
    const dir = path.dirname(__dirname) + directory;
    const filenames = await fs.promises.readdir(dir);
    return filenames;
  } catch (e) {
    throw new Error('Unable to read directory');
  }
}
