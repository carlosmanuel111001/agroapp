import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {CartContext} from '../ScreenCompartidas/CarritoContext';

const CarritoDeCompras = ({route, navigation}) => {
  const carritoContext = useContext(CartContext);
  const carrito = carritoContext.cart;
  useEffect(() => {
    console.log('Nombres de los productos en el carrito:');
    carrito.forEach(item => {
      console.log(item.nombreProducto);
    });
  }, [carrito]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <View style={styles.encabezado}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.botonRegresoContainer}>
          <Image
            source={require('../assets/regreso.png')}
            style={styles.botonRegreso}
          />
        </TouchableOpacity>
        <Text style={styles.tituloEncabezado}>Carrito de Compras</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listaContenido}
        data={carrito}
        keyExtractor={item => (item && item.id ? item.id.toString() : '')}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetalleCarrito', {
                productoSeleccionado: item,
              })
            }>
            <View style={styles.itemProductoContainer}>
              <Text style={styles.nombreProducto}>{item.nombreProducto}</Text>
              <Text style={styles.detalleProducto}>
                Cantidad: {item.cantidadProducto} - Precio: $
                {item.precioProducto}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    height: 60,
    paddingHorizontal: 15,
    elevation: 3,
  },
  botonRegresoContainer: {
    padding: 5,
  },
  botonRegreso: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  tituloEncabezado: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // compensar el espacio del botón
  },
  listaContenido: {
    paddingVertical: 10,
  },
  itemProductoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121', // Cambiado a un color oscuro (#212121)
  },
  detalleProducto: {
    marginTop: 5,
    fontSize: 14,
    color: '#555', // Cambiado a un tono de gris más oscuro (#555)
  },
});

export default CarritoDeCompras;
