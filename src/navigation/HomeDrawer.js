import React from 'react';
import  {createDrawerNavigator}  from '@react-navigation/drawer';
import HomeScreen from '../Screens/HomeScreen';
import AboutScreen from '../Screens/DrawerScreens/AboutScreen'; 
import CarScreen from '../Screens/DrawerScreens/CarScreen';
import ServiceScreen from '../Screens/DrawerScreens/ServiceScreen';
import BlogScreen from '../Screens/DrawerScreens/BlogScreen';
import ContactScreen from '../Screens/DrawerScreens/ContactScreen';

const Drawer = createDrawerNavigator();

export default function HomeDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Car" component={CarScreen} />
      <Drawer.Screen name="Service" component={ServiceScreen} />
      <Drawer.Screen name="Blog" component={BlogScreen} />
      <Drawer.Screen name="Contact" component={ContactScreen} />
    </Drawer.Navigator>
  );
}