import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {CartContext} from '../ScreenCompartidas/CarritoContext';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/database';

const DetalleCarrito = ({route, navigation}) => {
  const {cart, setCart} = useContext(CartContext);
  const [agricultorInfo, setAgricultorInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const {userId, agricultorId, consumerId} = route.params;
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [filteredCart, setFilteredCart] = useState([]);
  useEffect(() => {
    const filtered = cart.filter(
      product => product.agricultorId === agricultorId,
    );
    setFilteredCart(filtered);
  }, [cart, agricultorId]);
  // Consulta Realtime Database para obtener los datos del consumidor
  useEffect(() => {
    const loadConsumerData = async () => {
      try {
        const consumerRef = firebase
          .database()
          .ref(`consumidores/${consumerId}`); // Utiliza el ID del consumidor
        consumerRef.once('value', snapshot => {
          const data = snapshot.val();
          if (data) {
            // Ahora, data contendrá los datos del consumidor, incluyendo nombre, telefono y correo.
            // Establece estos datos en el estado.
            setNombre(data.nombre);
            setTelefono(data.telefono);
            setCorreo(data.correo);
          } else {
            console.error('No se encontró el consumidor');
          }
        });
      } catch (error) {
        console.error('Error al cargar los datos del consumidor:', error);
      }
    };

    if (consumerId) {
      loadConsumerData(); // Cargar los datos del consumidor si consumerId está definido
    }
  }, [consumerId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await firestore().collection('products').get();
        const productsData = productsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [setProducts]); // Agregar setProducts al array de dependencias

  // para traer los datos del agricultor
  useEffect(() => {
    const loadAgricultorInfo = async () => {
      try {
        const agricultorRef = firebase
          .database()
          .ref(`agricultores/${agricultorId}`);
        agricultorRef
          .once('value', snapshot => {
            const data = snapshot.val();
            if (data) {
              setAgricultorInfo(data);
            } else {
              console.error('No se encontró el agricultor');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      } catch (error) {
        console.error('Error al cargar la info del agricultor:', error);
      }
    };

    if (userId) {
      loadAgricultorInfo(); // Cargar la info del agricultor si userId está definido
    }
  }, [userId, agricultorId]);

  const totalCost = filteredCart.reduce((acc, prod) => {
    let precio = parseFloat(prod.precioProducto) || 0;
    let cantidadSeleccionada = Number(prod.cantidadSeleccionada) || 1;

    return acc + precio * cantidadSeleccionada;
  }, 0);
  cart.forEach(prod => {
    // Asegurándose de que las propiedades sean números
    prod.precioProducto = parseFloat(prod.precioProducto);
    prod.cantidadSeleccionada = parseFloat(prod.cantidadSeleccionada);

    // Ahora validamos el producto
    if (
      typeof prod.precioProducto !== 'number' ||
      typeof prod.cantidadSeleccionada !== 'number'
    ) {
      console.error('Producto con datos inválidos:', prod);
    }
  });

  const handleChat = () => {
    alert('Funcionalidad de chat en desarrollo. ¡Pronto estará disponible!');
  };
  // Logica para disminuir el producto
  const handleDecrease = id => {
    setCart(prevCart => {
      return prevCart.map(producto => {
        if (producto.id === id && producto.cantidadSeleccionada > 0) {
          console.log('Decrementando', producto.cantidadSeleccionada);
          return {
            ...producto,
            cantidadSeleccionada: producto.cantidadSeleccionada - 1,
          };
        }
        return producto;
      });
    });
  };

  // Lógica para aumentar la cantidad del producto
  const handleIncrease = id => {
    setCart(prevCart => {
      return prevCart.map(producto => {
        if (producto.id === id) {
          if (producto.cantidadSeleccionada + 1 > producto.cantidadProducto) {
            // Mostrar alerta si se excede la cantidad disponible
            Alert.alert(
              'Cantidad no disponible',
              `Solo hay ${producto.cantidadProducto} unidades disponibles de ${producto.nombreProducto}`,
              [{text: 'OK'}],
            );
            return producto; // No incrementar la cantidad
          }
          return {
            ...producto,
            cantidadSeleccionada: producto.cantidadSeleccionada + 1,
          };
        }
        return producto;
      });
    });
  };
  // Lógica para eliminar el producto del carrito
  const handleRemove = id => {
    setCart(prevCart => {
      return prevCart.filter(producto => producto.id !== id);
    });
  };
  const handlePedido = () => {
    // Crear un objeto que represente la orden
    const orderData = {
      cartItems: filteredCart, // Usar filteredCart en lugar de cart
      totalCost: totalCost,
      agricultorInfo: agricultorInfo,
      agricultorId: agricultorId,
      date: firestore.Timestamp.fromDate(new Date()),
      consumerInfo: {
        consumerId: consumerId,
        consumerName: nombre,
        consumerPhone: telefono,
        consumerEmail: correo,
      },
    };

    // Llamar a la función para enviar la orden a Firestore
    submitOrderToFirestore(orderData);

    // Elimina sólo los productos del agricultor del carrito
    const updatedCart = cart.filter(
      product => product.agricultorId !== agricultorId,
    );
    setCart(updatedCart);

    // Navegar de regreso a la vista principal del consumidor
    navigation.navigate('VistaPrincipalConsumidor');
  };

  const confirmRemove = id => {
    // Mostrar una ventana de alerta
    Alert.alert(
      'Eliminar producto', // Título de la ventana
      '¿Estás seguro de eliminar este producto del carrito?', // Mensaje
      [
        // Botones en la ventana de alerta
        {text: 'No', style: 'cancel'},
        {
          text: 'Sí',
          onPress: () => handleRemove(id), // Si el usuario confirma, se llama a handleRemove
        },
      ],
      {cancelable: true}, // Esto permite que el usuario cancele tocando fuera de la ventana
    );
  };
  const handleNavigateToMain = () => {
    navigation.navigate('VistaPrincipalConsumidor'); // Cambia 'VistaPrincipal' con el nombre correcto de tu vista principal si es diferente.
  };
  // Esta función toma los datos del pedido y los envía a la colección "orders" en Firestore.
  const submitOrderToFirestore = async orderData => {
    try {
      await firestore().collection('orders').add(orderData);
      Alert.alert('Pedido enviado', 'Tu pedido ha sido enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el pedido a Firestore:', error);
      Alert.alert(
        'Error',
        'Hubo un error al enviar tu pedido. Por favor, intenta nuevamente.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.botonRegresoContainer}>
          <Image
            source={require('../assets/regreso.png')}
            style={styles.botonRegreso}
          />
        </TouchableOpacity>
        <Text style={styles.tituloEncabezado}>Detalle del Carrito</Text>
        <View style={styles.iconosContainer}>
          <TouchableOpacity style={styles.botonMensaje} onPress={handleChat}>
            <Image
              source={require('../assets/mensaje.png')}
              style={styles.iconoMensaje}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonAgregarMas}
            onPress={handleNavigateToMain}>
            <Image
              source={require('../assets/mas.png')}
              style={styles.iconoAgregarMas}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tarjetaAgricultor}>
        <Text style={styles.nombreAgricultor}>
          {agricultorInfo
            ? agricultorInfo.nombre + ' ' + agricultorInfo.apellidos
            : 'Cargando...'}
        </Text>
        <Text style={styles.infoAgricultor}>
          Teléfono: {agricultorInfo ? agricultorInfo.telefono : 'Cargando...'}
        </Text>
        <Text style={styles.infoAgricultor}>
          Email: {agricultorInfo ? agricultorInfo.correo : 'Cargando...'}
        </Text>
      </View>
      <FlatList
        contentContainerStyle={styles.listaContenido}
        data={filteredCart}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.itemProducto}>
            <Image source={{uri: item.imagen}} style={styles.productImage} />
            <Text style={styles.nombreProducto}>{item.nombreProducto}</Text>
            <Text style={styles.precioProducto}>
              Precio: ${item.precioProducto}
            </Text>
            {item.promoDescription &&
              item.promoDescription.descripcionPromocion && (
                <Text style={styles.promocionTexto}>
                  Promoción: {item.promoDescription.descripcionPromocion}
                </Text>
              )}
            <Text style={styles.cantidadDisponibleTexto}>
              Cantidad disponible: {item.cantidadProducto}
            </Text>
            <Text style={styles.nombreAgricultor}>
              {agricultorInfo
                ? agricultorInfo.nombre + ' ' + agricultorInfo.apellidos
                : 'Cargando...'}
            </Text>

            <View style={styles.controlesProducto}>
              <TouchableOpacity onPress={() => handleDecrease(item.id)}>
                <Text style={styles.controlTexto}>-</Text>
              </TouchableOpacity>
              <Text style={styles.detallesProducto}>
                Cantidad seleccionada: {item.cantidadSeleccionada}
              </Text>
              <TouchableOpacity onPress={() => handleIncrease(item.id)}>
                <Text style={styles.controlTexto}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => confirmRemove(item.id)}
              style={styles.botonEliminar}>
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalCost}>Total: ${totalCost}</Text>
      </View>

      <TouchableOpacity style={styles.botonPagar} onPress={handlePedido}>
        <Text style={styles.textoBotonPagar}>Realizar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    height: 60,
    paddingHorizontal: 15,
    elevation: 2,
  },
  contenido: {
    flex: 1,
    justifyContent: 'space-between',
  },
  botonRegresoContainer: {
    marginRight: 10,
  },
  botonRegreso: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  tituloEncabezado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  iconosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botonChatContainer: {
    marginLeft: 10,
  },
  botonChat: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  listaContenido: {
    paddingVertical: 20,
  },
  itemProducto: {
    backgroundColor: '#EAEDED',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlesProducto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlTexto: {
    fontSize: 24,
    color: '#212121',
    marginHorizontal: 10,
    padding: 5, // Espacio interior
    backgroundColor: '#EAEDED', // Un color de fondo claro
    borderRadius: 8, // Bordes redondeados
    elevation: 2, // Sombra en Android
    shadowOffset: {width: 1, height: 1}, // Sombra en iOS
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detallesProducto: {
    marginTop: 5,
    fontSize: 15, // Aumentamos un poco el tamaño
    fontWeight: '600', // Semi-negrita
    color: '#333', // Un color oscuro pero no totalmente negro
  },
  botonEliminar: {
    marginTop: 10,
    backgroundColor: '#FF4747', // Color rojo para alerta
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8, // Bordes redondeados
    elevation: 2, // Sombra para Android
    shadowOffset: {width: 1, height: 1}, // Sombra para iOS
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  textoEliminar: {
    color: 'white', // Cambiando a blanco para que contraste con el fondo rojo
    fontWeight: 'bold', // Texto en negrita
    textAlign: 'center',
  },

  totalCost: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  botonPagar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginHorizontal: 50,
    borderRadius: 5,
  },
  textoBotonPagar: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tarjetaAgricultor: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
  },
  nombreAgricultor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  infoAgricultor: {
    fontSize: 16,
    color: '#757575',
  },
  totalContainer: {
    padding: 15,
  },
  botonMensaje: {
    marginRight: 10, // añade un margen a la derecha para separar los íconos
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 10,
    elevation: 10,
  },
  iconoMensaje: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10, // añade un margen si deseas separar la imagen del nombre del producto
  },
  nombreProducto: {
    fontSize: 18, // Aumentamos el tamaño
    fontWeight: 'bold', // Reforzamos la negrita
    color: '#212121', // Un color oscuro
    marginBottom: 5,
  },
  cantidadDisponible: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#212121',
    marginTop: 5,
    marginBottom: 5,
  },
  cantidadProducto: {
    fontSize: 14,
    color: '#757575',
  },
  precioProducto: {
    fontSize: 16,
    fontWeight: 'bold', // Lo ponemos en negrita para que destaque
    color: '#4CAF50', // Un tono verde oscuro que sugiere valor
    marginBottom: 5,
  },

  cantidadDisponibleTexto: {
    fontSize: 16,
    color: '#388E3C', // Un color verde oscuro para la disponibilidad
    marginTop: 5,
    fontWeight: '500', // Semi-negrita para un poco de énfasis
    textAlign: 'center', // Centrado para darle importancia
  },

  // Estilos para el botón de mensaje
  // Estilos para el nuevo botón y su imagen
  botonAgregarMas: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 10,
  },
  iconoAgregarMas: {
    width: 24,
    height: 24,
    tintColor: 'black',
  },
  promocionTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63', // Un color llamativo como rosa fuerte
    backgroundColor: '#FDEDEC', // Un fondo suave para hacer resaltar el texto
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E91E63',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center', // Centrado para darle más presencia
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#E91E63',
    shadowOpacity: 0.3,
    elevation: 3, // Sombra en Android
  },
});

export default DetalleCarrito;
