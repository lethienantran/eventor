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
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Pressable style={styles.backButton} onPress={onBackPressed}>
            <Entypo
              name="chevron-left"
              style={styles.backIcon}
              color={'#000'}
            />
          </Pressable>
          <Text style={styles.logoText}>eventor</Text>
          <Pressable style={styles.editButton} onPress={onEditPressed}>
            <Feather
              name="edit"
              style={styles.editIcon}
              color={'#000'}
            />
          </Pressable>
        </View>
        <View style={styles.eventBannerContainer}>

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
    backgroundColor:'#FFF',
  },
  contentContainer:{
    width: width - 50,
    height: height,
    flexDirection:'column',
  },
  headerContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    height:80,
  },
  backButton:{
    height:36,
    width:36,
    justifyContent:'center',
    alignItems:'center',
  },
  backIcon:{
    fontSize:20,
  },
  logoText:{
    fontSize: RFPercentage(4),
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
  },
  editButton:{
    height:36,
    width:36,
    justifyContent:'center',
    alignItems:'center',
  },
  editIcon:{
    fontSize:20,
  },
  eventBannerContainer:{
    width:'100%',
    height: 113,
    borderRadius:20,
    backgroundColor:'#EEEEEE',
  },
});
export default AddEventScreen;
