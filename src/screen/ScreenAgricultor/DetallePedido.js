import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import firebase from '@react-native-firebase/app';

const DetallePedido = ({navigation}) => {
  const route = useRoute();
  const currentData = route.params?.currentData;
  const [docData, setDocData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await firebase
          .firestore()
          .collection('orders')
          .doc(currentData.id)
          .get();
        if (doc.exists) setDocData(doc.data());
        else console.warn('No such document!');
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchData();
  }, [currentData.id]);

  const updateOrderStatus = async status => {
    try {
      await firebase
        .firestore()
        .collection('orders')
        .doc(currentData.id)
        .update({estado: status});
      const message =
        status === 'aceptado' ? 'Pedido Aceptado' : 'Pedido Rechazado';
      Alert.alert(message, `El pedido ha sido ${status}`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert(
        'Error',
        `Hubo un error al ${status} el pedido. Por favor intenta de nuevo.`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} orderId={currentData?.id} />
      <ClientData
        clientInfo={currentData?.agricultorInfo}
        orderDate={currentData?.date}
      />
      <ProductList cartItems={currentData?.cartItems} />
      <ActionButtons
        onAccept={() => updateOrderStatus('aceptado')}
        onDecline={() => updateOrderStatus('rechazado')}
      />
    </View>
  );
};

const Header = ({navigation, orderId}) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.iconContainer}>
      <Image
        source={require('../assets/regreso.png')}
        style={styles.iconImage}
      />
    </TouchableOpacity>
    <Text style={styles.header}>Pedido: {orderId}</Text>
  </View>
);

const ClientData = ({clientInfo, orderDate}) => (
  <>
    <DataContainer label="Cliente:" data={clientInfo?.nombre} />
    <DataContainer
      label="Fecha:"
      data={new Date(orderDate?.seconds * 1000).toLocaleDateString()}
    />
  </>
);

const ProductList = ({cartItems}) => (
  <>
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderCell}>Cód</Text>
      <Text style={styles.tableHeaderCell}>Cant</Text>
      <Text style={styles.tableHeaderCell}>Prod</Text>
      <Text style={styles.tableHeaderCell}>P. Unit.</Text>
      <Text style={styles.tableHeaderCell}>Desc.</Text>
      <Text style={styles.tableHeaderCell}>Total</Text>
    </View>
    {cartItems &&
      cartItems.map((producto, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{producto.codigoProducto}</Text>
          <Text style={styles.tableCell}>{producto.cantidadSeleccionada}</Text>
          <Text style={styles.tableCell}>{producto.nombreProducto}</Text>
          <Text style={styles.tableCell}>${producto.precioProducto}</Text>
          <Text style={styles.tableCell}>${producto.descuentoProducto}</Text>
          <Text style={styles.tableCell}>
            $
            {producto.cantidadSeleccionada * producto.precioProducto -
              producto.descuentoProducto}
          </Text>
        </View>
      ))}
  </>
);

const ActionButtons = ({onAccept, onDecline}) => (
  <View style={styles.buttonsContainer}>
    <Button
      action={onAccept}
      style={styles.acceptButton}
      title="Aceptar Pedido"
    />
    <Button
      action={onDecline}
      style={styles.declineButton}
      title="Rechazar Pedido"
    />
  </View>
);

const Button = ({action, style, title}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={action}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const DataContainer = ({label, data}) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoData}>{data}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff', // Fondo blanco para la vista completa
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Color oscuro para el encabezado
    textAlign: 'center', // Esto centrará el texto del encabezado
    flex: 1, // Esto hace que el texto ocupe todo el espacio disponible entre el ícono y el borde derecho
  },
  clientDataContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#555', // Color gris oscuro para las etiquetas
  },
  data: {
    fontSize: 16,
    color: '#555', // Color gris oscuro para los datos
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0', // Fondo gris claro para el encabezado
    paddingVertical: 5,
    marginTop: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c0c0c0', // Color gris para el borde entre filas
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 0.5,
    borderColor: '#c0c0c0', // Color gris para el borde entre celdas
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 0.5,
    borderColor: '#c0c0c0', // Color gris para el borde entre celdas
    textAlign: 'center',
    color: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    position: 'absolute', // Hacemos que la posición sea absoluta
    bottom: 10, // Los colocamos cerca del borde inferior
    left: 10, // Un pequeño margen izquierdo
    right: 10, // Un pequeño margen derecho
  },

  button: {
    padding: 15,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10, // Margin entre los botones
    borderRadius: 10, // Esquinas redondeadas
    elevation: 2, // Da la impresión de elevación para Android
  },

  acceptButton: {
    backgroundColor: '#4CAF50', // Un verde para el botón de aceptar
  },

  declineButton: {
    backgroundColor: '#FF5252', // Un rojo para el botón de rechazar
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5', // Fondo gris claro para dar contraste
    padding: 15,
    borderRadius: 10, // Bordes redondeados
    marginBottom: 15,
    elevation: 2, // Sombra ligera para dar efecto de elevación
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },

  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 10,
  },

  infoData: {
    fontSize: 18,
    color: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Esto alinea verticalmente el icono y el texto
    justifyContent: 'space-between', // Esto hará que el ícono y el texto se separen al máximo
    marginBottom: 20,
  },

  iconContainer: {
    marginRight: 10, // Espacio entre el icono y el texto del encabezado
    padding: 5, // Un ligero padding para hacer el área táctil más grande
  },

  iconImage: {
    width: 24, // Define un tamaño fijo para el icono. Ajusta según la apariencia que quieras
    height: 24,
    tintColor: '#333', // Esto cambiará el color del icono, suponiendo que tu icono sea de un solo color y transparente. Ajusta el color según lo necesites
    resizeMode: 'contain',
    marginTop: -15, // Desplaza el ícono un poco hacia arriba
  },
});

export default DetallePedido;
