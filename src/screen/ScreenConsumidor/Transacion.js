import React from 'react';
import { WebView } from 'react-native-webview';

const WebViewComponent = () => {
  return (
    <WebView source={{ uri: 'http://192.168.1.16:3000' }} />
  );
};

export default WebViewComponent;
