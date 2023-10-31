import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PantallaRol from './src/screen/ScreenCompartidas/PantallaRol';
import VistaAdmin from './src/vistasAdmin/VistaAdmin';
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
        <Stack.Screen name="Agricultor" component={AgricultorStackNavigator} />
        <Stack.Screen name="Consumidor" component={ConsumidorStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
