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

const Mensaje = ({navigation, route}) => {
  const {userId} = route.params;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsRef = firestore().collection('chats');
        const chatsQuerySnapshot = await chatsRef
          .where('agricultorId', '==', userId)
          .get();

        const chatsData = [];
        const consumerPromises = [];

        for (let doc of chatsQuerySnapshot.docs) {
          const chatData = doc.data();

          // Obtener el último mensaje de la subcolección messages para este chat
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

          const consumerPromise = database()
            .ref(`consumidores/${chatData.consumidorId}`)
            .once('value');

          consumerPromises.push(consumerPromise);

          chatsData.push({
            id: doc.id,
            consumidorId: chatData.consumidorId,
            lastMessage: lastMessageText,
          });
        }

        const consumerSnapshots = await Promise.all(consumerPromises);

        consumerSnapshots.forEach((consumerSnapshot, index) => {
          const consumerData = consumerSnapshot.val();
          if (consumerData) {
            chatsData[index].consumidorName = consumerData.nombre;
            chatsData[index].consumidorImage = consumerData.imagen; // Utiliza la URL directamente
          } else {
            console.warn(
              `No se encontró el consumidor con ID: ${chatsData[index].consumidorId}`,
            );
          }
        });

        setChats(chatsData);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los chats y/o imágenes:', err.message);
        setError(err);
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

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
          name: item.consumidorName,
          message: item.lastMessage,
          chatId: item.id,
        })
      }>
      <View style={styles.userImage}>
        <Image
          source={{uri: item.consumidorImage}}
          style={{width: 50, height: 50, borderRadius: 25}}
        />
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>Consumidor: {item.consumidorName}</Text>
        <Text style={styles.userMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
  const filteredChats = chats.filter(chat => {
    if (!chat.consumidorName) return false;
    return chat.consumidorName.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          <Text style={styles.headerText}>Mensaje</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Image source={searchIcon} style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar..."
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
      </View>
      <FlatList
        data={filteredChats}
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
    elevation: 3, // para sombra en Android
    shadowOffset: {width: 0, height: 2}, // para sombra en iOS
    shadowOpacity: 0.2, // para sombra en iOS
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
    elevation: 2, // para sombra en Android
    shadowOffset: {width: 0, height: 1}, // para sombra en iOS
    shadowOpacity: 0.2, // para sombra en iOS
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

export default Mensaje;
