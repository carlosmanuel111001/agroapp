import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import InicioSesionAgricultor from '../screen/ScreenAgricultor/InicioSesionAgricultor';
import vistaPrincipal from '../screen/ScreenAgricultor/vistaPrincipal';
import RegistroProducto from '../screen/ScreenAgricultor/RegistroProducto';
import EditarProducto from '../screen/ScreenAgricultor/EditarProducto';
import VistaOpcionesAgricultor from '../screen/ScreenAgricultor/VistaOpcionesAgricultor';
import GestionPedido from '../screen/ScreenAgricultor/GestionPedido';
import DetallePedido from '../screen/ScreenAgricultor/DetallePedido';
import DatosRegistro from '../screen/ScreenAgricultor/DatosRegistro';
import PerfilAgricultor from '../screen/ScreenAgricultor/PerfilAgricultor';
import ListaCalificaciones from '../screen/ScreenAgricultor/ListaCalificaciones';
import CalificacionComentario from '../screen/ScreenAgricultor/CalificacionComentario';
import Mensaje from '../screen/ScreenAgricultor/Mensaje';
import DetalleMensaje from '../screen/ScreenAgricultor/DetalleMensaje';
import HistorialDeVentas from '../screen/ScreenAgricultor/HistorialDeVentas';
import DetalleVenta from '../screen/ScreenAgricultor/DetalleVenta';

const AgricultorStack = createStackNavigator();

const AgricultorStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authUser => {
      setIsAuthenticated(!!authUser);
    });

    return subscriber; // desuscripción en desmontaje
  }, []);

  if (isAuthenticated) {
    return (
      <AgricultorStack.Navigator
        initialRouteName="vistaPrincipal"
        screenOptions={{headerShown: false}}>
        <AgricultorStack.Screen
          name="InicioSesionAgricultor"
          component={InicioSesionAgricultor}
        />
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
        <AgricultorStack.Screen
          name="DatosRegistro"
          component={DatosRegistro}
        />
        <AgricultorStack.Screen
          name="PerfilAgricultor"
          component={PerfilAgricultor}
        />
        <AgricultorStack.Screen
          name="ListaCalificaciones"
          component={ListaCalificaciones}
        />
        <AgricultorStack.Screen
          name="CalificacionComentario"
          component={CalificacionComentario}
        />
        <AgricultorStack.Screen name="Mensaje" component={Mensaje} />
        <AgricultorStack.Screen
          name="DetalleMensaje"
          component={DetalleMensaje}
        />
        <AgricultorStack.Screen
          name="HistorialDeVentas"
          component={HistorialDeVentas}
        />
        <AgricultorStack.Screen name="DetalleVenta" component={DetalleVenta} />
      </AgricultorStack.Navigator>
    );
  } else {
    return (
      <AgricultorStack.Navigator
        initialRouteName="DatosRegistro"
        screenOptions={{headerShown: false}}>
        <AgricultorStack.Screen
          name="DatosRegistro"
          component={DatosRegistro}
        />
        <AgricultorStack.Screen
          name="InicioSesionAgricultor"
          component={InicioSesionAgricultor}
        />
      </AgricultorStack.Navigator>
    );
  }
};

export default AgricultorStackNavigator;
