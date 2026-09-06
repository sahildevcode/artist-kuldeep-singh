import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../types';
import confetti from 'canvas-confetti';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  discountCode: string;
  applyDiscountCode: (code: string) => boolean;
  removeDiscount: () => void;
  discountError: string | null;
  shipping: number;
  finalTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckingOut: boolean;
  checkoutSuccess: boolean;
  performCheckout: () => Promise<void>;
  resetCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyDiscountCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ARTISAN15' || clean === 'JULIAN15') {
      setDiscountCode(clean);
      setDiscountPercent(0.15);
      setDiscountError(null);
      return true;
    }
    if (clean === 'COLLECTOR20') {
      setDiscountCode(clean);
      setDiscountPercent(0.20);
      setDiscountError(null);
      return true;
    }
    setDiscountError('Invalid promotional code. Try ARTISAN15');
    return false;
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountPercent(0);
    setDiscountError(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * discountPercent);

  // If cart contains only digital courses, shipping is 0. If it contains physical artwork, calculate insured crate shipping
  const hasPhysicalArt = cart.some((i) => i.type === 'artwork');
  const shipping = hasPhysicalArt ? (subtotal > 3000 ? 0 : 180) : 0;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const performCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise((res) => setTimeout(res, 1400));
    setIsCheckingOut(false);
    setCheckoutSuccess(true);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E63946', '#D97706', '#2563EB', '#059669', '#C5A059']
      });
    } catch {
      // ignore
    }
  };

  const resetCheckout = () => {
    setCheckoutSuccess(false);
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        discountCode,
        applyDiscountCode,
        removeDiscount,
        discountError,
        shipping,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckingOut,
        checkoutSuccess,
        performCheckout,
        resetCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
