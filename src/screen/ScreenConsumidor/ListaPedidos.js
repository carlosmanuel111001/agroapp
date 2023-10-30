import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const ListaPedidos = () => {
  const navigation = useNavigation();
  const [pedidos, setPedidos] = useState([]);

  const handlePress = pedido => {
    navigation.navigate('DetallePedido', {pedido: pedido});
  };

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        // Obteniendo el usuario autenticado
        const currentUser = auth().currentUser;

        if (!currentUser) {
          console.log('No hay usuario autenticado.');
          return;
        }

        // Obteniendo el UID del usuario autenticado
        const consumerId = currentUser.uid;
        console.log('ID del consumidor:', consumerId);

        // Realizando la consulta filtrada por el UID del consumidor
        const snapshot = await firestore()
          .collection('orders')
          .where('consumerInfo.consumerId', '==', consumerId)
          .get();

        if (!snapshot.empty) {
          setPedidos(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
        } else {
          console.log('No se encontraron pedidos para este consumidor.');
        }
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    obtenerPedidos();
  }, []);

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
        <Text style={styles.headerTitle}>Lista de Pedidos</Text>
        <View style={styles.backButton}></View>
        {/* Placeholder para centrar el título */}
      </View>
      <ScrollView style={styles.container}>
        {pedidos.map((pedido, index) => (
          <TouchableOpacity key={index} onPress={() => handlePress(pedido)}>
            <View style={styles.card}>
              <Text style={styles.title}>
                Pedido de {pedido.agricultorInfo.nombre}
              </Text>
              <Text style={styles.subTitle}>Estado: {pedido.estado}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  content: {
    marginTop: 10,
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
});

export default ListaPedidos;
