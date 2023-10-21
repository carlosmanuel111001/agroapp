import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const DebitCardPaymentScreen = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      Alert.alert(
        'Confirmación',
        'Tu pago está siendo procesado. Recibirás una notificación de confirmación.',
      );
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Pago con Tarjeta de Débito</Text>

        <Text style={styles.label}>Destinatario:</Text>
        <TextInput value="Carlos Fuentes" style={styles.input} />

        <Text style={styles.label}>Producto:</Text>
        <TextInput value="Pera" style={styles.input} />

        <View style={styles.totalContainer}>
          <Text style={styles.label}>Total a Pagar:</Text>
          <Text style={styles.totalAmount}>$375.00</Text>
        </View>

        <View style={styles.divider}></View>

        <Text style={styles.label}>Datos de la Tarjeta</Text>
        <TextInput
          placeholder="Número de Tarjeta"
          keyboardType="number-pad"
          style={styles.input}
        />

        <View style={styles.cardDetailsContainer}>
          <TextInput
            placeholder="MM/AA"
            keyboardType="number-pad"
            style={[styles.input, styles.dateInput]}
          />
          <TextInput
            placeholder="CVV"
            keyboardType="number-pad"
            style={[styles.input, styles.cvvInput]}
          />
        </View>

        <TextInput placeholder="Nombre en la Tarjeta" style={styles.input} />

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isProcessing}>
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Procesando...' : 'Realizar Pago'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Toda la información es encriptada y transmitida de forma segura.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F8F9FD',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3B3F5C',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B3F5C',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#D0D0D5',
    marginVertical: 20,
    width: '100%',
  },
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
  },
  cvvInput: {
    flex: 1,
    marginLeft: 10,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
    color: '#8D8D9D',
  },
});

export default DebitCardPaymentScreen;
