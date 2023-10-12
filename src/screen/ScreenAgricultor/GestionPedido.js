import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const GestionPedido = ({navigation}) => {
  const handleBackPress = () => {
    console.log('Back pressed!');
    navigation.goBack();
  };

  // Datos de ejemplo. Estos probablemente vendrán de la base de datos.
  const [orders, setOrders] = useState([]); // Usamos un estado para los pedidos
  //obtener los pedidos de Firestore y de actualizar el estado local con esos pedidos.
  useEffect(() => {
    const subscriber = firestore()
      .collection('orders')
      .onSnapshot(querySnapshot => {
        //onSnapshot para obtener los pedidos en tiempo real.
        const ordersList = [];
        querySnapshot.forEach(documentSnapshot => {
          ordersList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setOrders(ordersList);
      });
    // Cancelar la suscripción cuando el componente ya no está en uso
    return () => subscriber();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        console.log('Item to be sent:', item);
        navigation.navigate('DetallePedido', {currentData: item});
      }}>
      <View style={styles.row}>
        <Text style={styles.cell}>{item.id}</Text>
        <Text style={styles.cell}>{item.agricultorInfo.name}</Text>
        <Text style={styles.cell}>
          {item.date.toDate().toLocaleDateString()}
        </Text>
        <Text style={styles.cell}>{item.totalCost}</Text>
      </View>
    </TouchableOpacity>
  );
  const HeaderRow = () => {
    return (
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Cliente</Text>
        <Text style={styles.headerCell}>Fecha</Text>
        <Text style={styles.headerCell}>Total</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={{padding: 10, zIndex: 10, elevation: 10}}>
          <Image
            style={styles.exitIcon}
            source={require('../assets/regreso.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Registro de pedidos</Text>
      </View>
      <View style={styles.division} />
      <View style={styles.container}>
        <HeaderRow />
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 80,
    backgroundColor: '#5DDCAE',
    flexDirection: 'row',
    alignItems: 'center', // Centra verticalmente
    justifyContent: 'flex-start', // Alinea a la izquierda inicialmente
    paddingBottom: 10,
    paddingHorizontal: 20, // Espacio horizontal para que el ícono y el texto no estén pegados a los bordes
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    position: 'absolute', // Absolutamente posicionado
    left: 0, // Inicia desde la izquierda
    right: 40, // Y termina en la derecha
    textAlign: 'center', // Centra el texto dentro de su contenedor
  },
  content: {
    flex: 5,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitIcon: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  // estilos de la tabla de la pagina principal

  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    padding: 8,
    fontWeight: 'bold',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  cell: {
    flex: 1,
    padding: 8,
    color: 'black',
  },
});
export default GestionPedido;
