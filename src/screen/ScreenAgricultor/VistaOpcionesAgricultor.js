import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const VistaOpcionesAgricultor = () => {
  const navigation = useNavigation();

  const handleGestionPedidoPress = () => {
    navigation.navigate('GestionPedido');
  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleLogout = () => {
    // Aquí puedes colocar la lógica para cerrar la sesión
    console.log('Cerrar sesión presionado');
  };
  // Función para manejar el toque en la opción de perfil
  const handleProfilePress = () => {
    navigation.navigate('PerfilAgricultor'); // Navega a la pantalla de perfil
  };
  const handleGestionPagoPress = () => {
    navigation.navigate('GestionPago');
  };
  const handleCalificacionesComentariosPress = () => {
    navigation.navigate('ListaCalificaciones');
  };
  const handleHistorialVentasPress = () => {
    navigation.navigate('HistorialVentas');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Image
            source={require('../assets/regreso.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Opciones</Text>
      </View>
      <TouchableOpacity onPress={handleProfilePress}>
        <View style={[styles.firstOptionContainer, styles.separator]}>
          <Image
            source={require('../assets/perfil.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Perfil</Text>
          <View style={styles.rightOptionContainer}>
            <TouchableOpacity style={styles.selectButton}>
              <Image
                source={require('../assets/perfil.png')}
                style={styles.selectImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGestionPedidoPress}>
        <View style={[styles.optionContainer, styles.separator]}>
          <Image
            source={require('../assets/gestion.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Gestionar Pedido</Text>
          <View style={styles.rightOptionContainer}>
            <TouchableOpacity style={styles.selectButton}>
              <Image
                source={require('../assets/gestion.png')}
                style={styles.selectImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGestionPagoPress}>
        <View style={[styles.optionContainer, styles.separator]}>
          <Image
            source={require('../assets/pago.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Gestión de Pago</Text>
          <View style={styles.rightOptionContainer}>
            <TouchableOpacity style={styles.selectButton}>
              <Image
                source={require('../assets/pago.png')}
                style={styles.selectImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCalificacionesComentariosPress}>
        <View style={[styles.optionContainer, styles.separator]}>
          <Image
            source={require('../assets/calificacion.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Calificaciones y Comentarios</Text>
          <View style={styles.rightOptionContainer}>
            <TouchableOpacity style={styles.selectButton}>
              <Image
                source={require('../assets/calificacion.png')}
                style={styles.selectImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleHistorialVentasPress}>
        <View style={[styles.optionContainer, styles.separator]}>
          <Image
            source={require('../assets/historial.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Historial de Ventas</Text>
          <View style={styles.rightOptionContainer}>
            <TouchableOpacity style={styles.selectButton}>
              <Image
                source={require('../assets/historial.png')}
                style={styles.selectImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Aquí puedes agregar el resto del contenido de la pantalla */}
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#5DDCAE',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 20,
  },
  backImage: {
    width: 25,
    height: 25,
  },
  logoutButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 20,
    marginTop: 40,
  },
  logoutButton: {
    backgroundColor: '#f00', // Puedes ajustar el color según tu diseño
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 40,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  profileImage: {
    width: 25,
    height: 25,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  rightProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImage: {
    width: 15,
    height: 15,
  },
  optionsContainer: {
    marginTop: 20, // Ajusta este valor para agregar más espacio entre el encabezado y las opciones
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1, // Mantiene el separador
    borderBottomColor: 'red', // Puedes ajustar el color según lo desees
  },
  optionImage: {
    width: 25,
    height: 25,
  },
  optionText: {
    flex: 3,
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
  },
  rightOptionContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  firstOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 50, // Ajusta este valor para cambiar el espacio entre el encabezado y la primera opción
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

export default VistaOpcionesAgricultor;
