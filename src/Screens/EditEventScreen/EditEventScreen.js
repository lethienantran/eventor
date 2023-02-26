import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Delete from 'react-native-vector-icons/AntDesign';
import Calendar from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-modern-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getToday, getFormatedDate} from 'react-native-modern-datepicker';

const EditEventScreen = () => {
  const today = new Date();

  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1, 'YYYY/MM/DD'),
  );

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(false);

  function handleOnPress() {
    setOpen(!open);
  }

  function handleChange(propDate) {
    setDate(propDate);
  }

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  const buttonPressed = () => {
    navigation.navigate('HomeScreen');
  };
  return (
    <View style={styles.root}>
      <Modal animationType="slide" transparent={true} visible={open}>
        <View style={styles.centerView}>
          <View style={styles.modalView}>
            <DatePicker
              minimumDate={startDate}
              mode={'datepicker'}
              selected={date}
              onDateChanged={handleChange}
            />

            <Pressable onPress={handleOnPress}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView>
        <View style={styles.headingContainer}>
          <Pressable onPress={buttonPressed}>
            <FontAwesome
              name="angle-left"
              style={styles.backButton}
              color={'black'}
            />
          </Pressable>
          <Text style={styles.pageHeadingText}> Update Event </Text>
        </View>
        <View style={styles.bannerUpload}>
          <View style={styles.bannerContain}>
            <Text style={styles.uploadTxt}>
              {' '}
              Upload your event banner here.
            </Text>
            <Text style={styles.browseTxt}> Browse </Text>
          </View>
        </View>

        <View style={styles.eventOneLineContainer}>
          <Text style={styles.txtTitle}> Event Name </Text>
          <View style={styles.eOneLineInner}>
            <TextInput
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
              style={styles.descriptionInput}
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
              editable
              style={styles.txtInput}
              maxLength={50}></TextInput>
          </View>
        </View>

        <View style={styles.eventOneLineContainer}>
          <Text style={styles.txtTitle}> End Date/Time </Text>
          <Pressable onPress={handleOnPress}>
            <Calendar
              name="calendar"
              style={styles.calendarButton}
              color={'black'}></Calendar>
          </Pressable>
          <View style={styles.eOneLineInner}>
            <TextInput
              editable
              style={styles.txtInput}
              maxLength={50}></TextInput>
          </View>
        </View>

        <View style={styles.eventOneLineContainer}>
          <Text style={styles.txtTitle}> Location </Text>
          <View style={styles.eOneLineInner}>
            <TextInput
              editable
              style={styles.txtInput}
              maxLength={50}></TextInput>
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <Pressable onPress={buttonPressed}>
            <View style={styles.UpdateButton}>
              <Text editable style={styles.updateTxt}>
                Update
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable style={styles.deleteButtonContainer} onPress={buttonPressed}>
          <Delete name="delete" style={styles.deleteButton} color={'black'} />
        </Pressable>
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
  bannerContain: {
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
  descriptionInput: {
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(1.8),
    right: '50%',
    width: '200%',
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

  bottomButtonContainer: {
    margin: '30@ms',
    alignItems: 'center',
    flexDirection: 'row',
  },
  UpdateButton: {
    backgroundColor: '#FF3008',
    paddingHorizontal: '35@ms',
    paddingVertical: '15@ms',
    borderRadius: '30@ms',
    marginLeft: '5@ms',
  },
  updateTxt: {
    fontSize: RFPercentage(2.8),
    color: '#fff',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingRight: '5@ms',
  },
  deleteButtonContainer: {
    position: 'absolute',
    left: '100%',
    bottom: '5%',
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
  calendarButton: {
    fontSize: RFPercentage(3.3),
    position: 'absolute',
    bottom: '7.5@ms',
    right: '50@ms',
  },
  deleteButton: {
    fontSize: RFPercentage(3.5),
    position: 'absolute',
    bottom: '-30%',
    right: '50@ms',
  },
});
export default EditEventScreen;

{
  /* <Pressable onPress={buttonPressed}>
              <Delete name="delete" style={styles.backButton} color={'black'} />
            </Pressable> */
}
