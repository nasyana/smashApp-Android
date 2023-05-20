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
const TeamChallengeTargetsBadge = (props) => {
   const {
      numTeamChallengeTargetsCompletedToday,
      numTeamChallengeTargetsToday,
   } = props.challengesStore;

   const noTargetsToday = numTeamChallengeTargetsToday == 0;

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
            B12>{`${numTeamChallengeTargetsCompletedToday}/${numTeamChallengeTargetsToday}`}</Text>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamChallengeTargetsBadge));
