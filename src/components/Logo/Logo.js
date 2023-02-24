import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {RFPercentage} from 'react-native-responsive-fontsize';
const Logo = () => {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>eventor</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '9%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: RFPercentage(4),
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
  },
});

export default Logo;
