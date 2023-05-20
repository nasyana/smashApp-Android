import React, {  } from 'react';

import { inject, observer } from 'mobx-react';
import { View, Text } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import {text} from 'd3'; 
import LottieAnimation from 'components/LottieAnimation'
import { width } from 'config/scaleAccordingToDevice';
import AnimatedView from 'components/AnimatedView';

const SelectedHour = ({smashStore}) => {

    const {selectedHour} = smashStore;



    const selectedHourVertical = 30

    const widthArea = width - 32 - 32;

    const onePercentOfWidthArea = widthArea / 100;
    const fullHours = 24;
    const onePercentOfHours = selectedHour?.selectedHour / fullHours; // 0.5

    const boxShadow = {
        shadowRadius: 3,
        shadowOpacity: 0.1,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 2 },
     };
  

    const percentLeft = (onePercentOfHours * widthArea) + 5;

    if(!selectedHour)return null
    return (
       <View style={{position:'absolute', width: widthArea, top: 0, left: 16, height: 50, backgroundColor: 'rgba(0,0,0,0.0)'}} >

            <AnimatedView bounce={false} style={{paddingLeft: 4, position:'absolute',top: 16, left: percentLeft, height: 70, backgroundColor: 'rgba(0,0,0,0.0)', borderLeftWidth: 1, borderColor: '#aaa'}} >
                {/* <LottieAnimation source={require('../../lotties/graphcheck.json')} autoPlay style={{height: 40, width: 40}} loop={false}/> */}
                <View style={{transform: [{ rotate: '-10deg'}],  borderWidth: 0.5,
            borderColor: '#eee' || Colors.color6D,
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 7,
            marginBottom: 7,
            backgroundColor: '#fafafa',
            ...boxShadow}}><Text B10 >{selectedHour?.activityName}</Text>
            <Text R10 secondaryContent>{selectedHour?.time}</Text></View>
                </AnimatedView>
        {/* <Text>percentLeft{percentLeft}</Text>
        <Text>widthArea{widthArea}</Text>
        <Text>onePercentOfHours{onePercentOfHours}</Text>
        <Text>selectedHour{selectedHour}</Text> */}
        </View>

    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(SelectedHour));