import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

const DetalleMensaje = ({navigation, route}) => {
  const {chatId, name} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [consumerImageUrl, setConsumerImageUrl] = useState(null);

  useEffect(() => {
    const fetchConsumerImage = async () => {
      try {
        const chatRef = await firestore().collection('chats').doc(chatId).get();
        const chatData = chatRef.data();

        const consumerRef = await database()
          .ref(`consumidores/${chatData.consumidorId}`)
          .once('value');
        const consumerData = consumerRef.val();

        if (consumerData && consumerData.imagen) {
          setConsumerImageUrl(consumerData.imagen);
        } else {
          console.warn(
            `No se encontró la imagen del consumidor con ID: ${chatData.consumidorId}`,
          );
        }
      } catch (error) {
        console.error(
          'Error al obtener la imagen del consumidor:',
          error.message,
        );
      }
    };

    fetchConsumerImage();

    const messagesRef = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp');

    const unsubscribe = messagesRef.onSnapshot(querySnapshot => {
      const messagesData = querySnapshot.docs.map(doc => doc.data());
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        await firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            text: newMessage,
            timestamp: firestore.FieldValue.serverTimestamp(),
            sender: 'agricultor', // O el ID del agricultor si lo tienes
          });
        setNewMessage('');
      } catch (err) {
        console.error('Error al enviar mensaje:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat con {name}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageRow,
              item.sender === 'agricultor'
                ? styles.rightMessage
                : styles.leftMessage,
            ]}>
            {item.sender !== 'agricultor' &&
              consumerImageUrl && ( // Verifica que consumerImageUrl no sea nulo
                <Image
                  source={{uri: consumerImageUrl}}
                  style={styles.userImage}
                />
              )}
            <View
              style={[
                styles.messageBubble,
                item.sender === 'agricultor'
                  ? styles.rightBubble
                  : styles.leftBubble,
              ]}>
              <Text style={styles.messageText}>
                {item.sender}: {item.text}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe tu respuesta..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#5DDCAE',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '70%',
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#5DDCAE',
  },
  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#5DDCAE',
    padding: 10,
    borderRadius: 20,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rightMessage: {
    justifyContent: 'flex-end',
  },
  leftMessage: {
    justifyContent: 'flex-start',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
});

export default DetalleMensaje;
