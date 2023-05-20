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
const TargetsBadge = (props) => {
   const {
      myChallengesFull,
      numUserChallengeTargetsCompletedToday,
      numUserChallengeTargetsToday,
   } = props.challengesStore;

   const { all } = props;
   const noTargetsToday = numUserChallengeTargetsToday == 0;

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
            B12>{`${numUserChallengeTargetsCompletedToday}/${numUserChallengeTargetsToday}`}</Text>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TargetsBadge));
