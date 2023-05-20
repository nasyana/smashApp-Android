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
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import LottieAnimation from './LottieAnimation';

const DissapearingArrow = ({center = false, bottom = 100, stay = false}) => {


    //// useEffect to delay loading 
    const [dissapear, setDissapear] = useState(false);

    useEffect(() => {

      const timer =  setTimeout(() => {
            setDissapear(true)
        }, 2000);
    
      return ()=> timer ? timer : ()=> null
    }, [])
    

    if(dissapear && !stay){
        return null;
    }



    if(center){


        return (
            <View style={{width, position: 'absolute', bottom: bottom}} center>
        <LottieAnimation
                      autoPlay
                      loop={true}
                      style={{
                         height: 150,
                        //  top: -30,
                        //  right: -3,
                        //  zIndex: 0,
                        //  position: 'absolute'
                      }}
                      source={require('../lotties/arrow-down.json')}
                   />
            </View>
        )


    }
    return (
        <View>
    <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     height: 150,
                     top: -30,
                     right: -3,
                     zIndex: 0,
                     position: 'absolute'
                  }}
                  source={require('../lotties/arrow-down.json')}
               />
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(DissapearingArrow));