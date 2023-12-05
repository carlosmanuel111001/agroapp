import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HistorialCompras = ({navigation}) => {
  const [compras, setCompras] = useState([]);
  const [totalCompras, setTotalCompras] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);

  useEffect(() => {
    const obtenerCompras = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('No hay usuario autenticado.');
        return;
      }

      const consumerId = currentUser.uid;

      const snapshot = await firestore()
        .collection('orders')
        .where('consumerInfo.consumerId', '==', consumerId)
        .where('estado', '==', 'aceptado')
        .get();

      let total = 0;
      const comprasAceptadas = snapshot.docs.map(doc => {
        const compra = doc.data();
        total += compra.totalCost;
        return {
          ...compra,
          id: doc.id,
        };
      });

      setCompras(comprasAceptadas);
      setTotalCompras(comprasAceptadas.length);
      setMontoTotal(total);
    };

    obtenerCompras();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('DetalleCompra', {compra: item})}>
      <Text style={styles.text}>Compra a {item.agricultorInfo.nombre}</Text>
      <Text style={styles.text}>
        Fecha: {new Date(item.date.seconds * 1000).toLocaleDateString()}
      </Text>
      <Text style={styles.text}>Total: C${item.totalCost.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Compras</Text>
      <FlatList
        data={compras}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              Total de Compras: {totalCompras}
            </Text>
            <Text style={styles.summaryText}>
              Monto Total: C${montoTotal.toFixed(2)}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginVertical: 20,
  },
  summary: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  // ...añade más estilos si son necesarios...
});

export default HistorialCompras;
