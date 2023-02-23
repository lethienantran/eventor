import {View, Text, Pressable} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import React from 'react';
import Logo from '../../components/Logo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
const HomeScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  const addButtonPressed = () => {
    navigation.navigate('AddEventScreen');
  };

  const quote = '"May your \n Monday \n be productive."';
  return (
    <View style={styles.root}>
      <Logo />
      <View style={styles.content}>
        <View style={styles.detailContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>TUESDAY</Text>
              <Text style={styles.dateText}>21</Text>
            </View>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>{quote}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.seeAllContainer}>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <Pressable onPress={addButtonPressed}>
        <MaterialCommunityIcons
          name="plus-circle"
          style={styles.addButtonIcon}
          color={'#FF3008'}
        />
      </Pressable>
    </View>
  );
};
const styles = ScaledSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '91%',
  },
  addButtonIcon: {
    fontSize: RFPercentage(15),
    marginRight: '5@ms',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 0,
    borderRadius: 70,
    borderColor: 1,
    borderWidth: 1,
    right: 0,
  },
  detailContainer: {
    width: '100%',
    height: '39%',
    flexDirection: 'row',
    backgroundColor: 'red',
    justifyContent: 'space-between',
  },
  calendarContainer: {
    width: '45%',
    height: '100%',
    backgroundColor: 'white',
    marginLeft: '20@ms',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'column',
  },
  dayContainer: {
    width: '100%',
    height: '60%',
  },
  dayText: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'Inter-SemiBold',
    color: '#FF3008',
    marginLeft: '12@ms',
    marginTop: '10@vs',
  },
  dateText: {
    fontSize: RFPercentage(5.5),
    fontFamily: 'Inter-Regular',
    color: 'black',
    marginLeft: '12@ms',
  },
  quoteContainer: {
    width: '100%',
    height: '40%',
  },
  quoteText: {
    marginTop: '20@vs',
    marginRight: '7@ms',
    textAlign: 'right',
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Medium',
    fontStyle: 'italic',
    color: 'black',
    fontSize: RFPercentage(2.25),
  },
  statsContainer: {
    width: '40%',
    height: '100%',
    marginRight: '20@ms',

    flexDirection: 'column',
  },
  seeAllContainer: {
    width: '100%',
    height: '30%',
    backgroundColor: 'black',
    justifyContent: 'center',
    borderRadius: '20@ms',
  },
  seeAllText: {
    fontSize: RFPercentage(2.75),
    color: 'white',
    marginLeft: '10@ms',
  },
});
export default HomeScreen;
