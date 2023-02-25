import {View, Text, Pressable} from 'react-native';
import React from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import { RFPercentage } from 'react-native-responsive-fontsize';

const CustomButton = ({onPress, type, text}) => {
  return (
      <Pressable onPress={onPress}
                    style={[styles.ButtonContainer,
                    styles[type + 'ButtonContainer']]}>
        <Text style={styles.ButtonText}>{text}</Text>
      </Pressable>
  )
}

const styles = ScaledSheet.create({
  ButtonContainer:{
    backgroundColor:'#FF3008',
    borderRadius:'50@ms',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  AddButtonContainer:{
    width:'50%',
    height:'50%',
  },
  UpdateButtonContainer:{
    width:'60%',
    height:'50%',
  },
  ButtonText:{
    fontSize:RFPercentage(3.5),
    color:'white',
  },
});
export default CustomButton;
