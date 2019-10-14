export interface Money {
  currency_code: string;
  value: string;
}

export interface Breakdown {
  /**
   * The subtotal for all items. Required if the request includes
   * purchase_units[].items[].unit_amount. Must equal the sum
   * of (items[].unit_amount * items[].quantity) for all items.
   */
  item_total: Money;
  /**
   * The discount for all items within a given purchase_unit.
   */
  discount?: Money
  insurance?: Object;
  tax_total?: Object;
  shipping?: Object;
  handling?: Object;
  shipping_discount?: Object;
  // [ref] => https://developer.paypal.com/docs/api/orders/v2/#definition-amount_breakdown
}

export interface AmountWitBreakdown {
  currency_code: 'USD' | 'PHP';
  value: string;
  /**
   * The breakdown of the amount. Breakdown provides
   * details such as total item amount, total tax amount,
   * shipping, handling, insurance, and discounts, if any.
   */
  breakdown?: Breakdown;
}

export interface Item {
  name: string;
  /**
   * The item price or rate per unit.
   * If you specify unit_amount, purchase_units[].amount.breakdown.item_total is required.
   * Must equal unit_amount * quantity for all items.
   */
  unit_amount: Money;
  quantity: string;
  description?: string;
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS';
  sku?: string;
  tax?: Money;
  url?: string;
}

export interface PurchaseUnit {
  /**
   * The total order amount with an optional breakdown that
   * provides details, such as the total item amount, total
   * tax amount, shipping, handling, insurance, and discounts,
   * if any. If you specify amount.breakdown, the amount equals
   * [item_total + tax_total + shipping = handling + insurance -
   *  shipping_discount - discount]. The amount must be a 
   * positive number. For listed of supported currencies
   * and decimal precision, see the PayPal REST APIs Currency Codes.
   */
  amount: AmountWitBreakdown;
  /**
   * An array of items that the customer purchases from the merchant.
   */
  items?: Item[];
  /**
   * The API caller-provided external ID for the purchase unit.
   * Required for multiple purchase units when you must update
   * the order through PATCH. If you omit this value and the order
   * contains only one purchase unit, PayPal sets this value to default.
   */
  reference_id?: String;
  payee?: Object;
  payment_instruction?: Object;
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
  shipping?: Object;
}

export interface Payer {
  name: {
    given_name: string;
    family_name: string;
  };
  email_address: string;
}

type Intent = 'CAPTURE' | 'AUTHORIZE';

export interface CreateOrder {
  /**
   * [CAPTURE]: The merchant intends to capture payment
   * immediately after the customer makes a payment.
   * [AUTHORIZE]: The merchant intends to authorize a payment
   * and place funds on hold after the customer makes a payment.
   * Authorized payments are guaranteed for up to three days but
   * are available to capture for up to 29 days. After the three-day
   * honor period, the original authorized payment expires and you
   * must re-authorize the payment. You must make a separate request
   * to capture payments on demand.
   */
  intent: Intent;
  purchase_units: PurchaseUnit[];
  payer?: Object;
  application_context?: Object;
}

enum OrderStatus {
  /**
   * The order was created with the specified context.
   */
  CREATED = 'CREATED',
  /**
   * The order was saved and persisted. The order status
   * continues to be in progress until a capture is made
   * with final_capture = true for all purchase units within the order.
   */
  SAVED = 'SAVED',
  /**
   * The customer approved the payment through the PayPal
   * wallet or another form of guest or unbranded payment.
   * For example, a card, bank account, or so on.
   */
  APPROVED = 'APPROVED',
  /**
   * All purchase units in the order are voided.
   */
  VOIDED = 'VOIDED',
  /**
   * The payment was authorized or the authorized
   * payment was captured for the order.
   */
  COMPLETED = 'COMPLETED',
}

export interface OrderResponse {
  create_time: string;
  update_time: string;
  id: string;
  intent: Intent;
  payer: Payer;
  purchase_units: PurchaseUnit[];
  status: OrderStatus;
  links: any[];
}