import React from 'react'
import { View, Text, Colors, Assets, Image } from "react-native-ui-lib";
import LevelReachedBadge from "../../../components/LevelReachedBadge";
import moment from "moment";

const BadgeItem = (props: any) => {

    const challenge = props.item;
const { gotBadge, index, allGradients, playerChallenge } = props;

const gradient = gotBadge ? allGradients[index + 1] : allGradients[0];

const playerChallengeData = props?.playerChallengeData;

const value = props.targets[props.level];
return (
   <View flex centerH padding-16>
      <LevelReachedBadge
         gradient={gradient}
         playerChallengeData={playerChallengeData}
         challenge={challenge}
         level={props.level}
         value={value}
         playerChallenge={playerChallenge}
         gotBadge={gotBadge}
         kFormatter={props.kFormatter}
         large={props.large}
         getPlayerChallengeData={props.getPlayerChallengeData}
      />

      <View height={1} backgroundColor={Colors.line} marginB-0 />
      <View row spread>
         {props.large && (
            <Text center marginT-8>
               Last Day{' '}
               {moment(challenge.endDateKey, 'DDMMYYYY').format('Do MMM YYYY')}
            </Text>
         )}
      </View>
   </View>
);
}

export default BadgeItem
