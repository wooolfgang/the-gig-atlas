import * as yup from 'yup';

/* eslint-disable arrow-parens */
/**
 * name regex pattern: https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
 */

export const employerTypeRegex = /^(PERSONAL|COMPANY)$/;
export const userRoleRegex = /^(ADMIN|MEMBER)$/;
export const jobTypeRegex = /^(FULL_TIME|PART_TIME|CONTRACT)$/;
export const paymentTypeRegex = /^(HOURLY|FIXED)$/;
export const projectTypeRegex = /^(GREENFIELD|MAINTENANCE|CONSULTING|TESTING)$/;

export const id = yup.string();

// user
export const email = yup.string().email();
export const name = yup.string().min(3);
export const password = yup.string().min(6);
export const userRole = yup.string().matches(userRoleRegex);
export const signupInput = yup.object().shape({
  email,
  name,
  password,
});

// gig
export const title = yup
  .string()
  .min(2, 'Minimum of two characters')
  .max(200, 'Maximum limit for title')
  .required('Title is required');
export const description = yup
  .string()
  .min(2, 'Minimum of two characters')
  .required('Description is required');
export const technologies = yup
  .array()
  .of(yup.string())
  .min(1, 'Add at least one technology')
  .required('Technologies is required');
export const projectType = yup
  .string()
  .required('Project Type is required')
  .matches(projectTypeRegex);
export const paymentType = yup
  .string()
  .required('Payment Type is required')
  .matches(paymentTypeRegex);
export const jobType = yup
  .string()
  .required('Job Type is required')
  .matches(jobTypeRegex);
export const minFee = yup
  .number('Min Fee must be a number')
  .positive('Fee should be greater than zero')
  .required('Minimum fee is required');
export const maxFee = yup
  .number('Max Fee must be a number')
  .when('minFee', (_minFee, schema) => schema.min(_minFee))
  .positive('Fee should be greater than zero')
  .required('Maximum fee is required');
export const communicationType = yup
  .string('Communication type must be a string')
  .required('Communication type is required');
export const communicationEmail = yup.string().when('communicationType', {
  is: val => val === 'EMAIL',
  then: yup
    .string('Email must be a string')
    .email('Please input correct email format ')
    .required('Email is required'),
});
export const communicationWebsite = yup.string().when('communicationType', {
  is: val => val === 'WEBSITE',
  then: yup
    .string('Website must be a string')
    .url('Please input proper website url')
    .required('Website url is required'),
});
export const locationRestriction = yup.string();
export const gigInput = yup.object().shape({
  title,
  description,
  technologies,
  projectType,
  paymentType,
  minFee,
  maxFee,
  jobType,
  locationRestriction,
  communicationType,
  communicationEmail,
  communicationWebsite,
});

export const employerInput = yup.object().shape({
  displayName: yup
    .string('Display name must be a string')
    .required('Display name is required'),
  website: yup
    .string('Website must be a string')
    .url('Website must be a url')
    .required('Website is required'),
  introduction: yup
    .string('Introduction must be a string')
    .required('Introduction is required'),
  email: yup
    .string('Email must be a string')
    .email('Email must be the correct email format')
    .required('Email is required'),
  employerType: yup
    .string('Employer type must be a string')
    .required('Employer type is required')
    .matches(employerTypeRegex),
  avatarFileId: yup.string('Avatar is required').required('Avatar is required'),

// employer
export const setEmployerInput = yup.object().shape({
  employer: employerInput,
  gig: gigInput,
});

export const createGigInput = yup.object().shape({
  gig: gigInput,
  employer: employerInput,
});

export const createGigInput = yup.object().shape({
  gig: gigInput.required('Gig input is required'),
  employer: employerInput.required('Employer input is required'),
});
