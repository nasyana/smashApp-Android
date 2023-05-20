import React from 'react';
import PlayerBadge from '../../../components/PlayerBadge';
import Routes from 'config/Routes';
import AnimatedView from 'components/AnimatedView';
import { View, Text } from 'react-native-ui-lib';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import EpicAcquiredBadge from 'components/EpicAcquiredBadge';
const BadgeItem = (props: any) => {
   const { navigate } = useNavigation();
   const playerChallenge = props.item;
   const { challengesStore, smashStore } = props;
   const { stringLimit } = smashStore;
   const kFormatter = props.kFormatter;
   const goToBadge = () => {
      navigate(Routes.Badge, { challenge: playerChallenge });
   };

   const playerChallengeData = getPlayerChallengeData(
      playerChallenge,
      false,
      false,
      'won',
   );

   return (
      <AnimatedView duration={300}>
         <View flex centerH padding-16 style={{ borderWidth: 0 }}>
            <TouchableOpacity
               onPress={goToBadge}
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
               }}>
               <EpicAcquiredBadge
                  playerChallenge={playerChallenge}
                  playerChallengeData={playerChallengeData}
                  value={playerChallengeData.selectedTarget}
                  kFormatter={props.kFormatter}
                  notWon
                  challengesStore={challengesStore}
               />
               <View style={{ maxWidth: 80 }}>
                  <Text center marginT-8 style={{ flexWrap: 'wrap' }}>
                     {stringLimit(playerChallenge.challengeName, 15)}
                  </Text>
               </View>
            </TouchableOpacity>
         </View>
      </AnimatedView>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
)(observer(BadgeItem));
