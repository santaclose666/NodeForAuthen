import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const StactNavigator = () => {
  const dataNavigator = [];

  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{headerShown: false}}>
      {dataNavigator.map((item, index) => {
        return (
          <Stack.Screen
            key={index}
            name={item.name}
            component={item.component}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default StactNavigator;
