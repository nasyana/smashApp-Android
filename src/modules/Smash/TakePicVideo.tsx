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


const TakePicVideo = ({smashStore}) => {

   

    const {activtyWeAreSmashing} = smashStore;
    const hasImage =
    smashStore.capturedPicture || smashStore.capturedVideo || smashStore.manuallySkipped;

    if(hasImage || !activtyWeAreSmashing){return null}
    return (
        <View
               style={{
                  width: width,
                  height: 120,
                  position: 'absolute',
                  top: height / 3,
                  alignItems: 'center',
                  borderWidth: 0,
                  borderColor: 'rgba(255,255,255,1)',
               }}>

               <Text
                  B22
                  style={{
                     fontSize: 35,
                     textAlign: 'center',
                     color: 'rgba(255,255,255,0.4)',
                  }}
                  center>
                  Take Pic/Video
               </Text>



            </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TakePicVideo));