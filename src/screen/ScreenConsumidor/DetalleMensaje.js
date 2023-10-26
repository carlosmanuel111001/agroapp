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
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const DetalleMensaje = ({route}) => {
  const {agricultorId, consumerId, profileImage} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [agricultorImageUrl, setAgricultorImageUrl] = useState(null);

  // Generamos un identificador único para el chat basado en los IDs de los usuarios.
  const chatId =
    agricultorId < consumerId
      ? agricultorId + consumerId
      : consumerId + agricultorId;

  const firestore = firebase.firestore();

  useEffect(() => {
    // Escuchar los mensajes de la base de datos para este chat en tiempo real.
    const unsubscribe = firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

    // Obtener la imagen del agricultor
    const fetchAgricultorImage = async () => {
      try {
        const agricultorRef = await firebase
          .database()
          .ref(`agricultores/${agricultorId}`)
          .once('value');
        const agricultorData = agricultorRef.val();

        if (agricultorData && agricultorData.imagen) {
          setAgricultorImageUrl(agricultorData.imagen);
        } else {
          console.warn(
            `No se encontró la imagen del agricultor con ID: ${agricultorId}`,
          );
        }
      } catch (error) {
        console.error('Error al obtener la imagen del agricultor:', error);
      }
    };

    fetchAgricultorImage();

    // Limpiamos la suscripción al salir del componente.
    return () => unsubscribe();
  }, [chatId, firestore, agricultorId]);

  const handleSendMessage = async () => {
    if (!agricultorId || !consumerId || newMessage.trim() === '') {
      console.error('Algún valor es indefinido:', {
        agricultorId,
        consumerId,
        newMessage,
      });
      return;
    }

    try {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      await firestore
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          text: newMessage,
          timestamp: timestamp,
          sender: 'agricultor',
        });

      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageRow,
              item.sender === 'agricultor'
                ? styles.leftMessage // Cambia a leftMessage para mensajes del agricultor
                : styles.rightMessage, // Cambia a rightMessage para mensajes del consumidor
            ]}>
            {item.sender === 'agricultor' && agricultorImageUrl && (
              <Image
                source={{uri: agricultorImageUrl}}
                style={styles.userImage}
              />
            )}
            <View
              style={[
                styles.messageBubble,
                item.sender === 'agricultor'
                  ? styles.leftBubble // Cambia a leftBubble para mensajes del agricultor
                  : styles.rightBubble, // Cambia a rightBubble para mensajes del consumidor
                item.sender === 'agricultor' && agricultorImageUrl
                  ? styles.vistosoBubble // Agrega este estilo para mensajes del agricultor con imagen
                  : null, // No aplica estilo adicional a otros mensajes
              ]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
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
    marginHorizontal: 5,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    margin: 5,
    maxWidth: '80%',
  },
  rightBubble: {
    backgroundColor: '#e6e6e6',
  },
  leftBubble: {
    backgroundColor: '#a8e6cf',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#5DDCAE',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DetalleMensaje;
