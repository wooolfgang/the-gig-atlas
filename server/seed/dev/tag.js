/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import prisma from '@thegigatlas/prisma';
import cfg from '../../src/config';
import { fullDisplay } from '../utils';

export const categories = ['programming language', 'technologies', 'engineering'];
export const progLangs = ['js', 'python', 'rust', 'java', 'C', 'C++', 'C#', 'html', 'css', 'es6', 'typescript', 'go', 'dart'];
export const techs = ['react', 'vue', 'yue', 'aws', 'graphql', 'node', 'webassembly', 'android', 'linux'];
export const engineering = ['configuration', 'devops', 'architecture', 'software design', 'microservices'];
export const tags = [...progLangs, ...techs, ...engineering];

export default async () => {
  try {
    const resC = await Promise.all(categories.map(c => prisma.createTagCategory({ name: c })));
    const progs = await Promise.all(progLangs.map(p => prisma.createTag({ name: p, categories: { connect: { name: 'programming language' } } })));
    const techsP = await Promise.all(techs.map(t => prisma.createTag({ name: t, categories: { connect: { name: 'technologies' } } })));
    const engis = await Promise.all(engineering.map(e => prisma.createTag({ name: e, categories: { connect: { name: 'engineering' } } })));

    console.log('\n>>> Sucesful Seed on tags');
    fullDisplay(resC);
    fullDisplay(progs);
    fullDisplay(techsP);
    fullDisplay(engis);
  } catch (e) {
    console.error('error on inserting tags\n');
    console.log(e);
    process.exit(1);
  }
};
