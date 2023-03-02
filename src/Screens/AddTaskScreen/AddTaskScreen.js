import {View, Text, Pressable, Modal} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import Inoicons from 'react-native-vector-icons/Ionicons';
import Logo from '../../components/Logo';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CustomInputField from '../../components/CustomInputField';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import SQLite from 'react-native-sqlite-storage';

const AddTaskScreen = ({route}) => {

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  //setModalVisibility and message
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [eventName, setEventName] = useState(route.params.eventName);
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('In-Progress');

  const [currentSelectedEventID, setCurrentSelectedEventID] = useState(route.params.eventID);

  const onBackPressed = () => {
    navigation.goBack();
  };

  const onCreatePressed = () => {
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
        console.log('AddTaskScreen: Database opened successfully');
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
        <Logo onPress={onBackPressed} title="Create Task" hasBack="true" />
        <View style={styles.contentContainer}>
          <View style={styles.addTaskQuestion}>
            <Inoicons name="chatbubble-outline" style={styles.bubbleIcon} />
            <Text style={styles.questionText}>What should be done?</Text>
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
            />
          </View>
          <View style={styles.buttonContainer}>
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
