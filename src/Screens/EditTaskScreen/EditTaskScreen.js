import {View, Text, Pressable} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import Logo from '../../components/Logo';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CustomInputField from '../../components/CustomInputField';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import {DBContext} from '../../../App';
import Octicons from 'react-native-vector-icons/Octicons';

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

  const onUpdatePressed = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tasks SET taskName = ?, taskStatus = ? WHERE taskID = ? AND eventID = ?',
        [taskName, taskStatus, route.params.taskID, route.params.eventID],
        (tx, results) => {
          console.log('TaskID: ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID + ' successfully updated. Status: ' + taskStatus);
          navigation.goBack();   
        },
        error => {
          console.log('Error update TaskID: ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID, error);
        }
      );
    });
  };

  const onDeletePressed = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tasks WHERE taskID = ? AND eventID = ?',
        [route.params.taskID, route.params.eventID],
        (tx, results) => {
          console.log('TaskID: ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID + ' successfully deleted.');
          navigation.goBack();   
        },
        error => {
          console.log('Error delete TaskID: ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID, error);
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
              title={'Task Name (' + (!taskName ? 0 : taskName.length) + '/30)'}
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
          <View style={styles.buttonsContainer}>
            <CustomButton onPress={onUpdatePressed} type="Update" text="Update" />
            <Pressable style={styles.deleteButtonContainer} onPress={onDeletePressed}>
              <Feather name='trash-2' style={styles.deleteIcon}/>
            </Pressable>
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
});
export default EditTaskScreen;
