import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import React from 'react';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import { uid, unixToFromNow } from 'helpers/generalHelpers';
const LastSmashedBy = (props) => {
   const { teamId, teamsStore, goToRecent } = props;

   const {
      weeklyActivityHash,

      endOfCurrentWeekKey,
   } = teamsStore;

   const teamWeeklyKey = `${teamId}_${endOfCurrentWeekKey}`;

   const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};

   if (!weeklyActivity.lastSmashedBy) {
      return <View />;
   }
   return (
      <TouchableOpacity onPress={goToRecent} row centerV>
         <SmartImage
            style={{
               height: 24,
               width: 24,
               borderRadius: 48,
               marginRight: 4,
            }}
            uri={weeklyActivity.lastSmashedBy?.user?.picture?.uri || ''}
            preview={weeklyActivity.lastSmashedBy?.user?.picture?.preview || ''}
         />
         <View>
            <Text secondaryContent R12>
               {weeklyActivity.lastSmashedBy?.multiplier +
                  ' x ' +
                  weeklyActivity.lastSmashedBy?.activityName?.substring(
                     0,
                     10,
                  )}{' '}
               <Text secondaryContent R10>
                  {unixToFromNow(weeklyActivity?.lastSmashedBy?.timestamp)}
               </Text>
            </Text>
            {/* <Text secondaryContent R10>
               {unixToFromNow(weeklyActivity?.lastSmashedBy?.timestamp)}
            </Text> */}
         </View>
      </TouchableOpacity>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(LastSmashedBy));
