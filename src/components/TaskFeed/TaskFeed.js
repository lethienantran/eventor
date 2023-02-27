import {View, Text, Pressable, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {DBContext} from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const TaskFeed = (props) => {

  const [data, setData] = useState([]);

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  const db = useContext(DBContext);

  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE tasks.eventID = ?',
        [props.eventID],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setData(temp);
        },
      );
    });
  },[data]);

  const listItemView = item => {
    return (
      <View key={item.taskID} style={styles.taskContainer}>
        <View style={styles.taskInfoContainter}>
          {item.taskStatus === 'incomplete' ? (
            <Octicons
              name="pulse"
              style={[styles.taskStatusIcon, styles.taskIncomplete]}
            />
          ) : (
            <Feather
              name="check-circle"
              style={[styles.taskStatusIcon, styles.taskDone]}
            />
          )}
          <Text style={styles.taskName}>{item.taskName}</Text>
        </View>
        <Pressable style={styles.taskEditButton} onPress={()=> onEditPressed(item.taskStatus, props.eventName, item.taskName, item.taskID, props.eventID)}>
          <Feather name="edit-3" style={styles.editTaskIcon} />
        </Pressable>
      </View>
    );
  };

  const onEditPressed = (selectedTaskStatus, selectedEventName, selectedTaskName, selectedTaskID, selectedEventID) => {
    //navigate to edit task screen
    navigation.navigate('EditTaskScreen', 
                      {taskStatus: selectedTaskStatus, eventName: selectedEventName, taskName: selectedTaskName, taskID: selectedTaskID, eventID: selectedEventID});
  };

  return (
    <View style={styles.taskList}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => listItemView(item)}
      />
  </View>
  );
};

const styles = ScaledSheet.create({
  taskList: {
    paddingVertical: '2.5%',
    width: '100%',
    height: '38%',
    flexDirection: 'column',
  },
  taskContainer: {
    marginVertical: '3.2%',
    width: '100%',
    height: '55@vs',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: '6%',
    borderWidth: '2@ms',
    borderColor: 'black',
    borderRadius: '20@ms',
  },
  taskInfoContainter: {
    flexDirection: 'row',
    width: '88%',
    height: '100%',
    alignItems: 'center',
  },
  taskStatusIcon: {
    fontSize: RFPercentage(2.5),
  },
  taskIncomplete: {
    color: '#D9A900',
  },
  taskDone: {
    color: '#21B608',
  },
  taskName: {
    marginLeft: '4%',
    fontSize: RFPercentage(2.25),
    fontFamily: 'Inter-Regular',
    color: 'black',
  },
  taskEditButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '10%',
    height: '100%',
  },
  editTaskIcon: {
    fontSize: RFPercentage(2.5),
    color: 'black',
  },
});
export default TaskFeed;