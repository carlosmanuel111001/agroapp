import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PantallaRol from './src/screen/ScreenCompartidas/PantallaRol';
import VistaAdmin from './src/vistasAdmin/VistaAdmin';
import ListaAgricultores from './src/vistasAdmin/ListaAgricultores';
import ListaConsumidores from './src/vistasAdmin/ListaConsumidores';
import ListaProductos from './src/vistasAdmin/ListaProductos';
import DetallesConsumidor from './src/vistasAdmin/DetallesConsumidor';
import AgricultorStackNavigator from './src/navigation/AgricultorStack';
import ConsumidorStackNavigator from './src/navigation/ConsumidorStack';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PantallaRol"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="PantallaRol" component={PantallaRol} />
        <Stack.Screen name="VistaAdmin" component={VistaAdmin} />
        <Stack.Screen name="ListaAgricultores" component={ListaAgricultores} />
        <Stack.Screen name="ListaConsumidores" component={ListaConsumidores} />
        <Stack.Screen name="ListaProductos" component={ListaProductos} />
        <Stack.Screen
          name="DetallesConsumidor"
          component={DetallesConsumidor}
        />
        <Stack.Screen name="Agricultor" component={AgricultorStackNavigator} />
        <Stack.Screen name="Consumidor" component={ConsumidorStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
