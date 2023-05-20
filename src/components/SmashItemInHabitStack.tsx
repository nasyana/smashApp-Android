import { FONTS } from 'config/FoundationConfig';
import { width } from 'config/scaleAccordingToDevice';
import React, { memo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Text, View, TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { moment } from 'helpers/generalHelpers';;
// import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import {Vibrate} from 'helpers/HapticsHelpers'





const SmashItemInHabitStack = (props) => {
   // const { navigate } = useNavigation();
   const { smashStore, isHidden, addRemoveActivity } = props;
   const { levelColors, libraryActionsList,getLabelAndColor } = smashStore;
   const { activity } = props;

   const colorLabel = getLabelAndColor(activity.level || 0);
   const color = colorLabel.color || levelColors[activity.level || 0];

   const fullActivity = libraryActionsList.find(
      (x) => x.text == activity.activityName,
   );

   const addRemove = () => {

      Vibrate();
      addRemoveActivity(activity);
   }

   return (
      <TouchableOpacity
         onPress={addRemove}
         row
         centerV
         marginR-8
         backgroundColor={'transparent'}
         style={{
            borderWidth: isHidden ? 0.5 : 0.5,
            borderColor: isHidden ? Colors.color6D : color,
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
            marginBottom: 7,
            opacity: isHidden ? 0.5 : 1,
            backgroundColor: isHidden ? 'transparent' : color
           
         }}>
         {/* <View
            style={{
               height: 4,
               width: 4,
               backgroundColor: color || '#333',
               borderRadius: 4,
               marginRight: 4,
            }}
         /> */}
         <Text secondaryContent B12 white={!isHidden} style={{ textDecorationLine: isHidden ? 'line-through' : 'none',
            textDecorationStyle: 'solid'}}>
            {activity.text || 'nope'}{activity.multiplier && ' x ' + activity.multiplier}
         </Text>
      </TouchableOpacity>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(SmashItemInHabitStack));




