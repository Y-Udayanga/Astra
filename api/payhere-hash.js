import {
    PAY_CURRENCY,
    MIN_AMOUNT_LKR,
    formatAmount,
    generatePaymentHash,
    getPayHereCredentials,
    resolveNotifyOrigin,
    resolveSiteDomain,
    readJsonBody,
} from './lib/payhere.mjs';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { merchantId, merchantSecret, sandbox } = getPayHereCredentials();
    if (!merchantId || !merchantSecret) {
        return res.status(500).json({
            error: 'PayHere is not configured on the server. Set PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET in your deployment environment.',
        });
    }

    try {
        const body = await readJsonBody(req);
        const numericAmount = Number(body.amount);
        if (!Number.isFinite(numericAmount) || numericAmount < MIN_AMOUNT_LKR) {
            return res.status(400).json({
                error: `Minimum PayHere charge is LKR ${MIN_AMOUNT_LKR}.00. Your total is too low after conversion.`,
            });
        }

        const orderId = body.orderId || `ORD-${Date.now()}`;
        const amountFormatted = formatAmount(numericAmount);
        const hash = generatePaymentHash(merchantId, orderId, amountFormatted, PAY_CURRENCY, merchantSecret);
        const notifyUrl = `${resolveNotifyOrigin(req)}/api/payhere-notify`;

        return res.status(200).json({
            merchant_id: merchantId,
            order_id: orderId,
            amount: amountFormatted,
            currency: PAY_CURRENCY,
            hash,
            sandbox,
            notify_url: notifyUrl,
            site_domain: resolveSiteDomain(req),
        });
    } catch (err) {
        console.error('payhere-hash error', err);
        // Return error.message in dev to aid debugging (do not expose in production)
        const devDetail = String(err.message || err);
        return res.status(500).json({ error: 'Failed to prepare PayHere payment.', detail: devDetail });
    }
}
