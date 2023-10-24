import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Modal,
  Image,
} from 'react-native';
import bacLogo from '../assets/master.png';
import Bac from '../assets/Bac.png';
import fise from '../assets/fise.png';
import banpro from '../assets/banpro.png';

const DebitCardPaymentScreen = ({route}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const {totalCost} = route.params;

  const handlePayment = () => {
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
    const cvvRegex = /^\d{3}$/;

    if (
      !cardNumberRegex.test(cardNumber) ||
      !expiryDateRegex.test(expiryDate) ||
      !cvvRegex.test(cvv)
    ) {
      Alert.alert('Error', 'Por favor, ingresa datos válidos.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      Alert.alert('Confirmación', 'Pago Realizado');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <ImageBackground source={bacLogo} style={styles.imageBackground}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={Bac} style={styles.image} />
            <Image source={banpro} style={styles.image} />
            <Image source={fise} style={styles.image} />
            <Image source={bacLogo} style={styles.image} />
          </View>

          <Text style={styles.title}>Pago con Tarjeta</Text>
          <Text style={styles.label}>Destinatario:</Text>
          <TextInput value="Carlos Fuentes" style={styles.input} />

          <View style={styles.totalContainer}>
            <Text style={styles.label}>Total a Pagar:</Text>
          </View>
          <Text style={styles.totalAmount}>C$ {totalCost}</Text>

          <View style={styles.divider}></View>
          <Text style={styles.label}>Datos de la Tarjeta</Text>
          <TextInput
            placeholder="Número de Tarjeta"
            keyboardType="number-pad"
            style={styles.input}
            value={cardNumber}
            onChangeText={setCardNumber}
            maxLength={16}
          />
          <View style={styles.cardDetailsContainer}>
            <TextInput
              placeholder="MM/AA"
              keyboardType="number-pad"
              style={[styles.input, styles.dateInput]}
              value={expiryDate}
              onChangeText={setExpiryDate}
              maxLength={5}
            />
            <TextInput
              placeholder="CVV"
              keyboardType="number-pad"
              style={[styles.input, styles.cvvInput]}
              value={cvv}
              onChangeText={setCvv}
              maxLength={3}
            />
          </View>
          <TextInput placeholder="Nombre en la Tarjeta" style={styles.input} />
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            disabled={isProcessing}>
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.payButtonText}>Realizar Pago</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.footer}>
            Toda la información es encriptada y transmitida de forma segura.
          </Text>
        </View>
      </ScrollView>

      {isProcessing && (
        <Modal
          transparent={true}
          animationType="none"
          visible={isProcessing}
          onRequestClose={() => {}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        </Modal>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollView: {
    backgroundColor: 'rgba(0,0,0,0.4)',
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
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginHorizontal: 5,
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
