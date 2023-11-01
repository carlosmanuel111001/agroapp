import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Appbar, Card, Title, Paragraph} from 'react-native-paper';

const VistaAdmin = ({navigation}) => {
  const handleNavigateToDetails = type => {
    if (type === 'agricultores') {
      navigation.navigate('ListaAgricultores');
    } else if (type === 'consumidores') {
      navigation.navigate('ListaConsumidores');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Panel Administrador" subtitle="Bienvenido" />
        <Appbar.Action icon="cog-outline" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <TouchableOpacity
          onPress={() => handleNavigateToDetails('agricultores')}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Agricultores</Title>
              <Paragraph style={styles.cardDescription}>
                Visualiza y administra los agricultores registrados en la
                plataforma.
              </Paragraph>
            </Card.Content>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNavigateToDetails('consumidores')}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Consumidores</Title>
              <Paragraph style={styles.cardDescription}>
                Visualiza y administra los consumidores registrados en la
                plataforma.
              </Paragraph>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2ff',
  },
  header: {
    backgroundColor: '#4CAF50',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 20,
    color: '#344955',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4a4a4a',
  },
});

export default VistaAdmin;
