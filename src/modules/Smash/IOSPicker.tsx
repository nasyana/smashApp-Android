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
import { FONTS } from 'config/FoundationConfig';
import AnimatedView from '../../components/AnimatedView'
import { Picker } from '@react-native-picker/picker';
import DissapearingArrow from 'components/DissapearingArrow'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const IOSPicker = ({smashStore}) => {

const {activtyWeAreSmashing,hasImage,manuallySkipped,smashEffects,setSelectMultiplier, selectMultiplier} = smashStore;
const {hideMulti = false} = activtyWeAreSmashing;

if(hideMulti || !activtyWeAreSmashing || !selectMultiplier){return null}

const onPick = (item) => {
    smashEffects();

    smashStore.multiplier = parseInt(item) || 1;

    if (hasImage) {
       setSelectMultiplier(false);
    }
 };

 const maxMultiplier = 100;
 const selectorArray = Array.from(Array(maxMultiplier).keys());

 if(hasImage || manuallySkipped){
    return (
      <View
      style={{
         position: 'absolute',
         top: screenHeight / 2 - 100,
         right: 0,
         height: screenHeight - (screenHeight / 2 + 100),
         flexDirection: 'row',
         paddingHorizontal: 10,
         borderWidth: 0,
         borderColor: '#fff',
      }}>
        <AnimatedView
        style={{
           bottom: 0,
           zIndex: 999999999999,
           elevation: 999999999999,
           position: 'absolute',
           right: -20,
        }}>
        {(hasImage || manuallySkipped) && smashStore.multiplier < 2 && <DissapearingArrow />}
        <Picker
           selectedValue={smashStore.multiplier}
           itemStyle={{ color: '#333' }}
           mode="dropdown"
           style={{
              width: 130,
              color: '#fff',
              borderWidth: 0,
              borderColor: '#fff',
              backgroundColor: 'transparent',
              borderRadius: 5,
           }}
           itemStyle={{
              color: '#fff',
              // fontFamily: 'SFProText-Heavy',
              fontFamily: FONTS.heavy,
              fontSize: 40,
           }}
           onValueChange={onPick}>
           {selectorArray.map((int) => {
              const num = int + 1;
              return (
                 <Picker.Item
                    key={int}
                    label={`${num}`}
                    value={num}
                    fontFamily={FONTS.heavy}
                 />
              );
           })}
        </Picker>
     </AnimatedView>
     </View>
    )
         }else{

            return null
         }
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(IOSPicker));