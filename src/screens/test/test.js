import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {getDayOfWeek} from '../../utils/serviceFunction';

export default Test = () => {
  useEffect(() => {
    getDayOfWeek();
  }, []);

  return <Text>Test</Text>;
};
