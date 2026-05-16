import { create } from "zustand";
import { persist } from "zustand/middleware";
 
export interface CartItem {
  id: string | number;
  name: string;
  price: number; // in paise
  img: string; // snapshots image url
  material: string;
  size: string;
  quantity: number;
}
 
interface CartStore {
  items: CartItem[];
  isGiftWrapped: boolean;
  addItem: (product: any, quantity: number) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setGiftWrapped: (value: boolean) => void;
}
 
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isGiftWrapped: false,
      addItem: (product, quantity) => {
        const currentItems = get().items;
        const productId = product.id;
        const existingItem = currentItems.find((item) => item.id === productId);
 
        // Handle both legacy "img" and Prisma "images" structure
        const imageUrl = product.img || product.images?.[0]?.url || "/placeholder.jpg";
 
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ 
            items: [
              ...currentItems, 
              { 
                id: productId,
                name: product.name,
                price: product.price,
                img: imageUrl,
                material: product.material,
                size: product.size,
                quantity 
              }
            ] 
          });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }),
      clearCart: () => set({ items: [], isGiftWrapped: false }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      setGiftWrapped: (value) => set({ isGiftWrapped: value }),
    }),
    {
      name: "anand-arts-cart-storage",
    }
  )
);
