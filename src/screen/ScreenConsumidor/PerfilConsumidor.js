import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

const InfoCard = ({
  label,
  field,
  value,
  isEditing,
  setEditing,
  editData,
  setEditData,
  handleSave,
  editable = true,
}) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    {isEditing === field && editable ? ( // <-- Añadimos la condición editable aquí
      <View>
        <TextInput
          value={editData[field] ?? value}
          onChangeText={text =>
            setEditData(prevData => ({...prevData, [field]: text}))
          }
          style={styles.editableText}
        />
        <TouchableOpacity
          onPress={() => handleSave(field)}
          style={styles.buttonStyle}>
          <Text style={{color: '#fff'}}>Guardar</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity onPress={() => editable && setEditing(field)}>
        <Text
          style={isEditing === field ? styles.editingText : styles.cardValue}>
          {value}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const PerfilConsumidor = () => {
  const [data, setData] = useState(null);
  const [editData, setEditData] = useState({});
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const userId = auth().currentUser?.uid;

  const navigation = useNavigation();

  useEffect(() => {
    if (!userId) return;

    const ref = database().ref(`consumidores/${userId}`);
    const onValueChange = ref.on('value', snapshot => {
      setData(snapshot.val());
    });

    return () => ref.off('value', onValueChange);
  }, [userId]);
  const handleSave = async field => {
    if (!editData[field]) return;
    try {
      await database()
        .ref(`agricultores/${userId}`)
        .update({[field]: editData[field]});
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const selectAndUploadImage = async () => {
    launchImageLibrary({}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        setImage(source); // setea la imagen seleccionada para que se muestre en la UI
        const imageName = `${userId}_${Date.now()}.jpg`;
        const uploadUri =
          Platform.OS === 'ios'
            ? response.uri.replace('file://', '')
            : response.uri;
        const reference = storage().ref(`/profile_images/${imageName}`);

        try {
          setLoadingImage(true); // comenzamos el loading
          await reference.putFile(uploadUri);
          const imageURL = await reference.getDownloadURL();
          await database()
            .ref(`agricultores/${userId}`)
            .update({imagen: imageURL});
          setImage(null); // reseteamos el estado de image
        } catch (error) {
          console.error('Error uploading image: ', error);
        } finally {
          setLoadingImage(false); // finalizamos el loading
        }
      }
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require('../assets/regreso.png')}
            style={{width: 24, height: 24}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Perfil del Consumidor</Text>
        <View style={{width: 24}} />
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity onPress={selectAndUploadImage}>
          {image || data?.imagen ? (
            <Image
              source={image || {uri: data.imagen}}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text>Select Image</Text>
            </View>
          )}
          {loadingImage && <Text>Subiendo imagen...</Text>}
        </TouchableOpacity>
        <InfoCard
          label="Nombre"
          field="nombre"
          value={data?.nombre}
          isEditing={isEditing}
          setEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleSave={handleSave}
        />
        <InfoCard
          label="Apellidos"
          field="apellidos"
          value={data?.apellidos}
          isEditing={isEditing}
          setEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleSave={handleSave}
        />
        <InfoCard
          label="Correo"
          field="correo"
          value={data?.correo}
          isEditing={isEditing}
          setEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleSave={handleSave}
          editable={false}
        />
        <InfoCard
          label="Descripción de Preferencias"
          field="descripcion"
          value={data?.descripcion}
          isEditing={isEditing}
          setEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleSave={handleSave}
        />
        <InfoCard
          label="Dirección"
          field="direccion"
          value={data?.direccion}
          isEditing={isEditing}
          setEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleSave={handleSave}
        />
        <InfoCard
          label="Teléfono"
          field="telefono"
          value={data?.telefono}
          isEditing={isEditing}
          setEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleSave={handleSave}
        />
        <InfoCard
          label="Rol"
          field="rol"
          value={data?.rol}
          isEditing={isEditing}
          setEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleSave={handleSave}
          editable={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Añade esta línea
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#5DDCAE',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2, // añade una sombra en Android
    shadowOffset: {width: 0, height: 1}, // añade una sombra en iOS
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 10,
    borderColor: '#ddd', // añade un borde ligero
    borderWidth: 1,
  },
  buttonStyle: {
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  cardLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    color: '#333',
  },
  editingText: {
    fontSize: 16,
    color: '#FFA726', // un color que destaque cuando esté en modo de edición
  },
  editableText: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    color: '#4CAF50',
    textAlign: 'right',
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PerfilConsumidor;
