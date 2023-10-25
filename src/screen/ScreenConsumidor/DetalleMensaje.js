import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import firebase from '@react-native-firebase/app';

const DetalleMensaje = ({route}) => {
  const {agricultorId, consumerId} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Generamos un identificador único para el chat basado en los IDs de los usuarios.
  const chatId =
    agricultorId < consumerId
      ? agricultorId + consumerId
      : consumerId + agricultorId;

  useEffect(() => {
    const firestore = firebase.firestore();

    // Escuchar los mensajes de la base de datos para este chat en tiempo real.
    const unsubscribe = firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

    // Limpiamos la suscripción al salir del componente.
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const firestore = firebase.firestore();
    firestore.collection('chats').doc(chatId).collection('messages').add({
      text: newMessage,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.messageBox}>
            <Text>{item.text}</Text>
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
        <Button title="Enviar" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageBox: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
});

export default DetalleMensaje;
