import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import axios from "axios"

export default function HomeScreen() {
    const [data, setData] = useState(null)

    const fetchAirQuality = () => {
        var options = {
            method: 'GET',
            url: 'https://air-quality.p.rapidapi.com/current/airquality',
            params: { lon: '78.9629', lat: '20.5937' },
            headers: {
                'x-rapidapi-host': 'air-quality.p.rapidapi.com',
                'x-rapidapi-key': 'a901adf65bmsh6117e03f2efb58fp196bfdjsnc8a1c7c8b2ab'
            }
        };

        axios.request(options).then(function (response) {
            setData(response.data)
        }).catch(function (error) {
            console.error(error);
        });
    }

    useEffect(() => {
        fetchAirQuality()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text style={styles.header}>Today's Air Quality</Text>
                </View>

                {
                    data ?
                        <View style={{borderWidth: 1, backgroundColor: '#5e92f3', ...styles.inputContainer}}>
                            <Text style={styles.text} >AQI : {data.data[0].aqi}</Text>
                            <Text style={styles.text} >PM10 : {data.data[0].pm10}</Text>
                            <Text style={styles.text} >PM25 : {data.data[0].pm25}</Text>
                            <Text style={styles.text} >Timezone : {data.timezone}</Text>
                        </View>
                        : null
                }

                <View style={{margin:10}}>

                </View>


                <View  style={{ backgroundColor: '#5e92f3', ...styles.inputContainer}}>
                <Text style={styles.text}>What & Why ?</Text>
                <Text style={styles.text}>Let's pledge to make carbon neutral environment for us, for everyone.</Text>
                <Text style={styles.text}>Always follow basics suggest by WHO.</Text>
                <Text style={styles.text}>Use Public Transport as much as possible, or walk for smaller distance.</Text>
                <Text style={styles.text}>Use this app to find balance between Carbon Neutral environment and your lifestyle.</Text>
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#F5FCFF',
    },
    header: {
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold'
    },
    inputContainer: {
        paddingTop: 15
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    saveButton: {
        borderWidth: 1,
        borderColor: '#007BFF',
        backgroundColor: '#007BFF',
        padding: 15,
        margin: 5
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
        marginTop: 0
    },
    text: {
        marginBottom: 10,
        padding: 5,
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
    },
    pieBox: {
        borderWidth: 1,
        borderColor: 'gray',
    },
    item: {
        padding: 10,
        fontSize: 18,
        fontWeight: '500',
        height: 44,
        textAlign: 'center'
    },
});
