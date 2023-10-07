import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const VistaPrincipal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSearch, setPedidoSearch] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.navigate('VistaOpcionesAgricultor');
  };
  const handleMessagesPress = () => {
    navigation.navigate('Mensaje');
  };
  const handleViewPress = () => {
    // Abre el modal solo cuando se hace clic en el botón "Buscar"
    setModalVisible(true);
    // Limpia los resultados de búsqueda cuando se abre el modal
    setResultadosBusqueda([]);
  };

  const handleRegister = () => {
    navigation.navigate('RegistroProducto');
  };

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Productos')
      .onSnapshot(querySnapshot => {
        const productosData = [];
        querySnapshot.forEach(doc => {
          productosData.push({
            id: doc.id,
            nombre: doc.data().nombreProducto, // Asegúrate de tener el campo correcto de nombre en tu base de datos
          });
        });
        setProductos(productosData);
      });

    // Cuando el componente se desmonta, deja de escuchar los cambios
    return () => unsubscribe();
  }, []); // El array vacío como segundo argumento significa que este efecto se ejecutará solo una vez, similar a componentDidMount

  const handleEditPress = productoId => {
    navigation.navigate('EditarProducto', {id: productoId});
  };
  const handleLogOut = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que quieres salir?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: () => {
            console.log('Salir');
            // Navega de regreso a la pantalla de inicio de sesión
            navigation.reset({
              index: 0,
              routes: [{name: 'PantallaRol'}], // Asegúrate de usar el nombre correcto de tu pantalla de inicio
            });
          },
        },
      ],
      {cancelable: false},
    );
  };
  const handleEliminar = id => {
    // Muestra un cuadro de diálogo de confirmación antes de eliminar el producto
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel', // El botón de cancelar aparecerá a la izquierda
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              // Elimina el producto de Firestore utilizando el método delete
              await firestore().collection('Productos').doc(id).delete();

              Alert.alert('Información', 'Producto eliminado con éxito');
            } catch (error) {
              console.error('Error al eliminar el producto: ', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar el producto. Por favor, inténtalo de nuevo.',
              );
            }
          },
          style: 'destructive', // El botón de eliminar aparecerá en rojo
        },
      ],
      {cancelable: false}, // El usuario debe tomar una decisión antes de cerrar el cuadro de diálogo
    );
  };

  const handleSearch = async () => {
    console.log('Texto de búsqueda:', pedidoSearch);

    try {
      const productosSnapshot = await firestore()
        .collection('Productos')
        .where('nombreProducto', '>=', pedidoSearch)
        .get();

      const productosEncontrados = productosSnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombreProducto,
      }));

      console.log('Resultados de la búsqueda:', productosEncontrados);

      setResultadosBusqueda(productosEncontrados);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      Alert.alert(
        'Error',
        'No se pudo realizar la búsqueda. Por favor, inténtalo de nuevo.',
      );
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buscar Producto:</Text>
            <TextInput
              style={styles.input}
              value={pedidoSearch}
              onChangeText={text => setPedidoSearch(text)}
              placeholder="Nombre del producto"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                // Llama a la función handleSearch para realizar la búsqueda
                handleSearch();
              }}>
              <Text style={{color: 'white'}}>Buscar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: 'white'}}>Cancelar</Text>
            </TouchableOpacity>
            <FlatList
              data={resultadosBusqueda}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={styles.productRow}>
                  <Text style={styles.productId}>{item.id}</Text>
                  <Text style={styles.productName}>{item.nombre}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPress(item.id)}>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleEliminar(item.id)}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={handleViewPress}>
              <Image
                source={require('../assets/visualizar.png')}
                style={styles.viewImage}
              />
            </TouchableOpacity>
            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={styles.messagesButton}
                onPress={handleMessagesPress}>
                <Image
                  source={require('../assets/mensaje.png')}
                  style={styles.messagesImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={handleMenuPress}>
                <Image
                  source={require('../assets/menu.png')}
                  style={styles.menuImage}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.customButton}>
              <Text style={styles.buttonText}>Publicar Nuevo Producto</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lowerContainer}>
          {/* Parte inferior */}
          {/* Contenido principal */}
          <View style={styles.productListHeader}>
            <Text style={styles.productListHeaderText}>Lista de Productos</Text>
          </View>
          <View style={styles.listContainer}>
            <View style={styles.productListHeader}>
              <View style={styles.productRow}>
                <Text style={styles.columnHeader}>ID</Text>
                <Text style={styles.columnHeader}>Producto</Text>
              </View>
            </View>
            <FlatList
              data={productos}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={styles.productRow}>
                  <Text style={styles.productId}>
                    {item.id.substring(0, 3)}
                  </Text>
                  <Text style={styles.productName}>{item.nombre}</Text>
                  <View style={styles.editDeleteButtonContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditPress(item.id)} // Paso el id del producto
                    >
                      <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleEliminar(item.id)}>
                      <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleLogOut} style={styles.logOutButton}>
          <Text style={styles.logOutText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperContainer: {
    flex: 0.5,
    backgroundColor: '#5DDCAE',
  },
  lowerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  viewButton: {},
  viewImage: {
    width: 30,
    height: 30,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  messagesButton: {
    marginRight: 10,
  },
  messagesImage: {
    width: 30,
    height: 30,
  },
  menuButton: {},
  menuImage: {
    width: 30,
    height: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 90,
  },
  customButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black', // Esto hará que las letras sean negras
    fontSize: 18,
    fontWeight: 'bold',
  },
  productListHeader: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 10,
  },

  productListHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  columnHeader: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  productId: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  productName: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  editDeleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButton: {
    backgroundColor: '#5DDCAE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },

  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#F76D57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },

  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // fondo semi-transparente
  },
  modalContent: {
    width: 350, // Ancho del modal
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15, // Espaciado inferior
    textAlign: 'center', // Centrar el texto
  },
  input: {
    borderWidth: 1,
    marginTop: 10,
    padding: 10, // Aumentar el espacio interno
    borderColor: '#e0e0e0',
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: '#5DDCAE',
    marginTop: 20, // Aumentar el espacio superior
    padding: 15, // Aumentar el espacio interno
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F76D57',
    marginTop: 10,
    padding: 15, // Aumentar el espacio interno
    borderRadius: 5,
    alignItems: 'center',
  },
  logOutButton: {
    marginTop: 20,
    marginBottom: 10, // Espacio en la parte inferior
    alignSelf: 'center',
  },
  logOutText: {
    fontSize: 16,
    color: '#7B8D93', // Un color tenue para que el botón sea discreto
    textDecorationLine: 'underline',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
});

export default VistaPrincipal;
