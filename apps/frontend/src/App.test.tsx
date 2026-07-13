import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

function renderApp() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    // App renders HomePage at "/", which fetches catalog data — stub it so
    // this App-level test stays a pure nav smoke test, not a network call.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ products: [], total: 0, skip: 0, limit: 0 }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the e-shop brand link in the nav', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'e-shop' })).toBeInTheDocument();
  });

  it('renders links to Shop and Cart', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cart/ })).toBeInTheDocument();
  });
});
