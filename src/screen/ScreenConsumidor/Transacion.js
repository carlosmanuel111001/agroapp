import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');

  const handlePayment = () => {
    // Realiza la lógica de pago con PayPal aquí, utilizando la librería correspondiente

    // Divide el monto en 3% y 97%
    const totalAmount = parseFloat(amount);
    const commission = totalAmount * 0.03;
    const mainAccountAmount = totalAmount - commission;

    // Envía los montos a las cuentas correspondientes

    // Luego puedes navegar a la pantalla de confirmación o cualquier otra acción
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Realizar Pago</Text>
      <TextInput
        style={styles.input}
        placeholder="Monto Total"
        keyboardType="numeric"
        value={amount}
        onChangeText={text => setAmount(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email del destinatario del 3%"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pagar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentScreen;
