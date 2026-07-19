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

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <ul>
          <li className={location.pathname === '/' ? 'active' : undefined}>
            <Link to="/" className="nav-brand">
              e-shop
            </Link>
          </li>
          <li className={location.pathname.startsWith('/products') ? 'active' : undefined}>
            <Link to="/products">Shop</Link>
          </li>
          <li className={location.pathname === '/cart' ? 'active' : undefined}>
            <Link to="/cart">
              Cart
              {cartCount > 0 && <span className="badge margin-left-xs">{cartCount}</span>}
            </Link>
          </li>
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
