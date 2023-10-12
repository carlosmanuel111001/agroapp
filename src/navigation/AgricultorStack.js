import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import vistaPrincipal from '../screen/ScreenAgricultor/vistaPrincipal';
import RegistroProducto from '../screen/ScreenAgricultor/RegistroProducto';
import EditarProducto from '../screen/ScreenAgricultor/EditarProducto';
import VistaOpcionesAgricultor from '../screen/ScreenAgricultor/VistaOpcionesAgricultor';
import GestionPedido from '../screen/ScreenAgricultor/GestionPedido';
import DetallePedido from '../screen/ScreenAgricultor/DetallePedido';

const AgricultorStack = createStackNavigator();

const AgricultorStackNavigator = () => {
  return (
    <AgricultorStack.Navigator
      initialRouteName="vistaPrincipal"
      screenOptions={{headerShown: false}}>
      <AgricultorStack.Screen
        name="vistaPrincipal"
        component={vistaPrincipal}
      />
      <AgricultorStack.Screen
        name="RegistroProducto"
        component={RegistroProducto}
      />
      <AgricultorStack.Screen
        name="EditarProducto"
        component={EditarProducto}
      />
      <AgricultorStack.Screen
        name="VistaOpcionesAgricultor"
        component={VistaOpcionesAgricultor}
      />
      <AgricultorStack.Screen name="GestionPedido" component={GestionPedido} />
      <AgricultorStack.Screen name="DetallePedido" component={DetallePedido} />
    </AgricultorStack.Navigator>
  );
};

export default AgricultorStackNavigator;
