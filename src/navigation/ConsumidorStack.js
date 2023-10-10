import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VistaPrincipalConsumidor from '../screen/ScreenConsumidor/VistaPrincipalConsumidor';
import DescripcionProducto from '../screen/ScreenConsumidor/DescripcionProducto';
import Carrito from '../screen/ScreenConsumidor/Carrito';
import DetalleCarrito from '../screen/ScreenConsumidor/DetalleCarrito';
// ... (importa las otras pantallas del Consumidor cuando las tengas)

const ConsumidorStack = createStackNavigator();

const ConsumidorStackNavigator = () => {
  return (
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
    </ConsumidorStack.Navigator>
  );
};

export default ConsumidorStackNavigator;
