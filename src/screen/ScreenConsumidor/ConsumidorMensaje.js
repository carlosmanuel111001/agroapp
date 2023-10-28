import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

import searchIcon from '../assets/visualizar.png';

const ConsumidorMensaje = ({navigation, route}) => {
  const userId = route.params.consumerId; // Cambiar el nombre de la variable si es necesario
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsRef = firestore().collection('chats');
        const chatsQuerySnapshot = await chatsRef
          .where('consumidorId', '==', userId)
          .get();

        const chatsData = [];
        const agricultorPromises = [];

        for (let doc of chatsQuerySnapshot.docs) {
          const chatData = doc.data();
          setChats(chatsData);

          const lastMessageSnapshot = await firestore()
            .collection('chats')
            .doc(doc.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

          let lastMessageText = 'Sin mensajes';

          if (!lastMessageSnapshot.empty) {
            const lastMessage = lastMessageSnapshot.docs[0].data();
            lastMessageText = lastMessage.text;
          }

          const agricultorPromise = database()
            .ref(`agricultores/${chatData.agricultorId}`)
            .once('value');

          agricultorPromises.push(agricultorPromise);

          chatsData.push({
            id: doc.id,
            agricultorId: chatData.agricultorId,
            lastMessage: lastMessageText,
          });
        }

        const agricultorSnapshots = await Promise.all(agricultorPromises);

        agricultorSnapshots.forEach((agricultorSnapshot, index) => {
          const agricultorData = agricultorSnapshot.val();
          if (agricultorData) {
            chatsData[index].agricultorName = agricultorData.nombre;
            chatsData[index].agricultorImage = agricultorData.imagen; // Utiliza la URL directamente
          } else {
            console.warn(
              `No se encontró el agricultor con ID: ${chatsData[index].agricultorId}`,
            );
          }
        });

        setChats(chatsData);
        setFilteredChats(chatsData); // Esto se añade para inicializar los chats filtrados
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los chats y/o imágenes:', err.message);
        setError(err);
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);
  // Esta función filtra los chats basándose en el nombre del agricultor
  useEffect(() => {
    if (searchTerm) {
      const filtered = chats.filter(chat =>
        chat.agricultorName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchTerm, chats]);

  if (loading) {
    return <ActivityIndicator size="large" color="#5DDCAE" />;
  }

  if (error) {
    return <Text>Error al obtener los chats: {error.message}</Text>;
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.chatItemContainer}
      onPress={() =>
        navigation.navigate('DetalleMensaje', {
          agricultorId: item.agricultorId,
          consumerId: userId,
          profileImage: item.agricultorImage,
        })
      }>
      <View style={styles.userImage}>
        <Image
          source={{uri: item.agricultorImage}}
          style={{width: 50, height: 50, borderRadius: 25}}
        />
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>Agricultor: {item.agricultorName}</Text>
        <Text style={styles.userMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/regreso.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Chats Agricultores</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Image source={searchIcon} style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar..."
          style={styles.searchInput}
          onChangeText={text => setSearchTerm(text)}
          value={searchTerm}
        />
      </View>
      <FlatList
        data={filteredChats} // Cambio de chats a filteredChats
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#5DDCAE',
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  backButton: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 25,
    alignItems: 'center',
    padding: 10,
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 5,
    fontSize: 16,
  },
  chatItemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5DDCAE',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userMessage: {
    color: 'gray',
    marginTop: 5,
    fontSize: 14,
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default ConsumidorMensaje;
