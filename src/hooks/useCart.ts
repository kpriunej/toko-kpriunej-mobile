import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import CartItem from '../interfaces/CartItem';
import { getCart } from '../services/cartService';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    const data = await getCart();
    setCart(data);
    setTotalItems(data.reduce((sum, item) => sum + item.quantity, 0));
    setLoading(false);
  };

  useFocusEffect(() => {
    loadCart();
  });

  return { cart, totalItems, loading, refetch: loadCart };
};

export default useCart;
