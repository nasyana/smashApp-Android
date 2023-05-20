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
import { useNavigation } from '@react-navigation/core';
import Box from 'components/Box'
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import { FONTS } from 'config/FoundationConfig';

const TeamActivitiesList = ({team,smashStore}) => {


    const {libraryActionsList, libraryActivitiesHash, returnActionPointsValue} = smashStore;

;


    const boxStyle = {padding: 16}
   

    return (
        <View >
            {team?.teamActivityQuantities ? team?.teamActivityQuantities?.map((id, index) => {
                
                const activity = libraryActivitiesHash[id] || {}
                const value = returnActionPointsValue(activity);
                return(<Box>
                    <View style={{...boxStyle}} row spread>
                <Text B14>{activity.text}</Text><Text B14 buttonLink>{value}</Text>
                </View></Box>) })

   :  libraryActionsList?.map((item, index) => {
    
    const activity = item || {}
    const value = returnActionPointsValue(activity);
    return (<Box><View style={{...boxStyle}} row spread>
    <Text B14>{item.text}</Text><Text B14 buttonLink>{value}</Text>
    </View></Box>) }) }
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TeamActivitiesList));