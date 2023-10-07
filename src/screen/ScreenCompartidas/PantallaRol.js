// PantallaRol.js

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PantallaRol = () => {
  const navigation = useNavigation();

  const handleAgricultorPress = () => {
    navigation.navigate('vistaPrincipal', {userRole: 'agricultor'});
  };

  const handleConsumidorPress = () => {
    navigation.navigate('InicioSesion', {userRole: 'consumidor'});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a AgroApp!</Text>
      <Text style={styles.description}>Elige tu rol para continuar</Text>

      <TouchableOpacity
        style={styles.choiceBox}
        onPress={handleAgricultorPress}>
        <Image source={require('../assets/emoji.png')} style={styles.icon} />
        <Text style={styles.choiceText}>Agricultor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.choiceBox}
        onPress={handleConsumidorPress}>
        <Image source={require('../assets/personal.png')} style={styles.icon} />
        <Text style={styles.choiceText}>Consumidor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  description: {
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
  },
  choiceBox: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  choiceText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default PantallaRol;
