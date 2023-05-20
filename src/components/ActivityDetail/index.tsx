import ButtonLinear from "components/ButtonLinear";
import Tag from "components/Tag";
import { FONTS } from "config/FoundationConfig";
import React from "react";
import { View, Text, Colors, Button, Assets, Image } from "react-native-ui-lib";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native"
import Box from 'components/Box';
import { inject, observer } from 'mobx-react';
// import BreakdownBadge from "components/BreakdownBadge";
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import ActivitiesBarChartSingle from 'components/ActivitiesBarChartSingle';
import SmashItemLog from 'components/SmashItemLog';
import { thisMonth } from 'helpers/dateHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
interface Props {
   item: {
      colorTag: string;
      title: string;
      items: string[];
      value: string;
   };
}
const ActivityDetail = ({
   item,
   libraryActivitiesHash,
   kFormatter,
   gotToChallengeArea,
   simple,
   challengesStore,
   smashStore,
   date,
   goToTimeline,
   showLast7,
   isWholeChallenge,
   todayDateKey,
}: Props) => {
   const { navigate } = useNavigation();
   const { levelColors } = smashStore;
   const { playerChallenge } = item;
   const activityQuantities = item.activityQuantities || {};
   const challengeId = playerChallenge?.challengeId;
   const gotToChallenge = () => {
      if (gotToChallengeArea) {
         gotToChallengeArea(playerChallenge);
      }

      // const formattedChallenge = { id: item.challengeId, name: item.challengeName, targets: item?.targets }

      // navigate(Routes.ChallengeArena, { challenge: formattedChallenge });
   };

   return (
      <View padding-16 paddingB-0 paddingH-24 paddingT-0>
         <TouchableOpacity onPress={gotToChallenge}>
            {/* <SmartImage
               uri={playerChallenge?.picture?.uri}
               preview={playerChallenge?.picture?.preview}
               style={{ height: 100, width: 300 }}
            /> */}
            <View row centerV marginB-8 marginT-16 marginB-8>
               <View>
                  <Text R14>
                     {item.title
                        ? item.title.substring(0, 27)
                        : item?.challengeName?.substring(0, 27)}
                  </Text>
               </View>
            </View>
         </TouchableOpacity>
         <View row style={{ flexWrap: 'wrap' }}>
            {true &&
               item.items.map((item, index) => {
                  const activity = libraryActivitiesHash?.[item] || {};

                  return (
                     <SmashItemLog
                        activity={{
                           activityName: activity.text,
                           multiplier: activityQuantities?.[item],
                        }}
                     />
                  );

               })}
         </View>
         {/* <View
            marginT-16
            marginB-16
            row
            style={{
               height: 1,
            }}
            backgroundColor={Colors.grey70}
         /> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(ActivityDetail));
