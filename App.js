import React, { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

import HomeScreen from './components/HomeScreen'
import AutoCalculator from './components/AutoScreen'
import ManualCalculator from './components/ManualScreen'

const { AsyncStorage } = require("react-native")


const App = () => {

  const [onboarded, setOnboarded] = useState(false)

  const isFirstTime = async () => {
    try {
      const value = await AsyncStorage.getItem('first_time');
      if (value === null || value === 'true') {
        setOnboarded(false);
      } else if (value === 'false') {
        setOnboarded(true);
      }
    } catch (error) {
      console.log({ error });
    }
  }

  const onDone = async () => {
    console.log("onDone called")
    try {
      await AsyncStorage.setItem('first_time', 'false');
      setOnboarded(true);
    } catch (error) { }
  };

  useEffect(() => {
    isFirstTime();
  }, []);

  const Tab = createBottomTabNavigator()

  return (
    <>
      {!onboarded ? (
        <Onboarding onDone={onDone} />
      ) : (
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
  
                tabBarIcon: ({ color, size }) => {
  
                  if (route.name === 'Home') {
                    return <Icon name="home" size={size} color={color} />;
                  } else if (route.name === 'Auto') {
                    return <Icon name="cube" size={size} color={color} />;
                  } else if (route.name === 'Manual') {
                    return <Icon name="user" size={size} color={color} />;
                  }
                },
                tabBarActiveTintColor: '#003c8f',
                tabBarInactiveTintColor: '#5e92f3',
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Auto" component={AutoCalculator} />
              <Tab.Screen name="Manual" component={ManualCalculator} />
            </Tab.Navigator>
          </NavigationContainer>
        )}
    </>
  )
}

export default App