import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firebase from '@react-native-firebase/app'; // Asegúrate de importar tu configuración de Firebase

const starIcon = require('../assets/emoji.png'); // Asume que tienes un icono de estrella en tus assets.

const ListaCalificaciones = () => {
  const navigation = useNavigation();
  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    async function fetchCalificaciones() {
      const currentUserId = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
      const calificacionesRef = db.collection('calificaciones');
      const snapshot = await calificacionesRef
        .where('agricultorId', '==', currentUserId)
        .get();

      const calificacionesData = [];
      snapshot.forEach(doc => {
        calificacionesData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setCalificaciones(calificacionesData);
    }

    fetchCalificaciones();
  }, []);

  const handlePress = calificacion => {
    navigation.navigate('CalificacionComentario', calificacion);
  };

  const renderCalificacion = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.calificacionContainer}
        onPress={() => handlePress(item)}>
        <Image source={starIcon} style={styles.starIcon} />
        <Text style={styles.nombreUsuario}>
          {item.nombreUsuario} Te han calificado
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Felicidades! Mira tus calificaciones</Text>
      <FlatList
        data={calificaciones}
        renderItem={renderCalificacion}
        keyExtractor={item => item.id}
        style={styles.lista}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EFE7',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#4A915F',
  },
  calificacionContainer: {
    flexDirection: 'row',
    backgroundColor: '#AEDFB3',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  nombreUsuario: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A915F',
    marginLeft: 10,
  },
  starIcon: {
    width: 30,
    height: 30,
  },
  lista: {
    flex: 1,
  },
});

export default ListaCalificaciones;
