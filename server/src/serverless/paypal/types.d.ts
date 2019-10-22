import { string } from "yup";

export interface Money {
  currency_code: string;
  value: string;
}

interface Name {
  given_name: string;
  surname: string;
}

interface PaymentMethod {
  /**
   * The customer-selected payment method on the merchant site.
    Default: PAYPAL
   */
  payer_selected?: string;
  /**
   * The merchant-preferred payment sources. The possible values are:
        UNRESTRICTED. Accepts any type of payment from the customer.
        IMMEDIATE_PAYMENT_REQUIRED. Accepts only immediate payment
          from the customer. For example, credit card, PayPal balance, or instant ACH. Ensures that at the time of capture, the payment does not have the `pending` status.
        Default: UNRESTRICTED.
   */
  payee_preferred?: 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';
}

interface AppCtx {
  /**
   * The label that overrides the business name in the PayPal account on the PayPal site.
   */
  brand_name?: string;
  /**
   * The BCP 47-formatted locale of pages that the PayPal payment experience shows.
   * PayPal supports a five-character code. For example, da-DK, he-IL, id-ID, ja-JP,
   * no-NO, pt-BR, ru-RU, sv-SE, th-TH, zh-CN, zh-HK, or zh-TW.
   * Minimum length: 2.
   */
  locale?: string;
  /**
   * The location from which the shipping address is derived. The possible values are:
      GET_FROM_FILE. Get the customer-provided shipping address on the PayPal site.
      NO_SHIPPING. Redacts the shipping address from the PayPal site.
        Recommended for digital goods.
      SET_PROVIDED_ADDRESS. Get the merchant-provided address. The customer cannot
        change this address on the PayPal site. If merchant does not pass an address,
        customer can choose the address on PayPal pages.
      Default: GET_FROM_FILE.
   */
  shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
  /**
   * Configures the label name to Continue or Subscribe Now for subscription consent
   * experience. The possible values are:
      CONTINUE. After you redirect the customer to the PayPal subscription consent page,
        a Continue button appears. Use this option when you want to control the activation
        of the subscription and do not want PayPal to activate the subscription.
      SUBSCRIBE_NOW. After you redirect the customer to the PayPal subscription consent
        page, a Subscribe Now button appears. Use this option when you want PayPal to
        activate the subscription.
      Default: SUBSCRIBE_NOW.
   */
  user_action?: 'CONTINUE' | 'SUBSCRIBE_NOW';
  /**
   * The customer and merchant payment preferences. Currently only PAYPAL payment method is supported.
   * 
  */
 payment_method?: PaymentMethod;

 return_url: string; // not needed
 cancel_url: string; // not needed
}

interface Patch {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value: any;
  /**
   * The JSON Pointer to the target documentlocation from which to
   * move the value. Required for the move operation.
   */
  from: string;

  // [ref]=> https://developer.paypal.com/docs/api/subscriptions/v1/#definition-patch
}

/**
 * ___ORDER__
 */

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
  name: Name;
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
  application_context?: AppCtx;
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

/**
 * ___PRODUCT__
 * Merchants can use the Catalog Products API to
 * create products, which are goods and services.
 */

interface CreateProduct {
  name: string;
  id?: string;
  description?: string;
  // given
  type: 'SERVICE';
  category?: 'ONLINE_SERVICE';
  image_url?: string; // no need
  home_url?: string; /// no need
}

/**
 * ___PLAN__
 * You can use billing plans and subscriptions to create subscriptions
 * that process recurring PayPal payments for physical or digital goods,
 * or services. A plan includes pricing and billing cycle information
 * that defines the amount and frequency of charge for a subscription.
 * You can also define a fixed plan, such as a $5 basic plan or a
 * volume- or graduated-based plan with pricing tiers based on the
 * quantity purchased. For more information,
 */
//

/**
 * __PALN_CREATE__
 */

interface PricingSchema {
  /**
   * The version of the pricing scheme.
   */
  version: number; // int
  /**
   * The fixed amount to charge for the subscription. For regular pricing,
   * it is limited to a 20% increase from the current amount and the change
   * is applicable for both existing and future subscriptions. For trial
   * period pricing, there is no limit or constraint in changing the amount
   * and the change is applicable only on future subscriptions.
   */
  fixed_price?: Money;
  create_time?: string;
  update_time?: string
}

interface Frequency {
  /**
   * The interval at which the subscription is charged or billed. The possible values are:
   *  @DAY A daily billing cycle.
   *  @WEEK A weekly billing cycle.
   *  @MONTH A monthly billing cycle.
   *  @YEAR A yearly billing cycle.
   */
  interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  /**
   * The number of intervals after which a subscriber
   * is billed. For example, if the interval_unit is
   * DAY with an interval_count of 2, the subscription is
   * billed once every two days. The following table lists
   * the maximum allowed values for the interval_count for each interval_unit:
   * @interval_units     -> | DAY | WEEK | MONTH | YEAR |
   * @max_interval_count -> | 365 |  52 |    12 |    1 |
   */
  interval_count?: number; // int

}

