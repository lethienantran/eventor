import React, {createContext} from 'react';
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
