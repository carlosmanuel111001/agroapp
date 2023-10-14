import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import VistaPrincipalConsumidor from './VistaPrincipalConsumidor';
import {useNavigation} from '@react-navigation/native';

const DetallePedido = ({route}) => {
  const navigation = useNavigation();
  const {pedido} = route.params;

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require('../assets/regreso.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        <View style={styles.backButton}></View>
        {/* Placeholder para centrar el título */}
      </View>

      <View style={styles.card}>
        {pedido.estado === 'aceptado' ? (
          <>
            <Text style={styles.title}>¡Buenas noticias!</Text>
            <Text style={styles.subTitle}>
              Tu pedido ha sido aceptado por {pedido.agricultorInfo.nombre}
            </Text>
            <Button
              title="Pagar Ahora"
              onPress={() => navigation.navigate('VistaPrincipalConsumidor')}
              color="#4CAF50"
            />
          </>
        ) : (
          <>
            <Text style={styles.titleRejected}>Lo sentimos...</Text>
            <Text style={styles.subTitle}>
              Tu pedido ha sido rechazado por {pedido.agricultorInfo.nombre}
            </Text>
            <Button
              title="Volver a la tienda"
              onPress={() => navigation.navigate('VistaPrincipalConsumidor')}
              color="#B71C1C"
            />
          </>
        )}

        <Text style={styles.info}>Detalles del Pedido:</Text>
        {pedido.cartItems.map((item, index) => (
          <View key={index} style={styles.productCard}>
            <Image source={{uri: item.imagen}} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.nombreProducto}</Text>
              <Text>Cantidad: {item.cantidadSeleccionada}</Text>
              <Text>Precio: ${item.productPrice}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.totalCost}>Costo total: ${pedido.totalCost}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  headerTitle: {
    flex: 1, // Esto permitirá que el título tome el espacio disponible.
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center', // Esto centrará el texto.
  },
  backButton: {
    width: 25,
    alignItems: 'center',
  },
  backImage: {
    width: 25,
    height: 25,
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4E342E',
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalCost: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#D32F2F',
  },
  titleRejected: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default DetallePedido;
