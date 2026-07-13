import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProductListingPage from './ProductListingPage';

function product(id: number, title: string) {
  return {
    id,
    title,
    description: 'desc',
    price: 9.99,
    rating: 4,
    stock: 5,
    brand: 'Acme',
    category: 'gadgets',
    thumbnail: `/thumb-${id}.jpg`,
    images: [] as string[],
  };
}

function renderListingPage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/products']}>
        <ProductListingPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ProductListingPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('category-list')) {
          return { ok: true, json: async () => ['gadgets', 'beauty'] };
        }
        return {
          ok: true,
          json: async () => ({
            products: [product(1, 'First Item'), product(2, 'Second Item')],
            total: 2,
          }),
        };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the fetched products, category filters, and result count', async () => {
    renderListingPage();
    expect(await screen.findByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
    expect(screen.getByText('2 results')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'gadgets' })).toBeInTheDocument();
  });
});
