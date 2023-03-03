import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import Logo from '../../components/Logo';
const Loading = ({page = true}) => {
  if (page) {
    return (
      <View style={styles.loadingContainer}>
        <Logo />
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  } else {
    return (
      <View style={styles.feedLoadingContainer}>
        <ActivityIndicator
          size="large"
          color="orange"
          style={{alignSelf: 'center'}}
        />
      </View>
    );
  }
};

const styles = ScaledSheet.create({
  feedLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'orange', // change border color to orange
  },
});
export default Loading;
