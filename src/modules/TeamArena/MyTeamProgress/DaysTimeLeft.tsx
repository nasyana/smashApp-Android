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
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import CountDownTimer from '../CountDownTimer'
import { moment } from 'helpers/generalHelpers';;
import Box from '../../../components/Box';


const DaysTimeLeft = ({teamsStore}) => {

    
    const now = moment();
      const endOfCurrentWeek = moment().endOf('isoWeek');
      const daysLeft = endOfCurrentWeek.diff(now, 'days');
  return (
    <Box><View row spread padding-16>
    <View row><AntDesign
       name={'calendar'}
       size={14}
       color={Colors.buttonLink}
    />
    <Text color6D marginL-4  R14>
       {`${daysLeft == 0 ? 'today' : '' + daysLeft + ' days left'}`}
    </Text>
    </View>
    <View style={{height: 20, width: 1, backgroundColor: '#eee'}}/>
    <CountDownTimer />
 </View>

</Box>
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(DaysTimeLeft));