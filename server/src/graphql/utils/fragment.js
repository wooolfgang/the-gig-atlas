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

  return `{${fields} }`;
};

/**
 * Create fragment for prisma query optimization
 * @param {object} info the graphql info object
 * @param {string} operation any fragment name
 * @param {string} type corresponding schema type
 * @param {boolean} isRecursive [default=false] allow relationship query
 */
/* eslint-disable import/prefer-default-export */
export const createFragment = (info, operation, type, isRecursive = false) =>
  `fragment ${operation} on ${type} ${assembleFields(
    info.fieldNodes[0].selectionSet,
    isRecursive,
  )}`;

/**
 * Create fragment for prisma query optimization
 * @param {object} info the graphql info object
 * @param {string} operation any fragment name
 * @param {string} type corresponding schema type of sub field
 * @param {string} subName name of sub field
 * @param {boolean} isRecursive [default=false] allow relationship query
 */
/* eslint-disable import/prefer-default-export */
export const createSubFragment = (
  info,
  operation,
  type,
  subName,
  isRecursive = false,
) => {
  const selectionSet = info.fieldNodes[0].selectionSet.selections.find(
    field => field.name.value === subName,
  ).selectionSet;

  return `fragment ${operation} on ${type} ${assembleFields(
    selectionSet,
    isRecursive,
  )}`;
};
