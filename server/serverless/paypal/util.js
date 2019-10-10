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
      quantity,
      unit_amount: price.toFixed(2),
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
  const currency_code = 'USD';
  const amount = {
    breakdown: {
      item_total: {
        currency_code,
        value: totalPrice.toFixed(2),
      },
    },
  };
  const purchaseUnit = {
    amount,
    items: unitItems,
  };

  return purchaseUnit;
}

export default { processPurchaseUnit };
