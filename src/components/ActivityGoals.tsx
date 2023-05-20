import React from 'react';

import {
   TouchableOpacity
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { View, Text } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import * as _ from 'lodash';
import Routes from 'config/Routes';
import ButtonLinear from './ButtonLinear';
;

type propTypes = {
   small?: boolean;
   activity?: any;
   smashStore?: any;
   challengesStore?: any;
};

const ActivityChallenges = (props: propTypes) => {
   const { activity, smashStore, challengesStore, small = false } = props;
   const { myChallengesHash, myChallenges, challengesArray, goals } = challengesStore;

   const { navigate } = useNavigation();
   const goalsInActivity = goals.filter((c) =>
      c.masterIds.includes(activity.id),
   );
   // const myChallengesIds = challengesInActivity.map((c) => c.challengeId);
   // const alsoIn = challengesArray.filter(
   //    (c) => c.masterIds.includes(activity.id) && c.duration != 'weekly',
   // );

   // const challengesImNotIn = _.difference(challengesInActivity, alsoIn).map(
   //    (c) => c,
   // );
   const goToCreateGoal = (activity) =>
      navigate(Routes.CreateGoal, {
         activity
      });

   return (
      <View
         style={{ flexWrap: 'wrap', paddingHorizontal: 0, paddingTop: 0 }}
         row>
         {/* {challengesInActivity?.map((challenge) => <TouchableOpacity style={{ backgroundColor: challenge.colorStart, padding: 16 }} onPress={() => goToChallenge(challenge)}><Text white>{challenge.challengeName}</Text></TouchableOpacity>)} */}

         {goalsInActivity?.map((goal) => {
            // const amIPlaying = myChallengesIds.includes(challenge.id);
            return (
               <TouchableOpacity
                  style={{
                     marginRight: 4,
                     backgroundColor: goal.colorStart,
                     paddingVertical: small ? 4 : 8,
                     paddingHorizontal: small ? 8 : 12,
                     borderRadius: 16,
                  }}
                 >
                  <Text white R12={small} R14={!small}>
                     {goal.name}
                  </Text>
               </TouchableOpacity>
            );
         })}

         {goalsInActivity?.length == 0 && <Text R14 secondaryContent>No goals set with this habit/activity</Text>}

        
       
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ActivityChallenges));
