import { View, Text } from 'react-native-ui-lib';
import React from 'react';
import Box from 'components/Box';
import LottieAnimation from 'components/LottieAnimation';
const CelebratePlayAgain = (props) => {
   const { oldPlayerChallenge, smashStore } = props;
   const { kFormatter } = smashStore;

   let selectedScore = oldPlayerChallenge.score;
   let name = oldPlayerChallenge?.challengeName || 'No name';

   if (oldPlayerChallenge.targetType == 'qty') {
      selectedScore = oldPlayerChallenge.qty;
   }

   return (
      <View center padding-24 margin-16>
         <LottieAnimation
            autoPlay
            loop={true}
            style={{
               height: 200,
               zIndex: 0,
               top: 0,
               left: 0,
            }}
            source={require('lotties/thumbs-up.json')}
         />
         <Text B18 center>
            Nice! Let's go another month!
         </Text>
         <Text>
            Try to beat {kFormatter(selectedScore || 0)} this month! ({name})
         </Text>
      </View>
   );
};

export default CelebratePlayAgain;
