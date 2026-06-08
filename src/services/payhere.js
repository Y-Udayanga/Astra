const PAYHERE_HASH_PATH = '/api/payhere-hash';

// PayHere onsite checkout requires strict types (sandbox must be boolean true).
function sanitizePayHerePayment(payment) {
    const normalized = {
        sandbox: payment.sandbox === true || payment.sandbox === 'true',
        merchant_id: String(payment.merchant_id ?? ''),
        notify_url: String(payment.notify_url ?? ''),
        order_id: String(payment.order_id ?? ''),
        items: String(payment.items ?? 'Purchase'),
        amount: String(payment.amount ?? ''),
        currency: String(payment.currency ?? 'LKR'),
        hash: String(payment.hash ?? ''),
        first_name: String(payment.first_name ?? ''),
        last_name: String(payment.last_name ?? ''),
        email: String(payment.email ?? ''),
        phone: String(payment.phone ?? ''),
        address: String(payment.address ?? ''),
        city: String(payment.city ?? ''),
        country: String(payment.country ?? 'Sri Lanka'),
    };

    return Object.fromEntries(
        Object.entries(normalized).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
}

export function formatPayHereError(error, siteDomain) {
    const message = typeof error === 'string' ? error : 'Payment failed.';
    const lower = message.toLowerCase();

    if (/unauthorized|domain|origin|012008|something went wrong|invalid hash|hash/i.test(lower)) {
        const domain = siteDomain || window.location.hostname;
        return (
            `PayHere rejected this site (${domain}). In PayHere Sandbox go to Integrations → Add Domain/App, ` +
            `register "${domain}" (no https://), wait for approval, then copy that domain's Merchant Secret into ` +
            `Vercel → Settings → Environment Variables as PAYHERE_MERCHANT_SECRET and redeploy. ` +
            `Each domain has its own secret — localhost will not work on Vercel.`
        );
    }

    if (/sdk failed to load|payhere.js/i.test(lower)) {
        return 'PayHere SDK failed to load. Check your connection and that https://www.payhere.lk is not blocked.';
    }

    return message;
}

export async function preparePayHerePayment(amountLKR, orderId) {
    const response = await fetch(PAYHERE_HASH_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountLKR, orderId }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.error || 'Failed to prepare PayHere payment.');
    }
    return payload;
}

export function waitForPayHereSdk(timeoutMs = 8000) {
    if (typeof window !== 'undefined' && window.payhere) {
        return Promise.resolve(window.payhere);
    }

    return new Promise((resolve, reject) => {
        const started = Date.now();
        const timer = setInterval(() => {
            if (window.payhere) {
                clearInterval(timer);
                resolve(window.payhere);
                return;
            }
            if (Date.now() - started > timeoutMs) {
                clearInterval(timer);
                reject(new Error('PayHere SDK failed to load. Check your internet connection and try again.'));
            }
        }, 100);
    });
}

export function startPayHereCheckout(payment, handlers) {
    return waitForPayHereSdk().then((payhere) => {
        let completed = false;

        payhere.onCompleted = (orderId) => {
            completed = true;
            handlers.onCompleted?.(orderId);
        };
        payhere.onDismissed = () => {
            if (completed) return;
            handlers.onDismissed?.();
        };
        payhere.onError = (error) => {
            handlers.onError?.(error);
        };

        const payload = sanitizePayHerePayment(payment);
        if (!payload.sandbox || !payload.merchant_id || !payload.hash || !payload.amount) {
            throw new Error('PayHere payment payload is incomplete. Check server configuration.');
        }

        payhere.startPayment(payload);
    });
}
