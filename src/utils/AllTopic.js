import messaging from '@react-native-firebase/messaging';

export const topicForAll = () => {
  messaging()
    .subscribeToTopic('allEvent')
    .then(() => console.log('Subscribed to allEvent topic!'));
};