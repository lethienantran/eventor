import {View, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const EditEventScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  return (
    <View>
      <Text>EditEventScreen</Text>
    </View>
  );
};

export default EditEventScreen;
