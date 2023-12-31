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
import PerfilConsumidor from '../screen/ScreenConsumidor/PerfilConsumidor';
import Transacion from '../screen/ScreenConsumidor/Transacion';
import DetalleMensaje from '../screen/ScreenConsumidor/DetalleMensaje';
import ConsumidorMensaje from '../screen/ScreenConsumidor/ConsumidorMensaje';
import CalificacionConsumidor from '../screen/ScreenConsumidor/CalificacionConsumidor';
import ListaCalificacionConsumidor from '../screen/ScreenConsumidor/ListaCalificacionConsumidor';
import HistorialCompras from '../screen/ScreenConsumidor/HistorialCompras';
import DetalleCompra from '../screen/ScreenConsumidor/DetalleCompra';
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
        <ConsumidorStack.Screen
          name="PerfilConsumidor"
          component={PerfilConsumidor}
        />
        <ConsumidorStack.Screen name="Transacion" component={Transacion} />
        <ConsumidorStack.Screen
          name="DetalleMensaje"
          component={DetalleMensaje}
        />
        <ConsumidorStack.Screen
          name="ConsumidorMensaje"
          component={ConsumidorMensaje}
        />
        <ConsumidorStack.Screen
          name="CalificacionConsumidor"
          component={CalificacionConsumidor}
        />
        <ConsumidorStack.Screen
          name="ListaCalificacionConsumidor"
          component={ListaCalificacionConsumidor}
        />
        <ConsumidorStack.Screen
          name="HistorialCompras"
          component={HistorialCompras}
        />
        <ConsumidorStack.Screen
          name="DetalleCompra"
          component={DetalleCompra}
        />
      </ConsumidorStack.Navigator>
    </CartProvider>
  );
};

export default ConsumidorStackNavigator;
