import prisma from '@thegigatlas/prisma';
import cloudinary from '../../cloudinary';

const cloudinaryUpload = file =>
  new Promise((res, rej) => {
    const { createReadStream, filename } = file;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'The Gig Atlas',
      },
      (err, image) => {
        if (err) {
          rej(err);
        }
        res(image);
      },
    );
    createReadStream(filename).pipe(uploadStream);
  });

async function uploadImage(_r, { file }, _c, info) {
  const { filename, type } = file;
  const { url } = await cloudinaryUpload(file);
  const createFile = { url, type, name: filename };

  return prisma.createFile(createFile, info);
}

export default {
  Mutation: {
    uploadImage,
    createFile: async (root, { file }, _c, info) =>
      prisma.createFile(file, info),
  },

  Query: {
    file: async (_r, { id }, _c, info) => prisma.file({ id }, info),
  },
};
