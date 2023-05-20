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
import { moderateScale } from 'helpers/scale';
import * as _ from 'lodash';
import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;

type propTypes = {
   small?: boolean;
   activity?: any;
   smashStore?: any;
   challengesStore?: any;
};

const ActivityHabitStacks = (props: propTypes) => {
   const { activity, smashStore, challengesStore, small = false } = props;
   const { myChallengesHash, myChallenges, challengesArray } = challengesStore;
   const { habitStacksList } = smashStore;
   const { navigate } = useNavigation();
   const habitStacksInActivity = habitStacksList.filter((c) =>
      c.masterIds.includes(activity.id),
   );
   // const habitStacksIDs = habitStacksInActivity.map((c) => c.id);
   // const alsoIn = challengesArray.filter((c) => c.masterIds.includes(activity.id) && c.duration != 'weekly');

   // const challengesImNotIn = _.difference(challengesInActivity, alsoIn).map((c) => c)
   const goToChallenge = (challenge) =>
      navigate(Routes.ChallengeArena, {
         challenge: { id: challenge.challengeId },
      });

   return (
      <View
         style={{ flexWrap: 'wrap', paddingHorizontal: 0, paddingTop: 0 }}
         row>
         {/* {challengesInActivity?.map((challenge) => <TouchableOpacity style={{ backgroundColor: challenge.colorStart, padding: 16 }} onPress={() => goToChallenge(challenge)}><Text white>{challenge.challengeName}</Text></TouchableOpacity>)} */}

         {habitStacksInActivity?.map((habitStack) => {
            // const amIPlaying = myChallengesIds.includes(challenge.id)
            return (
               <TouchableOpacity
                  style={{
                     marginRight: 4,
                     marginTop: 4,
                     backgroundColor: Colors.buttonLink,
                     paddingVertical: small ? 4 : 8,
                     paddingHorizontal: small ? 8 : 12,
                     borderRadius: 16,
                  }}>
                  <Text white R12={small} R14={!small}>
                     {habitStack.name}
                  </Text>
               </TouchableOpacity>
            );
         })}
         {habitStacksInActivity.length === 0 && (
            <Text R14 secondaryContent>
               Not in any Habit Stacks
            </Text>
         )}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ActivityHabitStacks));
