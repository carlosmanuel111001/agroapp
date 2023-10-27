import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Crear el proveedor del contexto
export const CartProvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const CART_STORAGE_KEY = 'userCart';

  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart !== null) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    };

    loadCartFromStorage();
  }, []);

  useEffect(() => {
    if (!cart || cart.length === 0) return;
    const storeCart = async () => {
      if (cart === undefined || cart === null || cart.length === 0) {
        console.warn(
          'Intento de guardar carrito indefinido/nulo/vacío. Eliminando la clave en su lugar.',
        );
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    };

    storeCart().catch(err => {
      console.error('Error al guardar el carrito:', err);
    });
  }, [cart]);

  const handleSetCart = newCart => {
    if (typeof newCart === 'function') {
      setCart(newCart);
    } else if (typeof newCart !== 'object' || !Array.isArray(newCart)) {
      console.warn('El valor proporcionado para setCart no es un arreglo.');
    } else {
      setCart(newCart);
    }
  };

  const removeProductsByAgricultorId = agricultorId => {
    handleSetCart(prevCart =>
      prevCart.filter(product => product.agricultorId !== agricultorId),
    );
  };

  return (
    <CartContext.Provider
      value={{cart, setCart: handleSetCart, removeProductsByAgricultorId}}>
      {children}
    </CartContext.Provider>
  );
};
