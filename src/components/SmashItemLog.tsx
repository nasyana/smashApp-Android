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

const SmashItemLog = (props) => {
   // const { navigate } = useNavigation();
   const { smashStore } = props;
   const { levelColors, libraryActionsList, selectedHour, setSelectedHour } = smashStore;
   const { activity } = props;
   const color = levelColors[activity.level || 0];

   const fullActivity = libraryActionsList.find(
      (x) => x.text == activity.activityName,
   );
   const goToViewActivity = () => {
      smashStore.navigation.navigate(Routes.ViewActivity, {
         activity: fullActivity,
      });
      // smashStore.setQuickViewTeam(false);
   };

   const boxShadow = {
      shadowRadius: 3,
      shadowOpacity: 0.1,
      shadowColor: '#171717',
      shadowOffset: { width: 0, height: 2 },
   };

   // const selected = selectedHour == moment(activity.timestamp, 'X').format('H');

   // if(selectedHour && !selected) return null;

   const onPressIn = () => {

      if(!activity.timestamp)return
      
    setSelectedHour({selectedHour: moment(activity.timestamp, 'X').format('H'),time: moment(activity.timestamp, 'X').format('hh:mm a'), activityName: activity.activityName})
   }

   const onPressOut = () => {
      setSelectedHour(false)
   }
   return (
      <TouchableOpacity
         onPress={goToViewActivity}
         onPressIn={onPressIn}
         onPressOut={onPressOut}
         row
         centerV
         marginR-8
         backgroundColor={'transparent'}
         style={{
            borderWidth: 0.5,
            borderColor: '#eee' || Colors.color6D,
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 7,
            marginBottom: 7,
            backgroundColor: '#fafafa',
            ...boxShadow
         }}>
         <View
            style={{
               height: 4,
               width: 4,
               backgroundColor: color || '#aaa',
               borderRadius: 4,
               marginRight: 4,
            }}
         />
         <Text secondaryContent R12 >
         {activity.multiplier > 1 ? activity.multiplier + ' x ' : ''}{activity.activityName || 'nope'}
         </Text>
      </TouchableOpacity>
   );
};;;

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(SmashItemLog));
