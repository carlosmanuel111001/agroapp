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
          console.log('ID del Consumidor:', consumerId); // Imprime el ID del consumidor en la consola
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
    navigation.navigate('MensajeConsumidor'); // Asegúrate de que el nombre aquí coincide con el nombre que le diste en el stack navigator.
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
          {cartItemsCount > 0 && (
            <View style={styles.cartCounter}>
              <Text style={styles.cartCounterText}>{cartItemsCount}</Text>
            </View>
          )}
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
            }
          }}
        />
        <TouchableOpacity onPress={handleSearchPress}>
          <Image
            source={require('../assets/visualizar.png')}
            style={styles.searchImage}
          />
        </TouchableOpacity>
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
    width: 30, // ajusta el tamaño según tu necesidad
    height: 30,
    marginLeft: 10, // un pequeño margen para separarlo del texto
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginTop: 20,
    marginBottom: 20, // Espacio después de la sección de búsqueda
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
    marginLeft: 10, // Añade más margen si lo consideras necesario
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
    margin: 5, // Un pequeño margen para separar las tarjetas
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
    height: '75%', // Establecemos que la imagen ocupe el 75% del alto de la tarjeta
    resizeMode: 'cover',
  },
  productDescription: {
    padding: 5,
    fontSize: 14,
    textAlign: 'center',
    flex: 1, // Para que ocupe el espacio restante en la tarjeta
  },
  cardGroup: {
    flexDirection: 'row',
    marginBottom: 15, // Añade un espacio entre los grupos de tarjetas
  },
  logOutButton: {
    marginTop: 20,
    marginBottom: 50, // Espacio en la parte inferior
    alignSelf: 'center',
  },
  logOutText: {
    fontSize: 16,
    color: '#7B8D93', // Un color tenue para que el botón sea discreto
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
  // Estilos para los títulos y tarjetas
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
    justifyContent: 'flex-start', // Asegura que las tarjetas se alineen desde la izquierda
    marginBottom: 15,
  },
  tarjeta: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    margin: 5, // Agrega margen alrededor de cada tarjeta
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
    color: 'black', // Color del texto
  },
  imagenDeProductoPlaceholder: {
    width: '100%',
    height: cardWidth * 0.75, // Toma el mismo espacio que la imagen.
    backgroundColor: '#F2F3F4', // Color de fondo claro como placeholder. Puedes ajustar este color según tus preferencias.
  },
});

export default VistaPrincipalConsumidor;
