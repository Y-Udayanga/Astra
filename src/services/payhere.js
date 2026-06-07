const PAYHERE_HASH_PATH = '/api/payhere-hash';

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
        payhere.onCompleted = handlers.onCompleted;
        payhere.onDismissed = handlers.onDismissed;
        payhere.onError = handlers.onError;
        payhere.startPayment(payment);
    });
}
