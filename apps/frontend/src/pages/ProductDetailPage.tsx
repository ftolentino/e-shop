import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProduct, useRelatedProducts } from '../hooks/useCatalog';
import { useCartStore } from '../store/cartStore';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id);
  const related = useRelatedProducts(product?.category, product?.id);
  const addToCart = useCartStore((s) => s.add);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <main className="units-container">
        <p>Loading product…</p>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="units-container">
        <p>We couldn&rsquo;t find that product.</p>
        <Link to="/products">Back to shop</Link>
      </main>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const inStock = product.stock > 0;

  return (
    <main className="units-container">
      <div className="breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
          </li>
          <li className="active">
            <span>{product.title}</span>
          </li>
        </ul>
      </div>

      <div className="units-row">
        <div className="unit-40 phone-unit-100">
          <img
            className="gallery-main"
            src={images[activeImage] ?? product.thumbnail}
            alt={product.title}
          />
          {images.length > 1 && (
            <div className="display-flex gap-sm margin-top-sm">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`gallery-thumb-btn${index === activeImage ? ' active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="unit-60 phone-unit-100">
          <h1 className="no-top-margin">{product.title}</h1>
          <p className="text-secondary no-top-margin">
            ★ {product.rating.toFixed(1)}
            {product.brand ? ` · ${product.brand}` : ''}
          </p>
          <p className="text-2xl font-bold color-accent">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>

          <hr />

          <div className="display-flex items-center gap-sm margin-bottom">
            <span className="text-xs uppercase text-tertiary">Qty</span>
            <div className="btn-group joined" role="group" aria-label="Quantity">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="btn btn-sm cursor-default" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="margin-bottom-sm">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!inStock}
              onClick={() =>
                addToCart(
                  {
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                  },
                  quantity,
                )
              }
            >
              {inStock ? 'Add to cart' : 'Out of stock'}
            </button>
          </div>

          <p className="text-tertiary text-sm">
            {inStock ? `✓ in stock (${product.stock}) · free shipping` : 'Currently unavailable'}
          </p>
        </div>
      </div>

      {related.data && related.data.length > 0 && (
        <section className="margin-top-xl">
          <h2>You may also like</h2>
          <div className="units-row">
            {related.data.map((item) => (
              <div key={item.id} className="unit-25 tablet-unit-50 phone-unit-100">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
