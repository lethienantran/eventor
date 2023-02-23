import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const {height, width} = Dimensions.get('window');

const AddEventScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'yellow',
  },
  contentContainer:{
    width: width - 50,
    height: height,
    flexDirection:'column',
    backgroundColor:'red',
  },
  headerContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    height:'10%',
    backgroundColor:'green',
  },
});
export default AddEventScreen;
