import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import vistaPrincipal from './src/screen/ScreenAgricultor/vistaPrincipal';
import RegistroProducto from './src/screen/ScreenAgricultor/RegistroProducto';
import EditarProducto from './src/screen/ScreenAgricultor/EditarProducto';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="vistaPrincipal">
        <Stack.Screen name="vistaPrincipal" component={vistaPrincipal} />
        <Stack.Screen name="RegistroProducto" component={RegistroProducto} />
        <Stack.Screen name="EditarProducto" component={EditarProducto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
