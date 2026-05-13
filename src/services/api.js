/**
 * Sandbox API Service
 * 
 * This file acts as a mock backend for the application. It uses localStorage
 * to persist data temporarily. When the real backend is ready, simply replace
 * the logic in these functions with actual fetch/axios calls.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getFromStorage = (key, defaultValue = []) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from storage', error);
        return defaultValue;
    }
};

const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to storage', error);
    }
};

// Initial mock data if storage is empty
const defaultProducts = [
    { id: 1, name: "Premium Leather Jacket", price: 299, category: "Outerwear", image: "https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=500" },
    { id: 2, name: "Minimalist Watch", price: 150, category: "Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=500" },
    { id: 3, name: "Designer Sunglasses", price: 120, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=500" },
];

export const api = {
    // Products
    async getProducts() {
        await delay(500); // Simulate network latency
        let products = getFromStorage('astra_products', null);
        if (!products) {
            products = defaultProducts;
            saveToStorage('astra_products', products);
        }
        return products;
    },

    async getProduct(id) {
        await delay(300);
        const products = await this.getProducts();
        return products.find(p => p.id === parseInt(id)) || null;
    },

    async addProduct(product) {
        await delay(600);
        const products = await this.getProducts();
        const newProduct = { ...product, id: Date.now() };
        products.push(newProduct);
        saveToStorage('astra_products', products);
        return newProduct;
    },

    // Cart
    async saveCart(cartItems) {
        await delay(200);
        saveToStorage('astra_cart', cartItems);
    },

    async getCart() {
        await delay(200);
        return getFromStorage('astra_cart', []);
    },

    // Orders
    async createOrder(orderData) {
        await delay(800);
        const orders = getFromStorage('astra_orders', []);
        const newOrder = {
            id: `ORD-${Date.now()}`,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        orders.push(newOrder);
        saveToStorage('astra_orders', orders);
        return newOrder;
    },
    
    // Auth (Mock)
    async login(email, password) {
        await delay(800);
        // Simple mock login
        if (email && password) {
            const user = { id: 1, email, name: email.split('@')[0], role: email.includes('admin') ? 'admin' : 'user' };
            saveToStorage('astra_user', user);
            return user;
        }
        throw new Error('Invalid credentials');
    },

    async logout() {
        await delay(300);
        localStorage.removeItem('astra_user');
    },

    async getCurrentUser() {
        await delay(200);
        return getFromStorage('astra_user', null);
    }
};

export default api;
