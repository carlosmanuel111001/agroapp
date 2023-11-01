import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Appbar, Card, Title, Paragraph} from 'react-native-paper';
import database from '@react-native-firebase/database';

const ListaConsumidores = ({navigation}) => {
  const [consumidores, setConsumidores] = useState([]);

  const handleConsumidorPress = consumidorId => {
    navigation.navigate('DetallesConsumidor', {consumidorId: consumidorId});
  };

  useEffect(() => {
    const onValueChange = database()
      .ref('/consumidores')
      .on('value', snapshot => {
        const data = [];
        snapshot.forEach(child => {
          data.push({
            key: child.key,
            ...child.val(),
          });
        });
        setConsumidores(data);
      });

    return () => database().ref('/consumidores').off('value', onValueChange);
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Lista de Consumidores" />
      </Appbar.Header>
      <FlatList
        data={consumidores}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleConsumidorPress(item.key)}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Image source={{uri: item.imagen}} style={styles.image} />
                <View style={styles.textContainer}>
                  <Title style={styles.title}>
                    {item.nombre} {item.apellidos}
                  </Title>
                  <Paragraph style={styles.paragraph}>{item.correo}</Paragraph>
                  <Paragraph style={styles.paragraph}>
                    {item.telefono}
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    backgroundColor: '#4CAF50', // Mantengo el mismo color que proporcionaste, pero puedes cambiarlo si prefieres.
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    borderRadius: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  paragraph: {
    fontSize: 14,
    color: '#757575',
  },
});

export default ListaConsumidores;
