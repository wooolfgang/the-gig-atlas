/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
import request from './connect';
import util from './util';

const url = '/v1/catalogs/products';
/**
 * Valudate product value
 * @todo: implement validation
 */
function _validateProduct(product) {
  //
  return product;
}
/**
 * Create new Product
 * @param {Object} product product obj
 * @param {String} product.name product name
 * @param {String} product.description product description
 */
export async function createProduct(product) {
  const validated = _validateProduct(product);

  const dataBody = {
    type: 'SERVICE',
    category: 'ONLINE_SERVICES',
    ...validated,
  };
  const config = {
    url,
    method: 'post',
    data: dataBody,
  };

  try {
    const { data } = await request(config);
    const { id: orderId } = data;

    return orderId;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
}

export async function showProduct(id) {
  const config = {
    url: `${url}/${id}`,
    method: 'get',
  };

  try {
    const { data } = await request(config);
    // const { total_items, total_pages, products } = data;

    // return orderId;
    return data;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
}

/**
 * Update Product
 * @param {String} id - product id
 * @param {...Object} operations - update operations
 * @param {string} operations[].op - operation enum add|remove|replace|move|copy|test
 * @param {string} operations[].path - field name (ex: '/description')
 * @param {string} operations[].value - change value
 * @param {string} operations[].from - move value
 */
export async function updateProduct(id, ...operations) {
  const config = {
    url: `${url}/${id}`,
    method: 'patch',
    data: operations,
  };

  try {
    await request(config); // => has no data return

    return showProduct(id);
  } catch (e) {
    util.debugError(e);
    throw e;
  }

  // [ref] => https://developer.paypal.com/docs/api/catalog-products/v1/#products_patch
}

/**
 * List of all available products
 * @param {int} pageSize size of items per page
 * @param {int} pagePos initial page position
 * @returns async iterator for list products
 */
export function listProducts(pageSize = 10, pagePos = 1) {
  return {
    pageSize,
    pagePos,
    [Symbol.asyncIterator]() {
      let currentPos = this.pagePos;
      let isDone = false;

      return {
        async next() {
          if (isDone) {
            return { done: true };
          }

          const config = {
            url: `${url}?total_required=true&page_size=${pageSize}&page=${currentPos}`,
            method: 'get',
          };

          try {
            const { data } = await request(config);
            const { total_items } = data;

            if (pageSize * currentPos >= total_items) {
              isDone = true;
            }
            currentPos += pagePos;

            return {
              done: false,
              value: data,
            };
          } catch (e) {
            util.debugError(e);
            throw e;
          }
        },
      }
    }
  };

  // [ref]=> iterator reference: https://javascript.info/async-iterators-generators
}
