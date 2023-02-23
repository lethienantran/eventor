import {View, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const FilteredEventScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  return (
    <View>
      <Text>FilteredEventScreen</Text>
    </View>
  );
};

export default FilteredEventScreen;
