import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

const DetalleCompra = ({route, navigation}) => {
  const {compra} = route.params;

  const detalleProductos = compra.cartItems.map((item, index) => (
    <View key={index} style={styles.productContainer}>
      <Text style={styles.productTitle}>Producto: {item.nombreProducto}</Text>
      <Text>Cantidad: {item.cantidadSeleccionada}</Text>
      <Text>Precio Unitario: C${item.precioProducto}</Text>
      <Text>Total: C${item.cantidadSeleccionada * item.precioProducto}</Text>
    </View>
  ));

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Detalle de Compra</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.agricultorInfo}>
          Agricultor: {compra.agricultorInfo.nombre}
        </Text>
        <Text style={styles.agricultorInfo}>
          Correo: {compra.agricultorInfo.correo}
        </Text>
        <Image
          source={{uri: compra.agricultorInfo.imagen}}
          style={styles.agricultorImage}
        />
        {detalleProductos}
        <Text style={styles.total}>
          Total de Compra: C${compra.totalCost.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  backButton: {
    padding: 10,
    alignItems: 'flex-start',
  },
  backText: {
    fontSize: 18,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginVertical: 20,
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  agricultorInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  agricultorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  productContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 10,
  },
  // ...añade más estilos si son necesarios...
});

export default DetalleCompra;
