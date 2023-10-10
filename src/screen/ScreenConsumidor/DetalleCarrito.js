import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

const DetalleCarrito = ({route, navigation}) => {
  const agricultorId = route.params.agricultorId;
  const agricultorInfo = {
    nombre: 'Juan Pérez',
    telefono: '123-456-7890',
    email: 'juan@email.com',
  };

  const [productos, setProductos] = useState([
    {id: '1', nombre: 'Manzana', cantidad: 3, precio: 10},
    {id: '2', nombre: 'Plátano', cantidad: 2, precio: 15},
    // ... otros productos
  ]);
  const totalCost = productos.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0,
  );

  const handleChat = () => {
    navigation.navigate('DetalleMensaje', {agricultorId: agricultorId});
  };

  const handleDecrease = id => {
    // Lógica para disminuir la cantidad del producto
  };

  const handleIncrease = id => {
    // Lógica para aumentar la cantidad del producto
  };

  const handleRemove = id => {
    // Lógica para eliminar el producto del carrito
  };
  const handlePago = () => {
    navigation.navigate('RealizarPago', {name: 'Nombre del Agricultor'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.botonRegresoContainer}>
          <Image
            source={require('../assets/regreso.png')}
            style={styles.botonRegreso}
          />
        </TouchableOpacity>
        <Text style={styles.tituloEncabezado}>Detalle del Carrito</Text>
        <TouchableOpacity style={styles.botonMensaje} onPress={handleChat}>
          <Image
            source={require('../assets/mensaje.png')}
            style={styles.iconoMensaje}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tarjetaAgricultor}>
        <Text style={styles.nombreAgricultor}>{agricultorInfo.nombre}</Text>
        <Text style={styles.infoAgricultor}>
          Teléfono: {agricultorInfo.telefono}
        </Text>
        <Text style={styles.infoAgricultor}>Email: {agricultorInfo.email}</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.listaContenido}
        data={productos}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.itemProducto}>
            <Text style={styles.nombreProducto}>{item.nombre}</Text>
            <View style={styles.controlesProducto}>
              <TouchableOpacity onPress={() => handleDecrease(item.id)}>
                <Text style={styles.controlTexto}>-</Text>
              </TouchableOpacity>
              <Text style={styles.detallesProducto}>
                Cantidad: {item.cantidad} - ${item.precio * item.cantidad}
              </Text>
              <TouchableOpacity onPress={() => handleIncrease(item.id)}>
                <Text style={styles.controlTexto}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => handleRemove(item.id)}
              style={styles.botonEliminar}>
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalCost}>Total: ${totalCost}</Text>
      </View>

      <TouchableOpacity style={styles.botonPagar} onPress={handlePago}>
        <Text style={styles.textoBotonPagar}>Pagar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    height: 60,
    paddingHorizontal: 15,
    elevation: 2,
  },
  contenido: {
    flex: 1,
    justifyContent: 'space-between',
  },
  botonRegresoContainer: {
    marginRight: 10,
  },
  botonRegreso: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  tituloEncabezado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  botonChatContainer: {
    marginLeft: 10,
  },
  botonChat: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  listaContenido: {
    paddingVertical: 20,
  },
  itemProducto: {
    backgroundColor: '#EAEDED',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
  },
  nombreProducto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  controlesProducto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlTexto: {
    fontSize: 20,
    color: '#212121',
    marginHorizontal: 10,
  },
  detallesProducto: {
    marginTop: 5,
    fontSize: 14,
    color: '#757575',
  },
  botonEliminar: {
    marginTop: 10,
  },
  textoEliminar: {
    color: 'red',
    textAlign: 'center',
  },
  totalCost: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  botonPagar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginHorizontal: 50,
    borderRadius: 5,
  },
  textoBotonPagar: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tarjetaAgricultor: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
  },
  nombreAgricultor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  infoAgricultor: {
    fontSize: 16,
    color: '#757575',
  },
  totalContainer: {
    padding: 15,
  },
  botonMensaje: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  iconoMensaje: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
});

export default DetalleCarrito;
