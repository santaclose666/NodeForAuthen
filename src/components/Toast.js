import React from 'react';
import {Toast, Box, Text} from 'native-base';

export const ToastWarning = message => {
  Toast.show({
    render: () => {
      return (
        <Box bg="danger.400" px="2" py="2" rounded="sm" mb={10}>
          <Text fontSize={18} color="white" fontFamily="SF-Pro-Display-Medium">
            {message}
          </Text>
        </Box>
      );
    },
  });
};

export const ToastSuccess = message => {
  Toast.show({
    render: () => {
      return (
        <Box bg="success.400" px="2" py="2" rounded="sm" mb={10}>
          <Text fontSize={18} color="white" fontFamily="SF-Pro-Display-Medium">
            {message}
          </Text>
        </Box>
      );
    },
  });
};

export const ToastAlert = message => {
  Toast.show({
    render: () => {
      return (
        <Box bg="yellow.400" px="2" py="2" rounded="sm" mb={10}>
          <Text
            textAlign={'center'}
            fontSize={18}
            color="white"
            fontFamily="SF-Pro-Display-Medium">
            {message}
          </Text>
        </Box>
      );
    },
  });
};
