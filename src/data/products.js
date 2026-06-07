// Single source of truth for the demo storefront catalog. Prices are stored in
// the store's BASE currency (USD); the CurrencyContext converts them for
// display. Both the Shop grid and the Product Details page read from here so a
// click on any card always opens the matching product.

export const CATEGORIES = ['All', 'Outerwear', 'Accessories', 'Pants', 'Footwear', 'Tops'];

export const products = [
    {
        id: 1,
        name: 'Premium Leather Jacket',
        price: 299,
        category: 'Outerwear',
        rating: 4.8,
        reviews: 128,
        badge: 'Bestseller',
        stock: 12,
        colors: ['#1f2937', '#7c2d12', '#000000'],
        sizes: ['S', 'M', 'L', 'XL'],
        description:
            'Experience ultimate luxury with our premium leather jacket. Handcrafted from full-grain Italian leather, it features a modern slim fit, YKK hardware and a quilted satin lining for year-round comfort.',
        highlights: [
            'Full-grain Italian leather',
            'Tailored slim fit',
            'Quilted satin lining',
            'Antique brass hardware',
        ],
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=900',
        ],
        specs: {
            material: '100% Full-grain Italian Leather',
            lining: 'Viscose Rayon',
            fit: 'Slim Fit',
            care: 'Professional Leather Clean Only',
        },
    },
    {
        id: 2,
        name: 'Minimalist Watch',
        price: 150,
        category: 'Accessories',
        rating: 4.7,
        reviews: 96,
        badge: 'Bestseller',
        stock: 30,
        colors: ['#111827', '#9ca3af', '#b45309'],
        sizes: ['One Size'],
        description:
            'A timeless minimalist watch with a sapphire-coated dial, premium stainless steel case and a genuine leather strap. Water resistant to 5ATM and built to last.',
        highlights: [
            'Sapphire-coated crystal',
            'Japanese quartz movement',
            '5ATM water resistant',
            'Genuine leather strap',
        ],
        images: [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&q=80&w=900',
        ],
        specs: {
            case: '40mm Stainless Steel',
            movement: 'Japanese Quartz',
            water: '5ATM (50m)',
            strap: 'Genuine Leather',
        },
    },
    {
        id: 3,
        name: 'Designer Sunglasses',
        price: 120,
        category: 'Accessories',
        rating: 4.6,
        reviews: 74,
        badge: 'New',
        stock: 22,
        colors: ['#000000', '#7c2d12', '#1e3a8a'],
        sizes: ['One Size'],
        description:
            'Polarised designer sunglasses with UV400 protection and a lightweight acetate frame. Effortless style that pairs with any look.',
        highlights: [
            'UV400 polarised lenses',
            'Italian acetate frame',
            'Anti-scratch coating',
            'Includes hard case',
        ],
        images: [
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=900',
        ],
        specs: {
            lens: 'Polarised UV400',
            frame: 'Italian Acetate',
            fit: 'Universal',
            care: 'Wipe with microfibre cloth',
        },
    },
    {
        id: 4,
        name: 'Classic Denim Jeans',
        price: 89,
        category: 'Pants',
        rating: 4.5,
        reviews: 210,
        badge: null,
        stock: 40,
        colors: ['#1e3a8a', '#0f172a', '#374151'],
        sizes: ['28', '30', '32', '34', '36'],
        description:
            'Classic straight-leg denim crafted from premium stretch cotton for all-day comfort. A wardrobe staple that never goes out of style.',
        highlights: [
            '12oz stretch denim',
            'Straight-leg cut',
            'Reinforced stitching',
            'Fade-resistant wash',
        ],
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=900',
        ],
        specs: {
            material: '98% Cotton, 2% Elastane',
            fit: 'Straight Leg',
            rise: 'Mid Rise',
            care: 'Machine wash cold',
        },
    },
    {
        id: 5,
        name: 'Urban Sneakers',
        price: 110,
        category: 'Footwear',
        rating: 4.9,
        reviews: 318,
        badge: 'Bestseller',
        stock: 18,
        colors: ['#f3f4f6', '#111827', '#ef4444'],
        sizes: ['7', '8', '9', '10', '11', '12'],
        description:
            'Street-ready sneakers with a cushioned ortholite footbed and a breathable knit upper. Designed for the city, built for comfort.',
        highlights: [
            'Breathable knit upper',
            'OrthoLite cushioned insole',
            'Durable rubber outsole',
            'Lightweight design',
        ],
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=900',
        ],
        specs: {
            upper: 'Engineered Knit',
            sole: 'Rubber',
            insole: 'OrthoLite',
            care: 'Spot clean only',
        },
    },
    {
        id: 6,
        name: 'Cotton Blend Hoodie',
        price: 65,
        category: 'Tops',
        rating: 4.4,
        reviews: 152,
        badge: 'New',
        stock: 50,
        colors: ['#6b7280', '#111827', '#f59e0b'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description:
            'A heavyweight cotton-blend hoodie with a brushed fleece interior. The perfect balance of cosy and clean for everyday layering.',
        highlights: [
            'Brushed fleece interior',
            'Heavyweight 400gsm fabric',
            'Ribbed cuffs & hem',
            'Pre-shrunk cotton blend',
        ],
        images: [
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&q=80&w=900',
        ],
        specs: {
            material: '80% Cotton, 20% Polyester',
            weight: '400 GSM',
            fit: 'Regular',
            care: 'Machine wash warm',
        },
    },
];

// Accepts string or number ids (route params arrive as strings).
export const getLocalProduct = (id) =>
    products.find((p) => String(p.id) === String(id)) || null;

export const getRelatedProducts = (product, limit = 4) => {
    if (!product) return products.slice(0, limit);
    const sameCategory = products.filter(
        (p) => p.category === product.category && String(p.id) !== String(product.id)
    );
    const others = products.filter(
        (p) => p.category !== product.category && String(p.id) !== String(product.id)
    );
    return [...sameCategory, ...others].slice(0, limit);
};
