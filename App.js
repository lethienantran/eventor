import React, {createContext, useEffect} from 'react';
import AddEventScreen from './src/Screens/AddEventScreen';
import AddTaskScreen from './src/Screens/AddTaskScreen';
import EditEventScreen from './src/Screens/EditEventScreen';
import EditTaskScreen from './src/Screens/EditTaskScreen';
import EventDetailScreen from './src/Screens/EventDetailScreen';
import FilteredEventScreen from './src/Screens/FilteredEventScreen';
import HomeScreen from './src/Screens/HomeScreen';
import LandingScreen from './src/Screens/LandingScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, View} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
const Stack = createStackNavigator();

const db = SQLite.openDatabase(
  {
    name: 'eventorDB.db',
    createFromLocation: 1,
  },
  () => {
    console.log('Database opened successfully');
  },
  error => {
    console.log(error);
  },
);

export const DBContext = createContext({});

const App = () => {
  //update eventProgress every time, eventProgress = all done task of the same eventID / all task of the same eventID
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `
        UPDATE events
        SET eventProgress =ROUND( (
            SELECT CAST(SUM(done_count) AS FLOAT) / CAST(SUM(total_count) AS FLOAT) * 100
            FROM (
                SELECT eventID, COUNT(*) AS total_count, SUM(CASE WHEN taskStatus = 'done' THEN 1 ELSE 0 END) AS done_count
                FROM tasks
                GROUP BY eventID
            ) t
            WHERE t.eventID = events.eventID
        ))
    `,
        [],
        (_, result) => {},
        (_, error) => {
          console.log('Error updating event progress', error);
        },
      );
    });
  });

  return (
    <DBContext.Provider value={db}>
      <NavigationContainer>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
          <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
          <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
          <Stack.Screen name="EditTaskScreen" component={EditTaskScreen} />
          <Stack.Screen
            name="EventDetailScreen"
            component={EventDetailScreen}
          />
          <Stack.Screen
            name="FilteredEventScreen"
            component={FilteredEventScreen}
          />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DBContext.Provider>
  );
};

export default App;
