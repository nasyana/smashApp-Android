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
import { AntDesign, Feather } from '@expo/vector-icons';
const ActivityTodayBadge = (props) => {
   const {
      myChallengesFull,
      numUserChallengeTargetsCompletedToday,
      toggleItemsCount,
   } = props.challengesStore;

   const { all, teamsStore, smashStore } = props;

   const { userStoriesHash } = smashStore;

   const count = Object.keys(userStoriesHash).length;

   const { numTeamTargetsToday, numTeamTargetsCompletedToday } = teamsStore;


   const numTargetsToday = myChallengesFull.length + numTeamTargetsToday;
   const numChallengeTargetsToday = myChallengesFull.length;


   const numTargetsCompletedToday =
      numUserChallengeTargetsCompletedToday + numTeamTargetsCompletedToday;

   const noTargetsToday = numTargetsToday == 0;

   if (noTargetsToday) {

      return (
         <View
            style={{
               backgroundColor: Colors.green30,
               borderRadius: 10,
               padding: 2,
               paddingHorizontal: 7,
               marginLeft: 4,
               // paddingHorizontal: 6,
               alignItems: 'center',
               justifyContent: 'center',
               // position: 'absolute',
               // right: -2,
               // minWidth: 40,
            }}>
            <Text
               center
               white
               B12>
               {/* {`${numUserChallengeTargetsCompletedToday}/${numChallengeTargetsToday}`} */}
               0
            </Text>
            {/* ${numUserChallengeTargetsCompletedToday}/ */}
         </View>
      );
      // return (
      //    <Feather
      //       name="zap"
      //       color={Colors.meToday}
      //       size={17}
      //       style={{ marginLeft: 4 }}
      //    />
      // );
   }

   return (
      <View
         style={{
            backgroundColor: Colors.green30,
            borderRadius: 10,
            padding: 2,
            paddingHorizontal: 7,
            marginLeft: 4,
            // paddingHorizontal: 6,
            alignItems: 'center',
            justifyContent: 'center',
            // position: 'absolute',
            // right: -2,
            // minWidth: 40,
         }}>
         <Text
            center
            white
            B12>
            {/* {`${numUserChallengeTargetsCompletedToday}/${numChallengeTargetsToday}`} */}
            {`${count}`}
         </Text>
         {/* ${numUserChallengeTargetsCompletedToday}/ */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ActivityTodayBadge));
