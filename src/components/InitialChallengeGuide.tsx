import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from 'components/Box';
import AnimatedView from 'components/AnimatedView';
import LottieAnimation from './LottieAnimation';

const InitialChallengeGuide = ({smashStore, challenge, playerChallenge}) => {
const {currentUser, settings = {}} = smashStore;
const {aHelpers = {}} = settings

const {challengeScreenHelperDescriptionOne = 'This is the Challenge Screen. Here you can keep track of your progress for this Challenge.', challengeScreenHelperDescriptionTwo = 'Next Step: Press the "SMASH" button to earn some points!', challengeScreenHelperTitle = 'Challenge Screen'} = aHelpers;

    const { navigate } = useNavigation();
    const {selectedTodayTarget, unit} = playerChallenge;
    const [read, setRead] = useState(currentUser?.allPointsEver > 0);

    const seen = () => {

        setRead(true)

     }
    if(read){return null}

    return (
        // <AnimatedView fade  style={{width, height, position: 'absolute',top: 0, left: 0}}>

        <Modal visible={!read ? true : false} 
        presentationStyle="overFullScreen"
        animationType="fade"
        keyboardShouldPersistTaps="always"
        transparent={true}
        statusBarTranslucent={false}
        >
            <View style={{width, height, position: 'absolute', backgroundColor: 'rgba(0,0,0,0.8)'}} center>
            <View center>
        <LottieAnimation
                      autoPlay
                      loop={true}
                      style={{
                         height: 120,
                        //  top: -30,
                        //  right: -3,
                        //  zIndex: 0,
                        //  position: 'absolute'
                      }}
                      source={require('../lotties/info.json')}
                   />
                   </View>
        <Box>
        
        <View padding-24 paddingB-48 center style={{width: width - 48}}>
            <Text B18 center>{challengeScreenHelperTitle || 'Challenge Screen'}</Text>
            <Text R14 marginT-16 center>{challengeScreenHelperDescriptionOne}</Text>
            <Text R14 marginT-16 center>{challengeScreenHelperDescriptionTwo}</Text>
        </View>
        </Box>
        <TouchableOpacity
                  onPress={seen}
                  style={{
                     alignItems: 'center',
                  }}>
                  <View
                     style={{
                  
                        backgroundColor: Colors.smashPink,
                        borderRadius: 45,
                        alignItems: 'center',
                        paddingVertical: 15,
                        zIndex: 9999,
                        marginTop: -40,
                        paddingHorizontal: 24
                     }}>
                     <View row>
                     <Text B14 white>Got It, Let's Go!</Text></View>
                  </View>
               </TouchableOpacity>
        </View>
        </Modal>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(InitialChallengeGuide));