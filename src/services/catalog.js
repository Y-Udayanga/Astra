import { getProducts, getProduct } from './api';
import { products as localCatalog, getLocalProduct } from '../data/products';

const isActiveProduct = (product) => product.status !== 'draft' && product.status !== 'archived';

// Single storefront catalog source: Supabase when available, local demo fallback.
export async function fetchStorefrontProducts() {
    try {
        const remote = await getProducts();
        const active = remote.filter(isActiveProduct);
        if (active.length > 0) return active;
    } catch (err) {
        console.error('fetchStorefrontProducts: Supabase unavailable, using local catalog', err);
    }
    return localCatalog;
}

export async function fetchStorefrontProduct(id) {
    const local = getLocalProduct(id);
    if (local) return local;

    try {
        const remote = await getProduct(id);
        if (remote && isActiveProduct(remote)) return remote;
    } catch (err) {
        console.error('fetchStorefrontProduct: remote lookup failed', err);
    }

    const catalog = await fetchStorefrontProducts();
    return catalog.find((p) => String(p.id) === String(id)) || null;
}

export function searchProducts(products, query) {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
        const haystack = [
            p.name,
            p.category,
            p.description,
            ...(Array.isArray(p.highlights) ? p.highlights : []),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        return haystack.includes(q);
    });
}
