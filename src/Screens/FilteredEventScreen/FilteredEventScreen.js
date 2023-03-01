import {View, Text, Pressable, FlatList, ImageBackground} from 'react-native';
import React, { useEffect, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import Logo from '../../components/Logo';
import ViewModeButton from '../../components/ViewModeButton';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {DBContext} from '../../../App';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const eventsData= [
  {id: '1', name: 'Brain Injury Art Show', progress: 67, date: '2/26/2023 8:00'},
  {id: '2', name: 'Seattle Asian American...', progress: 23, date: '03/01/2023 18:00'},
  {id: '3', name: 'Dave Holland Trio', progress: 100, date: '02/05/2023 20:00'},
  {id: '4', name: 'RUBBERBAND - Reckless...', progress: 100, date: '01/29/2023 17:00'},
  {id: '5', name: 'Washington: My Home', progress: 100, date: '12/29/2022 8:00'}
];

  const FilteredEventScreen = () => {
    const navigation = useNavigation();
    const [viewMode, setViewMode] = useState('All');
    const [events, setevents] = useState(eventsData);


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
    navigation.navigate('AddEventScreen');
    
  };
  const onEventPressed = async selectedEventID => {
    AsyncStorage.setItem('selectedEventID', selectedEventID.toString())
      .then(() => {
        console.log('SelectedEventID: ' + selectedEventID.toString());
        navigation.navigate('EventDetailScreen');
      })
      .catch(error => {
        console.error(
          'Error',
          'Could not save SelectedEventID to AsyncStorage!',
        );
        console.error(error);
      });
  };
  

  const renderItem = ({ item }) => {
    const eventStartTime = moment(item.date, 'MM/DD/YYYY HH:mm').format('MM/DD/YYYY');
    const eventEndTime = moment(item.date, 'MM/DD/YYYY HH:mm').add(1, 'day').format('MM/DD/YYYY');
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.feedItem}
        activeOpacity={0.7}
        onPress={() => onEventPressed(item.id)}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTimeText}>
            {eventStartTime} - {eventEndTime}
          </Text>
        </View>
        <View style={styles.titleItemContainer}>
          <Text style={styles.titleItemText}>{item.name}</Text>
        </View>
        <View style={styles.progressionItemContainer}>
          <Text style={styles.progressionItemText}>Progress:</Text>
          <Text style={styles.displayProgressionItemText}>
            {item.progress}%
          </Text>
        </View>
      </TouchableOpacity>
    );
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
            <FlatList
             data={filteredEvents()}
             renderItem={renderItem}
             keyExtractor={(item) => item.id}
             ListEmptyComponent={renderEmptyComponent}
             showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <View style = {styles.addButtonIcon}>
        <Pressable onPress={addButtonPressed}>
        <MaterialCommunityIcons
          name="plus-circle"
          color={'#FF3008'}
          size = {100}
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
  },
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    height: '91%',
  },
  viewModeContainer: {
    width: '100%',
    height: '11%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewTitleContainer:{
    width:'100%',
    height:'7%',
    flexDirection: 'column',
    justifyContent: 'center',

  },
  viewTitleText:{
    fontFamily:'OpenSans-SemiBold',
    fontSize:RFPercentage(3.8),
    color:'black',
  },
  addButtonIcon: {
    fontSize: RFPercentage(13.5),
    marginRight: '5@ms',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: '7@vs',
    borderRadius: '70@ms',
    borderColor: 1,
    borderWidth: 1,
    right: '20@ms',
  },
  feedContainer: {
    width: '100%',
    height: '40%',
  },
  feedItem: {
    alignSelf: 'center',
    marginVertical: '15@vs',
    width: '100%',
    height: '95@vs',
    backgroundColor: '#777B7E',
    borderRadius: '25@ms',
  },
  itemImage: {
    borderRadius: '25@ms',
    opacity: 0.4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '22%',
    justifyContent: 'flex-end',
  },
  dateTimeText: {
    marginRight: '20@ms',
    marginTop: '5@vs',
    color: 'white',
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(2),
  },
  titleItemContainer: {
    width: '100%',
    height: '42%',
    justifyContent: 'flex-end',
  },
  titleItemText: {
    marginLeft: '20@ms',
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: RFPercentage(2.2),
  },
  progressionItemContainer: {
    width: '100%',
    height: '56%',
    flexDirection: 'row',
  },
  progressionItemText: {
    marginLeft: '20@ms',
    fontFamily: 'Inter-Regular',
    color: 'white',
    fontSize: RFPercentage(1.8),
  },
  displayProgressionItemText: {
    marginLeft: '2@ms',
    fontFamily: 'Inter-Regular',
    color: 'white',
    fontSize: RFPercentage(1.8),
  },
  
});

export default FilteredEventScreen;
