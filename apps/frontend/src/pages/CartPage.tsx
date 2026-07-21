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
        <div className="unit-70 tablet-unit-100">
          {items.map((item) => (
            <div
              className="border border-radius bg-surface padding-sm display-flex items-center gap margin-bottom-sm"
              key={item.productId}
            >
              <img className="cart-line-thumb" src={item.thumbnail} alt={item.title} />
              <div className="cart-line-info">
                <p className="font-medium no-margin">{item.title}</p>
              </div>
              <div
                className="btn-group joined"
                role="group"
                aria-label={`Quantity of ${item.title}`}
              >
                <button
                  type="button"
                  className="btn btn-sm"
                  aria-label={`Decrease quantity of ${item.title}`}
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                >
                  −
                </button>
                <span className="btn btn-sm cursor-default" aria-live="polite">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="btn btn-sm"
                  aria-label={`Increase quantity of ${item.title}`}
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-line-total font-bold no-margin">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-icon"
                aria-label={`Remove ${item.title} from cart`}
                onClick={() => remove(item.productId)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="unit-30 tablet-unit-100">
          <div className="border border-radius bg-surface padding">
            <h2 className="h4 no-top-margin">Summary</h2>
            <div className="display-flex justify-between margin-bottom-sm">
              <span className="text-secondary">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="display-flex justify-between margin-bottom-sm">
              <span className="text-secondary">Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="display-flex justify-between margin-bottom">
              <span className="font-semibold">Total</span>
              <strong className="color-accent">${subtotal.toFixed(2)}</strong>
            </div>
            <button type="button" className="btn btn-primary width-100" disabled>
              Checkout (coming soon)
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
