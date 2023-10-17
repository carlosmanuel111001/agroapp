import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VistaPrincipalConsumidor from '../screen/ScreenConsumidor/VistaPrincipalConsumidor';
import DescripcionProducto from '../screen/ScreenConsumidor/DescripcionProducto';
import Carrito from '../screen/ScreenConsumidor/Carrito';
import DetalleCarrito from '../screen/ScreenConsumidor/DetalleCarrito';
import OpcionesConsumidor from '../screen/ScreenConsumidor/OpcionesConsumidor';
import ListaPedidos from '../screen/ScreenConsumidor/ListaPedidos';
import DetallePedido from '../screen/ScreenConsumidor/DetallePedido';
import InicioSesionConsumidor from '../screen/ScreenConsumidor/InicioSesionConsumidor';
import RegistroConsumidor from '../screen/ScreenConsumidor/RegistroConsumidor';
import {CartProvider} from '../screen/ScreenCompartidas/CarritoContext';

// ... (importa las otras pantallas del Consumidor cuando las tengas)

const ConsumidorStack = createStackNavigator();

const ConsumidorStackNavigator = () => {
  return (
    // Aquí envolvemos todo el navegador del consumidor con CartProvider
    <CartProvider>
      <ConsumidorStack.Navigator
        initialRouteName="VistaPrincipalConsumidor"
        screenOptions={{headerShown: false}}>
        <ConsumidorStack.Screen
          name="VistaPrincipalConsumidor"
          component={VistaPrincipalConsumidor}
        />
        <ConsumidorStack.Screen
          name="DescripcionProducto"
          component={DescripcionProducto}
        />
        <ConsumidorStack.Screen name="Carrito" component={Carrito} />
        <ConsumidorStack.Screen
          name="DetalleCarrito"
          component={DetalleCarrito}
        />
        <ConsumidorStack.Screen
          name="OpcionesConsumidor"
          component={OpcionesConsumidor}
        />
        <ConsumidorStack.Screen name="ListaPedidos" component={ListaPedidos} />
        <ConsumidorStack.Screen
          name="DetallePedido"
          component={DetallePedido}
        />
        <ConsumidorStack.Screen
          name="InicioSesionConsumidor"
          component={InicioSesionConsumidor}
        />
        <ConsumidorStack.Screen
          name="RegistroConsumidor"
          component={RegistroConsumidor}
        />
      </ConsumidorStack.Navigator>
    </CartProvider>
  );
};

export default ConsumidorStackNavigator;
