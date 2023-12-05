import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import firebase from '@react-native-firebase/app';
import {useNavigation} from '@react-navigation/native';

const HistorialDeVentas = () => {
  const [pedidosAceptados, setPedidosAceptados] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const suscripcion = firebase
      .firestore()
      .collection('orders')
      .where('estado', '==', 'aceptado')
      .onSnapshot(querySnapshot => {
        const pedidos = [];
        let total = 0;
        querySnapshot.forEach(documentSnapshot => {
          const pedido = documentSnapshot.data();
          pedidos.push({
            ...pedido,
            key: documentSnapshot.id,
          });
          total += pedido.totalCost;
        });
        setPedidosAceptados(pedidos);
        setTotalVentas(pedidos.length);
        setMontoTotal(total);
      });

    return () => suscripcion();
  }, []);

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('DetalleVenta', {venta: item})}>
      <Text style={styles.cell}>{(index + 1).toString()}</Text>
      <Text style={styles.cell}>
        {item.consumerInfo?.consumerName ?? 'Desconocido'}
      </Text>
      <Text style={styles.cell}>
        {item.date?.seconds
          ? new Date(item.date.seconds * 1000).toLocaleDateString()
          : 'Fecha desconocida'}
      </Text>
      <Text style={styles.cell}>C${item.totalCost?.toFixed(2) ?? '0.00'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Ventas</Text>
      <View style={styles.header}>
        <Text style={styles.headerCell}>Venta</Text>
        <Text style={styles.headerCell}>Cliente</Text>
        <Text style={styles.headerCell}>Fecha</Text>
        <Text style={styles.headerCell}>Total</Text>
      </View>
      <FlatList
        data={pedidosAceptados}
        keyExtractor={item => item.key}
        renderItem={renderItem}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Has hecho {totalVentas} ventas.</Text>
        <Text style={styles.summaryText}>
          Monto Total: C${montoTotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    color: '#FFFFFF',
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDDDDD',
    padding: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // ... Más estilos si son necesarios ...
});

export default HistorialDeVentas;
