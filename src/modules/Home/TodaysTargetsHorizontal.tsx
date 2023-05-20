import React, { useMemo, useState } from 'react';
import { ScrollView, FlatList } from 'react-native';
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
import TodayTargetChallenges from './components/TodayTargetChallenges';
const SPACING = 28;
const AnimatedView = Animated.createAnimatedComponent(View);

const TodaysTargets = (props) => {
   const { navigate } = useNavigation();
   const { myChallengesFull } = props.challengesStore;
   const { type } = props;
alert('TodaysTargets')
   const goToChallengeArena = (playerChallenge) => {
      navigate(Routes.ChallengeArena, { playerChallenge });
   };

   let filter = (c) => c.challengeType == 'user';

   if (type == 'team') {
      filter = (c) => c.challengeType == 'team';
   }

   const playerChallengeIds = myChallengesFull.filter(filter).map((c) => c.id);

   const renderItem = React.useCallback(({ item, index }) => {
      const playerChallengeId = item;

      return (
         <TodayTargetChallenges
            {...{
               SPACING,
               playerChallengeId,
               goToChallengeArena,
            }}
            key={playerChallengeId}
         />
      );
   }, []);

   console.log('render challenges horizontal list');
   return (
      <ScrollView
         style={{ backgroundColor: 'transparent' || '#333' }}
         showsHorizontalScrollIndicator={false}
         horizontal>
         <View flex row>
            <FlatList
               horizontal={true}
               data={playerChallengeIds}
               renderItem={renderItem}
               keyExtractor={(item, index) => {
                  return item;
               }}
            />
         </View>
      </ScrollView>
   );
};;

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodaysTargets));
