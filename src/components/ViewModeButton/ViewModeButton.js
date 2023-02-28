import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { ScaledSheet } from 'react-native-size-matters'
import { RFPercentage } from 'react-native-responsive-fontsize'
const ViewModeButton = ({mode, viewMode, title, type, onPress}) => {
    return (
        <Pressable
              style={[
                viewMode === mode
                  ? styles.selectedButton
                  : styles.unselectedButton,
                  styles[type + 'Button']
              ]}
              onPress={onPress}>
              <Text
                style={[
                  viewMode === mode
                    ? styles.selectedText
                    : styles.unselectedText,
                  styles.viewModeText,
                ]}>
                {title}
              </Text>
        </Pressable>
    )
}

const styles = ScaledSheet.create({
    DescriptionButton: {
        width: '42%',
        height: '78%',
        borderRadius: '20@ms',
        justifyContent: 'center',
        alignItems: 'center',
      },
      RemainingTasksButton: {
        width: '52%',
        height: '78%',
        borderRadius: '20@ms',
        justifyContent: 'center',
        alignItems: 'center',
      },
      EvenSpaceButton:{
        width: '46%',
        height: '78%',
        borderRadius: '20@ms',
        justifyContent: 'center',
        alignItems: 'center',
      },
      viewModeText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: RFPercentage(2.25),
      },
      selectedText: {
        color: 'white',
      },
      unselectedText: {
        color: 'black',
      },
      selectedButton: {
        backgroundColor: '#FF3008',
      },
      unselectedButton: {
        backgroundColor: '#FFF',
        borderWidth: '2@ms',
        borderColor: 'black',
      },

});
export default ViewModeButton