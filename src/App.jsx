
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Sell = lazy(() => import('./pages/Sell'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', color: 'var(--color-text-muted)' }}>
    Loading...
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <Router>
              <AnimatedRoutes />
            </Router>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
