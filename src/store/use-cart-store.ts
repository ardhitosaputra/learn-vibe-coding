import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // product id
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  quantity: number;
  maxStock: number;
  category?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  setHydrated: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === product.id
          );

          if (existingItemIndex > -1) {
            // Item already in cart, increment quantity up to maxStock
            const existingItem = state.items[existingItemIndex];
            const newQuantity = Math.min(
              existingItem.quantity + quantity,
              product.maxStock
            );

            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };

            return { items: updatedItems, isOpen: true };
          } else {
            // New item, clamp quantity to available stock
            const validQuantity = Math.min(
              Math.max(1, quantity),
              product.maxStock
            );

            return {
              items: [...state.items, { ...product, quantity: validQuantity }],
              isOpen: true,
            };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.id === productId) {
                const clampedQuantity = Math.min(quantity, item.maxStock);
                return { ...item, quantity: clampedQuantity };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "store-id-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
