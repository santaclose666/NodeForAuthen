import messaging from '@react-native-firebase/messaging';

export const getToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log(token);

    return token;
  } catch (error) {
    console.log(error);
  }
};
