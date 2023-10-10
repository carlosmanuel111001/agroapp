import React, {createContext, useState} from 'react';

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Crear el proveedor del contexto
export const CartProvider = ({children}) => {
  const [cart, setCart] = useState([]);

  return (
    <CartContext.Provider value={{cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
};
