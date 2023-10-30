import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firebase from '@react-native-firebase/app';

const DetallePedido = ({route}) => {
  const navigation = useNavigation();
  const {pedido} = route.params;
  const agricultorID =
    pedido.cartItems && pedido.cartItems.length > 0
      ? pedido.cartItems[0].agricultorId
      : null;
  const [agricultorEmail, setAgricultorEmail] = useState(null);
  const productNames = pedido.cartItems
    .map(item => item.nombreProducto)
    .join(', ');
  useEffect(() => {
    if (agricultorID) {
      const agricultorRef = firebase
        .database()
        .ref('agricultores/' + agricultorID);
      agricultorRef.on('value', snapshot => {
        const agricultorData = snapshot.val();
        if (agricultorData) {
          setAgricultorEmail(agricultorData.correo);
        }
      });

      // Limpiar listener al desmontar el componente
      return () => agricultorRef.off();
    }
  }, [agricultorID]);

  const tipoDeCambio = 36.1;
  const calcularComision = monto => {
    return monto * 0.03;
  };

  const convertirADolares = montoEnPesos => {
    return montoEnPesos / tipoDeCambio;
  };
  const pagarAhora = () => {
    const comision = calcularComision(pedido.totalCost);
    const totalEnDolares = convertirADolares(pedido.totalCost - comision);
    navigation.navigate('Transacion', {
      totalCost: totalEnDolares,
      agricultorID: agricultorID,
      agricultorEmail: agricultorEmail,
      productNames: productNames,
    });
  };

  return (
    <View style={styles.container}>
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
      </View>
      <View style={styles.card}>
        {pedido.estado === 'aceptado' ? (
          <>
            <Text style={styles.title}>¡Buenas noticias!</Text>
            <Text style={styles.subTitle}>
              Tu pedido ha sido aceptado por {pedido.agricultorInfo.nombre}
            </Text>
            <Button title="Pagar Ahora" onPress={pagarAhora} color="#4CAF50" />
            <Button
              title="Calificar al Agricultor"
              onPress={() =>
                navigation.navigate('CalificacionConsumidor', {
                  agricultorID: agricultorID,
                })
              }
              color="#FFA000"
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
              <Text>Precio: C${item.precioProducto}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.totalCost}>Costo total: C${pedido.totalCost}</Text>
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
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
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
