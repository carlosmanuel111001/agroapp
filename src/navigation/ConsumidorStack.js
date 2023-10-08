import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VistaPrincipalConsumidor from '../screen/ScreenConsumidor/VistaPrincipalConsumidor';
import DescripcionProducto from '../screen/ScreenConsumidor/DescripcionProducto';
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
    </ConsumidorStack.Navigator>
  );
};

export default ConsumidorStackNavigator;
