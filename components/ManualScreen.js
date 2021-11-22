import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Keyboard,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'

const parameters = {
    car: {
        url: "CarbonFootprintFromCarTravel",
        types: ["SmallDieselCar", "MediumDieselCar", "LargeDieselCar", "MediumHybridCar", "LargeHybridCar", "MediumLPGCar", "LargeLPGCar", "MediumCNGCar", "LargeCNGCar", "SmallPetrolVan", "LargePetrolVan", "SmallDielselVan", "MediumDielselVan", "LargeDielselVan", "LPGVan", "CNGVan", "SmallPetrolCar", "MediumPetrolCar", "LargePetrolCar"]
    },
    bike: {
        url: "CarbonFootprintFromMotorBike",
        types: ["SmallMotorBike", "MediumMotorBike", "LargeMotorBike"]
    },
    flight: {
        url: "CarbonFootprintFromFlight",
        types: ["DomesticFlight", "ShortEconomyClassFlight", "ShortBusinessClassFlight", "LongEconomyClassFlight", "LongPremiumClassFlight", "LongBusinessClassFlight", "LongFirstClassFlight"]
    },
    public: {
        url: "CarbonFootprintFromPublicTransit",
        types: ["Taxi", "ClassicBus", "EcoBus", "Coach", "NationalTrain", "LightRail", "Subway", "FerryOnFoot", "FerryInCar"]
    }
}

export default function ManualCalculator() {

    const [type, setType] = useState('bike')
    const [subType, setSubType] = useState(parameters.bike.types[0])
    const [distance, setDistance] = useState(0)
    const [carbonEquivalent, setCarbonEquivalent] = useState(false)
    const [loading, setLoading] = useState(false)

    const URL = "https://carbonfootprint1.p.rapidapi.com"

    const sendVehicleData = () => {
        setLoading(true)

        const params = type == 'car' ? {
            vehicle: subType,
            distance: distance
        } : {
            type: subType,
            distance: distance
        }

        var options = {
            method: 'GET',
            url: URL + '/' + parameters[type].url,
            params: params,
            headers: {
                'x-rapidapi-host': 'carbonfootprint1.p.rapidapi.com',
                'x-rapidapi-key': 'a901adf65bmsh6117e03f2efb58fp196bfdjsnc8a1c7c8b2ab'
            }
        };

        // uncomment the code
        axios.request(options).then(function (response) {
            setLoading(false)
            setCarbonEquivalent(response.data.carbonEquivalent)
            console.log(response.data);
        }).catch(function (error) {
            setLoading(false)
            console.error(error);
        });
        // setTimeout(() => {
        //     setLoading(false)
        //     setCarbonEquivalent('14')
        // }, 2000);
    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>Calculate</Text>
            </View>

            <ScrollView>

                <View style={styles.inputContainer}>
                    <Picker
                        selectedValue={type}
                        style={styles.textInput}
                        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                    >
                        <Picker.Item label="Bike" value="bike" />
                        <Picker.Item label="Car" value="car" />
                        <Picker.Item label="Public Transit" value="public" />
                        <Picker.Item label="Flight" value="flight" />
                    </Picker>
                </View>
                {
                    type == 'car' ? (
                        <View>
                            <View style={styles.inputContainer}>
                                <Picker
                                    // vehicle type
                                    selectedValue={subType}
                                    style={styles.textInput}
                                    onValueChange={(itemValue, itemIndex) => setSubType(itemValue)}
                                >
                                    {
                                        parameters.car.types.map((t, index) => {
                                            return <Picker.Item key={index} label={t} value={t} />
                                        })
                                    }
                                </Picker>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="distance in kms"
                                    maxLength={20}
                                    onChangeText={(value) => setDistance(value)}
                                    onBlur={Keyboard.dismiss}
                                />
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={subType}
                                    style={styles.textInput}
                                    onValueChange={(itemValue, itemIndex) => setSubType(itemValue)}
                                >
                                    {
                                        parameters[type] && parameters[type].types.map((t, index) => {
                                            return <Picker.Item key={index} label={t} value={t} />
                                        })
                                    }
                                </Picker>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="distance in kms"
                                    maxLength={20}
                                    onChangeText={(value) => setDistance(value)}
                                    onBlur={Keyboard.dismiss}
                                />
                            </View>
                        </View>
                    )
                }

                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            sendVehicleData()
                            setLoading(true)
                        }}
                    >
                        <Text style={styles.saveButtonText}>Generate</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {
                carbonEquivalent ?
                    <View style={styles.inputContainer}>
                        <Text
                            style={{ marginBottom: 120,...styles.header}}
                        >
                            Your Carbon Equivalent: {carbonEquivalent}
                        </Text>
                        {/* <Text
                        style={styles.text}
                        >
                        {(((carbonEquivalent / 1000) * 100) / 100).toFixed(2)}
                        </Text> */}
                    </View>
                    : null
            }
            {
                loading ?
                    <View style={[styles.container, styles.horizontal]}>
                        <ActivityIndicator size="large" />
                    </View>
                    : null
            }

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
        fontSize:16,
        textAlign: 'center',
    }
});
