import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SectionList,
  Dimensions,
  Alert,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

const FilaDeTarjetas = ({productos, handleCardClick}) => (
  <View style={styles.filaDeTarjetas}>
    {Array.isArray(productos) &&
      productos.map(producto => (
        <TouchableOpacity
          key={producto.id}
          onPress={() => handleCardClick(producto)}
          style={styles.tarjeta}>
          {producto.imagen ? ( // Si hay imagen, la renderiza.
            <Image
              source={{uri: producto.imagen}}
              style={styles.imagenDeProducto}
            />
          ) : (
            // Si no hay imagen, muestra un View en blanco con el mismo tamaño.
            <View style={styles.imagenDeProductoPlaceholder}></View>
          )}

          <Text style={styles.descripcionDelProducto}>
            {producto.nombreProducto}
          </Text>
          {producto.promoDescription &&
          producto.promoDescription.descripcionPromocion &&
          producto.promoDescription.descripcionPromocion !== '' ? (
            <View style={styles.promoContainer}>
              <Text style={styles.promoText}>🔥 En promoción</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      ))}
  </View>
);
const VistaPrincipalConsumidor = ({navigation}) => {
  const [productos, setProductos] = useState([]);
  const [listaOriginalProductos, setListaOriginalProductos] = useState([]);
  const [columns] = useState(3);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [consumerId, setConsumerId] = useState(null);

  //para obtener el id del consumidor
  useEffect(() => {
    const obtenerIdDelConsumidor = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const consumerId = user.uid; // Cambiado a consumerId
          setConsumerId(consumerId); // Almacena el ID del consumidor en el estado
        }
      } catch (error) {
        console.error('Error al obtener el ID del consumidor:', error);
      }
    };

    obtenerIdDelConsumidor();
  }, []); // Este efecto se ejecuta solo una vez al montar el componente

  useEffect(() => {
    const desuscribirse = firestore()
      .collection('Productos')
      .onSnapshot(querySnapshot => {
        const productosFirebase = [];
        querySnapshot.forEach(documentSnapshot => {
          productosFirebase.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });

        setProductos(productosFirebase);
        setListaOriginalProductos(productosFirebase);
      });

    // Desuscribirse del listener cuando el componente se desmonte
    return () => desuscribirse();
  }, []);
  const agruparProductos = productos => {
    let grupos = [];
    for (let i = 0; i < productos.length; i += 3) {
      grupos.push(productos.slice(i, i + 3));
    }
    return grupos;
  };
  const mitad = Math.ceil(productos.length / 2);
  const productosCercaDeTi = agruparProductos(productos.slice(0, mitad));
  const productosDeInteres = agruparProductos(productos.slice(mitad));

  const secciones = [
    {title: 'Cerca de ti', data: productosCercaDeTi},
    {title: 'De Interés', data: productosDeInteres},
  ];
  const handleMenuPress = () => {
    navigation.navigate('OpcionesConsumidor');
  };
  const handleMessagePress = () => {
    navigation.navigate('ConsumidorMensaje', {consumerId: consumerId}); // Asegúrate de que el nombre aquí coincide con el nombre que le diste en el stack navigator.
  };

  const handleSearchPress = () => {
    if (!textoBusqueda.trim()) {
      // Si el campo de búsqueda está vacío, restablece a la lista original.
      setProductos(listaOriginalProductos);
    } else {
      const productosFiltrados = listaOriginalProductos.filter(producto =>
        producto.nombreProducto
          .toLowerCase()
          .includes(textoBusqueda.toLowerCase()),
      );
      setProductos(productosFiltrados);
    }
  };
  const handleCardClick = product => {
    if (product && product.id) {
      navigation.navigate('DescripcionProducto', {
        selectedProduct: {
          ...product,
          agricultorId: product.userId, // Asegúrate de que esto esté correctamente configurado
          productPrice: parseFloat(product.precioProducto),
          cantidadProducto: parseFloat(product.cantidadProducto), // Convierte cantidadProducto a número
          consumerId: consumerId, // Aquí pasamos el consumerId
        },
      });
    } else {
      console.error('El producto no tiene un ID válido.');
    }
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
          onPress: async () => {
            try {
              // Cierra la sesión en Firebase
              await firebase.auth().signOut();

              // Navega de regreso a la pantalla de inicio de sesión
              navigation.reset({
                index: 0,
                routes: [{name: 'PantallaRol'}], // Asegúrate de usar el nombre correcto de tu pantalla de inicio
              });
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  const cartItemsCount = 5;

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Image source={require('../assets/menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.header}>Productos Disponibles</Text>
        <TouchableOpacity onPress={handleMessagePress}>
          <Image
            source={require('../assets/mensaje.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Carrito', {consumerId: consumerId})
          }>
          <Image
            source={require('../assets/carrito.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Sección de búsqueda */}
      <View style={styles.searchCard}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          onChangeText={text => {
            setTextoBusqueda(text);
            if (!text.trim()) {
              setProductos(listaOriginalProductos);
            } else {
              const productosFiltrados = listaOriginalProductos.filter(
                producto =>
                  producto.nombreProducto
                    .toLowerCase()
                    .includes(text.toLowerCase()),
              );
              setProductos(productosFiltrados);
            }
          }}
        />
      </View>
      <SectionList
        sections={secciones}
        keyExtractor={(item, index) => item[0].id + index} // Cambio aquí, usando el id del primer producto del grupo
        renderItem={({item}) => (
          <FilaDeTarjetas
            productos={item} // Pasando el grupo completo de productos
            handleCardClick={handleCardClick}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
      {/* Botón de salida */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogOut} style={styles.logOutButton}>
          <Text style={styles.logOutText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth / 3 - 20; // Dividimos por 3 para mostrar tres tarjetas en una fila y aplicamos margen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEDED',
    padding: 20,
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#f7f7f7',
    padding: 10,
  },
  footer: {
    marginVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  menuImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#EAEDED',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 10,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#F2F3F4',
  },
  searchImage: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  nearbyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
  },
  productDescription: {
    padding: 5,
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  cardGroup: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  logOutButton: {
    marginTop: 2,
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 1,
  },
  logOutText: {
    fontSize: 16,
    color: 'red',
    textDecorationLine: 'underline',
  },
  cartCounter: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCounterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tituloCercaDeTi: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  tituloDeInteres: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  filaDeTarjetas: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  tarjeta: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  imagenDeProducto: {
    width: '100%',
    height: cardWidth * 0.75,
    resizeMode: 'cover',
  },
  descripcionDelProducto: {
    padding: 5,
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
    color: 'black',
  },
  imagenDeProductoPlaceholder: {
    width: '100%',
    height: cardWidth * 0.75,
    backgroundColor: '#F2F3F4',
  },
  promoContainer: {
    backgroundColor: '#FF5733', // Un color naranja brillante.
    borderRadius: 5, // Esquinas redondeadas.
    marginTop: 5, // Espacio superior.
    paddingHorizontal: 5, // Espacio horizontal.
    paddingVertical: 3, // Espacio vertical.
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3, // Para Android.
  },
  promoText: {
    color: 'white', // Texto en blanco.
    fontSize: 12,
    fontWeight: 'bold', // Texto en negrita.
  },
});

export default VistaPrincipalConsumidor;
