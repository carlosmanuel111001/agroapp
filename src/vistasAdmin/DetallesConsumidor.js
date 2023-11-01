import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, Alert} from 'react-native';
import {Appbar, Card, Title, Paragraph, Text, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const DetallesConsumidor = ({route, navigation}) => {
  const consumidorId = route.params.consumidorId;

  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('calificaciones')
      .where('consumidorId', '==', consumidorId)
      .onSnapshot(querySnapshot => {
        const calificacionesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCalificaciones(calificacionesData);
      });

    return () => unsubscribe();
  }, [consumidorId]);

  const handleEliminarConsumidor = async () => {
    try {
      // 1. Eliminar todas las calificaciones asociadas al consumidor.
      const calificacionesRef = firestore().collection('calificaciones');
      const calificacionesSnapshot = await calificacionesRef
        .where('consumidorId', '==', consumidorId)
        .get();

      const batch = firestore().batch();
      calificacionesSnapshot.forEach(doc => {
        batch.delete(calificacionesRef.doc(doc.id));
      });
      await batch.commit();

      // 2. Eliminar el consumidor (si se guarda en una colección de Firestore).
      // await firestore().collection('consumidores').doc(consumidorId).delete();

      // Notificar éxito.
      console.log('Consumidor y sus calificaciones eliminados con éxito.');
      navigation.goBack(); // Navega hacia atrás después de la eliminación
    } catch (error) {
      console.error(
        'Error eliminando consumidor y sus calificaciones: ',
        error,
      );
    }
  };

  const confirmarEliminacion = () => {
    Alert.alert(
      'Eliminar Consumidor',
      'Un consumidor se debe eliminar solo si incumplió las reglas y realizó comentarios indebidos. ¿Estás seguro de eliminar a este consumidor?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Sí', onPress: handleEliminarConsumidor},
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Calificaciones y Comentarios" />
      </Appbar.Header>
      <FlatList
        data={calificaciones}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Calificación: {item.calificacion}</Title>
              <Paragraph>Comentario: {item.comentario}</Paragraph>
              <Text>
                Fecha:{' '}
                {item.fecha ? item.fecha.toDate().toLocaleString() : 'N/A'}
              </Text>
            </Card.Content>
          </Card>
        )}
        keyExtractor={item => item.id}
      />
      <Button
        mode="contained"
        color="red"
        onPress={confirmarEliminacion}
        style={styles.buttonEliminar}>
        Eliminar Consumidor
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    borderRadius: 10,
  },
  buttonEliminar: {
    margin: 16,
  },
});

export default DetallesConsumidor;
