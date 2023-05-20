import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import React from 'react';
import { width, height } from 'config/scaleAccordingToDevice';
const WeekSmashed = (props) => {
   const { smashStore, teamsStore, team } = props;

   const { weeklyActivityHash, endOfCurrentWeekKey } = teamsStore;

   const teamWeeklyKey = `${team.id}_${endOfCurrentWeekKey}`;
   const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};

   const weekProgress = (weeklyActivity?.score / weeklyActivity.target) * 100;
   const weekSmashed = weekProgress >= 100;

   if (!weekSmashed || true) {
      return null;
   }
   return (
      <View
         style={{
            position: 'absolute',
            width,
            top: 160,
            alignItems: 'center',
            justifyContent: 'flex-end',
         }}>
         <View
            style={{
               backgroundColor: 'rgba(255,255,255,0.8)',
               paddingHorizontal: 16,
               borderRadius: 8,
               transform: [{ rotate: '0deg' }],
            }}>
            <Text right B12>
               WEEK TARGET SMASHED ✅
            </Text>
         </View>
      </View>
   );
};

export default WeekSmashed;
