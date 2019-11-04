const assembleFields = (selectionSet, hasChild) => {
  const fields = selectionSet.selections.reduce((collected, current) => {
    if (current.selectionSet) {
      return hasChild
        ? `${collected} ${current.name.value} ${assembleFields(
          current.selectionSet,
          hasChild,
        )}`
        : collected;
    }

    return `${collected} ${current.name.value}`;
  }, '');

  return `{${fields} }`;
};

/**
 * Create fragment for prisma query optimizatoin
 * @param {object} info the graphql info object
 * @param {string} operation fragment name
 * @param {string} type corresponding schema type
 * @param {boolean} hasChild allow relationship query default: false
 */
/* eslint-disable import/prefer-default-export */
export const createFragment = (info, operation, type, hasChild = false) =>
  `fragment ${operation} on ${type} ${assembleFields(
    info.fieldNodes[0].selectionSet,
    hasChild,
  )}`;
