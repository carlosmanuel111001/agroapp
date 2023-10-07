import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';
import {useRoute, useNavigation} from '@react-navigation/native';

const EditarProducto = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params; // Extraer el id de las params de la ruta.
  const imagePickerOptions = {
    title: 'Seleccionar imagen',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const [producto, setProducto] = useState({
    tipoProducto: '',
    codigoProducto: '',
    imagen: null, // Puedes inicializarlo con null si la imagen se cargará posteriormente
    nombreProducto: '',
    precioProducto: '',
    cantidadProducto: '',
    descuentoProducto: '',
    ubicacion: '',
    // ...otros campos del producto
  });

  useEffect(() => {
    const obtenerProductoDesdeFirestore = async () => {
      try {
        const productoDocument = await firestore()
          .collection('Productos')
          .doc(id)
          .get();
        if (productoDocument.exists) {
          const productoData = productoDocument.data();
          // Actualizar el estado del producto con los datos obtenidos de Firestore
          setProducto({
            tipoProducto: productoData.tipoProducto || '',
            codigoProducto: productoData.codigoProducto || '',
            imagen: productoData.imagen || null,
            nombreProducto: productoData.nombreProducto || '',
            precioProducto: productoData.precioProducto || 0,
            cantidadProducto: productoData.cantidadProducto || 0,
            descuentoProducto: productoData.descuentoProducto || 0,
            ubicacion: productoData.ubicacion || '',
            // ...otros campos del producto
          });
        } else {
          console.log('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el producto: ', error);
      }
    };

    obtenerProductoDesdeFirestore();
  }, [id]);

  const handleActualizar = async () => {
    try {
      // Aquí estamos verificando si hay una nueva imagen en imageData; si no, usamos la que ya estaba en el producto.
      const imagenActualizada = producto.imagen;
      // Actualiza el producto en Firestore utilizando el método update
      await firestore().collection('Productos').doc(id).update({
        tipoProducto: producto.tipoProducto,
        codigoProducto: producto.codigoProducto,
        imagen: imagenActualizada,
        nombreProducto: producto.nombreProducto,
        precioProducto: producto.precioProducto,
        cantidadProducto: producto.cantidadProducto,
        descuentoProducto: producto.descuentoProducto,
        ubicacion: producto.ubicacion,
        // ...otros campos del producto
      });

      Alert.alert('Información', 'Producto actualizado con éxito', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error al actualizar el producto: ', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar el producto. Por favor, inténtalo de nuevo.',
      );
    }
  };

  const selectImage = async () => {
    try {
      const response = await ImagePicker.launchImageLibrary(imagePickerOptions);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const imagePath = response.assets[0].uri;
        const imageBase64 = await RNFS.readFile(imagePath, 'base64');

        // Generar un nombre de archivo único para la imagen (puedes usar el timestamp, por ejemplo)
        const uniqueFileName = `${Date.now()}.jpg`;

        // Subir la imagen a Firebase Storage
        const reference = storage().ref(`productos/${uniqueFileName}`);
        await reference.putString(
          `data:image/jpeg;base64,${imageBase64}`,
          'data_url',
        );

        // Obtener la URL de descarga de la imagen
        const imageUrl = await reference.getDownloadURL();

        // Almacenar la URL de descarga en tu estado
        setProducto({...producto, imagen: imageUrl});
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  };
  const handleSalir = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tipo de producto:</Text>
      <TextInput
        style={styles.input}
        value={producto.tipoProducto}
        onChangeText={text => setProducto({...producto, tipoProducto: text})}
      />

      <Text style={styles.label}>Código de Producto:</Text>
      <TextInput
        style={styles.input}
        value={producto.codigoProducto}
        onChangeText={text => setProducto({...producto, codigoProducto: text})}
      />

      {/* Aquí puedes manejar la lógica para mostrar la imagen si hay una URL de imagen en el estado del producto */}
      <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
        <Text style={styles.imageButtonText}>Seleccionar Nueva Imagen</Text>
      </TouchableOpacity>
      {producto.imagen && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.imagePreviewText}>
            Vista previa de la imagen:
          </Text>
          <Image
            source={{uri: producto.imagen}}
            style={styles.imagePreview}
            onError={error => console.log('Error al cargar la imagen:', error)}
          />
        </View>
      )}
      <Text style={styles.label}>Nombre del producto:</Text>
      <TextInput
        style={styles.input}
        value={producto.nombreProducto}
        onChangeText={text => setProducto({...producto, nombreProducto: text})}
      />

      <Text style={styles.label}>Precio del Producto:</Text>
      <TextInput
        style={styles.input}
        value={String(producto.precioProducto)}
        onChangeText={text => setProducto({...producto, precioProducto: text})}
      />

      <Text style={styles.label}>Cantidad del Producto:</Text>
      <TextInput
        style={styles.input}
        value={String(producto.cantidadProducto)}
        onChangeText={text =>
          setProducto({...producto, cantidadProducto: parseFloat(text)})
        }
      />

      <Text style={styles.label}>Descuento del Producto:</Text>
      <TextInput
        style={styles.input}
        value={String(producto.descuentoProducto)}
        onChangeText={text =>
          setProducto({...producto, descuentoProducto: parseFloat(text)})
        }
      />

      <Text style={styles.label}>Ubicación:</Text>
      <TextInput
        style={styles.input}
        value={producto.ubicacion}
        onChangeText={text => setProducto({...producto, ubicacion: text})}
      />

      {/* Puedes agregar aquí más campos si es necesario */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actualizarButton}
          onPress={handleActualizar}>
          <Text style={styles.actualizarText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.salirButton} onPress={handleSalir}>
          <Text style={styles.salirText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#e0e0e0', // Color de fondo para representar el marcador de posición
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover', // Esto garantiza que la imagen se ajuste correctamente
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  actualizarButton: {
    flex: 1,
    backgroundColor: '#4CAF50', // verde para el botón de actualizar
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  actualizarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  salirButton: {
    flex: 1,
    backgroundColor: '#FF5252', // rojo para el botón de salir
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  salirText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditarProducto;
