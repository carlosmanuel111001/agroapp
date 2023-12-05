import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const DetalleVenta = ({route, navigation}) => {
  const {venta} = route.params;

  const consumerName = venta?.consumerInfo?.consumerName ?? 'Desconocido';
  const date = venta?.date
    ? new Date(venta.date.seconds * 1000).toLocaleDateString()
    : 'Fecha desconocida';
  const totalCost = venta?.totalCost ?? 0;

  const productDetails = venta?.cartItems?.map((item, index) => (
    <View key={index} style={styles.productDetailContainer}>
      <Text style={styles.productDetail}>{`Producto ${index + 1}: ${
        item.nombreProducto
      }`}</Text>
      <Text
        style={styles.productDetail}>{`Código: ${item.codigoProducto}`}</Text>
      <Text
        style={
          styles.productDetail
        }>{`Cantidad: ${item.cantidadSeleccionada}`}</Text>
      <Text
        style={styles.productDetail}>{`Precio: C${item.precioProducto}`}</Text>
      <Text style={styles.productDetail}>{`Total: C${
        item.precioProducto * item.cantidadSeleccionada
      }`}</Text>
      <View style={styles.separator} />
    </View>
  ));

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Detalle de Venta</Text>
      <Text style={styles.saleId}>Venta </Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>Cliente: {consumerName}</Text>
        <Text style={styles.detailText}>Fecha: {date}</Text>
        {productDetails}
        <Text style={styles.totalCost}>Total de Venta: C${totalCost}</Text>
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
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  backText: {
    fontSize: 18,
    color: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  saleId: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    // Sombreado para iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    // Sombreado para Android
    elevation: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  productDetailContainer: {
    marginTop: 10,
  },
  productDetail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  totalCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e2e2',
    marginVertical: 10,
  },
  // ... Añade más estilos según sea necesario ...
});

export default DetalleVenta;
