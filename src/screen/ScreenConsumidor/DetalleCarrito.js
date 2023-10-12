import React, {useContext} from 'react';
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

const DetalleCarrito = ({route, navigation}) => {
  const {cart, setCart} = useContext(CartContext);

  const agricultorDefault = {
    id: 1, // ID del producto
    nombre: 'Juan Pérez',
    telefono: '123-456-7890',
    email: 'juan@email.com',
  };

  const agricultorInfo = route.params.agricultorInfo || agricultorDefault;
  const totalCost = cart.reduce((acc, prod) => {
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
    submitOrderToFirestore();
    navigation.navigate('RealizarPaedido', {name: 'Nombre del Agricultor'});
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
  // Funcion que envia los datos del carrito a firestore
  const submitOrderToFirestore = async () => {
    try {
      await firestore()
        .collection('orders')
        .add({
          cartItems: cart,
          totalCost: totalCost,
          agricultorInfo: agricultorInfo,
          date: firestore.Timestamp.fromDate(new Date()),
        });
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
        <Text style={styles.nombreAgricultor}>{agricultorInfo.nombre}</Text>
        <Text style={styles.infoAgricultor}>
          Teléfono: {agricultorInfo.telefono}
        </Text>
        <Text style={styles.infoAgricultor}>Email: {agricultorInfo.email}</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.listaContenido}
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.itemProducto}>
            <Image source={{uri: item.imagen}} style={styles.productImage} />
            <Text style={styles.nombreProducto}>{item.nombreProducto}</Text>
            <Text style={styles.precioProducto}>
              Precio: ${item.precioProducto}
            </Text>
            <Text style={styles.cantidadDisponibleTexto}>
              Cantidad disponible: {item.cantidadProducto}
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
    marginTop: 5,
    fontSize: 14,
    color: '#757575', // Color más sutil
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
});

export default DetalleCarrito;
