import { FONTS } from 'config/FoundationConfig';
import { width } from 'config/scaleAccordingToDevice';
import React, { memo } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Text, View } from 'react-native-ui-lib';
import { moment } from 'helpers/generalHelpers';;
import { inject, observer } from 'mobx-react';
import LinearChartActivity from './LinearChartActivity';
import SectionHeader from './SectionHeader';
import Box from './Box';

const UserActivitiesStats = (props) => {
   const { smashStore, teamsStore } = props;

   const { libraryActivitiesHash, todayActivity, currentUser } = smashStore;

   const userActivities = currentUser.activityQuantities
      ? Object.keys(currentUser.activityQuantities)
      : [];
   const activityIds = userActivities.sort(
      (a, b) =>
         currentUser?.activityQuantities?.[a] -
         currentUser?.activityQuantities?.[b],
   );
   console.log('check rerenders UserActivitiesStats');
   if (activityIds.length == 0) {
      return null;
   }

   return (
      <View flex>
         <SectionHeader
            title={'Activity Stats '}
            subtitle={<Text B12>Last 7 Days</Text>}
            style={{ marginTop: 16 }}
         />
         {activityIds.map((a) => {
            const activity = libraryActivitiesHash?.[a];
            return (
               <Box paddingT-16 style={{ paddingTop: 16 }}>
                  <View row paddingH-16 centerV style={{ width: '100%' }}>
                     <Text B14>{activity.text}</Text>
                  </View>
                  {/* <SectionHeader
                     title={activity.text}
                     style={{ marginBottom: 0, paddingBottom: 0 }}
                  /> */}
                  {/* <Text>{a.text}</Text> */}
                  <LinearChartActivity activityMasterId={a} />
               </Box>
            );
         })}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(UserActivitiesStats));
