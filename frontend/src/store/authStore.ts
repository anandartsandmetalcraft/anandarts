import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  houseNo?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  items: Array<{
    name: string;
    price: number;
    img: string;
    qty: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    houseNo: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: Partial<User>) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addOrder: (order: Order) => void;
  orders: Order[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      orders: [],
      login: (user) => set((state) => ({ user: { ...(state.user ?? {}), ...user }, isLoggedIn: true })),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateUser: (data) => set((state) => ({ 
        user: state.user ? { ...state.user, ...data } : null 
      })),
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),
    }),
    {
      name: 'anand-arts-auth',
    }
  )
);
