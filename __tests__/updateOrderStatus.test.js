import {updateOrderStatus} from '../src/functions/servicioOrden';
import {Alert} from 'react-native';
import firebase from '@react-native-firebase/app';

// Mock de Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock de firebase
jest.mock('@react-native-firebase/app', () => {
  const updateMock = jest.fn();
  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          update: updateMock,
        }),
      }),
    }),
    // Mock de la función update
    updateMock,
  };
});

describe('Actualizar estado del pedido', () => {
  const navigationMock = {
    goBack: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('llama a la actualización de Firestore con el estado correcto y muestra una alerta de éxito', async () => {
    // Configura los mocks
    const orderId = '123';
    const status = 'aceptado';
    const updateMock = firebase
      .firestore()
      .collection('orders')
      .doc(orderId).update;
    updateMock.mockResolvedValueOnce(); // Simula una resolución de la promesa

    // Ejecuta la función
    await updateOrderStatus(orderId, status, navigationMock);

    // Verificaciones
    expect(updateMock).toHaveBeenCalledWith({estado: status});
    expect(Alert.alert).toHaveBeenCalledWith(
      expect.any(String),
      `El pedido ha sido ${status}`,
      expect.arrayContaining([expect.objectContaining({text: 'OK'})]),
    );
    // Comprueba si la función de navegación se llama dentro de onPress
    // Esto depende de cómo se llame onPress en Alert.alert
    const onPressFunction = Alert.alert.mock.calls[0][2][0].onPress;
    onPressFunction();
    expect(navigationMock.goBack).toHaveBeenCalled();
  });

  it('muestra una alerta de error cuando falla la actualización de Firestore', async () => {
    // Configura los mocks
    const orderId = '123';
    const status = 'aceptado';
    const updateMock = firebase
      .firestore()
      .collection('orders')
      .doc(orderId).update;
    updateMock.mockRejectedValueOnce(new Error('Test error')); // Simula un error en la promesa

    // Ejecuta la función
    await updateOrderStatus(orderId, status, navigationMock);

    // Verificaciones
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      `Hubo un error al ${status} el pedido. Por favor intenta de nuevo.`,
    );
  });
});
