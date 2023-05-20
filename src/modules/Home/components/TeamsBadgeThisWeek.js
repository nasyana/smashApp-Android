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
import { FontAwesome5 } from '@expo/vector-icons';
const TargetsBadge = (props) => {


   const { teamsStore } = props;

   const { numTeamTargetsToday } = teamsStore;



   const noTargetsToday = numTeamTargetsToday == 0;

   // useEffect(() => {
   //    toggleItemsCount();

   //    return () => {};
   // }, [noTargetsToday]);

   if (noTargetsToday) {

      return (
         <View
            style={{
               backgroundColor: Colors.buttonLink,
               borderRadius: 16,
               padding: 2,
               paddingHorizontal: 10,
               marginLeft: 4,
               // paddingHorizontal: 6,
               alignItems: 'center',
               justifyContent: 'center',
               // position: 'absolute',
               // right: -2,
               // width: 40,
            }}>
            <Text center white B14>
               0
               {/* {`${numTeamTargetsCompletedToday} */}
               {/* /${numTeamTargetsToday}`} */}
            </Text>
         </View>
      );
      // return null
      // return (
      //    <View
      //       style={{
      //          // backgroundColor: Colors.teamToday,
      //          borderRadius: 10,
      //          padding: 6,
      //          paddingHorizontal: 6,
      //          marginLeft: 0,
      //          // paddingHorizontal: 6,
      //          alignItems: 'center',
      //          justifyContent: 'center',
      //          // position: 'absolute',
      //          // right: -2,
      //          // width: 40,
      //       }}>
      //       <FontAwesome5
      //          name="people-arrows"
      //          color={Colors.teamToday}
      //          size={14}
      //          style={{ marginLeft: 0 }}
      //       />
      //    </View>
      // );
   }

   return (
      <View
         style={{
            backgroundColor: Colors.buttonLink,
            borderRadius: 16,
            padding: 2,
            paddingHorizontal: 10,
            marginLeft: 4,
            // paddingHorizontal: 6,
            alignItems: 'center',
            justifyContent: 'center',
            // position: 'absolute',
            // right: -2,
            // width: 40,
         }}>
         <Text center white B14>
            {numTeamTargetsToday}
            {/* {`${numTeamTargetsCompletedToday} */}
            {/* /${numTeamTargetsToday}`} */}
         </Text>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TargetsBadge));
