/**
 * Paypal money object factory
 * @param {number} amount money value
 * @return Money { currency_code: <code>, value: <stringed amount> }
 */
export function toMoney(amount) {
  return {
    currency_code: 'USD',
    value: amount.toFixed(2),
  };
}

/* eslint-disable camelcase */
/**
 * Parse gig/order item into Paypal purchase item
 * @param {Array} items array of gig items to be paid
 * @param {number} items[].price price of gig item
 * @param {String} items[].name item name
 * @param {String} items[].description item description
 * @param {number} items[].quantity item quantity count
 * @return {[Array<Item>, number]} tuple of purchase item and their total price
 */
export function parseItems(items) {
  let total = 0;
  const unitItems = items.map(item => {
    /**
     * @todo: add item validation
     */
    const { name, price, description, quantity } = item;

    total += price * quantity;

    return {
      name,
      description,
      quantity: quantity.toString(),
      unit_amount: toMoney(price),
      category: 'DIGITAL_GOODS',
    };
  });
  // [ref] => https://developer.paypal.com/docs/api/orders/v2/#definition-item

  return [unitItems, total];
}

/**
 * Create a purchase unit object that contains the detials of gig to order
 * @param {Array<UnitItem>} items array of gig items to be paid
 */
export function processPurchaseUnit(items) {
  const [unitItems, totalPrice] = parseItems(items);
  const amount = {
    breakdown: {
      item_total: toMoney(totalPrice),
    },
    ...toMoney(totalPrice),
  };
  const purchaseUnit = {
    amount,
    items: unitItems,
  };

  return [purchaseUnit, totalPrice];
}

export function debugError(e) {
  if (e.response) {
    console.log('Paypal request error: >>>> \n Response data:');
    console.log(e.response.data);
    console.log('error on paypal order:\n', e.toJSON());
  } else {
    console.log('paypal parse error');
    console.log(e);
  }
}

export default { processPurchaseUnit, debugError };
