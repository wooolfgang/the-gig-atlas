import { allow, rule } from 'graphql-shield';
import { validation } from '@shared/common';
import { isAuthenticated } from '../utils/rules';

const isValidImage = rule()(async (_, args) => {
  let file;
  try {
    file = await args.file;
  } catch (e) {
    return 'Image upload error';
  }
  try {
    await validation.imageName.validate(file.filename);
    // eslint-disable-next-line no-param-reassign
    args.file = file;

    return true;
  } catch (e) {
    return 'Invalid image type';
  }
});

export default {
  Mutation: {
    uploadImage: isValidImage,
    createFile: isAuthenticated,
  },
  Query: {
    file: allow,
  },
  File: allow,
};
