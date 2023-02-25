import { View, Text, TextInput } from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters'
import {RFPercentage} from 'react-native-responsive-fontsize';

const CustomInputField = ({value, setValue, title, secureTextEntry, editable, selectTextOnFocus}) => {
  return (
    <View style={styles.root}>
      <Text style={styles.fieldTitle}>{title}</Text>
      <TextInput placeholder="" onChangeText={setValue} 
                  value={value} 
                  style={styles.inputField} 
                  numberOfLines={1} 
                  secureTextEntry = {secureTextEntry}
                  editable ={editable}
                  selectTextOnFocus = {selectTextOnFocus}/>
    </View>
  )
}

const styles = ScaledSheet.create({
    root:{
      marginVertical:'1%',
      width:'100%',
      height:'20%',
      // backgroundColor:'pink',
    },
    fieldTitle:{
      marginVertical:'2%',
      fontFamily:'OpenSans-Regular',
      color:'black',
      fontSize:RFPercentage(2.25),
    },
    inputField:{
      borderRadius:'20@ms',
      backgroundColor:'#EEEEEE',
      height:'60%',
      paddingHorizontal:'5%',
      fontSize:RFPercentage(2.25),
    }
});
export default CustomInputField