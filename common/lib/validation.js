import * as yup from 'yup';

/**
 * name regex pattern: https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
 */

export const employerTypeRegex = /^(PERSONAL|COMPANY)$/;
export const userRoleRegex = /^(ADMIN|MEMBER)$/;
export const jobTypeRegex = /^(FULL_TIME|PART_TIME|CONTRACT)$/;
export const paymentTypeRegex = /^(HOURLY|FIXED)$/;
export const projectTypeRegex = /^(GREENFIELD|MAINTENANCE|CONSULTING|TESTING)$/;

// console.log('cannot read yup here', yup);

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
export const title = yup.string();
export const description = yup.string();
export const technologies = yup.array().of(yup.string());
export const projectType = yup.string().matches(projectTypeRegex);
export const paymentType = yup.string().matches(paymentTypeRegex);
export const jobType = yup.string().matches(jobTypeRegex);
export const locationRestriction = yup.string();
export const gigInput = yup.object().shape({
  title,
  description,
  technologies,
  projectType,
  paymentType,
  minFee: yup.number().min(0),
  maxFee: yup.number().when('minFee', (minFee, schema) => schema.min(minFee)),
  jobType,
  locationRestriction,
});

export const employerType = yup.string().matches(employerTypeRegex);
export const employerInput = yup.object().shape({
  displayName: yup.string(),
  website: yup.string().url(),
  introduction: yup.string(),
  email: yup.string().email(),
  employerType,
  avatarFileId: yup.string(),
});

// employer
export const setEmployerInput = yup.object().shape({
  employer: employerInput,
  gig: gigInput,
});

export const createGigInput = yup.object().shape({
  gig: gigInput,
  employer: employerInput,
});
