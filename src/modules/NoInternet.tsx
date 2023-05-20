import { View, Text, Colors } from 'react-native-ui-lib'
import React, { useEffect, useState } from 'react'

import NetInfo from '@react-native-community/netinfo';
import LottieAnimation from "components/LottieAnimation";
import { height, width } from 'config/scaleAccordingToDevice';


const NoInternet = () => {



    const [connection, setConnection] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {

            setConnection(state.isConnected)
        });

        return () => {
            if (unsubscribe) { unsubscribe() }
        }
    }, [])

    if (connection) { return null }

    const space = (height / 10);

    return (
        <View flex center backgroundColor={Colors.smashPink} style={{ height, width, position: 'absolute', top: 0, left: 0, opacity: 0.8 }}>

            <LottieAnimation
                autoPlay
                loop={true}
                style={{
                    height: 100,
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    marginBottom: 32
                }}
                source={require('lotties/internet.json')}
            />
            <Text white R16>Oops, check your internet connection...</Text>


        </View>
    )
}

export default NoInternet