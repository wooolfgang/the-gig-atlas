import prisma from '@thegigatlas/prisma';

/**
 * Tag
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} name
 */

/**
 * Create or Conenct
 * @typedef {Object} CreateOrConnect
 * @property {Tag[]} title
 * @property {Tag[]} artist
 */

/**
 * Find existing tags from the db to sort whether to create or connect them
 * @param {string[]} tags - list of tags to create or connect
 * @returns {CreateOrConnect}
 */
export async function sortExistTags(tags) {
  const exists = (await prisma.tags({ where: { name_in: tags } })).map(
    t => t.name,
  );
  const createOrConnect = { create: [], connect: [] };

  return tags.reduce((current, tag) => {
    const tagObj = { name: tag };

    if (exists.includes(tag)) {
      current.connect.push(tagObj);
    } else {
      current.create.push(tagObj);
    }

    return current;
  }, createOrConnect);
}
