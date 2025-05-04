import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/loginScreen';
import RegisterScreen from '../Screens/registerScreen';
import ForgotPasswordScreen from '../Screens/forgotpasswordScreen';
import HomeDrawer from './HomeDrawer';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
  

</Stack.Navigator>
    </NavigationContainer>
    
  );
  
} 
