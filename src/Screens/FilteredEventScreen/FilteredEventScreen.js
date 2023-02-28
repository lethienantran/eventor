import {View, Text, Pressable, FlatList} from 'react-native';
import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import Logo from '../../components/Logo';
import ViewModeButton from '../../components/ViewModeButton';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const eventsData = [
  {id: '1', name: 'Brain Injury Art Show', progress: 67, date: '2/26/2023 8:00'},
  {id: '2', name: 'Seattle Asian American...', progress: 23, date: '03/01/2023 18:00'},
  {id: '3', name: 'Dave Holland Trio', progress: 100, date: '02/05/2023 20:00'},
  {id: '4', name: 'RUBBERBAND - Reckless...', progress: 100, date: '01/29/2023 17:00'},
  {id: '5', name: 'Washington: My Home', progress: 100, date: '12/29/2022 8:00'}
];

  const FilteredEventScreen = () => {
    const navigation = useNavigation();
    const [viewMode, setViewMode] = useState('All');
    const [events, setEvents] = useState(eventsData);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemProgress}>Progress: {item.progress}%</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text>No events to show.</Text>
    </View>
  );

  const filteredEvents = () => {
    const now = new Date();
    switch (viewMode) {
      case 'Past':
        return events.filter((event) => new Date(event.date) < now && event.progress === 100);
      case 'Complete':
        return events.filter((event) => event.progress === 100);
      case 'In-Progress':
        return events.filter((event) => event.progress > 0 && event.progress < 100);
      default:
        return events;
    }
  };
  
  

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

  const addButtonPressed = () => {
    navigation.navigate('addEventScreen');
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
            <View style={styles.feedContainer} />
            <FlatList
              data={filteredEvents()}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyComponent}
            />
          </View>
        </View>
        <View style = {styles.addButtonContainer}>
        <Pressable onPress={addButtonPressed}>
        <MaterialCommunityIcons
          name="plus-circle"
          style={styles.addButtonIcon}
          color={'#FF3008'}
        />
      </Pressable>
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
  addButtonIcon: {
    fontSize: RFPercentage(15),
    marginRight: '5@ms',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  feedContainer: {
    width: '100%',
    height: '40%',
  },
  
});

export default FilteredEventScreen;
