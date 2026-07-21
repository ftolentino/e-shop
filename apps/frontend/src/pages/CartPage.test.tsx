import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import CartPage from './CartPage';
import { useCartStore } from '../store/cartStore';

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it('shows an empty state with no items', () => {
    renderCartPage();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('lists items, updates quantity, and removes an item', () => {
    useCartStore
      .getState()
      .add({ productId: 1, title: 'Widget', price: 10, thumbnail: '/widget.jpg' }, 2);
    renderCartPage();

    expect(screen.getByText('Widget')).toBeInTheDocument();
    expect(screen.getAllByText('$20.00')).toHaveLength(3); // line total + summary subtotal + total

    fireEvent.click(screen.getByRole('button', { name: /increase quantity/i }));
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);

    fireEvent.click(screen.getByRole('button', { name: /remove widget/i }));
    expect(useCartStore.getState().items).toEqual([]);
  });
});
