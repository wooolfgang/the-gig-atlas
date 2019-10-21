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

/**
 * Update Product
 * @todo: IMPLEMENT CODE..
 */
export async function updateProduct(...args) {
  // [ref] => https://developer.paypal.com/docs/api/catalog-products/v1/#products_patch
}

export async function listProducts(count = 12) {
  const config = {
    url: `${url}?total_required=true&page_size=${count}&page=1`,
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