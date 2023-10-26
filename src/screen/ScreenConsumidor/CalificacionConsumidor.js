import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import {useNavigation, useRoute} from '@react-navigation/native';

const backIcon = require('../assets/regreso.png');

const CalificacionConsumidor = ({navigation}) => {
  const route = useRoute();
  const [comentario, setComentario] = useState(''); // Estado para guardar el comentario ingresado por el usuario
  const [calificacion, setCalificacion] = useState(0); // Estado para guardar la calificación seleccionada
  const agricultorID = route.params?.agricultorID;

  const [agricultorName, setAgricultorName] = useState('');
  useEffect(() => {
    // Esta función obtiene el nombre del agricultor a partir de su ID usando Realtime Database
    const fetchAgricultorName = async () => {
      try {
        const agricultorRef = firebase
          .database()
          .ref('agricultores/' + agricultorID);
        agricultorRef.once('value', snapshot => {
          if (snapshot.exists() && snapshot.val().nombre) {
            setAgricultorName(snapshot.val().nombre);
          }
        });
      } catch (error) {
        console.error('Error obteniendo el nombre del agricultor:', error);
      }
    };

    fetchAgricultorName(); // Ejecutamos la función cuando el componente se monta
  }, [agricultorID]);

  useEffect(() => {
    const fetchPreviousRating = async () => {
      try {
        const consumerId = firebase.auth().currentUser.uid;

        // Verifica que ambos IDs están definidos
        if (!agricultorID || !consumerId) {
          console.warn('Falta el agricultorID o el consumerId.');
          return; // Si uno de los IDs no está definido, termina la función aquí.
        }

        const query = await firebase
          .firestore()
          .collection('calificaciones')
          .where('agricultorId', '==', agricultorID)
          .where('consumidorId', '==', consumerId)
          .limit(1)
          .get();

        if (!query.empty) {
          const prevRating = query.docs[0].data();
          setComentario(prevRating.comentario);
          setCalificacion(prevRating.calificacion);
        }
      } catch (error) {
        console.error('Error al buscar calificación previa:', error);
      }
    };

    fetchPreviousRating();
  }, [agricultorID]);

  const submitCalificacion = async () => {
    try {
      const consumerId = firebase.auth().currentUser.uid;

      // Verificar si ya existe una calificación para este consumidor y agricultor
      const query = await firebase
        .firestore()
        .collection('calificaciones')
        .where('agricultorId', '==', agricultorID)
        .where('consumidorId', '==', consumerId)
        .limit(1) // Solo necesitamos una coincidencia
        .get();

      if (!query.empty) {
        // Actualizar la calificación existente
        const docId = query.docs[0].id;
        await firebase
          .firestore()
          .collection('calificaciones')
          .doc(docId)
          .update({
            comentario: comentario,
            calificacion: calificacion,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
          });
        alert('Tu calificación ha sido actualizada!');
      } else {
        // Agregar una nueva calificación
        await firebase.firestore().collection('calificaciones').add({
          agricultorId: agricultorID,
          consumidorId: consumerId,
          comentario: comentario,
          calificacion: calificacion,
          fecha: firebase.firestore.FieldValue.serverTimestamp(),
        });
        alert('Gracias por tu calificación!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error enviando la calificación:', error);
      alert(
        'Hubo un problema al enviar tu calificación. Por favor, inténtalo de nuevo.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconContainer}
          onPress={() => navigation.goBack()}>
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Calificación y Comentario</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>
            Califica al Agricultor {agricultorName}
          </Text>

          {/* Aquí puedes agregar un sistema de calificación (por ejemplo, estrellas) y actualizar el estado `calificacion` cuando el usuario seleccione una calificación */}
          <View style={{flexDirection: 'row'}}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity key={num} onPress={() => setCalificacion(num)}>
                <Image
                  source={
                    num <= calificacion
                      ? require('../assets/calificacion.png')
                      : require('../assets/estrellas-vacias.png')
                  }
                  style={{width: 30, height: 30, margin: 5}}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.commentHeader}>Deja un comentario</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Escribe tu comentario aquí..."
            multiline
            onChangeText={text => setComentario(text)}
            value={comentario}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={submitCalificacion}>
          <Text style={styles.buttonText}>Enviar Calificación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A915F', // Aquí aplico el color al fondo del contenedor principal
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderBottomColor: '#4A915F',
    borderBottomWidth: 2,
  },
  backIconContainer: {
    position: 'absolute',
    left: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // para dejar espacio para el encabezado
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    height: '70%',
    justifyContent: 'flex-start',
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
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A915F',
    marginBottom: 20,
  },
  ratingCard: {
    backgroundColor: '#E5EFE7',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  ratingText: {
    fontSize: 20,
    color: '#4A915F',
  },
  commentHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A915F',
    marginBottom: 20,
  },
  commentCard: {
    backgroundColor: '#E5EFE7',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  commentText: {
    fontSize: 16,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 15, // Aumento del margen inferior para separar del siguiente contenido
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, // Espacio interno para que no esté pegado a los bordes de la tarjeta
  },
  infoText: {
    fontSize: 16,
    color: '#4A915F',
    textAlign: 'center',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  divider: {
    height: 1, // Espesor de la línea
    backgroundColor: '#E0E0E0', // Color de la línea
    marginVertical: 8, // Margen arriba y abajo para separar del contenido
  },
  button: {
    marginTop: 30, // Margen superior para separarlo de la tarjeta
    paddingVertical: 15, // Espacio vertical interno
    paddingHorizontal: 30, // Espacio horizontal interno
    backgroundColor: '#AEDFB3', // Color de fondo del botón, es un tono de verde más claro
    borderRadius: 8, // Bordes redondeados
    alignItems: 'center', // Alinea el texto al centro
  },

  buttonText: {
    color: 'black', // Color del texto
    fontSize: 20, // Tamaño del texto
    fontWeight: 'bold', // Grosor del texto
  },
  commentInput: {
    backgroundColor: '#E5EFE7',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    height: 150,
    textAlignVertical: 'top', // Para que el texto comience en la parte superior del TextInput
    marginBottom: 20,
  },
});

export default CalificacionConsumidor;
