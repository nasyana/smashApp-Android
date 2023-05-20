import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import {
   Assets,
   TabController,
   Colors,
   Typography,
   View,
   Text,
   Button,
   TabControllerItemProps,
} from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { endOfCurrentWeekKey } from 'helpers/teamDataHelpers';
const TargetsBadge = (props) => {
   const { myChallengesFull, numUserChallengeTargetsCompletedToday } =
      props.challengesStore;

   const { all, teamsStore } = props;

   const { numTeamTargetsToday, numTeamTargetsCompletedToday } = teamsStore;

   const numTargetsToday = myChallengesFull.length + numTeamTargetsToday;

   const numTargetsCompletedToday =
      numUserChallengeTargetsCompletedToday + numTeamTargetsCompletedToday;

   const noTargetsToday = numTargetsToday == 0;

   if (noTargetsToday) {
      return null;
   }

   return (
      <View
         style={{
            backgroundColor: Colors.buttonLink,
            borderRadius: 10,
            padding: 2,
            marginLeft: 4,
            paddingHorizontal: 6,
            alignItems: 'center',
            justifyContent: 'center',
         }}>
         <Text
            center
            white
            B12>{`${numTargetsCompletedToday}/${numTargetsToday}`}</Text>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TargetsBadge));
