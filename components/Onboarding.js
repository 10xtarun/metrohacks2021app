import { Alert, StatusBar, Button, PermissionsAndroid } from 'react-native';
import React from 'react';

import Onboarding from 'react-native-onboarding-swiper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const WithCTA = ({ onDone }) => {
    const requestPermissions = () => {
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: "CO2 App wants to read SMS",
                    message:
                        "We need your permission to read your SMS",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            )
                .then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert('Woosh! permission granted.')
                        console.log("You can read the sms : ", granted);
                    } else {
                        Alert.alert('Oops! permission denied.')
                        console.log("Read permission denied : ", granted);
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Onboarding
            showDone={false}
            onSkip={() => Alert.alert('Skipped')}
            pages={[
                {
                    title: 'Hey!',
                    subtitle: 'Welcome to CO2 Neutral App!',
                    backgroundColor: '#003c8f',
                    image: (
                        <Icon name="bomb" size={30} />
                    ),
                },
                {
                    title: 'Our Mission',
                    subtitle: 'To create carbon neutral environment for us, everyone.',
                    backgroundColor: '#5e92f3',
                    image: (
                        <Icon name="heart" size={30} />
                    ),
                },
                {
                    title: "Last! We need to access your SMS to auto generate the result.",
                    subtitle: (
                        <Button
                            title={'Need Permission'}
                            containerViewStyle={{ marginTop: 20 }}
                            backgroundColor={'white'}
                            borderRadius={5}
                            textStyle={{ color: '#003c8f' }}
                            onPress={() => {

                                onDone()
                                requestPermissions()
                                // StatusBar.setBarStyle('default')
                            }}
                        />
                    ),
                    backgroundColor: '#003c8f',
                    image: (
                        <Icon name="unlock" type="font-awesome" size={100} color="white" />
                    ),
                },
            ]}
        />
    )

}

export default WithCTA;