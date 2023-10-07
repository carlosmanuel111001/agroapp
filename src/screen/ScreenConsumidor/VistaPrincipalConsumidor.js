import React from 'react';
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

const VistaPrincipalConsumidor = ({navigation}) => {
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
    navigation.navigate('ProductosDelAgricultor', {
      agricultorId: product.agricultorId,
      selectedProduct: product,
    });
  };
  // Simulación de datos (Puedes extender este array para simular más productos)
  const IMAGES = {
    sample: require('../assets/productos.png'),
    // ... otros assets
  };

  // ...

  const simulatedData = Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index.toString(),
      image: IMAGES.sample,
      description: `Descripción del producto ${index + 1}`,
    }));
  const groupedData = [];
  for (let i = 0; i < simulatedData.length; i += 3) {
    groupedData.push(simulatedData.slice(i, i + 3));
  }
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
      <Text style={styles.nearbyTitle}>Cerca de ti</Text>
      <FlatList
        horizontal
        data={groupedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: group}) => (
          <View style={styles.cardGroup}>
            {group.map(product => (
              <TouchableOpacity
                key={product.id}
                onPress={() => handleCardClick(product)}>
                <View style={styles.card}>
                  <Image source={product.image} style={styles.productImage} />
                  <Text style={styles.productDescription}>
                    {product.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {/* Sección "De interés" */}
      <Text style={styles.nearbyTitle}>De Interes</Text>
      <FlatList
        horizontal
        data={groupedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: group}) => (
          <View style={styles.cardGroup}>
            {group.map(product => (
              <TouchableOpacity
                key={product.id}
                onPress={() => handleCardClick(product)}>
                <View style={styles.card}>
                  <Image source={product.image} style={styles.productImage} />
                  <Text style={styles.productDescription}>
                    {product.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      <TouchableOpacity onPress={handleLogOut} style={styles.logOutButton}>
        <Text style={styles.logOutText}>Salir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
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
    paddingLeft: 20, // espacio adicional a la izquierda para el texto
    paddingRight: 10, // espacio adicional a la derecha
    fontSize: 16, // tamaño de texto un poco más grande
    color: '#2C3E50', // color del texto
    backgroundColor: '#F2F3F4', // fondo ligeramente gris para que se destaque
  },
  searchImage: {
    width: 25, // ajustado para no ser demasiado grande
    height: 25, // ajustado para no ser demasiado grande
    marginLeft: 10, // un poco de espacio entre el texto y el ícono
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
    width: '30%', // Considerando 3 tarjetas y un poco de espacio entre ellas
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden', // Asegura que la imagen no sobrepase los bordes redondeados
    marginBottom: 10,
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
    height: 100, // Puedes ajustar esto dependiendo de tus necesidades
    resizeMode: 'cover', // Asegura que la imagen cubra todo el espacio
  },
  productDescription: {
    padding: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  cardGroup: {
    flexDirection: 'row',
    marginBottom: 15, // Añade un espacio entre los grupos de tarjetas
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
});

export default VistaPrincipalConsumidor;
