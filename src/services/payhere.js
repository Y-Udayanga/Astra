const PAYHERE_HASH_PATH = '/api/payhere-hash';

function sanitizePayHerePayment(payment) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const normalized = {
        ...payment,
        merchant_id: String(payment.merchant_id ?? ''),
        amount: String(payment.amount ?? ''),
        currency: String(payment.currency ?? 'LKR'),
        // PayHere requires these keys; undefined becomes the literal string "undefined".
        return_url: payment.return_url ?? `${origin}/checkout`,
        cancel_url: payment.cancel_url ?? `${origin}/checkout`,
    };

    return Object.fromEntries(
        Object.entries(normalized).filter(([, value]) => value !== undefined && value !== null)
    );
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

        payhere.startPayment(sanitizePayHerePayment(payment));
    });
}
