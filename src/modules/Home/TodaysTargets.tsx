import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../components/SmartImage/SmartImage';
import Box from '../../components/Box';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated from 'react-native-reanimated';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import TodayTarget from './components/TodayTarget';
import TargetTypesScreens from './TargetTypesScreens';
import TeamsTodayTargets from './TeamsTodayTargets';
const SPACING = 28;
const AnimatedView = Animated.createAnimatedComponent(View);

const TodaysTargets = (props) => {
   const { navigate } = useNavigation();
   const { myChallenges, myChallengesFull } = props.challengesStore;
   const { smashStore, type } = props;


   const goToChallengeArena = (playerChallenge) => {
      navigate(Routes.ChallengeArena, { playerChallenge });
   };

   let filter = (c) => c.challengeType == 'user';

   if (type == 'team') {
      filter = (c) => c.challengeType == 'team';
   }

   return (
      <ScrollView style={{ backgroundColor: 'transparent' || '#333' }}>
         <View flex paddingT-16>
            {myChallengesFull.filter(filter).map((playerChallenge, index) => {
               return (
                  <TodayTarget
                     {...{
                        SPACING,
                        playerChallenge,
                        goToChallengeArena,
                        smashStore,
                     }}
                     challengesStore={props?.challengesStore}
                  />
               );
            })}
         </View>
         {/* <TeamsTodayTargets /> */}
      </ScrollView>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodaysTargets));
