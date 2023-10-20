import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const backIcon = require('../assets/regreso.png');

const CalificacionComentario = ({navigation}) => {
  const comentario =
    'El producto llegó en excelentes condiciones y a tiempo. Muy recomendado.';
  const nombreUsuario = 'Juan Pérez'; // Esto es un ejemplo.

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
          <View style={styles.userInfo}>
            <Text style={styles.infoText}>
              Has recibido calificación y comentario del usuario:{' '}
              <Text style={styles.userName}>{nombreUsuario}</Text>
            </Text>
          </View>
          <View style={styles.divider}></View>
          <Text style={styles.cardHeader}>Calificación</Text>
          <View style={styles.ratingCard}>
            <Text style={styles.ratingText}>4.5/5</Text>
          </View>
          <Text style={styles.commentHeader}>Comentario</Text>
          <View style={styles.commentCard}>
            <Text style={styles.commentText}>{comentario}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Aceptar</Text>
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
});

export default CalificacionComentario;
