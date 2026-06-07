import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import {
    PAY_CURRENCY,
    MIN_AMOUNT_LKR,
    formatAmount,
    generatePaymentHash,
    getPayHereCredentials,
    resolveNotifyOrigin,
    readJsonBody,
    readFormBody,
    verifyNotificationSignature,
} from './api/lib/payhere.mjs';

// Local dev shim for Vercel serverless routes (/api/*) so PayHere hash
// generation works with `npm run dev` without exposing secrets in the bundle.
function payhereDevApi(env) {
    // Make .env values available to getPayHereCredentials() during dev.
    process.env.VITE_PAYHERE_MERCHANT_ID = env.VITE_PAYHERE_MERCHANT_ID;
    process.env.VITE_PAYHERE_MERCHANT_SECRET = env.VITE_PAYHERE_MERCHANT_SECRET;
    process.env.PAYHERE_MERCHANT_ID = env.PAYHERE_MERCHANT_ID;
    process.env.PAYHERE_MERCHANT_SECRET = env.PAYHERE_MERCHANT_SECRET;
    process.env.PAYHERE_SANDBOX = env.PAYHERE_SANDBOX;

    return {
        name: 'payhere-dev-api',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url?.startsWith('/api/payhere-')) return next();

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                if (req.method === 'OPTIONS') {
                    res.statusCode = 204;
                    return res.end();
                }

                if (req.url === '/api/payhere-hash' && req.method === 'POST') {
                    const { merchantId, merchantSecret, sandbox } = getPayHereCredentials();
                    if (!merchantId || !merchantSecret) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify({ error: 'PayHere server credentials missing in .env' }));
                    }

                    try {
                        const body = await readJsonBody(req);
                        const numericAmount = Number(body.amount);
                        if (!Number.isFinite(numericAmount) || numericAmount < MIN_AMOUNT_LKR) {
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            return res.end(JSON.stringify({
                                error: `Minimum PayHere charge is LKR ${MIN_AMOUNT_LKR}.00.`,
                            }));
                        }

                        const orderId = body.orderId || `ORD-${Date.now()}`;
                        const amountFormatted = formatAmount(numericAmount);
                        const hash = generatePaymentHash(
                            merchantId,
                            orderId,
                            amountFormatted,
                            PAY_CURRENCY,
                            merchantSecret
                        );

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify({
                            merchant_id: merchantId,
                            order_id: orderId,
                            amount: amountFormatted,
                            currency: PAY_CURRENCY,
                            hash,
                            sandbox,
                            notify_url: `${resolveNotifyOrigin(req)}/api/payhere-notify`,
                        }));
                    } catch (err) {
                        console.error('dev payhere-hash error', err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify({ error: 'Failed to prepare payment.' }));
                    }
                }

                if (req.url === '/api/payhere-notify' && req.method === 'POST') {
                    // PayHere cannot reach localhost; acknowledge so sandbox doesn't retry endlessly.
                    try {
                        const params = await readFormBody(req);
                        const { merchantSecret } = getPayHereCredentials();
                        if (merchantSecret && verifyNotificationSignature(params, merchantSecret)) {
                            console.info('[dev] PayHere notify verified for', params.order_id, 'status', params.status_code);
                        }
                    } catch (err) {
                        console.warn('[dev] PayHere notify parse failed', err);
                    }
                    res.statusCode = 200;
                    return res.end('OK');
                }

                next();
            });
        },
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), payhereDevApi(env)],
    };
});
