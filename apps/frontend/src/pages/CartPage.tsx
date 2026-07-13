import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="units-container">
        <h1>Your cart</h1>
        <p>
          Your cart is empty. <Link to="/products">Browse products</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="units-container">
      <h1>Your cart</h1>
      <div className="units-row">
        <div className="unit-70 tablet-unit-100 cart-items">
          {items.map((item) => (
            <div className="cart-line" key={item.productId}>
              <img className="cart-line-thumb" src={item.thumbnail} alt={item.title} />
              <div className="cart-line-info">
                <p>{item.title}</p>
              </div>
              <div className="qty-stepper">
                <button
                  type="button"
                  className="btn btn-sm"
                  aria-label={`Decrease quantity of ${item.title}`}
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  className="btn btn-sm"
                  aria-label={`Increase quantity of ${item.title}`}
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-line-total">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-label={`Remove ${item.title} from cart`}
                onClick={() => remove(item.productId)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="unit-30 tablet-unit-100 cart-summary">
          <h2>Summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <button type="button" className="btn btn-primary btn-lg" disabled>
            Checkout (coming soon)
          </button>
        </aside>
      </div>
    </main>
  );
}
