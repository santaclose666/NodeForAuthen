import messaging from '@react-native-firebase/messaging';

export const topicForAll = () => {
  messaging()
    .subscribeToTopic('testNotifi')
    .then(() => console.log('Subscribed to testNotifi topic!'));
};

export const subcribeWorkUnitTopic = name => {
  messaging()
    .subscribeToTopic(name)
    .then(() => console.log(`Subscribed to ${name} topic!`));
};
export const unSubcribeWorkUnitTopic = name => {
  messaging()
    .unsubscribeFromTopic(name)
    .then(() => console.log(`unSubscribed to ${name} topic!`));
};
