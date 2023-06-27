import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './loginScreen';
import RegisterScreen from './registerScreen';
import MainScreen from './mainScreen';
import Fetch from './Fetch';
import ChatScreen from './ChatScreen';


const Stack = createNativeStackNavigator();

export default function NavigationScreen() {
  return (
    
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
          <Stack.Screen name="main" component={MainScreen} options={{headerShown:false}}/>
          <Stack.Screen name="fetch" component={Fetch} options={{headerShown:false}}/>
          <Stack.Screen name="Chats" component={ChatScreen }  options={{
          title: 'My Chats',
          headerStyle: {
            backgroundColor: '#F3F1F1',
            
          },
          headerTintColor: 'orange',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/>
          
        </Stack.Navigator>
      </NavigationContainer>
  )
}