import React, { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
const { View, Text, AsyncStorage } = require("react-native")

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

  return (
    <>
      {/* {!onboard ? ( */}
      {!onboarded ? (
        <Onboarding onDone={onDone} />
      ) : (
        <View>
          <Text>Hello World</Text>
        </View>
      )}
    </>
  )
}

export default App