import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const DebitCardPaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pago con Tarjeta de Débito</Text>

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

      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>Realizar Pago</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Toda la información es encriptada y transmitida de forma segura.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: 'white',
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
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
    color: '#777',
  },
});

export default DebitCardPaymentScreen;
