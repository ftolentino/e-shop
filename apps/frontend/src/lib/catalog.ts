// Dev/seed data layer backed by dummyjson.com. Swap the fetch() calls below
// for `/api/products` (Firestore-backed) when the real backend is ready —
// page and component code doesn't need to change, only this file.

const BASE_URL = 'https://dummyjson.com/products';
const SELECT_FIELDS = 'id,title,description,price,rating,stock,brand,category,thumbnail,images';
const PAGE_SIZE = 12;

export interface CatalogProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: CatalogProduct[];
  total: number;
  skip: number;
  limit: number;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Catalog request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function fetchFeaturedProducts(): Promise<CatalogProduct[]> {
  return fetchJson<ProductsResponse>(`${BASE_URL}?limit=4&select=${SELECT_FIELDS}`).then(
    (r) => r.products,
  );
}

export function fetchNewArrivals(): Promise<CatalogProduct[]> {
  return fetchJson<ProductsResponse>(`${BASE_URL}?limit=4&skip=4&select=${SELECT_FIELDS}`).then(
    (r) => r.products,
  );
}

export function fetchCategories(): Promise<string[]> {
  return fetchJson<string[]>(`${BASE_URL}/category-list`);
}

export type ProductSort = 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface ProductListFilters {
  category?: string;
  sort?: ProductSort;
  page?: number;
}

const SORT_PARAMS: Record<ProductSort, { sortBy: string; order: 'asc' | 'desc' }> = {
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  rating: { sortBy: 'rating', order: 'desc' },
  newest: { sortBy: 'id', order: 'desc' },
};

export async function fetchProductList(
  filters: ProductListFilters = {},
): Promise<{ products: CatalogProduct[]; total: number }> {
  const page = filters.page ?? 1;
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
    select: SELECT_FIELDS,
  });
  if (filters.sort) {
    const { sortBy, order } = SORT_PARAMS[filters.sort];
    params.set('sortBy', sortBy);
    params.set('order', order);
  }
  const path = filters.category
    ? `${BASE_URL}/category/${encodeURIComponent(filters.category)}`
    : BASE_URL;
  const data = await fetchJson<ProductsResponse>(`${path}?${params.toString()}`);
  return { products: data.products, total: data.total };
}

export function fetchProductById(id: string | number): Promise<CatalogProduct> {
  return fetchJson<CatalogProduct>(`${BASE_URL}/${id}`);
}

export async function fetchRelatedProducts(
  category: string,
  excludeId: number,
): Promise<CatalogProduct[]> {
  const data = await fetchJson<ProductsResponse>(
    `${BASE_URL}/category/${encodeURIComponent(category)}?limit=5&select=${SELECT_FIELDS}`,
  );
  return data.products.filter((p) => p.id !== excludeId).slice(0, 4);
}

export const PRODUCT_PAGE_SIZE = PAGE_SIZE;
