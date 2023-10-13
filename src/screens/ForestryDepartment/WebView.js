import React from 'react';
import {WebView} from 'react-native-webview';

const Webview = ({route}) => {
  const link = route.params.link;

  return (
    <WebView
      source={{
        uri: link,
      }}
      style={{flex: 1}}
    />
  );
};

export default Webview;
