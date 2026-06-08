import { createClient } from '@supabase/supabase-js';
import {
    getPayHereCredentials,
    verifyNotificationSignature,
    readFormBody,
} from './lib/payhere.mjs';

const statusFromPayHere = (statusCode) => {
    // PayHere: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = chargedback
    if (String(statusCode) === '2') return 'completed';
    if (String(statusCode) === '0') return 'pending';
    if (String(statusCode) === '-1') return 'cancelled';
    return 'failed';
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');

    const { merchantSecret } = getPayHereCredentials();
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!merchantSecret || !supabaseUrl || !serviceKey) {
        console.error('payhere-notify: missing server credentials');
        return res.status(500).send('Server not configured');
    }

    try {
        const params = await readFormBody(req);

        const sigResult = verifyNotificationSignature(params, merchantSecret);
        if (!sigResult.ok) {
            console.error('payhere-notify: invalid signature for order', params.order_id);
            if (process.env.PAYHERE_DEBUG === 'true') {
                console.error('payhere-notify: signature mismatch', { localSig: sigResult.localSig, provided: sigResult.provided });
            }
            return res.status(400).send('Invalid signature');
        }

        const orderId = params.order_id;
        const nextStatus = statusFromPayHere(params.status_code);

        const supabase = createClient(supabaseUrl, serviceKey);
        const { error } = await supabase
            .from('orders')
            .update({
                status: nextStatus,
                amount: Number(params.payhere_amount || 0),
                currency: params.payhere_currency || 'LKR',
            })
            .eq('id', orderId);

        if (error) {
            console.error('payhere-notify: failed to update order', error);
            return res.status(500).send('Failed to update order');
        }

        return res.status(200).send('OK');
    } catch (err) {
        console.error('payhere-notify error', err);
        return res.status(500).send('Error');
    }
}
