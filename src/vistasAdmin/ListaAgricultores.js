import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import {Appbar, Card, Title, Paragraph} from 'react-native-paper';
import database from '@react-native-firebase/database';

const ListaAgricultores = ({navigation}) => {
  const [agricultores, setAgricultores] = useState([]);
  const [filteredAgricultores, setFilteredAgricultores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onValueChange = database()
      .ref('/agricultores')
      .on('value', snapshot => {
        const data = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              key,
              ...snapshot.val()[key],
            }))
          : [];
        setAgricultores(data);
        setFilteredAgricultores(data);
      });

    // Detach listener on cleanup
    return () => database().ref('/agricultores').off('value', onValueChange);
  }, []);

  useEffect(() => {
    const filteredData = searchQuery
      ? agricultores.filter(agricultor => {
          const agricultorData = `${agricultor.nombre.toUpperCase()} ${agricultor.apellidos.toUpperCase()}`;
          return agricultorData.includes(searchQuery.toUpperCase());
        })
      : agricultores;
    setFilteredAgricultores(filteredData);
  }, [agricultores, searchQuery]);

  const handleAgricultorPress = agricultorId => {
    navigation.navigate('DetallesAgricultor', {agricultorId});
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content
          title="Lista de Agricultores"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>
      <TextInput
        placeholder="Buscar agricultor..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        style={styles.searchInput}
      />
      <Text style={styles.totalCounter}>
        Total de Agricultores: {filteredAgricultores.length}
      </Text>
      <FlatList
        data={filteredAgricultores}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleAgricultorPress(item.key)}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Image
                  source={{uri: item.imagen || undefined}}
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
                  <Paragraph style={styles.paragraph}>
                    {item.direccion}
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
    alignSelf: 'center', // Centra el título en la AppBar
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

export default ListaAgricultores;
