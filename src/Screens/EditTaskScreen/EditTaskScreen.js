import {View, Text, Pressable} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import Inoicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Logo from '../../components/Logo';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CustomInputField from '../../components/CustomInputField';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import {DBContext} from '../../../App';
import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditTaskScreen = ({route}) => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  const db = useContext(DBContext);
  
  const [taskStatus, setTaskStatus] = useState(route.params.taskStatus);
  const [eventName, setEventName] = useState(route.params.eventName);
  const [taskName, setTaskName] = useState(route.params.taskName);

  const onBackPressed = () => {
    navigation.goBack();
  };

  const onTaskStatusPressed = () =>{
    setTaskStatus(taskStatus==='incomplete' ? 'done' : 'incomplete');
  };

  const onEditPressed = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tasks (taskName, taskStatus, eventID) VALUES (?, ?, ?)',
        [taskName, 'incomplete', currentSelectedEventID],
        (tx, results) => {
          console.log('Task \"' + taskName + '\" successfully added to ' + eventName + '\'s id:' + currentSelectedEventID);
          navigation.goBack();   
        },
        error => {
          console.log("Error adding task to database: ", error);
        }
      );
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.container}>
        <Logo onPress={onBackPressed} title="Edit Task" hasBack="true" />
        <View style={styles.contentContainer}>
          <View style={styles.statusBarContainer}>
            {taskStatus !== 'done' ? (
                <Octicons
                  name="pulse"
                  style={[styles.taskStatusIcon, styles.inProgressIcon]}
                />
              ) : (
                <Feather
                  name="check-circle"
                  style={[styles.taskStatusIcon, styles.doneIcon]}
                />
              )}
            <Text style={styles.questionText}>{taskStatus}</Text>
          </View>
          <View style={styles.taskInfoContainer}>
            <CustomInputField
              value={eventName}
              setValue={setEventName}
              title={'Part of Event'}
              editable={false}
              selectTextOnFocus={false}
            />
            <CustomInputField
              value={taskName}
              setValue={setTaskName}
              title={'Task Name'}
              editable={true}
              selectTextOnFocus={true}
            />
            <CustomInputField
              value={taskStatus}
              setValue={setTaskStatus}
              title={'Task Status'}
              editable={false}
              selectTextOnFocus={false}
              isButton={true}
              onPress={onTaskStatusPressed}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton onPress={onEditPressed} type="Add" text="Update" />
          </View>
        </View>
      </View>
    </ScrollView>
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
    // backgroundColor:'pink',
  },
  statusBarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '40@vs',
    paddingHorizontal:'12@ms',
    alignItems: 'center',
    borderRadius:'20@ms',
    backgroundColor: '#FFF',
    borderWidth: '2@ms',
    borderColor: 'black',
  },
  taskStatusIcon: {
    fontSize: RFPercentage(3.5),
    color: 'black',
  },
  inProgressIcon:{
    color: '#D9A900',
  },
  doneIcon: {
    color: '#21B608',
  },
  questionText: {
    fontSize: RFPercentage(2.25),
    fontFamily: 'Inter-Regular',
    color: 'black',
    marginLeft: '4%',
  },
  taskInfoContainer: {
    flexDirection: 'column',
    width: '100%',
    height: '428@vs',
    // backgroundColor:'grey',
  },
  buttonContainer: {
    width: '100%',
    height: '20%',
    // backgroundColor:'yellow',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default EditTaskScreen;
