import crypto from 'crypto';

export const PAY_CURRENCY = 'LKR';
export const MIN_AMOUNT_LKR = 30;

export function formatAmount(amount) {
    return Number(amount).toFixed(2);
}

export function hashSecret(merchantSecret) {
    return crypto.createHash('md5').update(String(merchantSecret)).digest('hex').toUpperCase();
}

export function generatePaymentHash(merchantId, orderId, amount, currency, merchantSecret) {
    const amountFormatted = formatAmount(amount);
    const hashedSecret = hashSecret(merchantSecret);
    return crypto
        .createHash('md5')
        .update(String(merchantId) + String(orderId) + amountFormatted + currency + hashedSecret)
        .digest('hex')
        .toUpperCase();
}

export function verifyNotificationSignature(params, merchantSecret) {
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

    return localSig === String(md5sig).toUpperCase();
}

export function readJsonBody(req) {
    if (req.body !== undefined && req.body !== null) {
        if (typeof req.body === 'object') {
            return Promise.resolve(req.body);
        }
        if (typeof req.body === 'string') {
            try {
                return Promise.resolve(req.body ? JSON.parse(req.body) : {});
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }

    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

export function readFormBody(req) {
    if (req.body !== undefined && req.body !== null) {
        if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
            return Promise.resolve(req.body);
        }
        if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
            try {
                const raw = String(req.body);
                const params = new URLSearchParams(raw);
                return Promise.resolve(Object.fromEntries(params.entries()));
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }

    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => {
            try {
                const params = new URLSearchParams(data);
                resolve(Object.fromEntries(params.entries()));
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

export function getPayHereCredentials() {
    return {
        merchantId: (process.env.PAYHERE_MERCHANT_ID || process.env.VITE_PAYHERE_MERCHANT_ID || '').trim(),
        merchantSecret: (process.env.PAYHERE_MERCHANT_SECRET || process.env.VITE_PAYHERE_MERCHANT_SECRET || '').trim(),
        sandbox: (process.env.PAYHERE_SANDBOX ?? 'true') !== 'false',
    };
}

export function resolveNotifyOrigin(req) {
    if (process.env.PAYHERE_NOTIFY_ORIGIN) return process.env.PAYHERE_NOTIFY_ORIGIN.replace(/\/$/, '');
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'http';
    if (host) return `${proto}://${host}`;
    return 'http://localhost:5173';
}
