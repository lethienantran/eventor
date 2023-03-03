import {View, Text, Pressable, ImageBackground, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Logo from '../../components/Logo';
import TaskFeed from '../../components/TaskFeed';
import ViewModeButton from '../../components/ViewModeButton';
import SQLite from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../../components/Loading';

const EventDetailScreen = ({route}) => {
  const [isLoading, setIsLoading] = useState(true);
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  //data
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [progression, setProgression] = useState('');
  const [description, setDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [viewMode, setViewMode] = useState('description');
  const [eventImage, setEventImage] = useState();

  const [currentSelectedEventID, setCurrentSelectedEventID] = useState(
    route.params.eventID,
  );

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      const db = SQLite.openDatabase(
        {
          name: 'eventorDB.db',
          createFromLocation: 1,
        },
        () => {
          console.log('EventDetailScreen: Database opened successfully');
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM events WHERE eventID = ?',
              [currentSelectedEventID],
              (tx, results) => {
                setEventName(results.rows.item(0).eventName);
                setLocation(results.rows.item(0).location);
                setProgression(results.rows.item(0).eventProgress);
                setDescription(results.rows.item(0).eventCaption);
                setEventImage(results.rows.item(0).eventImage);
                setEventStartTime(results.rows.item(0).eventStartTime);
                setEventEndTime(results.rows.item(0).eventEndTime);
                console.log('EventDetailScreen: Database close.');
                setIsLoading(false);
                db.close();
              },
            );
          });
        },
        error => {
          console.log(error);
        },
      );
    }
  }, [isFocused]);

  const onBackPressed = () => {
    console.log('EventDetailScreen: Go Back.');
    navigation.goBack();
  };

  //on edit press go to editeventscreen with parameters.
  const onEditPress = (
    selectedEventID,
    selectedEventImage,
    selectedEventName,
    selectedEventDescription,
    selectedEventStartTime,
    selectedEventEndTime,
    selectedEventLocation,
  ) => {
    navigation.navigate('EditEventScreen', {
      eventID: selectedEventID,
      eventImage: selectedEventImage,
      eventName: selectedEventName,
      eventDescription: selectedEventDescription,
      eventStartTime: selectedEventStartTime,
      eventEndTime: selectedEventEndTime,
      eventLocation: selectedEventLocation,
    });
  };

  //navigate to add task screen when add pressed
  const onAddTaskPressed = () => {
    navigation.navigate('AddTaskScreen', {
      eventName: eventName,
      eventID: currentSelectedEventID,
    });
  };

  //change to description view mode
  const onDescriptionPressed = () => {
    setViewMode('description');
  };

  //change to remaining tasks view mode
  const onRemainingTasksPressed = () => {
    setViewMode('remainingTasks');
  };

  const display = () => {
    if (!isLoading) {
      return (
        <View style={styles.container}>
          <Logo
            onPress={onBackPressed}
            title="eventor"
            hasBack="true"
            hasEdit="true"
            onEditPress={() => {
              onEditPress(
                currentSelectedEventID,
                eventImage,
                eventName,
                description,
                eventStartTime,
                eventEndTime,
                location,
              );
            }}
          />
          <View style={styles.contentContainer}>
            <View style={styles.eventBannerContainer}>
              <ImageBackground
                source={
                  eventImage !== null
                    ? {uri: `data:image/jpeg;base64,${eventImage}`}
                    : require('../../../assets/images/eventsBanner.png')
                }
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
              <ViewModeButton
                mode="description"
                viewMode={viewMode}
                title="Description"
                type="Description"
                onPress={onDescriptionPressed}
              />
              <ViewModeButton
                mode="remainingTasks"
                viewMode={viewMode}
                title="Remaining Tasks"
                type="RemainingTasks"
                onPress={onRemainingTasksPressed}
              />
            </View>

            {viewMode === 'remainingTasks' ? (
              <>
                <TaskFeed
                  eventName={eventName}
                  eventID={currentSelectedEventID}
                />
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
                  <Text style={styles.bodyText}>
                    {description.length !== 0
                      ? description
                      : 'The event does not have any description.'}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      );
    } else {
      return <Loading />;
    }
  };

  return <View style={styles.root}>{display()}</View>;
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
  aboutContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    height: '19%',
  },
  headerText: {
    marginVertical: '4%',
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
    fontSize: RFPercentage(3),
  },
  bodyContainer: {
    paddingVertical: '2@vs',
    width: '100%',
  },
  bodyText: {
    fontFamily: 'Inter-Regular',
    color: '#ABABAB',
    fontSize: RFPercentage(2.25),
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
