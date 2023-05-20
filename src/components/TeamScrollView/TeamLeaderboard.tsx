import _ from 'lodash';
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
import SectionHeader from 'components/SectionHeader';

const TeamScrollView = (props) => {
   const { navigate } = useNavigation();

   const { smashStore, teamsStore, team, home } = props;

   const onPressApproveUsers = () => {
      navigate(Routes.CreateTeam, { teamDoc: team, type: 'requestToJoin' });
   };

   const { setShowFollowingDialog, endOfCurrentWeekKey, weeklyActivityHash } =
      teamsStore;
   // const allPlayers = teamUsersByTeamId[team.id]
   const admins = team?.admins || [];

   const { todayDateKey, kFormatter, setFocusUser, currentUser,currentUserId, teamsView } =
      smashStore;
   const [players, setPlayers] = useState([]);
   const pressAvatarHeight = 70;
   const goToProfile = (user) => {
      navigate('MyProfileHome', { user });
   };
   const isAdmin =
      admins?.includes(currentUserId) || team.uid == currentUserId;

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
            <LeaderboardContainerInTeam
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


   if (teamsView != 'thisweek') { return null }

   return (
      <View
         showsHorizontalScrollIndicator={false}
      // contentContainerStyle={styles.container}
      >


         <View flex>
            {(isAdmin || currentUser.superUser) && !home && false && (
               <TouchableOpacity onPress={setShowFollowingDialog}>
                  <Box
                     style={{
                        height: pressAvatarHeight,
                        width: pressAvatarHeight,
                        borderRadius: pressAvatarHeight / 2,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        marginRight: 6,
                        marginTop: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}>
                     <AntDesign
                        name={'addusergroup'}
                        size={28}
                        color={'#777'}
                     />
                  </Box>
               </TouchableOpacity>
            )}

            <Box>
               <View paddingH-24 paddingT-8 paddingB-24>
            <FlatList
               // horizontal={true}
                     scrollEnabled={false}
                  // contentContainerStyle={{ }}
               data={[...players, ...allRequested]}
               renderItem={renderItem}
                     ListHeaderComponent={<SectionHeader title="Team Leaderboard" top={16} style={{ marginLeft: 0 }} />}
               keyExtractor={(item, index) => {
                  return item;
               }}
            />
               </View>
            </Box>
         </View>
      </View>
   );
};

export default inject('smashStore', 'teamsStore')(observer(TeamScrollView));

const styles = StyleSheet.create({
   container: {
      paddingTop: 25,
      paddingHorizontal: 16,
      paddingTop: 0,
   },
   section: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
   },
});
