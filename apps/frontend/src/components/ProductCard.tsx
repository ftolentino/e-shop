import { Link } from 'react-router-dom';
import type { CatalogProduct } from '../lib/catalog';

interface ProductCardProps {
  product: CatalogProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img src={product.thumbnail} alt={product.title} className="product-card-image" />
        <h3 className="product-card-title">{product.title}</h3>
      </Link>
      <p className="product-card-price">${product.price.toFixed(2)}</p>
    </article>
  );
}
