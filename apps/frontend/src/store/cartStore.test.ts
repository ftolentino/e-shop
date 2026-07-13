import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cartStore';

const sampleItem = { productId: 1, title: 'Widget', price: 10, thumbnail: '/widget.png' };

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it('adds a new item with the given quantity', () => {
    useCartStore.getState().add(sampleItem, 2);
    expect(useCartStore.getState().items).toEqual([{ ...sampleItem, quantity: 2 }]);
  });

  it('increments quantity when adding an existing item again', () => {
    useCartStore.getState().add(sampleItem, 1);
    useCartStore.getState().add(sampleItem, 3);
    expect(useCartStore.getState().items).toEqual([{ ...sampleItem, quantity: 4 }]);
  });

  it('updates quantity directly, removing the item when set to zero', () => {
    useCartStore.getState().add(sampleItem, 2);
    useCartStore.getState().setQuantity(sampleItem.productId, 5);
    expect(useCartStore.getState().items[0]?.quantity).toBe(5);

    useCartStore.getState().setQuantity(sampleItem.productId, 0);
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('removes an item', () => {
    useCartStore.getState().add(sampleItem);
    useCartStore.getState().remove(sampleItem.productId);
    expect(useCartStore.getState().items).toEqual([]);
  });
});
