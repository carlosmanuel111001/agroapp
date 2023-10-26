import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/app';

const ListaCalificacionesConsumidor = ({navigation}) => {
  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const db = firebase.firestore();
        const querySnapshot = await db
          .collection('calificaciones')
          .where('consumidorId', '==', firebase.auth().currentUser.uid)
          .get();

        const calificacionesData = [];

        for (let doc of querySnapshot.docs) {
          const data = doc.data();
          const userRef = firebase
            .database()
            .ref('agricultores/' + data.agricultorId);
          const snapshot = await userRef.once('value');
          const agricultorName = snapshot.val().nombre;

          calificacionesData.push({
            ...data,
            agricultorName,
            id: doc.id,
          });
        }

        setCalificaciones(calificacionesData);
      } catch (error) {
        console.log('Error obteniendo las calificaciones:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mis Calificaciones</Text>
      </View>
      <FlatList
        data={calificaciones}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CalificacionConsumidor', {
                agricultorID: item.agricultorId,
              })
            }
            style={styles.card}>
            <Text style={styles.agricultorName}>
              Agricultor: {item.agricultorName}
            </Text>
            <Text style={styles.rating}>
              Calificación: {item.calificacion}⭐
            </Text>
            <Text style={styles.comment}>Comentario: {item.comentario}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20, // Redondear esquinas inferiores
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  agricultorName: {
    fontSize: 20,
    color: '#4a90e2',
    marginBottom: 5,
  },
  rating: {
    fontSize: 18,
    color: '#f1c40f',
    marginBottom: 5,
  },
  comment: {
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default ListaCalificacionesConsumidor;
