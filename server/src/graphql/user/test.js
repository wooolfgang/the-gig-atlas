import prisma from '../../prisma';
import { createDebugPost } from '../utils/req_debug';
import config from '../../config';
import { createAuth } from '../auth/util';

const { testUrl } = config;

const loginUser = {
  firstName: 'Juan',
  lastName: 'De la Cruz',
  email: 'juan1k2k3k4k@gmail.com',
  password: 'password',
};
const loginUser2 = {
  firstName: 'Mario',
  lastName: 'Analo',
  email: 'mario@yahoo.com',
  password: 'password',
};
const signupEmployerUser = {
  firstName: 'John2',
  lastName: 'Doe2',
  email: 'john123986@gmail.com',
  password: 'password',
  onboardingStep: 'EMPLOYER',
};
const signupFreelanceUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john1234187@gmail.com',
  password: 'password',
  onboardingStep: 'FREELANCER',
};
const avatarFile = {
  name: 'Avatar',
  url:
    'https://avatars3.githubusercontent.com/u/20152170?s=400&u=3a22690968ee9bb7f2d102cecabdac8823eeb018&v=4',
};
let users;
let avatarFileId;

beforeAll(async () => {
  try {
    users = await Promise.all([
      prisma.createUser(loginUser),
      prisma.createUser(loginUser2),
      prisma.createUser(signupEmployerUser),
      prisma.createUser(signupFreelanceUser),
    ]);
  } catch (e) {
    console.log('ERROR: create users');
    console.error(e);
  }

  try {
    const res = await prisma.createFile(avatarFile);
    avatarFileId = res.id;
  } catch (e) {
    console.log('Error creating avatarFile', JSON.stringify(e));
  }
});

afterAll(async () => {
  try {
    const ids = users.map(u => u.id);
    await prisma.deleteManyUsers({ id_in: ids });
  } catch (e) {
    // soft delete
  }
  try {
    await prisma.deleteFile({ id: avatarFileId });
  } catch (e) {
    //
  }
});

const personalQuery = `
mutation ONBOARDING_PERSONAL($input: PersonalInput!) {
  onboardingPersonal(input: $input) {
    id
    onboardingStep
    firstName
    lastName
  }
}
`;
const employerQuery = `
  mutation ONBOARDING_EMPLOYER($input: EmployerOnboardbIn!) {
    onboardingEmployer(input: $input) {
      id
      onboardingStep
      asEmployer {
        id
        employerType
        displayName
        email
        introduction
        website
      }
    }
  }
`;

const freelancerQuery = `
  mutation ONBOARDING_FREELANCER($input: FreelancerOnboardIn!) {
    onboardingFreelancer(input: $input) {
      id
      onboardingStep
      asFreelancer {
        id
        bio
        website
        location
        socials {
          id
          type
          url
        }
        portfolio {
          id
          title
          description
          url
          images {
            name
            url
          }
        }
        skills
      }
    }
  }
`;

describe('User onboarding', () => {
  it('onboarding from personal to employer', async () => {
    const [user] = users;
    const { token } = await createAuth(user.id, user.role);
    const headers = { Authorization: `Bearer ${token}` };
    const debugPost = createDebugPost(testUrl, { headers }); // => to avoid redundant debugging code

    const personalInput = {
      firstName: 'Maria',
      lastName: 'Santos',
      accountType: 'EMPLOYER',
      avatarFileId,
    };
    const { onboardingPersonal: op } = await debugPost({
      query: personalQuery,
      variables: { input: personalInput },
    });

    expect(op.id).toBe(user.id);
    expect(op.onboardingStep).toBe('EMPLOYER');

    const employerinput = {
      employerType: 'COMPANY',
      displayName: 'The Power Lattice',
      email: 'power@gmail.com',
      introduction: 'Im good',
      website: 'https://www.pwer.com',
    };
    const { onboardingEmployer: oe } = await debugPost({
      query: employerQuery,
      variables: { input: employerinput },
    });
    expect(oe.id).toBe(user.id);
    expect(oe.onboardingStep).toBe(null);
    const employer = oe.asEmployer;
    expect(employer.employerType).toBe(employerinput.employerType);
    expect(employer.displayName).toBe(employerinput.displayName);
  });

  it('onboarding from personal to freelancer', async () => {
    const [_, user] = users;
    const { token } = await createAuth(user.id, user.role);
    const headers = { Authorization: `Bearer ${token}` };
    const debugPost = createDebugPost(testUrl, { headers }); // => to avoid redundant debugging code

    const personalInput = {
      firstName: 'Maria',
      lastName: 'Santos',
      accountType: 'FREELANCER',
      avatarFileId,
    };
    const { onboardingPersonal: op } = await debugPost({
      query: personalQuery,
      variables: { input: personalInput },
    });

    expect(op.id).toBe(user.id);
    expect(op.onboardingStep).toBe(personalInput.accountType);
    expect(op.firstName).toBe(personalInput.firstName);
    expect(op.lastName).toBe(personalInput.lastName);

    const freelanceIn = {
      bio: 'I am good',
      website: 'lol.com',
      location: 'Iloilo, Ph',
      socials: [{ type: 'TWITTER', url: 'twitter.com/3kj45' }],
      portfolio: [
        {
          title: 'Accounting business',
          description: 'Calculates all incomes',
          images: [],
          url: 'accc.com',
        },
      ],
      skills: ['node', 'react'],
    };

    const { onboardingFreelancer: of } = await debugPost({
      query: freelancerQuery,
      variables: { input: freelanceIn },
    });

    expect(of.onboardingStep).toBe(null);
    const freelancer = of.asFreelancer;
    expect(freelancer.bio).toBe(freelanceIn.bio);
    expect(freelancer.skills).toEqual(freelanceIn.skills);
  });

  it('onboarding from signup to employer', async () => {
    const [_, _a, user] = users;
    const debugPost = await createDebugPost.withUser(testUrl, user);

    const employerinput = {
      employerType: 'COMPANY',
      displayName: 'The Power Lattice',
      email: 'power@gmail.com',
      introduction: 'Im good',
      website: 'https://www.pwer.com',
    };
    const { onboardingEmployer: oe } = await debugPost({
      query: employerQuery,
      variables: { input: employerinput },
    });
    expect(oe.id).toBe(user.id);
    expect(oe.onboardingStep).toBe(null);
    const employer = oe.asEmployer;
    expect(employer.employerType).toBe(employerinput.employerType);
    expect(employer.displayName).toBe(employerinput.displayName);
  });

  it('onboarding from signup to freelancer', async () => {
    const [_, _a, _b, user] = users;
    const debugPost = await createDebugPost.withUser(testUrl, user);

    const freelanceIn = {
      bio: 'I am good',
      website: 'lol.com',
      location: 'Iloilo, Ph',
      socials: [{ type: 'TWITTER', url: 'twitter.com/3kj45' }],
      portfolio: [
        {
          title: 'Accounting business',
          description: 'Calculates all incomes',
          images: [],
          url: 'accc.com',
        },
      ],
      skills: ['node', 'react'],
    };

    const { onboardingFreelancer: of } = await debugPost({
      query: freelancerQuery,
      variables: { input: freelanceIn },
    });

    expect(of.onboardingStep).toBe(null);
    const freelancer = of.asFreelancer;
    expect(freelancer.bio).toBe(freelanceIn.bio);
    expect(freelancer.skills).toEqual(freelanceIn.skills);
  });
});
