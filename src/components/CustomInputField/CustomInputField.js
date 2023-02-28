import {View, Text, TextInput, Pressable} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';

const CustomInputField = ({
  value,
  setValue,
  title,
  secureTextEntry,
  editable,
  selectTextOnFocus,
  isButton = false,
  onPress,
  type ='inputField'
}) => {
  return (
    <View style={styles[type + 'Root']}>
      <Text style={styles.fieldTitle}>{title}</Text>
      {!isButton ? 
      (<TextInput
        placeholder=""
        onChangeText={setValue}
        value={value}
        style={styles[type]}
        // numberOfLines={1}
        multiline={type === 'inputField' ? false : true}
        secureTextEntry={secureTextEntry}
        editable={editable}
        selectTextOnFocus={selectTextOnFocus}
      />)
      :(<Pressable 
        onPress={onPress}
        style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{value}</Text>
      </Pressable>)}
    </View>
  );
};

const styles = ScaledSheet.create({
  inputFieldRoot: {
    marginVertical: '1%',
    width: '100%',
    height: '70@vs',
  },
  descriptionFieldRoot: {
    marginVertical: '1%',
    width: '100%',
    height: '190@vs',
  },
  fieldTitle: {
    marginVertical: '2%',
    fontFamily: 'OpenSans-Regular',
    color: 'black',
    fontSize: RFPercentage(2.25),
  },
  inputField: {
    borderRadius: '20@ms',
    backgroundColor: '#EEEEEE',
    height: '62%',
    paddingHorizontal: '5%',
    fontSize: RFPercentage(2.25),
  },
  descriptionField: {
    borderRadius: '20@ms',
    backgroundColor: '#EEEEEE',
    height: '84%',
    paddingHorizontal: '5%',
    fontSize: RFPercentage(2.25),
    textAlignVertical: 'top'
  },
  buttonContainer: {
    borderRadius: '20@ms',
    backgroundColor: '#EEEEEE',
    height: '60%',
    flexDirection:'column',
    justifyContent:'center',
    paddingHorizontal: '5%',
  },
  buttonText: {
    fontFamily: 'OpenSans-Regular',
    color: 'black',
    fontSize: RFPercentage(2.25),
  },
  inputField: {
    borderRadius: '20@ms',
    backgroundColor: '#EEEEEE',
    height: '62%',
    paddingHorizontal: '5%',
    fontSize: RFPercentage(2.25),
  },
});
export default CustomInputField;
