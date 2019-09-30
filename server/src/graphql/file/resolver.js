import cloudinary from '../../cloudinary';

const promisifiedCloudinaryUpload = file =>
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
    uploadImage: async (root, args, { prisma }, info) => {
      const file = await args.file;
      const { filename, type } = file;
      const res = await promisifiedCloudinaryUpload(file);
      const { url } = res;
      return prisma.createFile(
        {
          url,
          name: filename,
          type,
        },
        info,
      );
    },
    createFile: async (root, { file }, { prisma }, info) =>
      prisma.createFile(file, info),
  },

  Query: {
    file: async (root, { id }, { prisma }, info) => prisma.file({ id }, info),
  },
};
