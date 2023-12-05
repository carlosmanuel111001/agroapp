import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, Alert, Image} from 'react-native';
import {Appbar, Card, Title, Paragraph, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const ListaProductos = ({route, navigation}) => {
  const agricultorId = route.params.agricultorId; // Asumiendo que pasas el ID del agricultor a través de la navegación.

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Productos')
      .where('userId', '==', agricultorId)
      .onSnapshot(querySnapshot => {
        const productosData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProductos(productosData);
      });

    return () => unsubscribe();
  }, [agricultorId]);

  const handleEliminarAgricultor = async () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este agricultor y todos sus productos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              // Iniciar una transacción de Firestore
              const batch = firestore().batch();

              // Eliminar todos los productos asociados al agricultor
              const productosRef = firestore().collection('Productos');
              const productosSnapshot = await productosRef
                .where('userId', '==', agricultorId)
                .get();

              productosSnapshot.forEach(doc => {
                batch.delete(productosRef.doc(doc.id));
              });

              // Eliminar el agricultor
              const agricultorRef = firestore()
                .collection('Agricultores')
                .doc(agricultorId);
              batch.delete(agricultorRef);

              // Confirmar la transacción
              await batch.commit();

              // Regresar a la pantalla anterior
              navigation.goBack();
            } catch (error) {
              console.error(
                'Error al eliminar el agricultor y sus productos:',
                error,
              );
              Alert.alert(
                'Error',
                'No se pudo eliminar el agricultor y sus productos.',
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  const confirmarEliminacion = () => {
    Alert.alert(
      'Eliminar Agricultor',
      'Un agricultor se debe eliminar solo si incumplió las reglas y publicó productos indebidos. ¿Estás seguro de eliminar a este agricultor?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Sí', onPress: handleEliminarAgricultor},
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Lista de Productos" />
      </Appbar.Header>
      <FlatList
        data={productos}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Image source={{uri: item.imagen}} style={styles.image} />

              <View style={styles.textContainer}>
                <Title style={styles.title}>{item.nombreProducto}</Title>
                <Paragraph style={styles.paragraph}>
                  Precio: ${item.precioProducto}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  Descuento: {item.descuentoProducto}%
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  Tipo: {item.tipoProducto}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  Cantidad disponible: {item.cantidadProducto}
                </Paragraph>
                <Paragraph>
                  Fecha de Vencimiento:
                  {item.fechaVencimiento &&
                    new Date(
                      item.fechaVencimiento._seconds * 1000,
                    ).toLocaleDateString()}
                </Paragraph>

                {item.promoDescription &&
                item.promoDescription.descripcionPromocion ? (
                  <Paragraph style={styles.promoText}>
                    Promoción: {item.promoDescription.descripcionPromocion}
                  </Paragraph>
                ) : null}
              </View>
            </Card.Content>
          </Card>
        )}
      />
      <Button
        mode="contained"
        color="red"
        onPress={confirmarEliminacion}
        style={styles.buttonEliminar}>
        Eliminar Agricultor
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    backgroundColor: '#4CAF50',
  },
  card: {
    margin: 10,
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 3,
  },
  promoText: {
    fontSize: 14,
    color: '#FF5722', // Un color rojizo para resaltar la promoción
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonEliminar: {
    margin: 16,
  },
});

export default ListaProductos;
