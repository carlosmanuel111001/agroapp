import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const DatosRegistro = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [imageData, setImageData] = useState(null);
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmContraseña, setConfirmContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const navigation = useNavigation();

  const handleRegistro = async () => {
    try {
      // Validaciones
      if (
        nombre === '' ||
        apellidos === '' ||
        correo === '' ||
        contraseña === '' ||
        confirmContraseña === '' ||
        contraseña !== confirmContraseña
      ) {
        alert(
          'Por favor, complete todos los campos y asegúrese de que las contraseñas coincidan.',
        );
        return;
      }

      // Validación de correo electrónico
      if (!isValidEmail(correo)) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return;
      }

      // Validación de longitud mínima de contraseña
      if (contraseña.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
      }

      // Validación de formato de teléfono
      if (!isValidPhoneNumber(telefono)) {
        alert(
          'Por favor, ingrese un número de teléfono en el formato +505 1234-5678',
        );
        return;
      }

      // Verificar si el correo electrónico ya está en uso
      const userExists = await auth().fetchSignInMethodsForEmail(correo);

      if (userExists && userExists.length > 0) {
        // El correo electrónico ya está en uso
        alert(
          'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.',
        );
        return;
      }

      // Registro de usuario con Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        correo,
        contraseña,
      );
      const user = userCredential.user;

      // Guardar datos adicionales en Firebase Database
      await database()
        .ref(`agricultores/${user.uid}`)
        .set({
          nombre,
          apellidos,
          imagen: imageData,
          correo,
          telefono,
          direccion,
          descripcion,
          rol: 'agricultor',
        })
        .catch(error => {
          console.error('Error al guardar datos en la base de datos:', error);
        });
      alert('Registro exitoso!');
      navigation.navigate('InicioSesion');
    } catch (error) {
      console.error('Error al registrar:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert(
          'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.',
        );
      } else {
        alert('Hubo un error al registrarse. Inténtelo de nuevo.');
      }
    }
  };
  // Función para validar el formato de correo electrónico
  const isValidEmail = email => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  // Función para validar el formato del número de teléfono de Nicaragua
  const isValidPhoneNumber = phone => {
    const phoneRegex = /^\+505 \d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  // Función para abrir el seleccionador de imágenes
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

        const uniqueFileName = `${Date.now()}.jpg`;

        const reference = storage().ref(`agricultores/${uniqueFileName}`);
        await reference.putString(
          `data:image/jpeg;base64,${imageBase64}`,
          'data_url',
        );

        const imageUrl = await reference.getDownloadURL();
        setImageData(imageUrl);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Registro Agricultor</Text>

        <View style={styles.group}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tus apellidos"
            value={apellidos}
            onChangeText={setApellidos}
          />
        </View>
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

        <View style={styles.group}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 8 caracteres"
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite tu contraseña"
            value={confirmContraseña}
            onChangeText={setConfirmContraseña}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="+505 1234-5678"
            value={telefono}
            onChangeText={setTelefono}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Calle Ejemplo, #123"
            value={direccion}
            onChangeText={setDireccion}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.inputMulti}
            placeholder="Cuenta algo sobre ti o tu granja..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegistro}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('InicioSesion')}>
          <Text style={styles.linkText}>
            ¿Ya tienes una cuenta? Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#EAEDED',
  },
  container: {
    padding: 25,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
    textAlign: 'center',
  },
  group: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#7F8C8D',
    borderWidth: 1,
    fontSize: 16,
  },
  inputMulti: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#7F8C8D',
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 15,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  imageButton: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreviewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: '#7F8C8D',
    borderWidth: 1,
  },
});

export default DatosRegistro;
