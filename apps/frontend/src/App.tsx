import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import { useCartCount } from './store/cartStore';
import './styles/catalog.css';

export default function App() {
  const cartCount = useCartCount();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'e-shop' },
    { to: '/products', label: 'Shop' },
    { to: '/cart', label: `Cart${cartCount > 0 ? ` (${cartCount})` : ''}` },
  ];

  return (
    <>
      <nav className="navbar">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className={location.pathname === item.to ? 'active' : undefined}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}
