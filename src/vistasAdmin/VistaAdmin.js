import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Appbar, Card, Title, Paragraph, IconButton} from 'react-native-paper';

const VistaAdmin = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Panel Administrador" subtitle="Bienvenido" />
        <Appbar.Action icon="cog-outline" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Usuarios Registrados</Title>
            <Paragraph>
              Visualiza y administra los usuarios registrados en la plataforma.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="arrow-right" onPress={() => {}} />
          </Card.Actions>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Reportes</Title>
            <Paragraph>
              Revisa los reportes y estadísticas de la aplicación.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="arrow-right" onPress={() => {}} />
          </Card.Actions>
        </Card>
        {/* Agrega más tarjetas o secciones según sea necesario */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
});

export default VistaAdmin;