interface BillingCycle {
  /**
   * The active pricing scheme for this billing cycle.
   * A free trial billing cycle does not require a pricing scheme.
   */
  pricing_schema?: PricingSchema;
  /**
   * The frequency details for this billing cycle.
   */
  frequency: Frequency;
  /**
   * The tenure type of the billing cycle. In case of a plan
   * having trial period, only 1 trial period is allowed per plan. The possible values are:
   *  @REGULAR A regular billing cycle.
   *  @TRIAL A trial billing cycle.
   */
  tenure_type: 'REGULAR' | 'TRIAL';
  /**
   * The order in which this cycle is to run among other billing cycles.
   * For example, a trial billing cycle has a sequence of 1 while a regular
   * billing cycle has a sequence of 2, so that trial cycle runs before the regular cycle.
   */
  sequence: number; // integer
  /**
   * The number of times this billing cycle runs. Trial billing cycles can only have a
   * value of 1 for total_cycles. Regular billing cycles can either have infinite cycles
   * (value of 0 for total_cycles) or a finite number of cycles (value between 1 and 999 for total_cycles).
   */
  total_cycles?: number // integer;
}

interface PaymentReference {
  /**
   * Indicates whether to automatically bill the outstanding amount in the next billing cycle.
   * default: true
   */
  auto_bill_outstanding?: boolean;
  /**
   * The initial set-up fee for the service.
   */
  setup_fee?: Money;
  /**
   * The action to take on the subscription if the initial payment for the setup fails. The possible values are:
   *  @CONTINUE Continues the subscription if the initial payment for the setup fails.
   *  @CANCE Cancels the subscription if the initial payment for the setup fails.
   *  @Default -> CANCEL.
   */
  setup_fee_failure_action?: 'CONTINUE' | 'CANCEL';
  /**
   * The maximum number of payment failures before a subscription is suspended.
   * For example, if payment_failure_threshold is 2, the subscription automatically
   * updates to the SUSPEND state if two consecutive payments fail.
   *   Default: 0.
   */
  payment_failure_threshold?: number // int
}

interface Tax {
  /**
   * The tax percentage on the billing amount.
   */
  percentage: string;
  /**
   * Indicates whether the tax was already included in the billing amount.
   *  Default: true.
   */
  inclusive?: boolean;
}

interface CreatePlan {
  /**
   * product id of as its reference for the plan
   */
  product_id: string;
  name: string;
  /**
   * An array of billing cycles for trial and regular billing.
   * A plan can have multiple billing cycles but only one trial billing cycle.
   */
  billing_cycles: BillingCycle[];  
  /**
   * The initial state of the plan. Allowed input values
   * are CREATED and ACTIVE. The allowed values are:
   * @CREATED The plan was created. You cannot create subscriptions for a plan in this state.
   * @INACTIVE The plan is inactive.
   * @ACTIVE The plan is active. You can only create subscriptions for a plan in this state.
   * @Default ACTIVE.
   */
  status?: 'CREATED' | 'INACTIVE' | 'ACTIVE';
  description?: string;
  /**
   * The payment preferences for a subscription.
   */
  payment_preferences?: PaymentReference;
  taxes?: Tax;
  /**
   * Indicates whether you can subscribe to this plan
   * by providing a quantity for the goods or service.
   */
  quantity_supported?: boolean;
}

/**
 * __PLAN_PRICE_UPDATE__
 */

interface UpdatePricingScheme {
  billing_cycle_sequence: number;
  pricing_scheme: PricingSchema;
}

interface UpdateData {
  pricing_schemes: UpdatePricingScheme[];
}

/**
 * ___SUBSCRIPTION__
 * You can use billing plans and subscriptions to create subscriptions
 * that process recurring PayPal payments for physical or digital goods,
 * or services. A plan includes pricing and billing cycle information that
 * defines the amount and frequency of charge for a subscription. You can also
 * define a fixed plan, such as a $5 basic plan or a volume- or graduated-based
 * plan with pricing tiers based on the quantity purchased. For more information
 */

 /**
  * __SUBSCRIPTION_CREATE__
  */
 interface Subscriber {
   name: Name;
   email_address: string;
   shipping_address: any; // not needed
 }

 interface CreateSubscription {
   plan_id: string;
   /**
    * The date and time when the subscription started, in Internet date and time format.
    *    Default: Current time.
    */
   start_time?: string;
   /**
    * The quantity of the product in the subscription.
        Minimum length: 1.
    */
   quantity?: string;
   shipping_amount?: Money;
   /**
    * The subscriber information.
    */
   subscriber?: Subscriber;
   /**
    * The application context, which customizes the
    * payer experience during the subscription approval process with PayPal.
    */
   application_context?: AppCtx;
 }

 /**
  * __SUBSCRIPTION_CAPTURE_AUTHORIZE__
  * not needed for now
  */

interface CaptureInput {
  /**
   * The reason or note for the subscription charge.
   */
  note: string;
  capture_type: 'OUTSTANDING_BALANCE',
  amount: Money,
}