import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors, Modal, Assets } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';

import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';
const ShareSekiInviteModal = ({challengesStore, smashStore}) => {

    const {libraryActivitiesHash,returnActionPointsValue,stringLimit} = smashStore;
    const {goalToShare} = challengesStore;

    const numberToShow = 5
    return (
        <View  marginT-16>
         
         {Object.keys(goalToShare?.actions)?.slice(0, numberToShow).map((key, index) => {
  const action = libraryActivitiesHash[key] || { text: 'Unknown activity' };

  return (
    <View key={index} row centerV style={{ marginBottom: 10 }}>
      <View style={{width: width / 2}}>
        <Text white  R12>{stringLimit(action?.text, 23)?.toUpperCase()}</Text>
      </View>
      <View style={{padding: 4, paddingHorizontal: 12, borderRadius: 5, backgroundColor: Colors.smashPink, borderRadius: 24 }}>
        <Text B12 white>{returnActionPointsValue(action)} PTS</Text>
      </View>
    </View>
  );
})}
{Object.keys(goalToShare?.actions)?.length > numberToShow && (
  <Text white R12>+ {Object.keys(goalToShare?.actions)?.length - numberToShow} MORE</Text>
)}


 

</View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ShareSekiInviteModal));