import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import vistaPrincipal from './src/screen/ScreenAgricultor/vistaPrincipal'; // Asegúrate de que la ruta del archivo sea correcta
import RegistroProducto from './src/screen/ScreenAgricultor/RegistroProducto'; // Asegúrate de que la ruta del archivo sea correcta

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="vistaPrincipal">
        <Stack.Screen name="vistaPrincipal" component={vistaPrincipal} />
        <Stack.Screen name="RegistroProducto" component={RegistroProducto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
