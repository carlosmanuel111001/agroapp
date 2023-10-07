import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native'; // Asegúrate de tener esta importación
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

const RegistroProducto = () => {
  const navigation = useNavigation(); // Obtiene el objeto de navegación

  const [tipoProducto, setTipoProducto] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [imageData, setImageData] = useState(null);
  const [nombreProducto, setNombreProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [descuentoProducto, setDescuentoProducto] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const options = {
    mediaType: 'photo',
    includeBase64: true,
  };

  const selectImage = async () => {
    try {
      const response = await ImagePicker.launchImageLibrary(options);

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
        setImageData(imageUrl);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  };

  async function subirProducto() {
    if (tipoProducto === '') {
      Alert.alert('Error', 'Por favor, selecciona un tipo de producto.');
      return;
    }

    try {
      const nombreProductoLowerCase = nombreProducto.toLowerCase(); // Convertir el nombre del producto a minúsculas
      await firestore().collection('Productos').add({
        tipoProducto: tipoProducto,
        codigoProducto: codigoProducto,
        imagen: imageData,
        nombreProducto: nombreProducto,
        precioProducto: precioProducto,
        cantidadProducto: cantidadProducto,
        descuentoProducto: descuentoProducto,
        ubicacion: ubicacion,
        nombreProductoLowerCase: nombreProductoLowerCase, // Almacenar el nombre del producto en minúsculas para facilitar la búsqueda
      });

      Alert.alert('Información', 'Producto registrado con éxito', [
        {
          text: 'OK',
        },
      ]);

      // Resetear la pila de navegación para ir a VistaPrincipal después de registrar el producto
      navigation.reset({
        index: 0,
        routes: [{name: 'vistaPrincipal'}],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTipoProducto('');
      setCodigoProducto('');
      setImageData(null);
      setNombreProducto('');
      setPrecioProducto('');
      setCantidadProducto('');
      setDescuentoProducto('');
      setUbicacion('');
    }
  }

  return (
    <ScrollView>
      <Text style={styles.label}>Tipo de producto:</Text>
      <Picker
        style={styles.input}
        selectedValue={tipoProducto}
        onValueChange={(itemValue, itemIndex) => setTipoProducto(itemValue)}>
        <Picker.Item label="Selecciona un tipo de producto" value="" />
        <Picker.Item label="Frutas" value="frutas" />
        <Picker.Item label="Verduras" value="verduras" />
        <Picker.Item label="Vegetales" value="vegetales" />
      </Picker>

      <Text style={styles.label}>Codigo de Producto</Text>
      <TextInput
        style={styles.input}
        value={codigoProducto}
        onChangeText={text => setCodigoProducto(text)}
      />
      <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imageData && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.imagePreviewText}>
            Vista previa de la imagen:
          </Text>
          <Image source={{uri: imageData}} style={styles.imagePreview} />
        </View>
      )}
      <Text style={styles.label}>Nombre de Producto:</Text>
      <TextInput
        style={styles.input}
        value={nombreProducto}
        onChangeText={text => setNombreProducto(text)}
      />
      <Text style={styles.label}>Precio del Producto:</Text>
      <TextInput
        style={styles.input}
        value={`${'C$' + precioProducto}`}
        onChangeText={text => {
          // Validar que el texto sea un número antes de actualizar el estado
          const numericValue = text.replace(/[^\d]/g, ''); // Eliminar cualquier caracter que no sea número
          setPrecioProducto(numericValue);
        }}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Cantidad del Producto:</Text>
      <TextInput
        style={styles.input}
        value={cantidadProducto.toString()} // Asegura que el valor sea una cadena
        onChangeText={text => {
          // Validar que el texto sea un número antes de actualizar el estado
          const numericValue = text.replace(/[^\d]/g, ''); // Eliminar cualquier caracter que no sea número
          setCantidadProducto(numericValue);
        }}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descuento del Producto:</Text>
      <TextInput
        style={styles.input}
        value={descuentoProducto}
        onChangeText={text => setDescuentoProducto(text)}
      />
      <Text style={styles.label}>Ubicacion:</Text>
      <TextInput
        style={styles.input}
        value={ubicacion}
        onChangeText={text => setUbicacion(text)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registrarButton}
          onPress={subirProducto}>
          <Text style={styles.registrarText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.salirButton}>
          <Text style={styles.salirText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 20,
  },
  imagePreviewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  registrarButton: {
    flex: 1,
    backgroundColor: '#4CAF50', // verde para el botón de registrar
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  registrarText: {
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

export default RegistroProducto;
