import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ImageBackground,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Logo from '../../components/Logo';

import {DBContext} from '../../../App';

import eventsBanner from '../../../assets/images/eventsBanner.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTaskScreen from '../AddTaskScreen';

const {height, width} = Dimensions.get('window');

const retrieveSelectedEventID = async () => {
  try {
    const currSelectedEventID = await AsyncStorage.getItem('selectedEventID');
    return currSelectedEventID !== null ? currSelectedEventID : null;
  } catch (error) {
    console.error(error);
  }
};

const EventDetailScreen = () => {
  const [data, setData] = useState([]);

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  const db = useContext(DBContext);
  const [currentSelectedEventID, setCurrentSelectedEventID] = useState();

  const setSelectedEventID = async () => {
    try {
      const val = await retrieveSelectedEventID();
      if (val !== null) {
        return val;
      } else {
        console.error('No SelectedEventID found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onBackPressed = async () => {
    try {
      //remove the selectedClubID value
      await AsyncStorage.removeItem('selectedEventID');

      const currSelectedEventID = await retrieveSelectedEventID();

      if (currSelectedEventID == null) {
        console.log(
          'BackPressed! The selectedEventID in AsynStorage is removed and now become ' +
            currSelectedEventID +
            '.',
        );
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const onEditPressed = () => {
    //navigate to add task screen
    console.warn('navigate to edit task screen');
  };

  const onAddTaskPressed = () => {
    //navigate to add task screen
    navigation.navigate('AddTaskScreen');
  };

  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [progression, setProgression] = useState('');
  const [description, setDescription] = useState('');
  const [viewMode, setViewMode] = useState('description');

  const onDescriptionPressed = () => {
    setViewMode('description');
  };

  const onRemainingTasksPressed = () => {
    setViewMode('remainingTasks');
  };

  useEffect(() => {
    setSelectedEventID().then(setCurrentSelectedEventID);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events WHERE eventID = ?',
        [currentSelectedEventID],
        (tx, results) => {
          setEventName(results.rows.item(0).eventName);
          setLocation(results.rows.item(0).location);
          setProgression(results.rows.item(0).eventProgress);
          setStatus(results.rows.item(0).eventStatus);
          setDescription(results.rows.item(0).eventCaption);
        },
      );
      tx.executeSql(
        'SELECT * FROM tasks WHERE tasks.eventID = ?',
        [currentSelectedEventID],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setData(temp);
        },
      );
    });
  }, [currentSelectedEventID]);

  const listItemView = item => {
    return (
      <View key={item.taskID} style={styles.taskContainer}>
        <View style={styles.taskInfoContainter}>
          {item.taskStatus === 'incomplete' ? (<Octicons name="pulse" style={[styles.taskStatusIcon, styles.taskIncomplete]} />) 
                                            : (<Feather name="check-circle" style={[styles.taskStatusIcon, styles.taskDone]} />)}
          <Text style={styles.taskName}>{item.taskName}</Text>
        </View>
        <Pressable style={styles.taskEditButton} onPress={onEditPressed}>
          <Feather name="edit-3" style={styles.editTaskIcon} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Logo
          onPress={onBackPressed}
          title="eventor"
          hasBack="true"
          hasEdit="true"
        />
        <View style={styles.contentContainer}>
          <View style={styles.eventBannerContainer}>
            <ImageBackground
              source={eventsBanner}
              resizeMode="cover"
              style={{flex: 1}}
              imageStyle={styles.itemImage}></ImageBackground>
          </View>
          <View style={styles.eventInfoContainer}>
            <View style={styles.eventInfoHeader}>
              <View style={styles.eventNameContainer}>
                <Text style={styles.eventName}>{eventName}</Text>
              </View>
              {progression !== 100 ? (
                <Octicons
                  name="pulse"
                  style={[styles.eventStatusIcon, styles.inProgressIcon]}
                />
              ) : (
                <Feather
                  name="check-circle"
                  style={[styles.eventStatusIcon, styles.doneIcon]}
                />
              )}
            </View>
            <View style={styles.eventLocationContainer}>
              <Feather name="map-pin" style={styles.mapPinIcon} />
              <Text style={styles.eventLocationText}>{location}</Text>
            </View>
          </View>
          <View style={styles.viewModeContainer}>
            <Pressable
              style={[
                viewMode === 'description'
                  ? styles.selectedButton
                  : styles.unselectedButton,
                styles.descriptionButton,
              ]}
              onPress={onDescriptionPressed}>
              <Text
                style={[
                  viewMode === 'description'
                    ? styles.selectedText
                    : styles.unselectedText,
                  styles.viewModeText,
                ]}>
                Description
              </Text>
            </Pressable>
            <Pressable
              style={[
                viewMode === 'remainingTasks'
                  ? styles.selectedButton
                  : styles.unselectedButton,
                styles.remainingTasksButton,
              ]}
              onPress={onRemainingTasksPressed}>
              <Text
                style={[
                  viewMode === 'remainingTasks'
                    ? styles.selectedText
                    : styles.unselectedText,
                  styles.viewModeText,
                ]}>
                Remaining Tasks
              </Text>
            </Pressable>
          </View>

          {viewMode === 'remainingTasks' ? (
            <>
              <View style={styles.taskList}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => listItemView(item)}
                />
              </View>
              <View style={styles.actionBar}>
                <View style={styles.progressionContainer}>
                  <View style={styles.progressionHeader}>
                    <Text style={styles.progressionText}>Progression</Text>
                    <MaterialCommunityIcons
                      name="chart-timeline-variant"
                      style={styles.graphIcon}
                    />
                  </View>
                  <Text style={styles.progressText}>{progression}%</Text>
                </View>
                <Pressable onPress={onAddTaskPressed}>
                  <MaterialCommunityIcons
                    name="plus-circle"
                    style={styles.addButtonIcon}
                    color={'#FF3008'}
                  />
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.aboutContainer}>
              <Text style={styles.headerText}>About the event</Text>
              <ScrollView style={styles.bodyContainer}>
                <Text style={styles.bodyText}>{description}</Text>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  root: {
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
  eventBannerContainer: {
    width: '100%',
    height: '19%',
    borderRadius: '25@ms',
    backgroundColor: '#EEEEEE',
  },
  itemImage: {
    borderRadius: '25@ms',
  },
  eventInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: '18@vs',
    width: '100%',
    height: '16%',
  },
  eventInfoHeader: {
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: '1%',
  },
  eventNameContainer: {
    width: '82%',
    height: '100%',
  },
  eventName: {
    fontSize: RFPercentage(3.3),
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
  },
  eventStatusIcon: {
    fontSize: RFPercentage(4.25),
  },
  inProgressIcon: {
    color: '#D9A900',
  },
  doneIcon: {
    color: '#21B608',
  },
  eventLocationContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mapPinIcon: {
    fontSize: RFPercentage(3.5),
    color: '#AFAFAF',
  },
  eventLocationText: {
    fontSize: RFPercentage(2.25),
    fontFamily: 'Inter-SemiBold',
    color: '#AFAFAF',
    marginLeft: '2%',
  },
  viewModeContainer: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionButton: {
    width: '42%',
    height: '78%',
    borderRadius: '20@ms',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingTasksButton: {
    width: '52%',
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

  aboutContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    height: '50%',
  },
  headerText: {
    marginVertical: '4%',
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
    fontSize: RFPercentage(2.9),
  },
  bodyContainer: {
    width: '100%',
    height: '83.7%',
  },
  bodyText: {
    fontFamily: 'Inter-Regular',
    color: '#ABABAB',
    fontSize: RFPercentage(2.2),
  },
  taskList: {
    paddingVertical: '2.5%',
    width: '100%',
    height: '38%',
    flexDirection: 'column',
  },
  taskContainer: {
    marginVertical: '3.2%',
    width: '100%',
    height: '55@vs',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: '6%',
    borderWidth: '2@ms',
    borderColor: 'black',
    borderRadius: '20@ms',
  },
  taskInfoContainter: {
    flexDirection: 'row',
    width: '88%',
    height: '100%',
    alignItems: 'center',
  },
  taskStatusIcon: {
    fontSize: RFPercentage(2.5),
  },
  taskIncomplete:{
    color:'#D9A900',
  },
  taskDone:{
    color:'#21B608',
  },
  taskName: {
    marginLeft: '4%',
    fontSize: RFPercentage(2.25),
    fontFamily: 'Inter-Regular',
    color: 'black',
  },
  taskEditButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '10%',
    height: '100%',
  },
  editTaskIcon: {
    fontSize: RFPercentage(2.5),
    color: 'black',
  },
  actionBar: {
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButtonIcon: {
    fontSize: RFPercentage(13.5),
    backgroundColor: 'white',
    borderRadius: '70@ms',
    borderColor: 1,
  },
  progressionContainer: {
    width: '70%',
    height: '80%',
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    borderRadius: '10@ms',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#EEEEEE',
  },
  progressionHeader: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressionText: {
    fontFamily: 'Inter-Medium',
    color: 'black',
    fontSize: RFPercentage(2),
  },
  graphIcon: {
    fontSize: RFPercentage(3),
    color: 'black',
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    color: 'black',
    fontSize: RFPercentage(4),
  },
});
export default EventDetailScreen;
