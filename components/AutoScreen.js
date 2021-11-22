import React, { useState, useEffect } from 'react'
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator
    , FlatList
} from 'react-native'
import SMS from 'react-native-get-sms-android'
import axios from 'axios'
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('screen').height
import { PieChart } from 'react-native-chart-kit'

var colorList = [
    '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'
]

export default function AutoCalculator() {
    const [loading, setLoading] = useState(false)
    const [CEdata, setCEData] = useState(null)
    const [pieData, setPieData] = useState(null)
    const [loadText, setLoadText] = useState(null)
    const getAllSms = () => {
        setLoadText('auto reading sms')
        setLoading(true)
        SMS.list(
            JSON.stringify({ box: "inbox" }),
            (fail) => {
                console.log(fail)
            },
            (count, smsList) => {
                setLoadText('sms reading completed')
                const sendArr = []
                const arr = JSON.parse(smsList)
                arr.forEach(object => {
                    try {
                        sendArr.push(object.body);
                    } catch (error) {
                        console.log(error)
                    }
                });
                setLoadText('analyzing data')
                axios.post("https://1eae-103-195-249-218.ngrok.io/sms/lexer",
                    {
                        sms: sendArr
                    })
                    .then((res) => {
                        setLoadText('process finished')
                        setLoading(false)
                        if (res.data.count)
                            setCEData(res.data.count)
                    })
                    .catch(err => {
                        setCEData(null)
                        setLoadText('error occurred')
                        setLoading(false)
                        console.log(err)
                    })
            }
        )
    }

    useEffect(() => {
        return () => {
            let pie = []
            CEdata ? CEdata.map((obj, index) => {
                pie.push({
                    name: obj.name,
                    population: obj.multiple,
                    color: colorList[index],
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                })
            }) : CEdata
            setLoadText('generating chart')
            setPieData(pie)
        }
    }, [CEdata])

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Auto Calculator</Text>
            <ScrollView>
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            setLoading(true)
                            setLoadText('process started')
                            getAllSms()
                            // setCEData(null)
                        }}
                    >
                        <Text style={styles.saveButtonText}>Start</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {
                pieData ?
                    <ScrollView style={{marginBottom: 20}}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.header}>
                                Your Carbon Contributed Activities are as
                            </Text>
                        </View>
                        <View style={[styles.container, styles.horizontal, styles.pieBox]}>
                            <PieChart
                                data={pieData}
                                width={windowWidth - 20}
                                height={220}
                                chartConfig={{
                                    backgroundColor: '#e26a00',
                                    backgroundGradientFrom: '#fb8c00',
                                    backgroundGradientTo: '#ffa726',
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                paddingLeft="15"
                                absolute
                            />
                        </View>
                        <Text style={styles.item}>Activity - Value Of Impact - Impact Type</Text>
                        {/* <View style={styles.inputContainer}> */}
                        <FlatList
                            data={CEdata}
                            renderItem={({ item }) => <Text style={styles.item}>{item.name} - {item.multiple} - {item.impact}</Text>}
                        />
                        {/* </View> */}
                    </ScrollView>
                    : null
            }

            {
                loading ?
                    <View style={[styles.horizontal]}>
                        <View>
                            <Text style={styles.text}>{loadText}</Text>
                            <ActivityIndicator size="large" />
                        </View>
                    </View>
                    : null
            }

            <View></View>

        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        height: windowHeight
    },
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
        fontSize: 16,
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

