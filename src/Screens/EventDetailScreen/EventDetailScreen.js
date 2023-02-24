import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { ScaledSheet } from 'react-native-size-matters';
import { RFPercentage } from 'react-native-responsive-fontsize';
const {height, width} = Dimensions.get('window');

const AddEventScreen = () => {

  const onBackPressed = () =>{

  };

  const onEditPressed = () =>{

  };

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  return (
    <View style={styles.root}>

    </View>
  );
};

const styles = StyleSheet.create({
  root:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFF',
  },
});
export default AddEventScreen;
