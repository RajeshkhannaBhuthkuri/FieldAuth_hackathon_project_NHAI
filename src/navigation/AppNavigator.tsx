import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AuthenticateScreen from '../screens/AuthenticateScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import SyncScreen from '../screens/SyncScreen';
import EmployeeDirectoryScreen from '../screens/EmployeeDirectoryScreen';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Authenticate: undefined;
  Attendance: undefined;
  Sync: undefined;
  EmployeeDirectory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'FieldAuth'}}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{title: 'Register Employee'}}
        />

        <Stack.Screen
          name="Authenticate"
          component={AuthenticateScreen}
          options={{title: 'Authenticate Employee'}}
        />

        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{title: 'Attendance Logs'}}
        />

        <Stack.Screen
          name="Sync"
          component={SyncScreen}
          options={{title: 'Sync Pending Records'}}
        />

        <Stack.Screen
          name="EmployeeDirectory"
          component={EmployeeDirectoryScreen}
          options={{title: 'Employee Directory'}}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}