import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../services/api';

const emptyProduct = {
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    status: 'active',
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [activeOnly, setActiveOnly] = useState(false);
    const [feedback, setFeedback] = useState('');

    const loadProducts = async () => {
        setLoading(true);
        const rows = await getProducts();
        setProducts(rows);
        setLoading(false);
    };

    useEffect(() => {
        loadProducts().catch((error) => {
            console.error('Failed to load products', error);
            setFeedback(error.message);
            setLoading(false);
        });
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesQuery = [product.name, product.category, product.status]
                .join(' ')
                .toLowerCase()
                .includes(query.toLowerCase());
            const matchesStatus = !activeOnly || product.status === 'active';
            return matchesQuery && matchesStatus;
        });
    }, [activeOnly, products, query]);

    const promptProduct = (initial = emptyProduct) => {
        const name = window.prompt('Product name', initial.name);
        if (name === null) return null;

        const price = window.prompt('Price', initial.price);
        if (price === null) return null;

        const category = window.prompt('Category', initial.category);
        if (category === null) return null;

        const stock = window.prompt('Stock', initial.stock);
        if (stock === null) return null;

        const image = window.prompt('Image URL', initial.image);
        if (image === null) return null;

        const description = window.prompt('Description', initial.description);
        if (description === null) return null;

        const status = window.prompt('Status (active/draft/archived)', initial.status) || 'active';
        const normalizedStatus = ['active', 'draft', 'archived'].includes(status.trim()) ? status.trim() : 'active';

        return {
            name: name.trim(),
            price: Number(price) || 0,
            category: category.trim(),
            stock: Number(stock) || 0,
            image: image.trim(),
            description: description.trim(),
            status: normalizedStatus,
        };
    };

    const handleAddProduct = async () => {
        try {
            const product = promptProduct();
            if (!product?.name) return;

            const created = await createProduct(product);
            setFeedback(`Created ${created.name}`);
            await loadProducts();
        } catch (error) {
            console.error('Failed to create product', error);
            setFeedback(error.message);
        }
    };

    const handleEditProduct = async (product) => {
        try {
            const updates = promptProduct({
                name: product.name,
                price: product.price,
                category: product.category,
                stock: product.stock,
                image: product.image,
                description: product.description,
                status: product.status,
            });

            if (!updates?.name) return;

            const saved = await updateProduct(product.id, updates);
            setFeedback(`Updated ${saved.name}`);
            await loadProducts();
        } catch (error) {
            console.error('Failed to update product', error);
            setFeedback(error.message);
        }
    };

    const handleDeleteProduct = async (product) => {
        try {
            if (!window.confirm(`Delete ${product.name}?`)) return;

            await deleteProduct(product.id);
            setFeedback(`Deleted ${product.name}`);
            await loadProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
            setFeedback(error.message);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Products</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your product catalog</p>
                </div>
                <button
                    type="button"
                    onClick={handleAddProduct}
                    style={{
                        backgroundColor: 'var(--color-accent)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {feedback && (
                <div style={{ marginBottom: '16px', color: 'var(--color-accent)', fontWeight: 500 }}>{feedback}</div>
            )}

            <div style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                        <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveOnly((value) => !value)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            background: activeOnly ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-background)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            color: 'var(--color-text-main)'
                        }}
                    >
                        <Filter size={18} />
                        {activeOnly ? 'Showing Active' : 'Filter'}
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-background)' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Product</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Category</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Price</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Stock</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '20px 24px', color: 'var(--color-text-muted)' }}>Loading products...</td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#e2e8f0',
                                                        borderRadius: '8px',
                                                        backgroundImage: item.image ? `url(${item.image})` : 'none',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                                <span style={{ fontWeight: 500 }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{item.category}</td>
                                        <td style={{ padding: '16px 24px', fontWeight: 500 }}>${Number(item.price).toFixed(2)}</td>
                                        <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{item.stock} in stock</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                backgroundColor: item.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: item.status === 'active' ? '#10B981' : '#F59E0B',
                                                fontWeight: 500
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditProduct(item)}
                                                    style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteProduct(item)}
                                                    style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-danger)' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '20px 24px', color: 'var(--color-text-muted)' }}>No products match your filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;
