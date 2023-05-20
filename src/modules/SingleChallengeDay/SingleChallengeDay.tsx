import { Assets, Colors, View, Text } from 'react-native-ui-lib';
import React from 'react';
import { ScrollView } from 'react-native';
import Header from 'components/Header';
import TodayTarget from './components/TodayTarget';
import TimelineToday from 'modules/PlayerStats/TimelineToday';
import LostStreakQuestion from 'modules/Home/components/TodayTargetChallengesListItem/LostStreakQuestion';
import { dayKeyToDayDate, dayKeyToHuman, dayKeyToShortDay } from 'helpers/dateHelpers';
const SingleChallengeDay = (props) => {
   const {
      playerChallenge,
      progress,
      dayScore,
      dayTarget,
      dayKey,
      currentUserId,
   } = props.route?.params || {};
   return (
      <View flex>
         <Header title={dayKeyToHuman(dayKey)} back />
         <ScrollView>
      <View paddingH-16 paddingT-16>
      <LostStreakQuestion dayKey={dayKey} playerChallenge={playerChallenge} />
      </View>
         
            <TodayTarget
               SPACING={28}
               playerChallenge={playerChallenge}
               {...{ progress, dayScore, dayTarget,dayKey }}
            />
            <TimelineToday
               SPACING={28}
               date={dayKey}
               focusUser={currentUserId}
               challengeId={playerChallenge.challengeId}
            />
         </ScrollView>
      </View>
   );
};

export default SingleChallengeDay;
