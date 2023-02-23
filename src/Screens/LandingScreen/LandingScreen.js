import {View, Text, Image, Pressable} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import React from 'react';
import Logo from '../../components/Logo';
import IllustratorImage from '../../../assets/images/illustratorImage.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const LandingScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  //ContinueButtonPressed
  const continueButtonPressed = () => {
    navigation.navigate('HomeScreen');
  };

  //render
  return (
    <View style={styles.root}>
      <Logo />
      <View style={styles.imageContainer}>
        <Image
          source={IllustratorImage}
          style={styles.illustratorImageStyle}
          resizeMode="contain"
        />
      </View>
      <View style={styles.sloganContainer}>
        <Text style={styles.sloganTextTop}>Where</Text>
        <Text style={styles.sloganText}>your event</Text>
        <Text style={styles.sloganText}>starts.</Text>
      </View>

      <Pressable onPress={continueButtonPressed}>
        <Ionicons
          name="arrow-forward-circle"
          style={styles.continueButtonIcon}
          color={'#FF3008'}
        />
      </Pressable>
    </View>
  );
};

const styles = ScaledSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '52%',
  },
  sloganContainer: {
    width: '100%',
    height: '39%',
  },
  illustratorImageStyle: {
    width: '100%',
    height: '100%',
  },
  sloganTextTop: {
    fontSize: RFPercentage(5.5),
    fontFamily: 'OpenSans-Bold',
    marginTop: '10@ms',
    marginLeft: '25@ms',
    color: 'black',
  },
  sloganText: {
    fontSize: RFPercentage(5.5),
    fontFamily: 'OpenSans-Bold',
    marginLeft: '25@ms',
    color: 'black',
  },
  continueButtonIcon: {
    fontSize: RFPercentage(15),
    marginRight: '5@ms',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default LandingScreen;
