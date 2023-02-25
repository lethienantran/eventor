import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
const Logo = ({onPress, title ='eventor', hasBack = false, hasEdit = false}) => {
  return (
    <View style={styles.root}>
      {hasBack ? (<Feather name='chevron-left' style={styles.backIcon} onPress={onPress}/>) : null}
      <Text style={styles.title}>{title}</Text>
      {hasEdit ? (<Feather name='edit' style={styles.editIcon}/>) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '9%',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  title: {
    fontSize: RFPercentage(4.5),
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
  },
  backIcon:{
    position:'absolute',
    left:0,
    fontSize: RFPercentage(3),
    color: 'black',
  },
  editIcon:{
    position:'absolute',
    right:0,
    fontSize:RFPercentage(3),
    color:'black',
  },
});

export default Logo;
