import { supabase } from '../utils/supabase';

const mapProduct = (row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    category: row.category ?? 'Uncategorized',
    image: row.image_url ?? row.images?.[0] ?? '',
    images: row.images ?? [],
    stock: Number(row.stock ?? 0),
    status: row.status ?? 'active',
    specs: row.specs ?? {},
    sellerId: row.seller_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const mapOrder = (row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    customer: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
    address: row.address,
    city: row.city,
    country: row.country,
    amount: Number(row.amount ?? 0),
    currency: row.currency ?? 'USD',
    paymentMethod: row.payment_method ?? 'card',
    status: row.status ?? 'pending',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const mapCustomer = (row) => ({
    id: row.id,
    name: row.name ?? 'User',
    email: row.email ?? '',
    role: row.role ?? 'user',
    avatar: row.avatar_url ?? `https://ui-avatars.com/api/?name=${(row.name ?? 'User').replaceAll(' ', '+')}&background=random`,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const mapSettings = (row) => ({
    id: row.id,
    storeName: row.store_name,
    supportEmail: row.support_email,
    currency: row.currency,
    updatedAt: row.updated_at,
});

const throwIfError = (error, message) => {
    if (error) {
        throw new Error(`${message}: ${error.message}`);
    }
};

const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    throwIfError(error, 'Failed to load current user');
    return data.user ?? null;
};

export const getProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    throwIfError(error, 'Failed to load products');
    return (data ?? []).map(mapProduct);
};

export const getProduct = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error?.code === 'PGRST116') {
        return null;
    }

    throwIfError(error, 'Failed to load product');
    return mapProduct(data);
};

export const createProduct = async (product) => {
    const user = await getCurrentUser();
    const payload = {
        name: product.name,
        description: product.description ?? '',
        price: Number(product.price ?? 0),
        category: product.category ?? 'Uncategorized',
        image_url: product.image ?? product.image_url ?? '',
        images: product.images ?? (product.image ? [product.image] : []),
        stock: Number(product.stock ?? 0),
        status: product.status ?? 'active',
        seller_id: product.sellerId ?? user?.id ?? null,
        specs: product.specs ?? {},
    };

    const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select('*')
        .single();

    throwIfError(error, 'Failed to create product');
    return mapProduct(data);
};

export const updateProduct = async (id, updates) => {
    const payload = {
        name: updates.name,
        description: updates.description ?? '',
        price: Number(updates.price ?? 0),
        category: updates.category ?? 'Uncategorized',
        image_url: updates.image ?? updates.image_url ?? '',
        images: updates.images ?? (updates.image ? [updates.image] : []),
        stock: Number(updates.stock ?? 0),
        status: updates.status ?? 'active',
        specs: updates.specs ?? {},
    };

    const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

    throwIfError(error, 'Failed to update product');
    return mapProduct(data);
};

export const deleteProduct = async (id) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    throwIfError(error, 'Failed to delete product');
};

export const getOrders = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    throwIfError(error, 'Failed to load orders');
    return (data ?? []).map(mapOrder);
};

export const getOrder = async (id) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error?.code === 'PGRST116') {
        return null;
    }

    throwIfError(error, 'Failed to load order');
    return mapOrder(data);
};

export const createOrder = async (orderData) => {
    const payload = {
        id: orderData.id ?? `ORD-${Date.now()}`,
        user_id: orderData.userId ?? null,
        first_name: orderData.firstName,
        last_name: orderData.lastName,
        email: orderData.email,
        address: orderData.address,
        city: orderData.city,
        country: orderData.country ?? 'Sri Lanka',
        amount: Number(orderData.amount ?? 0),
        currency: orderData.currency ?? 'USD',
        payment_method: orderData.paymentMethod ?? 'card',
        status: orderData.status ?? 'pending',
    };

    const { data, error } = await supabase
        .from('orders')
        .insert(payload)
        .select('*')
        .single();

    throwIfError(error, 'Failed to create order');
    return mapOrder(data);
};

export const getMyOrders = async () => {
    const user = await getCurrentUser();
    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    throwIfError(error, 'Failed to load your orders');
    return (data ?? []).map(mapOrder);
};

export const getCustomers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    throwIfError(error, 'Failed to load customers');
    return (data ?? []).map(mapCustomer);
};

export const getStoreSettings = async () => {
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

    throwIfError(error, 'Failed to load store settings');
    const settings = data?.[0];
    return settings ? mapSettings(settings) : null;
};

export const saveStoreSettings = async (settings) => {
    const existing = await getStoreSettings();
    const payload = {
        store_name: settings.storeName,
        support_email: settings.supportEmail,
        currency: settings.currency,
    };

    const request = existing
        ? supabase.from('store_settings').update(payload).eq('id', existing.id)
        : supabase.from('store_settings').insert(payload);

    // Use maybeSingle() instead of single(): when a row-level-security policy
    // blocks the write, the statement affects 0 rows and single() throws the
    // cryptic "Cannot coerce the result to a single JSON object". maybeSingle()
    // returns null so we can surface a clear, actionable message instead.
    const { data, error } = await request.select('*').maybeSingle();
    throwIfError(error, 'Failed to save store settings');

    if (!data) {
        throw new Error(
            'Failed to save store settings: the update was blocked by the database. ' +
            'Your account needs the admin role — re-run schema.sql (it now backfills ' +
            'the admin profile) and try again.'
        );
    }

    return mapSettings(data);
};

export const api = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getOrders,
    getOrder,
    createOrder,
    getMyOrders,
    getCustomers,
    getStoreSettings,
    saveStoreSettings,
};

export default api;
