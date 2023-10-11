import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Crear el proveedor del contexto
export const CartProvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const CART_STORAGE_KEY = 'userCart';

  useEffect(() => {
    // Cargar el carrito desde AsyncStorage cuando la app se inicia
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('userCart');
        if (savedCart !== null) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error al cargar el carrito', error);
      }
    };

    loadCart();
  }, []);

  const handleSetCart = newCart => {
    let updatedCart;

    if (typeof newCart === 'function') {
      updatedCart = newCart(cart); // Si newCart es una función, la llamamos con el carrito actual.
    } else if (typeof newCart !== 'object' || !Array.isArray(newCart)) {
      console.warn('El valor proporcionado para setCart no es un arreglo.');
      return;
    } else {
      updatedCart = newCart; // Si no es una función, simplemente usamos el valor proporcionado.
    }

    storeCart(updatedCart)
      .then(() => {
        setCart(updatedCart);
      })
      .catch(err => {
        console.error('Error guardando el carrito:', err);
      });
  };

  const storeCart = async newCart => {
    console.log('storeCart called with:', newCart);

    if (newCart === undefined || newCart === null) {
      console.warn(
        'Attempt to store undefined/null in userCart. Removing key instead.',
      );
      await AsyncStorage.removeItem('userCart');
    } else {
      await AsyncStorage.setItem('userCart', JSON.stringify(newCart));
    }
  };

  return (
    <CartContext.Provider value={{cart, setCart: handleSetCart}}>
      {children}
    </CartContext.Provider>
  );
};
