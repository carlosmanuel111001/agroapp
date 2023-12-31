import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {CartContext} from '../ScreenCompartidas/CarritoContext';

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

const firestoreDb = firestore();

const DescripcionProducto = ({route, navigation}) => {
  const {cart, setCart} = useContext(CartContext);
  const {selectedProduct} = route.params;
  const {consumerId} = selectedProduct;
  const agricultorId = selectedProduct.userId;
  const [agricultor, setAgricultor] = React.useState(null);

  useEffect(() => {
    const agricultorRef = firebase
      .database()
      .ref('agricultores/' + agricultorId);

    agricultorRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setAgricultor(data);
      } else {
        console.log('El agricultor no existe en la base de datos');
      }
    });

    return () => agricultorRef.off(); // Desvincula el listener cuando el componente se desmonta
  }, [agricultorId]);

  if (!selectedProduct) {
    return <Text>Error: No se pudo cargar el producto</Text>;
  }
  function formatDate(seconds) {
    const date = new Date(seconds * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  const chatId =
    agricultorId < consumerId
      ? agricultorId + consumerId
      : consumerId + agricultorId;

  const handleChatPress = async () => {
    try {
      const chatRef = firestoreDb.collection('chats').doc(chatId);
      const chatSnapshot = await chatRef.get();

      if (!chatSnapshot.exists) {
        // Si no existe el chat, crea uno nuevo
        await chatRef.set({
          agricultorId: agricultorId,
          consumidorId: consumerId,
        });
      }

      navigation.navigate('DetalleMensaje', {agricultorId, consumerId});
    } catch (error) {
      console.error('Error al acceder o crear el chat: ', error);
      // Aquí puedes optar por mostrar un mensaje al usuario sobre el error, si lo consideras necesario.
      alert(
        'Ocurrió un error al intentar acceder o crear el chat. Por favor, intenta de nuevo.',
      );
    }
  };

  const handleAddToCart = () => {
    // Crear una copia de selectedProduct
    const productToAdd = {
      ...selectedProduct,
      cantidadSeleccionada: 1,
      productPrice: parseFloat(selectedProduct.productPrice),
      cantidadProducto: parseFloat(selectedProduct.cantidadProducto),
      descripcionPromocion:
        selectedProduct.promoDescription?.descripcionPromocion || null,
    };

    setCart(prevCart => [...prevCart, productToAdd]);

    if (selectedProduct.userId) {
      // Pasar solo el ID del agricultor a la vista Carrito
      navigation.navigate('Carrito', {
        productos: [productToAdd], // Puedes pasar el producto recién agregado
        userId: selectedProduct.userId, // Asegúrate de que selectedProduct.userId esté definido
        consumerId: consumerId,
      });
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require('../assets/regreso.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Producto</Text>
      </View>

      <Image
        source={{uri: selectedProduct.imagen}}
        style={styles.productImage}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Tipo de Producto:</Text>
        <Text style={styles.dataText}>{selectedProduct.tipoProducto}</Text>
        <Text style={styles.label}>Nombre de Producto:</Text>
        <Text style={styles.productName}>{selectedProduct.nombreProducto}</Text>
        {selectedProduct.promoDescription &&
          selectedProduct.promoDescription.descripcionPromocion &&
          selectedProduct.promoDescription.descripcionPromocion !== '' && (
            <>
              <Text style={styles.label}>Promoción:</Text>
              <Text style={styles.promotionText}>
                {selectedProduct.promoDescription.descripcionPromocion}
              </Text>
            </>
          )}
        <Text style={styles.label}>Descripcion:</Text>
        <Text style={styles.productDescription}>
          {selectedProduct.descripcionProducto ||
            'No hay descripción disponible'}
        </Text>
        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.dataText}>
          {selectedProduct.ubicacion || 'Ubicación no especificada'}
        </Text>
        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.priceText}>C${selectedProduct.productPrice}</Text>
        <Text style={styles.label}>Descuento:</Text>
        <Text style={styles.dataText}>{selectedProduct.descuentoProducto}</Text>

        <Text style={styles.label}>Fecha de Disponibilidad:</Text>
        <Text>
          {selectedProduct.fecha?.seconds
            ? formatDate(selectedProduct.fecha.seconds)
            : 'No disponible'}
        </Text>

        <Text style={styles.label}>Cantidad:</Text>
        <Text style={styles.dataText}>{selectedProduct.cantidadProducto}</Text>

        <Text style={styles.label}>ID del Agricultor:</Text>
        <Text style={styles.agricultorIdText}>
          {selectedProduct.userId || 'No disponible'}
        </Text>
        <Text style={styles.label}>Nombre del Agricultor:</Text>
        <Text style={styles.dataText}>
          {agricultor ? agricultor.nombre : 'Cargando...'}
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}>
          <Image
            source={require('../assets/carrito.png')}
            style={styles.cartIcon}
          />
          <Text style={styles.addToCartText}>Agregar al Carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleChatPress}>
          <Image
            source={require('../assets/mensaje.png')}
            style={styles.messageIcon}
          />
          <Text style={styles.buttonText}>Mensaje</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco para una apariencia más limpia.
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#212121', // Ícono oscuro para contraste.
  },
  headerTitle: {
    fontSize: 22, // Más grande para darle protagonismo.
    fontWeight: '700', // Más bold para destacar.
    color: '#212121',
  },
  productImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  detailsContainer: {
    backgroundColor: '#F5F5F5', // Un gris claro para distinguir la sección.
    borderRadius: 8,
    padding: 15,
    marginBottom: 15, // Añado margen para separarlo del contenedor de botones.
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20, // Más espacio para respirar entre secciones.
    lineHeight: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5, // Un pequeño margen para separarlo del contenido.
  },
  dataText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10, // Consistente con el espaciado.
  },
  priceText: {
    fontSize: 22,
    color: '#E74C3C', // Rojo para llamar la atención al precio.
    marginBottom: 15,
    fontWeight: '700',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  addToCartButton: {
    flexDirection: 'row', // Alineación horizontal para el ícono y el texto
    alignItems: 'center', // Centrado vertical
    backgroundColor: '#3498DB',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: '48%',
    elevation: 5, // Efecto de sombra para Android
    shadowOffset: {width: 1, height: 2}, // Sombras para iOS
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10, // Añadido un pequeño margen a la izquierda para separar el texto del ícono
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFFFD6',
    borderRadius: 25,
    padding: 12,
    width: '48%',
    elevation: 5,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  messageIcon: {
    width: 24,
    height: 24,
    tintColor: '#3498DB',
    marginRight: 10, // Añadido un pequeño margen a la derecha para separar el ícono del texto
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10, // Añadido un pequeño margen a la izquierda para separar el texto del ícono
  },
  agricultorIdText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10, // Consistente con el espaciado.
  },
  promotionText: {
    fontSize: 18,
    color: '#ff4500', // Un color naranja vibrante
    fontWeight: 'bold',
    backgroundColor: '#fff0e6', // Un ligero fondo naranja para resaltar aún más
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff4500',
    shadowColor: '#ff4500',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 10,
    textAlign: 'center', // centra el texto en el contenedor
  },
});

export default DescripcionProducto;
