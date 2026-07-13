import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from './HomePage';

function product(id: number, title: string) {
  return {
    id,
    title,
    description: 'A great product',
    price: 19.99,
    rating: 4.5,
    stock: 10,
    brand: 'Acme',
    category: 'gadgets',
    thumbnail: `/thumb-${id}.jpg`,
    images: [`/thumb-${id}.jpg`],
  };
}

function renderHomePage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('category-list')) {
          return { ok: true, json: async () => ['gadgets', 'beauty'] };
        }
        if (url.includes('skip=4')) {
          return {
            ok: true,
            json: async () => ({ products: [product(5, 'New Thing')], total: 1 }),
          };
        }
        return {
          ok: true,
          json: async () => ({ products: [product(1, 'Featured Thing')], total: 1 }),
        };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the hero and fetched products', async () => {
    renderHomePage();
    expect(screen.getByRole('heading', { name: /shop everything/i })).toBeInTheDocument();
    expect(await screen.findByText('Featured Thing')).toBeInTheDocument();
    expect(await screen.findByText('New Thing')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'gadgets' })).toBeInTheDocument();
  });
});
