import React, { useState, useRef, useEffect } from 'react';

import {
    Image
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { View, Text, Colors, Assets } from 'react-native-ui-lib';

import AnimatedView from './AnimatedView';
const ChallengeJourneyBadge = ({ allowedToDo, color, offColor, icon, duration, offColorText, index,showLabel,small }) => {

    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const timeout = setTimeout(() => {
            setLoading(false)
        }, (index + 1) * 50);

        return () => {
            clearTimeout(timeout);
        }
    }, [])

    // if (loading) { return null }
    return (

        <View

            style={{
                borderWidth: 0,
                borderColor: allowedToDo && false
                    ? color
                    : offColor,
                margin: 0,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
            
            }}>
            {loading && <View style={{
                backgroundColor: allowedToDo
                    ? color
                    : offColor, width: width / 10, height: width / 10, borderRadius: 80, height: 30,
                alignItems: 'center',
                justifyContent: 'center'
            }} />}
            {!loading && <AnimatedView><View style={{
                    backgroundColor: allowedToDo
                        ? color
                        : offColor, width: small ? (width / 11) : (width / 10), height: small ? (width / 11) : (width / 10), borderRadius: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0, 

                    borderColor: color
                }}>

                    <Image
                        source={icon}
                        style={{
                            height: 30,
                            width: 30,
                            position: 'absolute'}}
                />
                </View>
            </AnimatedView>}

            <Text
                B12
                center
                marginV-4
                style={{
                    fontSize: 10,
                    letterSpacing: -1,
                    color: allowedToDo
                        ? color
                        : offColorText,
                }}>
                {duration.duration} DAYS
            </Text>

        </View>

    )
}

export default ChallengeJourneyBadge