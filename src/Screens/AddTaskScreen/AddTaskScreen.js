import {View, Text, Pressable, Modal} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
//stylesheet
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
//icons
import Inoicons from 'react-native-vector-icons/Ionicons';
//components
import Logo from '../../components/Logo';
import CustomInputField from '../../components/CustomInputField';
import CustomButton from '../../components/CustomButton';
//database
import SQLite from 'react-native-sqlite-storage';

const AddTaskScreen = ({route}) => {

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  //setModalVisibility and message
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  //eventname use state, initialize with passed event name value
  const [eventName, setEventName] = useState(route.params.eventName);
  //taskName use state
  const [taskName, setTaskName] = useState('');
  //taskstatus, for add task, only allow in progress state
  const [taskStatus, setTaskStatus] = useState('In-Progress');

  //event id for database key, use passed value
  const [currentSelectedEventID, setCurrentSelectedEventID] = useState(route.params.eventID);

  //if back pressed, go back
  const onBackPressed = () => {
    navigation.goBack();
  };

  //if create button pressed, insert task name, task status and event id to tasks table and update progress
  const onCreatePressed = () => {
    //if taskname is blank, show notifications
    if(!taskName || taskName.length === 0){
      setModalVisible(true);
      setModalMessage('Please enter a task name. It can be no longer than 30 characters.');
      return false;
    }
    //open database connection
    const db = SQLite.openDatabase(
      {
        name: 'eventorDB.db',
        createFromLocation: 1,
      },
      //success callback: insert to database and update progress
      () => {
        console.log('AddTaskScreen: Database opened successfully');
        //insert to tasks table
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO tasks (taskName, taskStatus, eventID) VALUES (?, ?, ?)',
            [taskName, 'ip', currentSelectedEventID],
            (tx, results) => {
              console.log('AddTaskScreen: Task \"' + taskName + '\" successfully added to ' + eventName + '\'s id:' + currentSelectedEventID);
            },
            error => {
              console.log("AddTaskScreen: Error adding task to database: ", error);
            }
          );
          //update progress 
          tx.executeSql(
            `UPDATE events 
            SET eventProgress = Round((
              SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks WHERE eventID = ?) 
              FROM tasks 
              WHERE eventID = ? AND taskStatus = 'cp'
            ))
            WHERE eventID = ?;`,
            [currentSelectedEventID,currentSelectedEventID, currentSelectedEventID],
            (tx, results) => {
              console.log("AddTaskScreen: Update Successfully");
              console.log('AddTaskScreen: Database close.');
              navigation.goBack();   
              db.close();
            },
            error => {
              console.log("AddTaskScreen: Can't update, error: " + error);
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
    //Scroll View/can be view tho :))
    <ScrollView contentContainerStyle={styles.root}>
      {/* big container center 85% wide */}
      <View style={styles.container}>
        {/* modal container */}
      <Modal 
          animationType='fade'
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
        {/* logo component, has back button */}
        <Logo onPress={onBackPressed} title="Create Task" hasBack="true" />
        {/* content container, everything below logo goes here */}
        <View style={styles.contentContainer}>
          {/* wrapper wrap bubble icons and "what should be done" text */}
          <View style={styles.addTaskQuestion}>
            <Inoicons name="chatbubble-outline" style={styles.bubbleIcon} />
            <Text style={styles.questionText}>What should be done?</Text>
          </View>
          {/* task info input fields */}
          <View style={styles.taskInfoContainer}>
            {/* displaying what event name belongs to, CAN'T be edit! */}
            <CustomInputField
              value={eventName}
              setValue={setEventName}
              title={'Part of Event'}
              editable={false}
              selectTextOnFocus={false}
            />
            {/* input field for task name */}
            <CustomInputField
              value={taskName}
              setValue={setTaskName}
              title={'Task Name (' + (!taskName ? 0 : taskName.length) + '/30)'}
              editable={true}
              selectTextOnFocus={true}
            />
            {/* displaying status of task, because it is add task, CAN'T be edit (only inprogress state) */}
            <CustomInputField
              value={taskStatus}
              setValue={setTaskStatus}
              title={'Task Status'}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          {/* container wraps buttons */}
          <View style={styles.buttonContainer}>
            {/* custom button component (create button) */}
            <CustomButton onPress={onCreatePressed} type="Add" text="Create" />
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
  addTaskQuestion: {
    flexDirection: 'row',
    width: '100%',
    height: '40@vs',
    alignItems: 'center',
  },
  bubbleIcon: {
    fontSize: RFPercentage(6),
    color: 'black',
  },
  questionText: {
    fontSize: RFPercentage(2.25),
    fontFamily: 'Inter-Regular',
    color: 'black',
    marginLeft: '2%',
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
export default AddTaskScreen;
