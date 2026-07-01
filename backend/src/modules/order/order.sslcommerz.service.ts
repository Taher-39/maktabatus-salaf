import { env } from '../../config/env';

export type SslCommerzPaymentResult = {
  tran_id: string;
  redirectGatewayURL: string;
};

type SslCommerzValidationResult = {
  isValid: boolean;
  data: Record<string, any>;
};

const getRequiredEnv = (value: string, name: string) => {
  if (!value || !value.trim()) {
    throw new Error(`SSLCOMMERZ env var missing: ${name}`);
  }
  return value;
};

const getGatewayUrl = (configuredUrl: string, fallbackPath: string) => {
  const trimmed = configuredUrl?.trim();
  if (trimmed) return trimmed;

  const callbackUrl = env.SSLCOMMERZ_CALLBACK_URL?.trim();
  if (callbackUrl) {
    const normalized = callbackUrl.replace(/\/+$/, '');
    if (/\/callback\/?$/i.test(normalized)) {
      return `${normalized.replace(/\/callback\/?$/i, '')}${fallbackPath}`;
    }
    return `${normalized}${fallbackPath}`;
  }

  const envName = `SSLCOMMERZ_${fallbackPath.replace('/', '').toUpperCase()}_URL`;
  return `${env.CLIENT_URL}${fallbackPath}`;
};

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

export const createSslCommerzPayment = async (order: any): Promise<SslCommerzPaymentResult> => {
  const amount = Math.round(Number(order.grandTotal || 0));

  const store_id = getRequiredEnv(env.SSLCOMMERZ_STORE_ID, 'SSLCOMMERZ_STORE_ID');
  const store_passwd = getRequiredEnv(
    env.SSLCOMMERZ_STORE_PASSWORD,
    'SSLCOMMERZ_STORE_PASSWORD'
  );

  const success_url = getGatewayUrl(env.SSLCOMMERZ_SUCCESS_URL, '/success');
  const fail_url = getGatewayUrl(env.SSLCOMMERZ_FAIL_URL, '/fail');
  const cancel_url = getGatewayUrl(env.SSLCOMMERZ_CANCEL_URL, '/cancel');
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
    cus_add1: order.address,
    cus_city: order.district,
    cus_state: order.thana,
    cus_postcode: '',
    cus_country: 'Bangladesh',
    // Often requires address fields
    ship_name: order.name,
    ship_phone: order.phone,
    ship_addr1: order.address,
    ship_city: order.district,
    ship_state: order.thana,
    ship_postcode: '',
    ship_country: 'Bangladesh',

    // Variable names in SSLCOMMERZ gateway sometimes require this
    value_a: String(order._id || order.orderId || ''),
  };

  const baseURL = normalizeBaseUrl(env.SSLCOMMERZ_BASE_URL);
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

  const redirectGatewayURL = data?.GatewayPageURL || data?.redirectGatewayURL || '';

  if (!redirectGatewayURL) {
    throw new Error(
      `SSLCOMMERZ did not return a gateway URL. Response: ${JSON.stringify(data)}`
    );
  }

  // gateway returns e.g. { GatewayPageURL: '...', tran_id: '...' }
  return {
    tran_id: data?.tran_id || payload.tran_id,
    redirectGatewayURL,
  };
};

export const validateSslCommerzPayment = async (
  gatewayPayload: Record<string, any>,
  order: any
): Promise<SslCommerzValidationResult> => {
  const valId = gatewayPayload?.val_id;

  if (!valId) {
    return { isValid: false, data: { reason: 'Missing val_id' } };
  }

  const store_id = getRequiredEnv(env.SSLCOMMERZ_STORE_ID, 'SSLCOMMERZ_STORE_ID');
  const store_passwd = getRequiredEnv(
    env.SSLCOMMERZ_STORE_PASSWORD,
    'SSLCOMMERZ_STORE_PASSWORD'
  );
  const baseURL = normalizeBaseUrl(env.SSLCOMMERZ_BASE_URL);
  const params = new URLSearchParams({
    val_id: String(valId),
    store_id,
    store_passwd,
    v: '1',
    format: 'json',
  });

  const resp = await fetch(`${baseURL}/validator/api/validationserverAPI.php?${params}`);

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`SSLCOMMERZ validation failed: ${resp.status} ${text}`);
  }

  const data = (await resp.json()) as Record<string, any>;
  const status = String(data.status || '').toUpperCase();
  const tranIdMatches = !data.tran_id || data.tran_id === order.tran_id;
  const amountMatches =
    !data.amount || Math.round(Number(data.amount)) === Math.round(Number(order.grandTotal));
  const currencyMatches =
    !data.currency || String(data.currency).toUpperCase() === env.SSLCOMMERZ_CURRENCY.toUpperCase();

  return {
    isValid:
      (status === 'VALID' || status === 'VALIDATED') &&
      tranIdMatches &&
      amountMatches &&
      currencyMatches,
    data,
  };
};

