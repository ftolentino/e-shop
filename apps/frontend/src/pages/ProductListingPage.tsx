import { Link, useSearchParams } from 'react-router-dom';
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

/** Pages to show in the pagination strip: a window of 5 around the current page. */
function pageWindow(page: number, pageCount: number): number[] {
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const end = Math.min(pageCount, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? undefined;
  const sort = (searchParams.get('sort') as ProductSort | null) ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const categories = useCategories();
  const listing = useProductList({ category, sort, page });

  function paramsWith(next: Record<string, string | undefined>): URLSearchParams {
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
    return params;
  }

  const total = listing.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE));

  return (
    <main className="units-container">
      <div className="units-row">
        <aside className="unit-25 tablet-unit-100">
          <h2 className="h4">Filters</h2>
          <p className="text-xs uppercase text-tertiary no-bottom-margin">Category</p>
          <nav className="navbar navbar-vertical" aria-label="Category filter">
            <ul>
              <li className={category ? '' : 'active'}>
                <Link to={{ search: paramsWith({ category: undefined }).toString() }}>
                  All categories
                </Link>
              </li>
              {categories.data?.map((c) => (
                <li key={c} className={category === c ? 'active' : ''}>
                  <Link to={{ search: paramsWith({ category: c }).toString() }}>{c}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="unit-75 tablet-unit-100">
          <div className="display-flex justify-between items-center margin-bottom-sm">
            <p className="text-secondary no-margin">
              {listing.isLoading ? 'Loading…' : `${total} results`}
            </p>
            <form className="form-inline">
              <label>
                Sort by{' '}
                <select
                  value={sort ?? ''}
                  onChange={(e) =>
                    setSearchParams(paramsWith({ sort: e.target.value || undefined }))
                  }
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

          <div className="units-row">
            {listing.data?.products.map((product) => (
              <div key={product.id} className="unit-33 tablet-unit-50 phone-unit-100">
                <ProductCard product={product} showMeta />
              </div>
            ))}
          </div>

          <nav aria-label="Pagination">
            <ul className="pagination justify-center margin-top-lg">
              <li className={page <= 1 ? 'disabled' : ''}>
                {page <= 1 ? (
                  <span aria-hidden="true">‹</span>
                ) : (
                  <Link
                    to={{ search: paramsWith({ page: String(page - 1) }).toString() }}
                    aria-label="Previous page"
                  >
                    ‹
                  </Link>
                )}
              </li>
              {pageWindow(page, pageCount).map((p) => (
                <li key={p} className={p === page ? 'active' : ''}>
                  <Link
                    to={{ search: paramsWith({ page: String(p) }).toString() }}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </Link>
                </li>
              ))}
              <li className={page >= pageCount ? 'disabled' : ''}>
                {page >= pageCount ? (
                  <span aria-hidden="true">›</span>
                ) : (
                  <Link
                    to={{ search: paramsWith({ page: String(page + 1) }).toString() }}
                    aria-label="Next page"
                  >
                    ›
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
