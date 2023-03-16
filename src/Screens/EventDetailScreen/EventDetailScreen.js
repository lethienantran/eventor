//Import from React, React Navigation, React Native
import {View, Text, Pressable, ImageBackground, ScrollView, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
//Import Icons and Fonts
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//Import Styling
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
//Import Components
import Logo from '../../components/Logo';
import TaskFeed from '../../components/TaskFeed';
import ViewModeButton from '../../components/ViewModeButton';
import Loading from '../../components/Loading';

const EventDetailScreen = ({route}) => {

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  
  //State of if page is being focused
  const isFocused = useIsFocused();

  const [openImageView, setOpenImageView] = useState(false);

  //State of page is loading or not
  const [isLoading, setIsLoading] = useState(true);
  
  //variables for populating from data and adjust data through states when use
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [progression, setProgression] = useState('');
  const [description, setDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventImage, setEventImage] = useState();
  const [currentSelectedEventID, setCurrentSelectedEventID] = useState(
    route.params.eventID,
  );

  //ViewMode state to distinguish/toggle between description and remaining tasks.
  const [viewMode, setViewMode] = useState('description');

  // Will be called whenever page is being focused, navigated
  useEffect(() => {

    //if the page is focused, retrieve from data and set as loading state
    if (isFocused) {

      //state is loading
      setIsLoading(true);

      //openDatabaseConnection
      const db = SQLite.openDatabase(
        {
          name: 'eventorDB.db',
          createFromLocation: 1,
        },

        //Success Callback: retrieve and populate all variables
        () => {
          console.log('EventDetailScreen: Database opened successfully');
          db.transaction(tx => {
            
            //Find events matched with the current event ID and populate the variables
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

                //after everything is populated, its ready, the loading state is no longer true
                setIsLoading(false);

                //close database, finish transaction
                db.close();
              },
            );
          });
        },

        //Error Callback: log out error
        error => {
          console.error(error);
        },
      );
    }
  }, [isFocused]);

  //When Back Button is pressed, go back to previous screen.
  const onBackPressed = () => {
    console.log('EventDetailScreen: Go Back.');
    navigation.goBack();
  };

  //on edit press go to editeventscreen with parameters needed for retrieve data with key.
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

  const openImage = () =>{ 
    console.log("opne");
    setOpenImageView(true);
  }
  const closeImage = () =>{
    setOpenImageView(false);
  }
  //navigate to add task screen when add pressed and pass the parameter as key to populate data 
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

  {
    /* this function is use for rendering the page based on isLoading state, if isLoading = true then we use Loading components and 
      if isLoading = false then we display the eventdetailscreen UI */
  }
  const display = () => {
    if (!isLoading) {
      return (
        //big container 85% center
        <View style={styles.container}>
          {/* component, this page has back button and edit button */}
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
          {/* contentContainer, everything in the page below logo */}
          <View style={styles.contentContainer}>
            {/* container for displaying banner image */}
            <Pressable onPress = {openImage}style={styles.eventBannerContainer}>
              <ImageBackground
                source={
                  eventImage !== null
                    ? {uri: `data:image/jpeg;base64,${eventImage}`}
                    : require('../../../assets/images/eventsBanner.png')
                }
                resizeMode="cover"
                style={{flex: 1}}
                imageStyle={styles.itemImage}>
                </ImageBackground>
            </Pressable>
            {/* information of event container, wrap header, name, location */}
            <View style={styles.eventInfoContainer}>
              {/* wrap name and icons */}
              <View style={styles.eventInfoHeader}>
                <View style={styles.eventNameContainer}>
                  <Text style={styles.eventName}>{eventName}</Text>
                </View>
                {/* check if is not complete then pulse icon else, check circle icon */}
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
              {/* wrap location pin icon and location name */}
              <View style={styles.eventLocationContainer}>
                <Feather name="map-pin" style={styles.mapPinIcon} />
                <Text style={styles.eventLocationText}>{location}</Text>
              </View>
            </View>
            {/* view buttons, switch between to see either descriptions or remaining tasks wrapper */}
            <View style={styles.viewModeContainer}>
              {/* description button use viewmode component */}
              <ViewModeButton
                mode="description"
                viewMode={viewMode}
                title="Description"
                type="Description"
                onPress={onDescriptionPressed}
              />
              {/* remaining tasks button use viewmode component */}
              <ViewModeButton
                mode="remainingTasks"
                viewMode={viewMode}
                title="Remaining Tasks"
                type="RemainingTasks"
                onPress={onRemainingTasksPressed}
              />
            </View>
            {/* if view mode is remaining tasks, show tasks feed and other related, else show description feed */}
            {viewMode === 'remainingTasks' ? (
              <>
                {/* taskfeed component, load up data */}
                <TaskFeed
                  eventName={eventName}
                  eventID={currentSelectedEventID}
                />
                {/* action bar wrapper, wrap progression container and add button */}
                <View style={styles.actionBar}>
                  {/* progression container wraps header, and progression text */}
                  <View style={styles.progressionContainer}>
                    {/* progression header wraps header and icons */}
                    <View style={styles.progressionHeader}>
                      {/* header text */}
                      <Text style={styles.progressionText}>Progression</Text>
                      <MaterialCommunityIcons
                        name="chart-timeline-variant"
                        style={styles.graphIcon}
                      />
                    </View>
                    {/* progression text */}
                    <Text style={styles.progressText}>{progression}%</Text>
                  </View>
                  {/* add button*/}
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
              <>
                {/* about container wraps the header and the event content container*/}
                <View style={styles.aboutContainer}>
                  {/* header text */}
                  <Text style={styles.headerText}>About the event</Text>
                  {/* event content */}
                  <ScrollView style={styles.bodyContainer}>
                    <Text style={styles.bodyText}>
                      {description.length !== 0
                        ? description
                        : 'The event does not have any description.'}
                    </Text>
                  </ScrollView>
                </View>
              </>
            )}
          </View>
          {openImageView && (
                    <View style={styles.modal}>
                      <BlurView style={{ flex: 1, width:'115%'}}
                        blurType="light"
                        blurAmount={10}>
                        <View style = {{width:'100%',height:'100%', justifyContent:"center", alignItems:"center"}}>
                        <Image
                          source={
                            eventImage !== null
                              ? {uri: `data:image/jpeg;base64,${eventImage}`}
                              : require('../../../assets/images/eventsBanner.png')
                          }
                          resizeMode="cover"
                          style = {styles.detailImage}/>
                          <Pressable onPress={closeImage}>
                            <Text style = {styles.closeImageText}>Close</Text>
                        </Pressable>
                        </View>
                    </BlurView>
                  </View>
            )}
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
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
  },
  detailImage:{
    width:"85%",
    height:"30%",
    borderRadius: "20@ms",
  },
  closeImageText:{
    fontSize: RFPercentage(2.5),
    fontFamily: 'OpenSans-Regular',
    color: '#FF3008',
    marginTop:"10@vs"
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
