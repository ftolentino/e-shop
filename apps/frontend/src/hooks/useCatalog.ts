import { useQuery } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchProductById,
  fetchProductList,
  fetchRelatedProducts,
  type ProductListFilters,
} from '../lib/catalog';

export function useFeaturedProducts() {
  return useQuery({ queryKey: ['catalog', 'featured'], queryFn: fetchFeaturedProducts });
}

export function useNewArrivals() {
  return useQuery({ queryKey: ['catalog', 'new-arrivals'], queryFn: fetchNewArrivals });
}

export function useCategories() {
  return useQuery({ queryKey: ['catalog', 'categories'], queryFn: fetchCategories });
}

export function useProductList(filters: ProductListFilters) {
  return useQuery({
    queryKey: ['catalog', 'products', filters],
    queryFn: () => fetchProductList(filters),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['catalog', 'product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: Boolean(id),
  });
}

export function useRelatedProducts(category: string | undefined, excludeId: number | undefined) {
  return useQuery({
    queryKey: ['catalog', 'related', category, excludeId],
    queryFn: () => fetchRelatedProducts(category as string, excludeId as number),
    enabled: Boolean(category) && excludeId !== undefined,
  });
}
