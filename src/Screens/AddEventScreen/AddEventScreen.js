import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Button,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
// Icons and Fonts
import {RFPercentage} from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Calendar from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';

// Database
import {TextInput} from 'react-native-gesture-handler';
import {DBContext} from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
// Images
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {CALLBACK_TYPE} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

const AddEventScreen = () => {
  const today = new Date();
  const [open, setOpen] = useState(false); // Start Date
  const [open1, setOpen1] = useState(false); // End Date

  /* Storing User Data entries */
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartTime, setEventStartTime] = useState(new Date());
  const [eventEndTime, setEventEndTime] = useState(new Date());

  /* Setting Img UseState */
  const [image, setImage] = useState(null);

  /*Inputting data in DB*/

  const db = useContext(DBContext);
  const createButtonPressed = async imagePath => {
    try {
      const imageData = await RNFS.readFile(image, 'base64');
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO events 
        (eventName, eventStartTime, eventEndTime, eventCaption, eventProgress, location)
        VALUES(?,?,?,?,?,?)
        `,
          [
            eventName,
            eventStartTime.toString(),
            eventEndTime.toString(),
            eventDescription,
            0,
            eventLocation,
          ],
          (tx, results) => {
            console.log('successfuly created event');
          },
          error => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      console.log('error reading file for image', error);
    }
  };

  // Start Date
  function handleOnPress() {
    setOpen(!open);
  }
  // End Date
  function handleOnPress2() {
    setOpen1(!open1);
  }

  function handleChange(propDate) {
    setDate(propDate);
  }

  function browseFunc() {
    const options = {};
    launchImageLibrary(options, response => {
      console.log('Image Selected:', response.assets[0].uri);
      setImage(response.assets[0].uri);
      console.log(response);
    });
  }

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  const buttonPressed = () => {
    navigation.navigate('HomeScreen');
  };
  const bP2 = () => {
    navigation.navigate('EditEventScreen');
  };

  return (
    <View style={styles.root}>
      <DatePicker
        androidVariant="iosClone"
        modal
        mode="datetime"
        open={open}
        date={eventStartTime}
        minimumDate={eventStartTime}
        onConfirm={date => {
          setOpen(false);
          setEventStartTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <DatePicker
        // Date Picker for the End time
        androidVariant="iosClone"
        modal
        mode="datetime"
        open={open1}
        date={eventEndTime}
        minimumDate={eventStartTime}
        onConfirm={date => {
          setOpen1(false);
          setEventEndTime(date);
        }}
        onCancel={() => {
          setOpen1(false);
        }}
      />

      <ScrollView>
        <View style={styles.headingContainer}>
          <Pressable onPress={buttonPressed}>
            <FontAwesome
              name="angle-left"
              style={styles.backButton}
              color={'black'}
            />
          </Pressable>
          <Text style={styles.pageHeadingText}> Create Event </Text>
        </View>
        <View style={styles.bannerUpload}>
          <View style={styles.bannerContainer}>
            <Text style={styles.uploadTxt}>
              {' '}
              Upload your event banner here.
            </Text>
            <Pressable onPress={browseFunc}>
              <Text style={styles.browseTxt}>Browse</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.eventOneLineContainer}>
          <Text style={styles.txtTitle}> Event Name </Text>
          <View style={styles.eOneLineInner}>
            <TextInput
              onChangeText={setEventName}
              value={eventName}
              editable
              style={styles.txtInput}
              maxLength={50}></TextInput>
          </View>
        </View>

        <View style={styles.descriptionBoxContainer}>
          <Text style={styles.txtTitle}> Description </Text>
          <View style={styles.descriptionBox}>
            <TextInput
              editable
              multiline
              onChangeText={setEventDescription}
              value={eventDescription}
              style={styles.descInput}
              maxLength={548}></TextInput>
          </View>
        </View>

        <View style={styles.eventOneLineContainer}>
          <Text style={styles.txtTitle}> Start Date/Time </Text>
          <Pressable onPress={handleOnPress}>
            <Calendar
              name="calendar"
              style={styles.calendarButton}
              color={'black'}></Calendar>
          </Pressable>
          <View style={styles.eOneLineInner}>
            <TextInput
              value={eventStartTime.toString()}
              editable
              style={styles.txtInput}
              maxLength={50}></TextInput>
          </View>
        </View>

        <View style={styles.eventOneLineContainer}>
          <Text style={styles.txtTitle}> End Date/Time </Text>
          <Pressable onPress={handleOnPress2}>
            <Calendar
              name="calendar"
              style={styles.calendarButton}
              color={'black'}></Calendar>
          </Pressable>
          <View style={styles.eOneLineInner}>
            <TextInput
              value={eventEndTime.toString()}
              editable
              style={styles.txtInput}
              maxLength={50}></TextInput>
          </View>
        </View>

        <View style={styles.eventOneLineContainer}>
          <Text style={styles.txtTitle}> Location </Text>
          <View style={styles.eOneLineInner}>
            <TextInput
              onChangeText={setEventLocation}
              value={eventLocation}
              editable
              style={styles.txtInput}
              maxLength={50}></TextInput>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={createButtonPressed}
            type="Add"
            text="Create"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = ScaledSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  headingContainer: {
    paddingTop: '10@ms',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageHeadingText: {
    fontSize: RFPercentage(4),
    color: '#000',
    fontFamily: 'OpenSans-SemiBold',
    left: '5@ms',
  },
  backButton: {
    fontSize: RFPercentage(3),
    position: 'absolute',
    bottom: '-30%',
    right: '50@ms',
  },
  bannerUpload: {
    marginTop: '20@ms',
    justifyContent: 'center',
    marginLeft: '25@ms',
    marginRight: '25@ms',
  },
  bannerContainer: {
    padding: '45@ms',
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderRadius: '20@ms',
  },
  uploadTxt: {
    color: '#000',
  },
  browseTxt: {
    color: '#FF3008',
    textDecorationLine: 'underline',
  },
  eventOneLineContainer: {
    marginTop: '25@ms',
    marginLeft: '25@ms',
    marginRight: '25@ms',
  },
  // E meaning Event - These are description boxes
  eOneLineInner: {
    backgroundColor: '#EEE',
    borderRadius: '15@ms',
  },
  txtTitle: {
    color: '#000',
    marginBottom: '5@ms',
    fontSize: RFPercentage(1.9),
    fontFamily: 'Inter-Regular',
  },
  txtInput: {
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(1.8),
    textDecorationLine: 'none',
    marginLeft: '10@ms',
  },
  descriptionBoxContainer: {
    marginTop: '25@ms',
    marginLeft: '25@ms',
    marginRight: '25@ms',
  },
  descriptionBox: {
    padding: '80@ms',
    backgroundColor: '#eee',
    borderRadius: '20@ms',
  },
  descInput: {
    right: '50%',
    width: '200%',
  },
  buttonContainer: {
    margin: '30@ms',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#FF3008',
    paddingHorizontal: '35@ms',
    paddingVertical: '15@ms',
    borderRadius: '30@ms',
  },
  createTxt: {
    fontSize: RFPercentage(2.8),
    color: '#fff',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingRight: '5@ms',
  },
  calendarButton: {
    fontSize: RFPercentage(3.3),
    position: 'absolute',
    bottom: '7.5@ms',
    right: '50@ms',
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AddEventScreen;
