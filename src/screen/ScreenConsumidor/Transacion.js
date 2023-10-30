import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';

const Transaccion = () => {
  const route = useRoute();

  const agricultorID = route.params?.agricultorID;
  const totalEnDolares = route.params.totalCost;
  const agricultorEmail = route.params.agricultorEmail;
  const productNames = route.params.productNames;

  console.log(agricultorID);
  console.log(totalEnDolares);
  console.log(agricultorEmail);
  console.log(productNames);

  const urlPagoPayPal = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${agricultorEmail}&item_name=${productNames}&amount=${totalEnDolares}&currency_code=USD`;

  return (
    <View style={styles.container}>
      <WebView source={{uri: urlPagoPayPal}} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    marginTop: 20,
  },
});

export default Transaccion;
