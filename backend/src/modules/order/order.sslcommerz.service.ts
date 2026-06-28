import { env } from '../../config/env';

export type SslCommerzPaymentResult = {
  tran_id: string;
  redirectGatewayURL: string;
};

const getRequiredEnv = (value: string, name: string) => {
  if (!value || !value.trim()) {
    throw new Error(`SSLCOMMERZ env var missing: ${name}`);
  }
  return value;
};

export const createSslCommerzPayment = async (order: any): Promise<SslCommerzPaymentResult> => {
  const amount = Math.round(Number(order.grandTotal));

  const store_id = getRequiredEnv(env.SSLCOMMERZ_STORE_ID, 'SSLCOMMERZ_STORE_ID');
  const store_passwd = getRequiredEnv(
    env.SSLCOMMERZ_STORE_PASSWORD,
    'SSLCOMMERZ_STORE_PASSWORD'
  );

  const success_url = getRequiredEnv(env.SSLCOMMERZ_SUCCESS_URL, 'SSLCOMMERZ_SUCCESS_URL');
  const fail_url = getRequiredEnv(env.SSLCOMMERZ_FAIL_URL, 'SSLCOMMERZ_FAIL_URL');
  const cancel_url = getRequiredEnv(env.SSLCOMMERZ_CANCEL_URL, 'SSLCOMMERZ_CANCEL_URL');
  const ipn_callback_url = getRequiredEnv(
    env.SSLCOMMERZ_CALLBACK_URL,
    'SSLCOMMERZ_CALLBACK_URL'
  );

  const tran_id = `SSLCZ-${order.orderId || order._id}`;

  // SSLCOMMERZ payload (v4)
  // Note: SSLCOMMERZ field names must match their gateway docs.
  // We use ipn_callback_url to receive server-to-server callback.
  // Common ones: store_id, store_passwd, total_amount, tran_id, currency, success_url, fail_url, cancel_url, ipn_callback_url
  const payload: Record<string, any> = {
    store_id,
    store_passwd,
    total_amount: amount,
    currency: env.SSLCOMMERZ_CURRENCY,

    tran_id,

    success_url,
    fail_url,
    cancel_url,
    ipn_callback_url,

    // Optional fields
    shipping_method: 'Courier',
    product_name: 'Book Order',
    product_category: 'Books',
    product_profile: 'general',
    cus_name: order.name,
    cus_phone: order.phone,
    cus_email: order.email || '',
    // Often requires address fields
    ship_name: order.name,
    ship_phone: order.phone,
    ship_addr1: order.address,
    ship_city: order.district,
    ship_state: order.thana,
    ship_postcode: '',

    // Variable names in SSLCOMMERZ gateway sometimes require this
    value_a: String(order._id || order.orderId || ''),
  };

  const baseURL = env.SSLCOMMERZ_BASE_URL;
  const endpoint = `${baseURL}/gwprocess/v4/api.php`;

  const form = new URLSearchParams(payload as any);

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`SSLCOMMERZ request failed: ${resp.status} ${text}`);
  }

  const data: any = await resp.json().catch(async () => {
    const text = await resp.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  });

  // gateway returns e.g. { GatewayPageURL: '...', tran_id: '...' }
  return {
    tran_id: data?.tran_id || payload.tran_id,
    redirectGatewayURL: data?.GatewayPageURL || data?.redirectGatewayURL || '',
  };
};

