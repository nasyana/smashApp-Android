import _, { map } from 'lodash';
import React, { Component, useEffect, useMemo, useState } from 'react';
import {
   ScrollView,
   Text,
   StyleSheet,
   TouchableOpacity,
   FlatList,
} from 'react-native';
import { View } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import Firebase from '../../config/Firebase';
import AvatarContainerWeek from './AvatarContainerWeek';
import AvatarContainerInTeam from './AvatarContainerInTeam';
import Shimmer from '../Shimmer';
import { AntDesign } from '@expo/vector-icons';
import Box from 'components/Box';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import LeaderboardContainerInTeam from './LeaderboardContainerInTeam';
import { Vibrate } from 'helpers/HapticsHelpers';
import LeaderboardCleanContainerInTeam from './LeaderboardCleanContainerInTeam';
import TeamListItemProgress from 'modules/MyTeamsHome/TeamProgress/TeamListItemProgress';

const TeamLeaderboardClean = (props) => {
   const { navigate } = useNavigation();

   const { smashStore, teamsStore, team, home } = props;

   const onPressApproveUsers = () => {
      navigate(Routes.CreateTeam, { teamDoc: team, type: 'requestToJoin' });
   };

   const { setShowFollowingDialog, endOfCurrentWeekKey, weeklyActivityHash } =
      teamsStore;
   // const allPlayers = teamUsersByTeamId[team.id]
   const admins = team?.admins || [];

   const { todayDateKey, kFormatter, setFocusUser, currentUser, allUsersHash } =
      smashStore;
   const [players, setPlayers] = useState([]);
   const pressAvatarHeight = 70;
   const goToProfile = (user) => {
      navigate('MyProfileHome', { user });
   };
   const isAdmin =
      admins?.includes(currentUser.uid) || team.uid == currentUser.uid;

   const teamWeeklyKey = `${team.id}_${endOfCurrentWeekKey}`;

   const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};

   useEffect(() => {
      const unsubscribeToPlayers = Firebase.firestore
         .collection('users')
         .where('teams', 'array-contains', team.id)
         .orderBy('updatedAt', 'desc')
         .limit(30)
         .onSnapshot((snaps) => {
            if (!snaps.empty) {
               const playersArray = [];
               snaps.forEach((snap) => {
                  if (!snap.exists) return;
                  const user = snap.data();

                  // console.warn(user);

                  playersArray.push(user);
               });

               const playersSorted = playersArray.sort(
                  (a, b) =>
                     (weeklyActivity?.players?.[b.uid]?.score || 0) -
                     (weeklyActivity?.players?.[a.uid]?.score || 0),
               );

               setPlayers(playersSorted.map((p) => p.uid));
            }
         });

      return () => (unsubscribeToPlayers ? unsubscribeToPlayers : null);
   }, []);

   const allRequested = team?.requested || [];
   const goToTeamArenaPre = () => {
      Vibrate();
      // setHomeTabsIndex(0);
      goToTeamArena();
   };
   const goToTeamArena = () => {
      navigate(Routes.TeamArena, { team, initialIndex: 0 || 0 });
   };
   const renderItem = React.useCallback(({ item, index }) => {
      return (
         <View key={item} style={styles.section}>
            <LeaderboardCleanContainerInTeam
               goToTeamArena={goToTeamArenaPre}
               onPressApproveUsers={onPressApproveUsers}
               playerId={item}
               {...{
                  todayDateKey,
                  setFocusUser,
                  goToProfile,
                  team,
               }}
               week
               index={index}
            />
         </View>
      );
   }, []);

   return (
      <View >
         <View >

            <Box>
               <View paddingH-24 paddingT-24 paddingB-16 style={{ flexWrap: 'wrap' }} row>
                  <FlatList
                     numColumns={5}
                     data={[...players, ...allRequested]}
                     renderItem={renderItem}
                     keyExtractor={(item, index) => {
                        return item.uid;
                     }}
                  />


               </View>

            </Box>
         </View>
      </View>
   );
};

export default inject('smashStore', 'teamsStore')(observer(TeamLeaderboardClean));

const styles = StyleSheet.create({
   container: {
      paddingTop: 25,
      paddingHorizontal: 16,
      paddingTop: 0,
   },
   // section: {
   //    flexDirection: 'column',
   //    alignItems: 'center',
   //    justifyContent: 'space-between',
   //    marginBottom: 0,
   // },
});
