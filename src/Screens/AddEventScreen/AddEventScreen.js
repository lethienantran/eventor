import {
  View,
  Text,
  Pressable,
  ScrollView,
  Keyboard,
  Modal,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
// Icons and Fonts
import {RFPercentage} from 'react-native-responsive-fontsize';

// Database
import {DBContext} from '../../../App';
import CustomButton from '../../components/CustomButton';
// Images
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Logo from '../../components/Logo';
import CustomInputField from '../../components/CustomInputField';
//Date Picker
import StartEventTimePicker from '../../components/StartEventTimePicker';
import EndEventTimePicker from '../../components/EndEventTimePicker';

const AddEventScreen = () => {
  const [keyBoardStatus, setKeyboardStatus] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  /* Storing User Data entries */
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartTime, setEventStartTime] = useState(new Date());
  const [eventEndTime, setEventEndTime] = useState(new Date());
  const [endDateText, setEndDateText] = useState(eventStartTime);
  //get CurrentDate to set minimumDate
  const currentDate = new Date();

  //variable to setMaxDate to 7 years from now
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 7);

  /* Setting Img UseState */
  const [image, setImage] = useState(null);

  /*Inputting data in DB*/
  const db = useContext(DBContext);

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  //when BackButton pressed
  const onBackPressed = () =>{
    navigation.goBack();
  };

  //browse image
  const onBrowsePressed = () => {
    const options = {};
    //open the gallery
    launchImageLibrary(options, (response) => {
      if (response && response.assets) {
        console.log('Image Selected:', response.assets[0].uri);
        setImage(response.assets[0].uri);
      }
    });
  };

  const onCreatePressed = async() => {
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
      const imageData = (image !== null ? (await RNFS.readFile(image, 'base64')) : (null));
      db.transaction(tx => {
        tx.executeSql(
          //Insert all entered values.
          `INSERT INTO events 
          (eventName, eventStartTime, eventEndTime, eventCaption, eventImage, eventProgress, location) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            eventName,
            eventStartTime.toString(),
            eventEndTime.toString(),
            eventDescription,
            imageData,
            0,
            eventLocation,
          ],
          (tx, results) => {
            console.log("Event successfully uploaded to database and go back");
            navigation.goBack();
          },
          error => {
            console.log("Error uploading event to database: ", error);
          }
        );
      });
    }
    catch(error){
      console.log("error reading image file: ", error);
    }
  };
  useEffect(()=>{

    // console.log("eventName: " + eventName);
    // console.log("eventDescription: " + eventDescription); 
    // console.log("eventStartTime: " + eventStartTime);
    // console.log("eventEndTime: " + eventEndTime);
    // console.log("eventImage: " + image);
    // console.log("eventLocation: " + eventLocation);

    });
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
        <Logo hasBack={true} title='Create Event' onPress={onBackPressed}/>
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
              <CustomInputField value={eventDescription} setValue={setEventDescription} title={'Description (' + (!eventDescription ? 0 : eventDescription.length) + '/120)'} maxLength = {120} editable={true} selectTextOnFocus={true} type='descriptionField'/>
              <StartEventTimePicker 
                minDate={currentDate} 
                maxDate={maxDate} 
                setEndDateText = {setEndDateText} 
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
         <View style={styles.buttonContainer}>
          <CustomButton onPress={()=>{onCreatePressed(image)}} type="Add" text="Create" />
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
  buttonContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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

export default AddEventScreen;
