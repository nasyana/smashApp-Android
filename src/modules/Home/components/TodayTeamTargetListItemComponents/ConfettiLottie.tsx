import { View, Text } from 'react-native';
import React from 'react';
import { inject, observer } from 'mobx-react';
import LottieAnimation from 'components/LottieAnimation';
import { width, height } from 'config/scaleAccordingToDevice';
const ConfettiLottie = (props) => {
   const { team, smashStore, teamsStore } = props;

   const { weeklyActivityHash, endOfCurrentWeekKey } = teamsStore;

   const teamWeeklyKey = `${team.id}_${endOfCurrentWeekKey}`;
   const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};

   const weekProgress = (weeklyActivity?.score / weeklyActivity.target) * 100;
   const weekSmashed = weekProgress >= 100;

   if (!weekSmashed) {
      return null;
   }

   return (
      <LottieAnimation
         autoPlay
         loop={true}
         style={{
            // width: 200,

            height: width,
            zIndex: 0,
            top: 0,
            left: 0,
            position: 'absolute',
         }}
         source={require('../../../../lotties/confetti.json')}
      />
   );
};
export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ConfettiLottie));
