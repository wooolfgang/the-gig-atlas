import config from './config';

const cloudinary = require('cloudinary').v2;

cloudinary.config(config.cloudinary);

export default cloudinary;
