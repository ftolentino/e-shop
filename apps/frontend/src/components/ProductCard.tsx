import { Link } from 'react-router-dom';
import type { CatalogProduct } from '../lib/catalog';

interface ProductCardProps {
  product: CatalogProduct;
  /** Show the "★ rating · category" line (used on the listing grid). */
  showMeta?: boolean;
}

export default function ProductCard({ product, showMeta = false }: ProductCardProps) {
  return (
    <article className="product-card border border-radius bg-surface no-link-style">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img src={product.thumbnail} alt={product.title} className="product-card-image" />
        <div className="padding-sm">
          <h3 className="product-card-title text-sm font-medium no-margin">{product.title}</h3>
          <p className="color-accent font-bold no-margin">${product.price.toFixed(2)}</p>
          {showMeta && (
            <p className="text-tertiary text-xs no-margin">
              ★ {product.rating.toFixed(1)} · {product.category}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
