// Debug helper for PayHere hash/signature verification
// Usage examples:
// 1) With env file: `node scripts/debug_payhere.js` (loads .env if present and dotenv installed)
// 2) Inline (no deps):
//    PAYHERE_MERCHANT_ID=1235747 PAYHERE_MERCHANT_SECRET=your_secret node scripts/debug_payhere.js

const crypto = require('crypto');

function formatAmount(amount) {
  return Number(amount).toFixed(2);
}

function hashSecret(merchantSecret) {
  return crypto.createHash('md5').update(String(merchantSecret)).digest('hex').toUpperCase();
}

function generatePaymentHash(merchantId, orderId, amount, currency, merchantSecret) {
  const amountFormatted = formatAmount(amount);
  const hashedSecret = hashSecret(merchantSecret);
  return crypto
    .createHash('md5')
    .update(String(merchantId) + String(orderId) + amountFormatted + currency + hashedSecret)
    .digest('hex')
    .toUpperCase();
}

function verifyNotificationSignature(params, merchantSecret) {
  const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = params;
  if (!merchant_id || !order_id || !md5sig) return false;

  const hashedSecret = hashSecret(merchantSecret);
  const localSig = crypto
    .createHash('md5')
    .update(
      String(merchant_id) +
      String(order_id) +
      String(payhere_amount) +
      String(payhere_currency) +
      String(status_code) +
      hashedSecret
    )
    .digest('hex')
    .toUpperCase();

  return { localSig, provided: String(md5sig).toUpperCase(), ok: localSig === String(md5sig).toUpperCase() };
}

// Load env from process.env (you can export before running)
const merchantId = process.env.PAYHERE_MERCHANT_ID || process.env.VITE_PAYHERE_MERCHANT_ID || '';
const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || process.env.VITE_PAYHERE_MERCHANT_SECRET || '';

if (!merchantId || !merchantSecret) {
  console.error('Missing PAYHERE_MERCHANT_ID or PAYHERE_MERCHANT_SECRET in env');
  process.exit(2);
}

const sampleOrderId = process.argv[2] || `ORD-${Date.now()}`;
const sampleAmount = process.argv[3] || '100.00';
const currency = 'LKR';

const paymentHash = generatePaymentHash(merchantId, sampleOrderId, sampleAmount, currency, merchantSecret);
console.log('merchantId:', merchantId);
console.log('orderId:', sampleOrderId);
console.log('amount:', Number(sampleAmount).toFixed(2));
console.log('paymentHash:', paymentHash);

// Example notification verification
const exampleParams = {
  merchant_id: merchantId,
  order_id: sampleOrderId,
  payhere_amount: Number(sampleAmount).toFixed(2),
  payhere_currency: currency,
  status_code: '2',
  md5sig: '', // put a md5sig here to verify
};

if (process.argv[4]) {
  exampleParams.md5sig = process.argv[4];
  const result = verifyNotificationSignature(exampleParams, merchantSecret);
  console.log('verifyNotificationSignature:', result);
} else {
  console.log('To verify an incoming notification signature, re-run and pass the `md5sig` as the 4th arg.');
}
