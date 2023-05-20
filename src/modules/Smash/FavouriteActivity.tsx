import React, { useRef, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';

import { FONTS } from 'config/FoundationConfig';
import { height, width as ScreenWidth } from 'config/scaleAccordingToDevice';
import { View, Colors, Text, TouchableOpacity } from 'react-native-ui-lib';
import {
   Animated,
   StyleSheet,
   Platform,
   ScrollView,
   TextInput,
} from 'react-native';
import AnimatedView from 'components/AnimatedView';
import SmoothPicker from 'components/SmoothPicker';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import SectionHeader from 'components/SectionHeader';
import * as _ from 'lodash';

const FavouriteActivity = ({onPick,smashEffects, smashStore, aid}) => {

    const {libraryActivitiesHash, activtyWeAreSmashing, levelColors, searchText} = smashStore;

    const a = libraryActivitiesHash?.[aid] || false;
    const isSelected = activtyWeAreSmashing?.id == aid;

    const color = levelColors?.[a.level];

    

  return (
    <TouchableOpacity
    onPress={() => {
       onPick(a);
       smashEffects();
    }}
    style={{
       backgroundColor: isSelected
          ? Colors.buttonLink
          : 'rgba(255,255,255,0.2)',
       borderRadius: 36,
       paddingHorizontal: 16,
       margin: 3,
       marginLeft: 0,
       marginVertical: 0,
       height: 40,
       marginVertical: 4,
       justifyContent: 'center',
       alignItems: 'center',
       padding: 0,
       flexDirection: 'row',
       borderColor: color,
       borderWidth: 0,
    }}>
    <View
       style={{
          width: 7,
          height: 7,
          borderRadius: 14,
          backgroundColor: color,
          marginRight: 8,
       }}
    />
    <Text
       H14
       // content28
       style={{
          color: isSelected ? '#fff' : '#fff',
          padding: 0,
       }}>
       {a?.text || 'cannot find text'}
    </Text>
 </TouchableOpacity>
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(FavouriteActivity));