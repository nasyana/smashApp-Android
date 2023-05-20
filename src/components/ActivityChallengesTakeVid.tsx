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
import * as _ from 'lodash';


type propTypes = {
   small?: boolean;
   activity?: any;
   smashStore?: any;
   challengesStore?: any;
};

const ActivityChallengesTakeVid = (props: propTypes) => {
   const {  smashStore, challengesStore, small = false } = props;
   const { myChallenges, challengesArray } = challengesStore;

   const activity = smashStore.activtyWeAreSmashing;

   const challengesInActivity = myChallenges.filter((c) =>
      c.masterIds.includes(activity.id),
   );
   const myChallengesIds = challengesInActivity.map((c) => c.challengeId);
   const alsoIn = challengesArray.filter(
      (c) => c.masterIds.includes(activity.id) && c.duration != 'weekly',
   );

   if (challengesInActivity.length === 0 || !activity) { return null }
   
   return (
      <View paddingH-24 style={{ position: 'absolute', top: 144 }}>
      <View>
         <Text R12 marginB-4 white>Challenges: </Text>
      <View
         style={{ flexWrap: 'wrap', paddingHorizontal: 0, paddingTop: 0 }}
         row
         centerV
      >
        
         {alsoIn?.map((challenge) => {
            const amIPlaying = myChallengesIds.includes(challenge.id);

            if (!amIPlaying) { return null }
            return (
               <TouchableOpacity
               key={challenge.id}
                  style={{
                     marginRight: 4,
                     backgroundColor: amIPlaying
                        ? challenge.colorStart
                        : '#ccc',
                     paddingVertical: small ? 4 : 8,
                     paddingHorizontal: small ? 8 : 12,
                     borderRadius: 16,
                  }}
               // onPress={() => goToChallenge({ challengeId: challenge.id })}
               >
                  <Text white R12={small} R14={!small}>
                     {challenge.name}
                  </Text>
               </TouchableOpacity>
            );
         })}
         {alsoIn.length === 0 && (
            <Text R14 secondaryContent>
               Not in any challenges
            </Text>
         )}
      </View>

      </View>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ActivityChallengesTakeVid));
