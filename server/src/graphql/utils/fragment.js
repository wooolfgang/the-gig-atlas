const assembleFields = (selectionSet, isRecursive) => {
  const fields = selectionSet.selections.reduce((collected, current) => {
    if (current.selectionSet) {
      return isRecursive
        ? `${collected} ${current.name.value} ${assembleFields(
            current.selectionSet,
            isRecursive,
          )}`
        : collected;
    }

    return `${collected} ${current.name.value}`;
  }, '');

  return `{ ${fields} }`;
};

/**
 * Create fragment for prisma query optimizatoin
 * @param {object} info the graphql info object
 * @param {string} operation fragment name
 * @param {string} type corresponding schema type
 * @param {boolean} isRecursive [default=false] allow relationship query
 */
/* eslint-disable import/prefer-default-export */
export const createFragment = (info, operation, type, isRecursive = false) =>
  `fragment ${operation} on ${type} ${assembleFields(
    info.fieldNodes[0].selectionSet,
    isRecursive,
  )}`;
