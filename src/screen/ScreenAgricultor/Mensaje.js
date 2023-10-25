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

import searchIcon from '../assets/visualizar.png';

const Mensaje = ({navigation, route}) => {
  const {userId} = route.params;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsQuery = await firestore()
          .collection('chats')
          .where('agricultorId', '==', userId)
          .get();

        const chatsData = [];
        for (const chat of chatsQuery.docs) {
          const messagesQuery = await chat.ref
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();
          const lastMessage = messagesQuery.docs[0]
            ? messagesQuery.docs[0].data()
            : null;

          chatsData.push({
            id: chat.id,
            consumidorId: chat.data().consumidorId,
            lastMessage: lastMessage ? lastMessage.text : 'Sin mensajes',
          });
        }

        setChats(chatsData);
        setLoading(false);
      } catch (err) {
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
          name: item.consumidorId,
          message: item.lastMessage,
          chatId: item.id,
        })
      }>
      <View style={styles.userImage}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
          {item.consumidorId[0].toUpperCase()}
        </Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>Consumidor: {item.consumidorId}</Text>
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
          <Text style={styles.headerText}>Mensaje</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Image source={searchIcon} style={styles.searchIcon} />
        <TextInput placeholder="Buscar..." style={styles.searchInput} />
      </View>
      <FlatList
        data={chats}
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
