import cloudinary from '../../cloudinary';
import prisma from '../../prisma';

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

export default {
  Mutation: {
    uploadImage: async (_r, args, _c, info) => {
      const file = await args.file;
      const { filename, type } = file;
      const { url } = await cloudinaryUpload(file);
      const createFile = { url, type, name: filename };

      return prisma.createFile(createFile, info);
    },
    createFile: async (root, { file }, _c, info) =>
      prisma.createFile(file, info),
  },

  Query: {
    file: async (_r, { id }, _c, info) => prisma.file({ id }, info),
  },
};
