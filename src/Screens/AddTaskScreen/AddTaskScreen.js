import {View, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const AddTaskScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  return (
    <View>
      <Text>AddTaskScreen</Text>
    </View>
  );
};

export default AddTaskScreen;
