import {View, Text, Pressable} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import Inoicons from 'react-native-vector-icons/Ionicons';
import Logo from '../../components/Logo';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CustomInputField from '../../components/CustomInputField';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import {DBContext} from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const retrieveSelectedEventID = async () => {
  try {
    const currSelectedEventID = await AsyncStorage.getItem('selectedEventID');
    return currSelectedEventID !== null ? currSelectedEventID : null;
  } catch (error) {
    console.error(error);
  }
};

const AddTaskScreen = () => {
  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  const db = useContext(DBContext);

  const [currentSelectedEventID, setCurrentSelectedEventID] = useState();

  const setSelectedEventID = async () => {
    try {
      const val = await retrieveSelectedEventID();
      if (val !== null) {
        return val;
      } else {
        console.error('No SelectedEventID found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setSelectedEventID().then(setCurrentSelectedEventID);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events WHERE eventID = ?',
        [currentSelectedEventID],
        (tx, results) => {
          setEventName(results.rows.item(0).eventName);
        },
      );
      tx.executeSql(
        'SELECT * FROM tasks WHERE tasks.eventID = ?',
        [currentSelectedEventID],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setData(temp);
        },
      );
    });
  }, [currentSelectedEventID]);

  const [eventName, setEventName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('Incomplete');

  const onBackPressed = () => {
    navigation.goBack();
  };

  const onCreatePressed = () => {
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
});
export default AddTaskScreen;
