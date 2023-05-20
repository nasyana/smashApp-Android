import { useNavigation } from '@react-navigation/core';
import Header from 'components/Header';
import Routes from 'config/Routes';
import { width } from 'config/scaleAccordingToDevice';
import React from 'react';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { View, Assets, Text, Colors } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import Box from 'components/Box';
import SectionHeader from 'components/SectionHeader';
import { dayNumberOfChallenge, daysInChallenge } from 'helpers/dateHelpers';
import ChallengeDayTargets from 'components/ChallengeDayTargets';
import MyChallengeProgressReview from 'modules/TeamArena/components/MyChallengeProgressReview';
import LinearChartChallenge from 'components/LinearChartChallenge';
import {
   convertEndDateKeyToFriendly,
   convertEndDateKeyToFriendlyShort,
} from 'helpers/dateHelpers';
const ChallengeReview = (props) => {
   const { smashStore } = props;

   const { kFormatter } = smashStore;
   const { navigate } = useNavigation();

   const playerChallenge = props?.route?.params?.playerChallenge || false;

   let title = `${convertEndDateKeyToFriendlyShort(
      playerChallenge?.startDate,
   )} - ${convertEndDateKeyToFriendly(playerChallenge?.endDate)}`;
   return (
      <View flex>
         <Header title={title} back />
         <View paddingH-16 paddingT-24 marginB-8 centerH>
            <Text B22>{playerChallenge?.challengeName}</Text>
         </View>
         <LinearChartChallenge
            playerChallenge={playerChallenge}
            graphHeight={100}
         />
         <MyChallengeProgressReview
            playerChallenge={playerChallenge}
            smashStore={smashStore}
            playerChallengeData={playerChallenge}
         />
         <SectionHeader
            title="All Days"
            subtitle={
               <Text centerV secondaryContent>
                  {daysInChallenge(playerChallenge)} Days
               </Text>
            }
            style={{ marginTop: 16 }}
         />
         <Box style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <ChallengeDayTargets item={playerChallenge} />
         </Box>

         {/* <Box style={{ paddingHorizontal: 0, paddingBottom: 8 }}>
            <View padding-16>
               <Text>Score: {kFormatter(playerChallenge.selectedScore)}</Text>
               <Text>Target: {kFormatter(playerChallenge.selectedTarget)}</Text>
            </View>
         </Box> */}
      </View>
   );
};
export default inject(
   'smashStore',
   'challengeArenaStore',
   'challengesStore',
)(observer(ChallengeReview));

const styles = StyleSheet.create({});
