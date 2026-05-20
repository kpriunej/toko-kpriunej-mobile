import AsyncStorage from '@react-native-async-storage/async-storage';
import CartItem from '../interfaces/CartItem';
import Barang from '../interfaces/Barang';

const CART_KEY = '@toko_kpri_cart';

// Simple event emitter untuk broadcast cart updates
type CartUpdateListener = () => void;
const listeners = new Set<CartUpdateListener>();
let currentCartCount = 0;

export const subscribeToCartChanges = (listener: CartUpdateListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emitCartChange = () => {
  listeners.forEach((listener) => listener());
};

const setCartCount = (cart: CartItem[]) => {
  currentCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  emitCartChange();
};

export const getCartCountSnapshot = () => currentCartCount;

export const bootstrapCartCount = async () => {
  const cart = await getCart();
  setCartCount(cart);
};

export const getCart = async (): Promise<CartItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

export const addToCart = async (item: Barang, quantity: number = 1): Promise<CartItem[]> => {
  try {
    const cart = await getCart();
    const existingItem = cart.find((c) => c.idtab === item.idtab);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    setCartCount(cart);
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return [];
  }
};

export const updateCartItemQuantity = async (
  itemId: number,
  newQuantity: number,
): Promise<CartItem[]> => {
  try {
    let cart = await getCart();

    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      cart = cart.filter((c) => c.idtab !== itemId);
    } else {
      const item = cart.find((c) => c.idtab === itemId);
      if (item) {
        item.quantity = newQuantity;
      }
    }

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    setCartCount(cart);
    return cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    return [];
  }
};

export const removeFromCart = async (itemId: number): Promise<CartItem[]> => {
  try {
    const cart = await getCart();
    const filtered = cart.filter((c) => c.idtab !== itemId);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(filtered));
    setCartCount(filtered);
    return filtered;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return [];
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
    setCartCount([]);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

export const getTotalItems = async (): Promise<number> => {
  try {
    const cart = await getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Error getting total items:', error);
    return 0;
  }
};

export const getCartTotal = async (): Promise<number> => {
  try {
    const cart = await getCart();
    return cart.reduce((sum, item) => sum + (item.hargajual1 ?? 0) * item.quantity, 0);
  } catch (error) {
    console.error('Error calculating total:', error);
    return 0;
  }
};
