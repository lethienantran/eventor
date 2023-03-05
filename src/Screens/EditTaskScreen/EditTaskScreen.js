import {View, Text, Pressable, Modal} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

//icons
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

//stylesheet
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';

//components
import Logo from '../../components/Logo';
import CustomInputField from '../../components/CustomInputField';
import CustomButton from '../../components/CustomButton';

//database
import SQLite from 'react-native-sqlite-storage';

const EditTaskScreen = ({route}) => {

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  
  //modal for notification
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  //initialize with whatever state the task is, can be either complete or inprogress state (ip or cp)
  const [taskStatus, setTaskStatus] = useState(route.params.taskStatus);
  //to display what event is in use passed value
  const [eventName, setEventName] = useState(route.params.eventName);
  //input usestate, initialize with the passed value selected task name
  const [taskName, setTaskName] = useState(route.params.taskName);

  //on go back pressed then go back
  const onBackPressed = () => {
    navigation.goBack();
  };

  //if tasks status pressed, toggle states
  const onTaskStatusPressed = () =>{
    setTaskStatus(taskStatus==='ip' ? 'cp' : 'ip');
  };

  //if update pressed, update values in datadabase, and update progress of event
  const onUpdatePressed = () => {
    if(!taskName || taskName.length === 0){
      setModalVisible(true);
      setModalMessage('Please enter a task name. It can be no longer than 30 characters.');
      return false;
    }
    const db = SQLite.openDatabase(
      {
        name: 'eventorDB.db',
        createFromLocation: 1,
      },
      () => {
        console.log('EditTaskScreen: Database opened successfully');
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE tasks SET taskName = ?, taskStatus = ? WHERE taskID = ? AND eventID = ?',
            [taskName, taskStatus, route.params.taskID, route.params.eventID],
            (tx, results) => {
              console.log('EditTaskScreen: TaskID - ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID + ' successfully updated. Status: ' + taskStatus); 
            },
            error => {
              console.error('EditTaskScreen: Error update TaskID - ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID, error);
            }
          );
          tx.executeSql(
            `UPDATE events 
            SET eventProgress = ROUND((
              SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks WHERE eventID = ?) 
              FROM tasks 
              WHERE eventID = ? AND taskStatus = 'cp'
            ))
            WHERE eventID = ?;`,
            [route.params.eventID, route.params.eventID, route.params.eventID],
            (tx, results) => {
              console.log("EditTaskScreen: Update eventProgress Successfully");
              console.log("EditTaskScreen: Database close.");
              navigation.goBack();   
              db.close();
            },
            error => {
              console.error("EditTaskScreen: Can't update eventProgress, error: " + error);
            }
          )
        });
      },
      error => {
        console.error(error);
      },
    );
  };

  //if delete press, delete task from tasks table and update progress
  const onDeletePressed = () => {
    const db = SQLite.openDatabase(
      {
        name: 'eventorDB.db',
        createFromLocation: 1,
      },
      () => {
        console.log('EditTaskScreen: Database opened successfully');
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM tasks WHERE taskID = ? AND eventID = ?',
            [route.params.taskID, route.params.eventID],
            (tx, results) => {
              console.log('EditTaskScreen: TaskID - ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID + ' successfully deleted.'); 
            },
            error => {
              console.log('EditTaskScreen: Error delete TaskID - ' + route.params.taskID + ' - \"' + taskName + '\" from eventID: ' + route.params.eventID, error);
            }
          );
          tx.executeSql(
            `UPDATE events 
            SET eventProgress = COALESCE(
                ROUND((
                    SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks WHERE eventID = ?) 
                    FROM tasks 
                    WHERE eventID = ? AND taskStatus = 'cp'
                )), 
                0
            )
            WHERE eventID = ?;`,
            [route.params.eventID, route.params.eventID, route.params.eventID],
            (tx, results) => {
              console.log("EditTaskScreen: Update eventProgress Successfully");
              navigation.goBack();   
              console.log("EditTaskScreen: Database close.");
            },
            error => {
              console.log("EditTaskScreen: Can't update eventProgress, error: " + error);
            }
          )
        });
      },
      error => {
        console.log(error);
      },
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.root}>
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
        <Logo onPress={onBackPressed} title="Edit Task" hasBack="true" />
        <View style={styles.contentContainer}>
          <View style={styles.statusBarContainer}>
            {taskStatus !== 'cp' ? (
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
            <Text style={styles.questionText}>{taskStatus === 'ip' ? 'In-Progress' : 'Complete'}</Text>
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
              value={taskStatus === 'ip' ? 'In-Progress' : 'Complete'}
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
export default EditTaskScreen;
