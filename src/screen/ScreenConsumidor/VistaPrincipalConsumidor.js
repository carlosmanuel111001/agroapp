import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

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
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const suscribirse = firestore()
      .collection('Productos')
      .onSnapshot(querySnapshot => {
        const productosFirebase = [];
        querySnapshot.forEach(documentSnapshot => {
          productosFirebase.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        console.log(productosFirebase);
        setProductos(productosFirebase);
      });

    // Desuscribirse del listener cuando el componente se desmonte
    return () => suscribirse();
  }, []);

  const handleMenuPress = () => {
    navigation.navigate('OpcionesConsumidor');
  };
  const handleMessagePress = () => {
    navigation.navigate('MensajeConsumidor'); // Asegúrate de que el nombre aquí coincide con el nombre que le diste en el stack navigator.
  };

  const handleSearchPress = () => {
    console.log('Search button pressed!');
    // Aquí puedes agregar la lógica para realizar la búsqueda
  };
  const handleCardClick = product => {
    navigation.navigate('DescripcionProducto', {
      selectedProduct: product,
    });
  };
  const groupedData = [];
  for (let i = 0; i < productos.length; i += 3) {
    groupedData.push(productos.slice(i, i + 3));
  }
  const sampleImagePath = require('../assets/productos.png');

  // Simulación de datos (Puedes extender este array para simular más productos)
  const IMAGES = {
    sample: sampleImagePath,
    // ... otros assets
  };

  // ...
  const groupProducts = (list, itemsPerGroup = 3) => {
    const grouped = [];
    for (let i = 0; i < list.length; i += itemsPerGroup) {
      grouped.push(list.slice(i, i + itemsPerGroup));
    }
    return grouped;
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
  const handleCartPress = () => {
    navigation.navigate('CarritoDeCompras');
  };
  const cartItemsCount = 5;

  return (
    <ScrollView style={styles.container}>
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

        <TouchableOpacity onPress={() => navigation.navigate('Carrito')}>
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
        <TextInput style={styles.searchInput} placeholder="Buscar..." />
        <TouchableOpacity onPress={handleSearchPress}>
          <Image
            source={require('../assets/visualizar.png')}
            style={styles.searchImage}
          />
        </TouchableOpacity>
      </View>

      {/* Sección "Cerca de ti" */}
      <Text style={styles.tituloCercaDeTi}>Cerca de ti</Text>
      <FlatList
        data={productos}
        numColumns={columns}
        key={columns} // ¡Aquí está el truco!
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <FilaDeTarjetas
            productos={[item]}
            handleCardClick={handleCardClick}
          />
        )}
      />

      {/* Sección "De Interés" */}
      <Text style={styles.tituloDeInteres}>De Interés</Text>
      <FlatList
        data={productos}
        numColumns={columns}
        key={columns} // ¡Aquí está el truco!
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <FilaDeTarjetas
            productos={[item]}
            handleCardClick={handleCardClick}
          />
        )}
      />

      {/* Botón de salida */}
      <TouchableOpacity onPress={handleLogOut} style={styles.logOutButton}>
        <Text style={styles.logOutText}>Salir</Text>
      </TouchableOpacity>
    </ScrollView>
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
