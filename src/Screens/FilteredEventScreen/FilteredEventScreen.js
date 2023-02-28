import {View, Text} from 'react-native';
import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import Logo from '../../components/Logo';
import ViewModeButton from '../../components/ViewModeButton';
import { RFPercentage } from 'react-native-responsive-fontsize';
const FilteredEventScreen = () => {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState('All');

  const onAllPressed = () => {
    setViewMode('All');
  };
  const onPastPressed = () => {
    setViewMode('Past');
  };
  const onCompletePressed = () => {
    setViewMode('Complete');
  };
  const onInProgressPressed = () => {
    setViewMode('In-Progress');
  };

  const onBackPressed = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Logo hasBack={true} onPress={onBackPressed}/>
        <View style={styles.contentContainer}>
          <View style={styles.viewModeContainer}>
            <ViewModeButton mode='All' viewMode={viewMode} title='All' type='EvenSpace' onPress={onAllPressed}/>
            <ViewModeButton mode='Past' viewMode={viewMode} title='Past' type='EvenSpace' onPress={onPastPressed}/>
          </View>
          <View style={styles.viewModeContainer}>
            <ViewModeButton mode='Complete' viewMode={viewMode} title='Complete' type='EvenSpace' onPress={onCompletePressed}/>
            <ViewModeButton mode='In-Progress' viewMode={viewMode} title='In-Progress' type='EvenSpace' onPress={onInProgressPressed}/>
          </View>
          <View style={styles.viewTitleContainer}>
            <Text style={styles.viewTitleText}>{viewMode} Events</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  root:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  container: {
    flexDirection: 'column',
    width: '85%',
    height: '100%',
    // backgroundColor:'green',
  },
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    height: '91%',
    // backgroundColor:'yellow',
  },
  viewModeContainer: {
    width: '100%',
    height: '11%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'pink',
  },
  viewTitleContainer:{
    width:'100%',
    height:'7%',
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor:'grey',

  },
  viewTitleText:{
    fontFamily:'OpenSans-SemiBold',
    fontSize:RFPercentage(3.8),
    color:'black',
  },
});

export default FilteredEventScreen;
