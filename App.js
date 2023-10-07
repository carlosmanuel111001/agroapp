import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PantallaRol from './src/screen/ScreenCompartidas/PantallaRol';
import vistaPrincipal from './src/screen/ScreenAgricultor/vistaPrincipal';
import RegistroProducto from './src/screen/ScreenAgricultor/RegistroProducto';
import EditarProducto from './src/screen/ScreenAgricultor/EditarProducto';
import VistaOpcionesAgricultor from './src/screen/ScreenAgricultor/VistaOpcionesAgricultor';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PantallaRol">
        <Stack.Screen name="PantallaRol" component={PantallaRol} />
        <Stack.Screen name="vistaPrincipal" component={vistaPrincipal} />
        <Stack.Screen name="RegistroProducto" component={RegistroProducto} />
        <Stack.Screen name="EditarProducto" component={EditarProducto} />
        <Stack.Screen
          name="VistaOpcionesAgricultor"
          component={VistaOpcionesAgricultor}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
