import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const PerfilConsumidor = () => {
  const [data, setData] = useState(null); // Estado para los datos del agricultor
  const userId = auth().currentUser?.uid;

  const navigation = useNavigation();
  const [showInfo, setShowInfo] = useState(false); // Estado para mostrar la información personal
  const [selectedSection, setSelectedSection] = useState('personalInfo'); // 'personalInfo' o 'photos'
  const [isPhotosModalVisible, setPhotosModalVisibility] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Estado para saber qué foto fue seleccionada.
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para saber si el modal está activo o no.
  const [selectedInfo, setSelectedInfo] = useState(null); // Estado para saber qué info fue seleccionada.

  useEffect(() => {
    if (!userId) return;

    const ref = database().ref(`consumidores/${userId}`);
    const onValueChange = ref.on('value', snapshot => {
      setData(snapshot.val());
    });

    return () => {
      ref.off('value', onValueChange);
    };
  }, [userId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePersonalInfoPress = () => {
    setSelectedSection('personalInfo');
  };

  const handlePhotosPress = () => {
    setSelectedSection('photos');
  };

  const handlePhotoSelect = photoName => {
    setSelectedPhoto(photoName);
    setIsModalVisible(true);
  };

  const handleExit = () => {
    setIsModalVisible(false);
    setSelectedPhoto(null);
  };

  const handleInfoSelect = infoName => {
    setSelectedInfo(infoName);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    alert('Editar');
  };

  const handleDelete = () => {
    alert('Eliminar');
  };

  const handleSave = () => {
    alert('Guardar');
  };

  const handleSavePress = () => {
    alert('Información guardada');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Image
              source={require('../assets/regreso.png')}
              style={styles.backImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Perfil</Text>
        </View>
        <View style={styles.profilePictureContainer}>
          <Image source={{uri: data?.imagen}} style={styles.profilePicture} />
        </View>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{data?.nombre + ' ' + data?.apellidos}</Text>
        <Text style={styles.description}>{data?.descripcion}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePersonalInfoPress}>
            <Text style={styles.buttonText}>Información Personal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePhotosPress}>
            <Text style={styles.buttonText}>Fotos</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.cardContainer}>
        {selectedSection === 'personalInfo' && (
          <>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleInfoSelect('personalInfo')}>
              <Image
                source={require('../assets/personal.png')}
                style={styles.cardIcon}
              />
              <Text style={[styles.cardTitle, styles.text]}>
                Información Personal
              </Text>

              <View style={styles.subCard}>
                <Text style={styles.title}>Nombre:</Text>
                <Text style={[styles.details, styles.text]}>
                  {data?.nombre + ' ' + data?.apellidos}
                </Text>
              </View>

              <View style={styles.subCard}>
                <Text style={styles.title}>Email:</Text>
                <Text style={[styles.details, styles.text]}>
                  {data?.correo}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => handleInfoSelect('compras')}>
              <Image
                source={require('../assets/productos.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Compras Recientes</Text>
              <Text style={styles.text}>Producto: Manzanas</Text>
              <Text style={styles.text}>Cantidad: 10kg</Text>
              <Text style={styles.text}>Precio: $100</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              <Image
                source={require('../assets/ubicacion.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Ubicación</Text>

              {/* Mostrando la dirección aquí */}
              <Text style={styles.text}>Dirección: {data?.direccion}</Text>
            </View>
          </>
        )}

        {selectedSection === 'photos' && (
          <View style={styles.photosContainer}>
            {['foto1', 'foto2', 'foto3', 'foto4'].map((photo, index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoCard}
                onPress={() => handlePhotoSelect(photo)}>
                <Text>{photo}</Text>
                {/* Si tienes imágenes, puedes usar el componente Image aquí para mostrar cada foto */}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isPhotosModalVisible}
        onRequestClose={() => {
          setPhotosModalVisibility(false);
        }}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Fotos del Agricultor</Text>

          {/* Foto de perfil */}
          <Image source={{uri: data?.imagen}} style={styles.fotoPerfil} />

          {/* Fotos de productos (Este es un ejemplo, debes ajustarlo según tus datos) */}
          {data?.productos &&
            data.productos.map((producto, index) => (
              <Image
                key={index}
                source={{uri: producto.imagen}}
                style={styles.fotoProducto}
              />
            ))}

          {/* Botón para cerrar el modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPhotosModalVisibility(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {isModalVisible && (
        <View style={styles.modalContainer}>
          {selectedSection === 'personalInfo' ? (
            <View style={styles.selectedInfoContainer}>
              <Text>Información seleccionada: {selectedInfo}</Text>
            </View>
          ) : (
            <View style={styles.selectedPhotoContainer}>
              <Text>Imagen seleccionada: {selectedPhoto}</Text>
            </View>
          )}

          <View style={styles.buttonsModalContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.editButton]}
              onPress={handleEdit}>
              <Text style={styles.modalButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDelete}>
              <Text style={styles.modalButtonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButtonModal]}
              onPress={handleSave}>
              <Text style={styles.modalButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.exitButton]}
              onPress={handleExit}>
              <Text style={styles.modalButtonText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  topSection: {
    flex: 1,
    backgroundColor: '#5DDCAE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 15,
  },
  backImage: {
    width: 30,
    height: 25,
  },
  profilePictureContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    overflow: 'hidden',
  },
  profilePicture: {
    width: 120,
    height: 120,
  },
  // espacio entre los dos botones
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20, // Añade un espacio debajo de los botones
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 15, // Añade espacio entre los botones y las tarjetas
  },
  button: {
    backgroundColor: '#5DDCAE',
    paddingVertical: 20,
    paddingHorizontal: 35,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f0f0f0', // Fondo gris para las tarjetas
    borderRadius: 5,
    padding: 10,
    marginBottom: 10, // Espacio entre tarjetas
    width: '90%', // Ancho reducido
    alignSelf: 'center', // Centra la tarjeta
    borderColor: 'black', // Color del borde
    borderWidth: 1, // Ancho del borde
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: 'black',
  },
  bottomSection: {
    flex: 0.2,
    backgroundColor: 'black', // Fondo blanco para la sección inferior
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: 'white', // Fondo blanco para el contenedor de las tarjetas
    flex: 1, // Ocupa el espacio disponible
    marginHorizontal: 10,
    marginTop: 30,
    borderColor: 'transparent', // Borde transparente
    borderWidth: 0, // Ancho del borde
  },
  saveButtonContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white', // Puedes ajustar el color según tus necesidades
  },
  saveButton: {
    backgroundColor: '#5DDCAE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  cardIcon: {
    width: 20, // puedes ajustar el tamaño
    height: 20, // puedes ajustar el tamaño
    marginRight: 10, // espacio a la derecha del icono
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%', // Esto permite que dos tarjetas (cada una del 48% de ancho) más un 4% de espacio total entre ellas, ocupen el 100% del ancho del contenedor.
    aspectRatio: 1, // Mantiene la proporción 1:1 (cuadrado)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Espacio en la parte inferior de cada tarjeta.
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // Fondo semi transparente
  },
  selectedPhotoContainer: {
    width: '80%',
    height: '40%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  // Contenedor de los botones del modal
  buttonsModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5, // margen entre botones
    flex: 1, // para que todos los botones ocupen el mismo espacio
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: 'blue',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  saveButtonModal: {
    backgroundColor: 'green',
  },
  exitButton: {
    backgroundColor: 'gray',
  },
  selectedInfoContainer: {
    width: '80%',
    height: '40%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  text: {
    color: 'black',
  },
  subCard: {
    backgroundColor: 'white', // Fondo blanco
    marginVertical: 5, // Espaciado vertical entre las sub-tarjetas
    borderRadius: 5, // Bordes redondeados
    padding: 10, // Padding interno
    shadowColor: '#000', // Sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  fotoProducto: {
    width: 80,
    height: 80,
    margin: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
  },
});

export default PerfilConsumidor;
