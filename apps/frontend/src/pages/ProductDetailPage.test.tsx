import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProductDetailPage from './ProductDetailPage';
import { useCartStore } from '../store/cartStore';

const detailProduct = {
  id: 1,
  title: 'Great Widget',
  description: 'A widget that does things',
  price: 24.99,
  rating: 4.2,
  stock: 3,
  brand: 'Acme',
  category: 'gadgets',
  thumbnail: '/widget.jpg',
  images: ['/widget.jpg'],
};

function renderDetailPage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ProductDetailPage', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/category/')) {
          return { ok: true, json: async () => ({ products: [], total: 0 }) };
        }
        if (url.includes('/products/1')) {
          return { ok: true, json: async () => detailProduct };
        }
        return { ok: false, json: async () => ({}) };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders product details and adds it to the cart', async () => {
    renderDetailPage();
    expect(await screen.findByRole('heading', { name: 'Great Widget' })).toBeInTheDocument();
    expect(screen.getByText('$24.99')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(useCartStore.getState().items).toEqual([
      { productId: 1, title: 'Great Widget', price: 24.99, thumbnail: '/widget.jpg', quantity: 1 },
    ]);
  });
});
