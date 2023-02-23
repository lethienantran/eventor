import {View, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const EditTaskScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  return (
    <View>
      <Text>EditTaskScreen</Text>
    </View>
  );
};

export default EditTaskScreen;
