import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DatePicker from 'react-native-date-picker';
const StartEventTimePicker = ({
  minDate,
  maxDate,
  startTime,
  setStartTime,
  setEndDateText,
  title,
}) => {
  const [open, setOpen] = useState(false);
  //confirmed date string to display on view
  const dateString = startTime.toLocaleString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return (
    <>
      <Pressable
        style={styles.root}
        onPress={() => {
          setOpen(true);
        }}>
        <View style={styles.titleContainer}>
          <Text style={styles.fieldTitle}>{title}</Text>
          <EvilIcons name="calendar" style={styles.calendarIcon} />
        </View>
        <View style={styles.inputField}>
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
      </Pressable>
      <DatePicker
        modal
        mode="datetime"
        open={open}
        date={startTime}
        minimumDate={minDate}
        maximumDate={maxDate}
        onConfirm={date => {
          setOpen(false);
          setStartTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  root: {
    marginVertical: '1%',
    width: '100%',
    height: '75@vs',
  },
  titleContainer: {
    width: '100%',
    height: '30@vs',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldTitle: {
    marginVertical: '1@vs',
    fontFamily: 'OpenSans-Regular',
    color: 'black',
    fontSize: RFPercentage(2.25),
  },
  calendarIcon: {
    marginVertical: '1@vs',
    fontSize: RFPercentage(4),
  },
  inputField: {
    borderRadius: '20@ms',
    backgroundColor: '#EEEEEE',
    height: '60%',
    justifyContent: 'center',
  },
  dateText: {
    marginLeft: '15@ms',
    color: 'black',
    fontSize: RFPercentage(2.25),
  },
  buttonContainer: {
    borderRadius: '20@ms',
    backgroundColor: '#EEEEEE',
    height: '60%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  buttonText: {
    fontFamily: 'OpenSans-Regular',
    color: 'black',
    fontSize: RFPercentage(2.25),
  },
});
export default StartEventTimePicker;
