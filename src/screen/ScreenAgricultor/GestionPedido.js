import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';

const GestionPedido = ({navigation}) => {
  const currentUserId = auth().currentUser.uid;

  const handleBackPress = () => {
    navigation.goBack();
  };
  const [filter, setFilter] = useState('todos');
  <Picker
    selectedValue={filter}
    onValueChange={itemValue => setFilter(itemValue)}>
    <Picker.Item label="Todos" value="todos" />
    <Picker.Item label="Aceptados" value="aceptado" />
    <Picker.Item label="Rechazados" value="rechazado" />
    <Picker.Item label="Pendientes" value="pendiente" />
  </Picker>;
  // Datos de ejemplo. Estos probablemente vendrán de la base de datos.
  const [orders, setOrders] = useState([]); // Usamos un estado para los pedidos
  //obtener los pedidos de Firestore y de actualizar el estado local con esos pedidos.
  useEffect(() => {
    const subscriber = firestore()
      .collection('orders')
      .where('agricultorId', '==', currentUserId) // Filtrar por agricultorId
      .limit(5) // Solo obtiene los primeros 5 documentos para verificar
      .onSnapshot(querySnapshot => {
        const ordersList = [];
        querySnapshot.forEach(documentSnapshot => {
          ordersList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });

        setOrders(ordersList);
      });

    return () => subscriber();
  }, [currentUserId]);
  const getRowStyle = estado => {
    switch (estado) {
      case 'aceptado':
        return [styles.row, {backgroundColor: '#D1FFD6'}]; // Verde claro para aceptados
      case 'rechazado':
        return [styles.row, {backgroundColor: '#FFD1D1'}]; // Rojo claro para rechazados
      default:
        return [styles.row, {backgroundColor: '#FFFCD1'}]; // Amarillo claro para pendientes
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DetallePedido', {currentData: item});
      }}>
      <View style={getRowStyle(item.estado)}>
        {/* Cambiado para mostrar el nombre del consumidor */}
        <Text style={styles.cell}>{item.consumerInfo.consumerName}</Text>
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
        <Text style={styles.headerCell}>Cliente</Text>
        <Text style={styles.headerCell}>Fecha</Text>
        <Text style={styles.headerCell}>Total</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Image
            style={styles.exitIcon}
            source={require('../assets/regreso.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Registro de pedidos</Text>
        <View style={styles.backButton}></View>
        {/* Placeholder para centrar el título */}
      </View>

      <View style={styles.division} />
      <View style={styles.contentContainer}>
        <HeaderRow />
        <FlatList
          data={
            filter === 'todos'
              ? orders
              : orders.filter(order => order.estado === filter)
          }
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  exitIcon: {
    width: 24,
    height: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  headerCell: {
    flex: 1,
    padding: 8,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 5,
    borderRadius: 10,
  },
  cell: {
    flex: 1,
    padding: 8,
    color: 'black',
    textAlign: 'center',
  },
});
export default GestionPedido;
