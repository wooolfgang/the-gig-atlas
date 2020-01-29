/* eslint-disable operator-linebreak */
/* eslint-disable no-use-before-define */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import prisma from '@thegigatlas/prisma';
import cfg from '../../src/config';
import { fullDisplay } from '../utils';

const tags1 = ['node', 'react', 'javascript', 'python', 'typescript', 'java', 'next', 'css'];
const tags2 = ['information', 'engineering', 'engineer', 'architecture', 'frontend', 'design', 'figma', 'consultant'];
const tags3 = ['programmer', 'devops', 'docker', 'infrastracture', 'configuration', 'ai'];

/* eslint-disable spaced-comment */
const searchGigs = [
  /*1*/_cgig('Senior javascript programmer', ['javascript', 'node', 'react']),
  /*2*/_cgig('Junior javascript programmer', ['node']),
  /*3*/_cgig('Frontend engineer', ['javascript', 'react', 'design', 'frontend']),
  /*4*/_cgig('Experienced Tech Mentor', ['javascript', 'node', 'next']),
  /*5*/_cgig('Information Business Consultant', ['information', 'architecture', 'consultant']),
  /*6*/_cgig('Frontend UI/UX designer', ['design', 'frontend', 'figma']),
  /*7*/_cgig('Development Operation Engineer', ['devops', 'infrastracture', 'configuration']),
  /*8*/_cgig('Senior AI Engineer', ['python', 'engineer', 'ai']),
  ].map(g => ({ ...g, tags: { connect: g.tags.map(t => ({ name: t })) } }));
  /* eslint-enable spaced-comment */
  /* eslint-enable prettier/prettier */

export default async () => {
  try {
    const tags = await Promise.all(
      [...tags1, ...tags2, ...tags3].map(t =>
        prisma.createTag({ name: t }).catch(console.error),
      ),
    );

    const frag =
      /* sql */ 'fragment ASD on Gig { id title status tags { id name } }';
    const gigs = await Promise.all(
      searchGigs.map(g => prisma.createGig(g).$fragment(frag)),
    );

    console.log('Success inserting gigs with tags');
    console.log('inserted tags >>>>>');
    fullDisplay(tags);
    console.log('inserted gigs >>>>>>>>');
    fullDisplay(gigs);
  } catch (e) {
    console.error('error on inserting gigs with tag\n');
    console.log(e);
    process.exit(1);
  }
};

function _cgig(title, tagss) {
  return {
    title,
    tags: tagss,
    description: '',
    status: 'POSTED',
  };
}
