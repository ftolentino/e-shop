import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCategories, useFeaturedProducts, useNewArrivals } from '../hooks/useCatalog';

export default function HomePage() {
  const featured = useFeaturedProducts();
  const newArrivals = useNewArrivals();
  const categories = useCategories();

  return (
    <main className="units-container">
      <section className="hero margin-bottom-lg" aria-label="Summer Sale promotion">
        <h1>Summer Sale</h1>
        <p className="lead">Up to 40% off across every category</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop now
        </Link>
      </section>

      {categories.data && categories.data.length > 0 && (
        <nav className="navbar-pills margin-bottom-lg" aria-label="Categories">
          <ul>
            {categories.data.slice(0, 8).map((category) => (
              <li key={category}>
                <Link to={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section className="margin-bottom-lg">
        <h2>Featured products</h2>
        {featured.isLoading && <p>Loading featured products…</p>}
        {featured.isError && <p>Couldn&rsquo;t load featured products.</p>}
        <div className="units-row">
          {featured.data?.map((product) => (
            <div key={product.id} className="unit-25 tablet-unit-50 phone-unit-100">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="margin-bottom-lg">
        <h2>New arrivals</h2>
        {newArrivals.isLoading && <p>Loading new arrivals…</p>}
        {newArrivals.isError && <p>Couldn&rsquo;t load new arrivals.</p>}
        <div className="units-row">
          {newArrivals.data?.map((product) => (
            <div key={product.id} className="unit-25 tablet-unit-50 phone-unit-100">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
