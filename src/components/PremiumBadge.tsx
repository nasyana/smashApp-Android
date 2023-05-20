import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';

const badgeWidth = 70
const badgeHeight = 25
const PremiumBadge = ({smashStore}) => {

    const {isPremiumMember = false} = smashStore

    const style = {position: 'absolute',right: -55 }
    if(!isPremiumMember)return null
//     return  (<View style={{...style}}>
//    <LinearGradient
//             start={{ x: 0.6, y: 0.1 }}
//             colors={[Colors.green10,Colors.green40]}
//             style={{
//                width: badgeWidth,
//                height: badgeHeight,
//                borderRadius: badgeHeight / 2,
//                alignItems: 'center',
//                justifyContent: 'center',
//                flex: 1,
//                opacity: 1,
//             }}>
//                <Text R12 white>Free</Text>
//                 </LinearGradient>
// </View>)
    return (
        <View style={{...style}}>
        <LinearGradient
              
                 colors={[Colors.smashPink,Colors.buttonLink]}
                 style={{
                    // width: badgeWidth,
                    // height: badgeHeight,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: badgeHeight / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    opacity: 1,
                 }}>
                       <Text R12 white>Premium</Text>
                     </LinearGradient>
     </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(PremiumBadge));