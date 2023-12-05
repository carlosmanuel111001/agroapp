import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {Modal} from 'react-native';

// Políticas de Uso
const policiesText = `
Políticas de Uso de [AgroApp]

Introducción:

[AgroApp] conecta a agricultores con consumidores, facilitando la compra y venta de productos agrícolas. Estas políticas están diseñadas para asegurar un ambiente seguro, respetuoso y eficiente para todos los usuarios.

1. Comunicación a través del Chat:

Respeto mutuo: Se espera que todos los usuarios se comuniquen con respeto y cortesía.
Prohibición de lenguaje ofensivo: No se tolerará el uso de lenguaje ofensivo, amenazante o discriminatorio.

2. Pago y Transacciones:

Método de Pago: Actualmente, aceptamos pagos a través de PayPal.
Seguridad en el Pago: Los usuarios deben seguir las políticas de seguridad de PayPal y [AgroApp].

3. Entrega de Productos:

Acuerdo de Entrega: La entrega de productos se acuerda entre el agricultor y el consumidor a través del chat de la aplicación.
Políticas de Entrega: [AgroApp] no se hace responsable de los acuerdos de entrega. Estos deben ser claros y mutuamente acordados.

4. Calificaciones y Comentarios:

Honestidad y Precisión: Se espera que las calificaciones y comentarios reflejen honestamente la experiencia del usuario.
Prohibición de Comentarios Indebidos: No se permiten comentarios abusivos, ofensivos o difamatorios. La violación de esta política puede resultar en la eliminación del comentario o en la suspensión del usuario.

5. Publicación de Productos:

Contenido Adecuado: Los productos publicados deben ser apropiados y legales.
Prohibición de Productos Indebidos: La publicación de productos ilegales, peligrosos o inapropiados resultará en la eliminación del producto y posibles acciones legales.

6. Resolución de Disputas:

Asistencia de [AgroApp]: En caso de disputas, [AgroApp] puede proporcionar asistencia para llegar a una resolución.
Decisión Final: Las decisiones tomadas por [AgroApp] en relación con disputas serán finales.

7. Cambios en las Políticas:

Actualizaciones: [AgroApp] se reserva el derecho de actualizar estas políticas en cualquier momento.
Notificación de Cambios: Los cambios serán comunicados a los usuarios a través de los canales apropiados.

8. Contacto y Soporte:

Soporte al Usuario: Para cualquier consulta o necesidad de soporte, los usuarios pueden contactar a AgroApp] a través de [método de contacto].
`;

const PantallaRol = () => {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPolicyModalVisible, setIsPolicyModalVisible] = useState(false);

  // Función para mostrar el modal de políticas
  const showPolicyModal = () => {
    setIsPolicyModalVisible(true);
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authUser => {
      setIsAuthenticated(!!authUser);
    });

    return subscriber; // desuscripción en desmontaje
  }, []);
  //Funcion Para el registro de agricultor
  const handleAgricultorPress = () => {
    navigation.navigate('Agricultor', {
      screen: 'InicioSesionAgricultor',
      params: {userRole: 'agricultor'},
    });
  };
  //Funcion para el registro de consumidor
  const handleConsumidorPress = () => {
    navigation.navigate('Consumidor', {
      screen: 'InicioSesionConsumidor',
      params: {userRole: 'consumidor'},
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a AgroApp!</Text>
      <Text style={styles.description}>Elige tu rol para continuar</Text>

      <TouchableOpacity
        style={styles.choiceBox}
        onPress={handleAgricultorPress}>
        <Image
          source={require('../assets/agricultor.png')}
          style={styles.icon}
        />
        <Text style={styles.choiceText}>Agricultor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.choiceBox}
        onPress={handleConsumidorPress}>
        <Image
          source={require('../assets/consumidor.png')}
          style={styles.icon}
        />
        <Text style={styles.choiceText}>Consumidor</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showPolicyModal}>
        <Text style={styles.policyLinkText}>Ver Políticas de Uso</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPolicyModalVisible}
        onRequestClose={() => {
          setIsPolicyModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.policyText}>{policiesText}</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsPolicyModalVisible(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  policyText: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    // Estilos para el texto dentro del modal
    fontSize: 16, // Tamaño de fuente
    lineHeight: 24, // Espacio entre líneas
    color: '#333', // Color del texto
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  policyLinkText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 20, // Ajusta este valor para controlar la distancia desde la parte superior
    alignSelf: 'flex-end', // Para alinear a la derecha
  },
});

export default PantallaRol;
