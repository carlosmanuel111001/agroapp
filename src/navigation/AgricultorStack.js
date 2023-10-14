import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import vistaPrincipal from '../screen/ScreenAgricultor/vistaPrincipal';
import RegistroProducto from '../screen/ScreenAgricultor/RegistroProducto';
import EditarProducto from '../screen/ScreenAgricultor/EditarProducto';
import VistaOpcionesAgricultor from '../screen/ScreenAgricultor/VistaOpcionesAgricultor';
import GestionPedido from '../screen/ScreenAgricultor/GestionPedido';
import DetallePedido from '../screen/ScreenAgricultor/DetallePedido';
import InicioSesionAgricultor from '../screen/ScreenAgricultor/InicioSesionAgricultor';
import DatosRegistro from '../screen/ScreenAgricultor/DatosRegistro';

const AgricultorStack = createStackNavigator();

const AgricultorStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authUser => {
      setIsAuthenticated(!!authUser);
    });

    return subscriber; // desuscripción en desmontaje
  }, []);

  return (
    <AgricultorStack.Navigator
      initialRouteName={
        isAuthenticated ? 'vistaPrincipal' : 'InicioSesionAgricultor'
      }
      screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        // Pantallas protegidas del Agricultor (usuario autenticado)
        <>
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
          <AgricultorStack.Screen
            name="GestionPedido"
            component={GestionPedido}
          />
          <AgricultorStack.Screen
            name="DetallePedido"
            component={DetallePedido}
          />
        </>
      ) : (
        // Pantallas de inicio de sesión o registro para Agricultor (usuario no autenticado)
        <>
          <AgricultorStack.Screen
            name="InicioSesionAgricultor"
            component={InicioSesionAgricultor}
          />
          <AgricultorStack.Screen
            name="DatosRegistro"
            component={DatosRegistro}
          />
        </>
      )}
    </AgricultorStack.Navigator>
  );
};

export default AgricultorStackNavigator;
