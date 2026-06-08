const PAYHERE_HASH_PATH = '/api/payhere-hash';

function sanitizePayHerePayment(payment) {
    const normalized = {
        ...payment,
        merchant_id: String(payment.merchant_id ?? ''),
        amount: String(payment.amount ?? ''),
        currency: String(payment.currency ?? 'LKR'),
    };
    
    // Explicitly delete return_url and cancel_url if they are not provided 
    // or set to undefined, as the Onsite Checkout popup requires them to be omitted.
    if (normalized.return_url === undefined || normalized.return_url === '') {
        delete normalized.return_url;
    }
    if (normalized.cancel_url === undefined || normalized.cancel_url === '') {
        delete normalized.cancel_url;
    }

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
