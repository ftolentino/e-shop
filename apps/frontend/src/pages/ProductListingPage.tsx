import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCategories, useProductList } from '../hooks/useCatalog';
import { PRODUCT_PAGE_SIZE, type ProductSort } from '../lib/catalog';

const SORT_OPTIONS: { value: ProductSort | ''; label: string }[] = [
  { value: '', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
];

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? undefined;
  const sort = (searchParams.get('sort') as ProductSort | null) ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const categories = useCategories();
  const listing = useProductList({ category, sort, page });

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    if (!('page' in next)) {
      params.delete('page');
    }
    setSearchParams(params);
  }

  const total = listing.data?.total ?? 0;
  const hasNextPage = page * PRODUCT_PAGE_SIZE < total;

  return (
    <main className="units-container">
      <div className="units-row">
        <aside className="unit-25 tablet-unit-100 filter-rail">
          <h2>Filters</h2>
          <nav className="navbar-vertical" aria-label="Category filter">
            <ul>
              <li className={category ? '' : 'active'}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    updateParams({ category: undefined });
                  }}
                >
                  All categories
                </a>
              </li>
              {categories.data?.map((c) => (
                <li key={c} className={category === c ? 'active' : ''}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      updateParams({ category: c });
                    }}
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="unit-75 tablet-unit-100">
          <div className="listing-toolbar">
            <p>{listing.isLoading ? 'Loading…' : `${total} results`}</p>
            <form className="form">
              <label>
                Sort by
                <select
                  value={sort ?? ''}
                  onChange={(e) => updateParams({ sort: e.target.value || undefined })}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </form>
          </div>

          {listing.isError && <p>Couldn&rsquo;t load products.</p>}

          <div className="units-row product-grid">
            {listing.data?.products.map((product) => (
              <div key={product.id} className="unit-33 tablet-unit-50 phone-unit-100">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <nav className="pagination" aria-label="Pagination">
            <button
              type="button"
              className="btn btn-sm"
              disabled={page <= 1}
              onClick={() => updateParams({ page: String(page - 1) })}
            >
              ‹ Prev
            </button>
            <span>Page {page}</span>
            <button
              type="button"
              className="btn btn-sm"
              disabled={!hasNextPage}
              onClick={() => updateParams({ page: String(page + 1) })}
            >
              Next ›
            </button>
          </nav>
        </div>
      </div>
    </main>
  );
}
