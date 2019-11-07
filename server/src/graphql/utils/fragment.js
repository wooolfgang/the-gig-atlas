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

  return `{ ${fields} }`;
};

/**
 * @param {*} info the graphql info object
 * @param {*} operation fragment name
 * @param {*} type corresponding schema type
 * @param {*} hasChild allow relationship query default: false
 */
/* eslint-disable import/prefer-default-export */
export const createFragment = (info, operation, type, hasChild = false) =>
  `fragment ${operation} on ${type} ${assembleFields(
    info.fieldNodes[0].selectionSet,
    hasChild,
  )}`;
