import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Appbar, Card, Title, Paragraph, Searchbar} from 'react-native-paper';
import database from '@react-native-firebase/database';

const ListaConsumidores = ({navigation}) => {
  const [consumidores, setConsumidores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConsumidores, setFilteredConsumidores] = useState([]);

  useEffect(() => {
    const onValueChange = database()
      .ref('/consumidores')
      .on('value', snapshot => {
        const data = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              key,
              ...snapshot.val()[key],
            }))
          : [];
        setConsumidores(data);
        setFilteredConsumidores(data);
      });

    return () => database().ref('/consumidores').off('value', onValueChange);
  }, []);

  const onChangeSearch = query => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const data = consumidores.filter(consumidor => {
      return (
        consumidor.nombre.toLowerCase().includes(formattedQuery) ||
        (consumidor.apellidos &&
          consumidor.apellidos.toLowerCase().includes(formattedQuery))
      );
    });
    setFilteredConsumidores(data);
  };

  const handleConsumidorPress = consumidorId => {
    navigation.navigate('DetallesConsumidor', {consumidorId});
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content
          title="Lista de Consumidores"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>
      <Searchbar
        placeholder="Buscar consumidor"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchInput}
      />
      <Text style={styles.totalCounter}>
        Total de Consumidores: {filteredConsumidores.length}
      </Text>
      <FlatList
        data={filteredConsumidores}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleConsumidorPress(item.key)}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Image
                  source={{
                    uri: item.imagen || 'your_default_placeholder_image_url',
                  }}
                  style={styles.image}
                />
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
    backgroundColor: '#f0f0f0',
  },
  appbarTitle: {
    alignSelf: 'center',
  },
  searchInput: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: 'white',
    elevation: 3,
  },
  totalCounter: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  card: {
    margin: 10,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paragraph: {
    fontSize: 14,
    color: '#666',
  },
});

export default ListaConsumidores;
