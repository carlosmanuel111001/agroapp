import firebase from '@react-native-firebase/app';
import {Alert} from 'react-native';

const updateOrderStatus = async (orderId, status, navigation) => {
  try {
    await firebase
      .firestore()
      .collection('orders')
      .doc(orderId)
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

export {updateOrderStatus};
