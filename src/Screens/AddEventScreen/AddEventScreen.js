//Hook and Functions
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
//Components and Responsive
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Keyboard,
  Modal,
  ImageBackground,
} from 'react-native';
import Logo from '../../components/Logo';
import CustomInputField from '../../components/CustomInputField';
import StartEventTimePicker from '../../components/StartEventTimePicker';
import EndEventTimePicker from '../../components/EndEventTimePicker';
import CustomButton from '../../components/CustomButton';
import {RFPercentage} from 'react-native-responsive-fontsize';
// Images
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
// Icons
import Inoicons from 'react-native-vector-icons/Ionicons';
// Database
import SQLite from 'react-native-sqlite-storage';

const AddEventScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  //to see if keyboard is active or not
  const [keyBoardStatus, setKeyboardStatus] = useState(false);

  //setModalVisibility and message
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // set minimumDate
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 7);

  //variable to setMaxDate to 7 years from now
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 7);

  /* Setting Img UseState */
  const [image, setImage] = useState(null);

  /* Storing User Data entries */
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartTime, setEventStartTime] = useState(new Date());
  const [eventEndTime, setEventEndTime] = useState(new Date());
  const [endDateText, setEndDateText] = useState(eventStartTime);

  /* if close is pressed, image is no longer wanted so set null*/
  const onCloseUploadedImage = () => {
    setImage(null);
  };

  //when BackButton pressed
  const onBackPressed = () => {
    navigation.goBack();
  };

  //browse image
  const onBrowsePressed = () => {
    const options = {};
    //open the gallery
    launchImageLibrary(options, response => {
      if (response && response.assets) {
        console.log('Image Selected:', response.assets[0].uri);
        setImage(response.assets[0].uri);
      }
    });
  };

  //if create pressed, insert all values
  const onCreatePressed = async () => {
    //convert eventStartTimeStr
    const startTimeStamp = Date.parse(eventStartTime);
    const startDateObj = new Date(startTimeStamp);
    const startIsoStr = startDateObj.toISOString();
    const eventStartTimeStr = startIsoStr.replace('T', ' ');

    //convert eventEndTimeStr
    const endTimeStamp = Date.parse(eventEndTime);
    const endDateObj = new Date(endTimeStamp);
    const endIsoStr = endDateObj.toISOString();
    const eventEndTimeStr = endIsoStr.replace('T', ' ');
    try {
      {
        /* if event name is not filled*/
      }
      if (!eventName || eventName.length === 0) {
        setModalVisible(true);
        setModalMessage(
          'Please enter an event name. It can be no longer than 30 characters.',
        );
        return false;
      }
      //if event location is not filled
      else if (!eventLocation || eventLocation.length === 0) {
        setModalVisible(true);
        setModalMessage(
          'Please enter a location for your event. It can be no longer than 30 characters.',
        );
        return false;
      }
      //read the file at path - this case is image dir/path and encoded as base64.
      const imageData =
        image !== null ? await RNFS.readFile(image, 'base64') : null;
      //open data base connection
      const db = SQLite.openDatabase(
        {
          name: 'eventorDB.db',
          createFromLocation: 1,
        },
        //success callback, insert all values to database
        () => {
          console.log('AddEventScreen: Database opened successfully');
          db.transaction(tx => {
            tx.executeSql(
              //Insert all entered values.
              `INSERT INTO events 
              (eventName, eventStartTime, eventEndTime, eventCaption, eventImage, eventProgress, location) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                eventName,
                eventStartTimeStr,
                eventEndTimeStr,
                eventDescription,
                imageData,
                0,
                eventLocation,
              ],
              (tx, results) => {
                console.log(
                  'Event successfully uploaded to database and go back',
                );
                console.log('AddEventScreen: Database close.');
                navigation.goBack();
                db.close();
              },
              error => {
                console.log('Error uploading event to database: ', error);
              },
            );
          });
        },
        //error call back
        error => {
          console.error(error);
        },
      );
    } catch (error) {
      console.error('error reading image file: ', error);
    }
  };

  //this function is to compare time
  const compareTime = () => {
    const startTimeStamp = eventStartTime.getTime();
    const endTimeStamp = eventEndTime.getTime();
    if (startTimeStamp > endTimeStamp) {
      setEndDateText(eventStartTime);
      setEventEndTime(eventStartTime);
    }
  };

  //start with calling event for 1 time.
  useEffect(() => {
    compareTime();
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [eventStartTime]);

  return (
    //root container
    <View style={styles.root}>
      {/* big container 85% center */}
      <View style={styles.container}>
        {/* modal view, for notication, transparent later in container put low black opacity */}
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          {/* modal big container*/}
          <View style={styles.modalContainer}>
            {/* modal view wraps message text and close button */}
            <View style={styles.modalView}>
              <Text style={styles.modalMessageText}>{modalMessage}</Text>
              {/* close button, if pressed then just set modal visible to false */}
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* logo component, only have back button */}
        <Logo hasBack={true} title="Create Event" onPress={onBackPressed} />
        {/* content container everything below logo goes here. */}
        <View style={styles.contentContainer}>
          {/* background for if image is not uploaded, else image if it is uploaded*/}
          <View style={styles.uploadBannerContainer}>
            {!image ? (
              <>
                <Text style={styles.uploadBannerText}>
                  Upload your event banner here.
                </Text>
                <Pressable onPress={onBrowsePressed}>
                  <Text style={styles.browseText}>Browse</Text>
                </Pressable>
              </>
            ) : (
              <View style={{width: '100%', height: '100%'}}>
                <ImageBackground
                  source={{uri: image}}
                  style={styles.imageBackground}
                  resizeMode="cover"
                  imageStyle={styles.imageUpload}
                  blurRadius={0}>
                  <Pressable onPress={onCloseUploadedImage}>
                    <Inoicons
                      name="close-circle"
                      style={styles.closeImageIcon}
                    />
                  </Pressable>
                </ImageBackground>
              </View>
            )}
          </View>
          {/* event info container, wraps the scrollview of input fields */}
          <View style={styles.eventInfoContainer}>
            {/* scroll view, wraps/holds all the input fields */}
            <ScrollView
              style={styles.eventInfoScrollView}
              showsVerticalScrollIndicator={false}>
              {/* custom input field component */}
              <CustomInputField
                value={eventName}
                setValue={setEventName}
                title={
                  'Event Name (' + (!eventName ? 0 : eventName.length) + '/30)'
                }
                editable={true}
                selectTextOnFocus={true}
              />
              {/* custom input field component */}
              <CustomInputField
                value={eventDescription}
                setValue={setEventDescription}
                title={
                  'Description (' +
                  (!eventDescription ? 0 : eventDescription.length) +
                  '/100)'
                }
                maxLength={100}
                editable={true}
                selectTextOnFocus={true}
                type="descriptionField"
              />
              {/* start event time picker component */}
              <StartEventTimePicker
                minDate={minDate}
                maxDate={maxDate}
                startTime={eventStartTime}
                title={'Start Date/Time'}
                setStartTime={setEventStartTime}
              />
              {/* end event time picker component */}
              <EndEventTimePicker
                minDate={eventStartTime}
                maxDate={maxDate}
                endTime={eventEndTime}
                endDateText={endDateText}
                setEndDateText={setEndDateText}
                setEndTime={setEventEndTime}
                title={'End Date/Time'}
              />
              {/* custom input field component */}
              <CustomInputField
                value={eventLocation}
                setValue={setEventLocation}
                title={
                  'Location (' +
                  (!eventLocation ? 0 : eventLocation.length) +
                  '/30)'
                }
                editable={true}
                selectTextOnFocus={true}
              />
              {/* if the keyboard is active then shows up (a bump item so that user can scroll down til last input field with out being
                blocked by keyboard, else dont show up) */}
              <View
                style={
                  keyBoardStatus
                    ? styles.bumpLastItemActive
                    : styles.bumpLastItemInactive
                }
              />
            </ScrollView>
          </View>
          {/* custom button, for create */}
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={() => {
                onCreatePressed(image);
              }}
              type="Add"
              text="Create"
            />
          </View>
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
    // backgroundColor:'yellow',
  },
  uploadBannerContainer: {
    flexDiretion: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100@vs',
    borderRadius: '25@ms',
    backgroundColor: '#EEEEEE',
  },
  uploadBannerText: {
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(2.25),
    color: 'black',
  },
  browseText: {
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(2.25),
    textDecorationLine: 'underline',
    color: '#FF3008',
  },
  imageBackground: {
    flex: 1,
    paddingTop: '5@vs',
    paddingHorizontal: '8@ms',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  imageUpload: {
    borderRadius: '25@ms',
    opacity: 0.5,
  },
  closeImageIcon: {
    fontSize: RFPercentage(3.5),
    color: 'black',
  },
  eventInfoContainer: {
    paddingTop: '20@vs',
    width: '100%',
    height: '376@vs',
  },
  eventInfoScrollView: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bumpLastItemActive: {
    height: '120@vs',
  },
  bumpLastItemInactive: {
    height: '10@vs',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '92%',
    height: '18%',
    borderRadius: '10@ms',
    backgroundColor: 'white',
  },
  modalMessageText: {
    textAlign: 'center',
    paddingHorizontal: '4%',
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(2.25),
    color: 'black',
    marginVertical: '2%',
  },
  modalCloseText: {
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(2),
    color: '#FF3008',
    marginVertical: '2%',
  },
});

export default AddEventScreen;
