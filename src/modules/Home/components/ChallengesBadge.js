import React, { Component, useEffect } from 'react';
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
import { useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
const TargetsBadge = (props) => {
   const isFocused = useIsFocused();
   const { myChallengesFull, numUserChallengeTargetsCompletedToday } =
      props.challengesStore;

   const { all, teamsStore, toggleItemsCount } = props;

   const { numTeamTargetsToday, numTeamTargetsCompletedToday } = teamsStore;

   const numTargetsToday = myChallengesFull.length + numTeamTargetsToday;
   const numChallengeTargetsToday = myChallengesFull.length;

   const numTargetsCompletedToday =
      numUserChallengeTargetsCompletedToday + numTeamTargetsCompletedToday;

   const noTargetsToday = numTargetsToday == 0;
   if (isFocused) {
      // toggleItemsCount();
   }
   useEffect(() => {
      // toggleItemsCount();

      return () => {};
   }, [numTargetsToday]);

   if (noTargetsToday) {

      return (
         <View
            style={{
               backgroundColor: Colors.smashPink,
               borderRadius: 16,
               padding: 2,
               paddingHorizontal: 10,
               marginLeft: 4,
               // paddingHorizontal: 6,
               alignItems: 'center',
               justifyContent: 'center',
               // position: 'absolute',
               // right: -2,
               // minWidth: 40,
            }}>
            <Text center white B14>0</Text>
            {/* ${numUserChallengeTargetsCompletedToday}/ */}
         </View>
      );

      // return (
      //    <Feather
      //       name="star"
      //       color={Colors.buttonLink}
      //       size={16}
      //       style={{ marginLeft: 6 }}
      //    />
      // );
   }
   return (
      <View
         style={{
            backgroundColor: Colors.smashPink,
            borderRadius: 16,
            padding: 2,
            paddingHorizontal: 10,
            marginLeft: 0,
            marginRight: 0,
            // paddingHorizontal: 6,
            alignItems: 'center',
            justifyContent: 'center',
            // position: 'absolute',
            // right: -2,
            // minWidth: 40,
         }}>
         <Text center white B14>{`${numUserChallengeTargetsCompletedToday} / ${numChallengeTargetsToday}`}</Text>
         {/* ${numUserChallengeTargetsCompletedToday}/ */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TargetsBadge));
