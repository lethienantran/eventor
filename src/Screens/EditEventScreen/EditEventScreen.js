import {
  View,
  Text,
  Pressable,
  ScrollView,
  Keyboard,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import CustomButton from '../../components/CustomButton';
// Icons and Fonts
import {RFPercentage} from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
// Database
import SQLite from 'react-native-sqlite-storage';
// Images
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Logo from '../../components/Logo';
import CustomInputField from '../../components/CustomInputField';
//Date Picker
import StartEventTimePicker from '../../components/StartEventTimePicker';
import EndEventTimePicker from '../../components/EndEventTimePicker';


const EditEventScreen = ({route}) => {

  /*Inputting data in DB*/

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  /* Setting Img UseState */
  const [image, setImage] = useState(null);

  //keyboard status to check for if keyboard is active or not - use for fitting input fields in scroll view
  const [keyBoardStatus, setKeyboardStatus] = useState(false);

  //modal for notification
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  //use state of whether the banner is update or not, if update gonna use the new one, if not then keep the old data
  const[isBannerUpdate,setBannerUpdate] = useState(false); 

  //get CurrentDate to set minimumDate from current date
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 7);

  //variable to setMaxDate to 7 years from now
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 7);
  
  /* Storing User Data entries */
  const [eventName, setEventName] = useState(route.params.eventName);
  const [eventDescription, setEventDescription] = useState(route.params.eventDescription);
  const [eventLocation, setEventLocation] = useState(route.params.eventLocation);
  const [eventStartTime, setEventStartTime] = useState(new Date(route.params.eventStartTime));
  const [eventEndTime, setEventEndTime] = useState(new Date(route.params.eventEndTime));
  const [endDateText, setEndDateText] = useState(eventEndTime);

  //browse image
  const onBrowsePressed = () => {
    const options = {};
    //open the gallery
    launchImageLibrary(options, (response) => {
      if (response && response.assets) {
        console.log('Image Selected:', response.assets[0].uri);
        setImage(response.assets[0].uri);
        setBannerUpdate(true);
      }
    });
  };

  //when BackButton pressed, just go back
  const onBackPressed = () =>{
    console.log('EditEventScreen: Go Back.')
    navigation.goBack();
  };

  //delete event and task when pressed delete button
  const onDeletePressed = () => {
    const db = SQLite.openDatabase(
    {
      name: 'eventorDB.db',
      createFromLocation: 1,
    },
    () => {
      console.log('EditEventScreen: Database opened successfully');
      db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM tasks WHERE eventID == ?',
            [route.params.eventID],
            (tx, results) => {
              console.log('EditEventScreen: Tasks from ' + route.params.eventID + ' - \"' + eventName + '\" successfully deleted.');
            },
            error => {
              console.log('EditEventScreen: Error delete tasks from eventID: ' + route.params.eventID + '.', error);
            }
          );
          tx.executeSql(
            'DELETE FROM events WHERE eventID == ?',
            [route.params.eventID],
            (tx, results) => {
              console.log('EditEventScreen: EventID: ' + route.params.eventID + ' - \"' + eventName + '\" successfully deleted.');
              navigation.goBack();   
              navigation.goBack();   
              console.log('EditEventScreen: Database close.');
              db.close();
            },
            error => {
              console.log('EditEventScreen: Error delete event of eventID: ' + route.params.eventID + '.', error);
            }
          );
      });
    },
    error => {
      console.log(error);
    },
    );
  };

  //update banner if new one is browsed, update event name, location, information
  const onUpdatePressed = async() => {
    try{
      if(!eventName || eventName.length === 0){
        setModalVisible(true);
        setModalMessage('Please enter an event name. It can be no longer than 30 characters.');
        return false;
      }
      else if(!eventLocation || eventLocation.length === 0){
        setModalVisible(true);
        setModalMessage('Please enter a location for your event. It can be no longer than 30 characters.');
        return false;
      }
      //read the file at path - this case is image dir/path and encoded as base64.
      const imageData = (isBannerUpdate !== false ? (await RNFS.readFile(image, 'base64')) : (null));
      const db = SQLite.openDatabase(
        {
          name: 'eventorDB.db',
          createFromLocation: 1,
        },
        () => {
          console.log('EditEventScreen: Database opened successfully');
          db.transaction(tx => {
            if(isBannerUpdate){
              tx.executeSql(
                'UPDATE events SET eventName = ?, eventCaption = ?, eventStartTime = ?, eventEndTime = ?, eventImage = ?, location = ? WHERE eventID = ?',
                [eventName, eventDescription, eventStartTime.toString(), eventEndTime.toString(), imageData, eventLocation, route.params.eventID,],
                (tx, results) => {
                  console.log('EditEventScreen: EventID - ' + route.params.eventID + ' - \"' + eventName + '\" successfully updated.');
                  console.log('EditEventScreen: Database close.')
                  navigation.goBack();   
                },
                error => {
                  console.error('EditEventScreen: Error update EventID - ' + route.params.eventID + ' - \"' + eventName + '\" can\'t updated.', error);
                }
              );
            }
            else{
              tx.executeSql(
                'UPDATE events SET eventName = ?, eventCaption = ?, eventStartTime = ?, eventEndTime = ?, location = ? WHERE eventID = ?',
                [eventName, eventDescription, eventStartTime.toString(), eventEndTime.toString(), eventLocation, route.params.eventID,],
                (tx, results) => {
                  console.log('EditEventScreen: EventID - ' + route.params.eventID + ' - \"' + eventName + '\" successfully updated.');
                  console.log('EditEventScreen: Database close.')
                  navigation.goBack();   
                  db.close();
                },
                error => {
                  console.error('EditEventScreen: Error update EventID - ' + route.params.eventID + ' - \"' + eventName + '\" can\'t updated.', error);
                }
              );
            }
          });
        },
        error => {
          console.log(error);
        },
      );
    }
    catch(error){
      console.log("error reading image file: ", error);
    }
  };

  //start with calling event for 1 time.
  useEffect(()=>{
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
  },[]);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {/* Modal Container */}
        <Modal 
          animationType='slide'
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalMessageText}>{modalMessage}</Text>
              <Pressable onPress={()=>setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Logo hasBack={true} title='Edit Event' onPress={onBackPressed}/>
        <View style={styles.contentContainer}>
          <View style={styles.uploadBannerContainer}>
            <Text style={styles.uploadBannerText}>Upload your event banner here.</Text>
            <Pressable onPress={onBrowsePressed}>
              <Text style={styles.browseText}>Browse</Text>
            </Pressable>
          </View>
          <View style={styles.eventInfoContainer}>
            <ScrollView style={styles.eventInfoScrollView}>
              <CustomInputField value={eventName} setValue={setEventName} title={'Event Name (' + (!eventName ? 0 : eventName.length) + '/30)'} editable={true} selectTextOnFocus={true} />
              <CustomInputField value={eventDescription} setValue={setEventDescription} title={'Description (' + (!eventDescription ? 0 : eventDescription.length) + '/100)'} maxLength = {100} editable={true} selectTextOnFocus={true} type='descriptionField'/>
              <StartEventTimePicker 
                minDate={minDate} 
                maxDate={maxDate} 
                startTime={eventStartTime} 
                title ={"Start Date/Time"} 
                setStartTime = {setEventStartTime}/>
              <EndEventTimePicker
                minDate={eventStartTime}
                maxDate={maxDate}
                endDateText={endDateText}
                setEndDateText={setEndDateText}
                setEndTime={setEventEndTime}
                title={'End Date/Time'}/>
              <CustomInputField value={eventLocation} setValue={setEventLocation} title={'Location (' + (!eventLocation ? 0 : eventLocation.length) + '/30)'} editable={true} selectTextOnFocus={true} />
              <View style={keyBoardStatus ? (styles.bumpLastItemActive) : (styles.bumpLastItemInactive)}/> 
            </ScrollView>
          </View>
          <View style={styles.buttonsContainer}>
            <CustomButton onPress={onUpdatePressed} type="Update" text="Update" />
            <Pressable style={styles.deleteButtonContainer} onPress={onDeletePressed}>
              <Feather name='trash-2' style={styles.deleteIcon}/>
            </Pressable>
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
    // backgroundColor:'green',
  },
  contentContainer:{
    flexDirection: 'column',
    width: '100%',
    height: '91%',
    // backgroundColor:'yellow',
  },
  uploadBannerContainer:{
    flexDiretion:'column',
    justifyContent:'center',
    alignItems:'center',
    width: '100%',
    height: '100@vs',
    borderRadius: '25@ms',
    backgroundColor:'#EEEEEE',
  },
  uploadBannerText:{
    fontFamily:'Inter-Regular',
    fontSize:RFPercentage(2.25),
    color:'black',
  },
  browseText:{
    fontFamily:'Inter-Regular',
    fontSize:RFPercentage(2.25),
    textDecorationLine:'underline',
    color:'#FF3008',
  },
  eventInfoContainer:{
    paddingTop:'20@vs',
    width:'100%',
    height:'376@vs',
  },
  eventInfoScrollView:{
    width:'100%',
  },
  buttonsContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:'yellow',
  },
  deleteButtonContainer:{
    // backgroundColor:'grey',
  },
  deleteIcon:{
    fontSize:RFPercentage(5),
    color:'#ABABAB',
  },
  bumpLastItemActive:{
    height:'120@vs',
  },
  bumpLastItemInactive:{
    height:'10@vs',
  },
  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)'
  },
  modalView:{
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    width:'92%',
    height:'18%',
    borderRadius:'10@ms',
    backgroundColor:'white',
  },
  modalMessageText:{
    textAlign:'center',
    paddingHorizontal:'4%',
    fontFamily:'Inter-Regular',
    fontSize:RFPercentage(2.25),
    color:'black',
    marginVertical:'2%',
  },
  modalCloseText:{
    textAlign:'center',
    fontFamily:'Inter-Regular',
    fontSize:RFPercentage(2),
    color:'#FF3008',
    marginVertical:'2%',
  },
});

export default EditEventScreen;
