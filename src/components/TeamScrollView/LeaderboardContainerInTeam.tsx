import React, { useState, useEffect } from 'react';
import {
   temporaryPreview,
   temporaryAvatar,
} from 'helpers/TemporaryDataHelpers';
import { useNavigation } from '@react-navigation/core';
import {
   Avatar,
   AvatarHelper,
   Text,
   Colors,
   Typography,
   View,
   TouchableOpacity,
   ProgressBar,
} from 'react-native-ui-lib'; //eslint-disable-line
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer } from 'mobx-react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AnimatedView from 'components/AnimatedView';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import {
   getDefaultWeeklyActivity,
   checkInfinity,
} from 'helpers/teamDataHelpers';
import Routes from 'config/Routes';
import { unixToFromNow } from 'helpers/generalHelpers';
import { update } from 'lodash';
import { doc, onSnapshot } from "firebase/firestore";
const LeaderboardContainerInWeek = (props) => {
   const { navigate } = useNavigation();
   const {
      playerId,
      goToTeamArena = () => null,
      smashStore,
      teamsStore,
      team,
      index = false,
   } = props;

   const { weeklyActivityHash, endOfCurrentWeekKey, setPlayersByTeamUIDHash } =
      teamsStore;
   const { todayDateKey, kFormatter, loadAndSetUserStories, currentUserId } =
      smashStore;
   const [avatar, setAvatar] = useState('');
   const [name, setName] = useState('...');
   const [emoji, setEmoji] = useState('...');
   const [updatedAt, setUpdatedAt] = useState('...');
   const [todayPlayer, setTodayPlayer] = useState({});

   const goToProfile = () => {
      if (playerId == currentUserId) {
         navigate(Routes.MyProfile);
      } else {
         navigate(Routes.MyProfileHome, { user: { uid: playerId } });
      }
   };

   useEffect(() => {
      onSnapshot(doc(firestore, "users", playerId), (snap) => {
         const userDoc = snap.data();
      
         if (userDoc)
            if (userDoc?.name != name) {
               setName(userDoc.name);
            }
         if (userDoc?.picture?.uri != avatar?.uri) {
            setAvatar(userDoc?.picture);
         }
      
         if (userDoc?.updatedAt != updatedAt) {
            setUpdatedAt(userDoc?.updatedAt);
         }
         if (userDoc?.feelings?.[todayDateKey]?.emoji != emoji) {
            setEmoji(userDoc?.feelings?.[todayDateKey]?.emoji);
         }
      });

      return () => {};
   }, [playerId]);

   // useEffect(() => {
   //    Firebase.firestore
   //       .collection('dailyActivity')
   //       .doc(`${team.id}_${todayDateKey}`)
   //       .onSnapshot((snap) => {
   //          const todayTeamDoc = snap.data();

   //          const todayPlayers = todayTeamDoc?.players || {};
   //          const _todayPlayer = todayPlayers?.[playerId] || {};

   //          if (_todayPlayer.score != todayPlayer.score) {
   //             setTodayPlayer(_todayPlayer);
   //             setPlayersByTeamUIDHash(team, {
   //                uid: playerId,
   //                ..._todayPlayer,
   //             });
   //          }
   //       });

   //    return () => {};
   // }, [playerId]);

   const [loaded, setLoaded] = useState(true);
   const showPlayerStats = () => goToProfile(player);


   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 500);

      return () => {};
   }, []);

   const teamWeeklyKey = `${team.id}_${endOfCurrentWeekKey}`;

   const weeklyActivity =
      weeklyActivityHash?.[teamWeeklyKey] || getDefaultWeeklyActivity(team);

   const placing =
      index === 0 ? '🥇' : index == 1 ? '🥈' : index == 2 ? '🥉' : false;

   const temporarySmashes = todayPlayer?.smashes;
   const playerWeekScore = weeklyActivity?.players?.[playerId]?.score || 0;
   const playerWeekTarget = weeklyActivity?.allPlayers
      ? parseInt(
           weeklyActivity.target /
              Object.keys(weeklyActivity?.allPlayers).length,
        )
      : 0;
   const progress = checkInfinity((playerWeekScore / playerWeekTarget) * 100);
   const todayValue = todayPlayer.score || 0;
   const todayQty = todayPlayer?.smashes?.length || 0;
   // if (!todayValue) {
   //    return null;
   // }
   const isUserRequested =
      (team?.requested?.includes(playerId) &&
         !team?.joined?.includes(playerId)) ||
      false;

   const isUserAdmin = team?.admins?.includes(currentUserId) || false;

   const onPressApproveUsers = () => {
      navigate(Routes.CreateTeam, { teamDoc: team, type: 'requestToJoin' });
   };
   return (
      <TouchableOpacity
         onPress={
            isUserRequested
               ? isUserAdmin
                  ? onPressApproveUsers
                  : () => null
               : () => goToTeamArena()
         }
         style={{ width: '100%' }}
         marginT-8>
         <View flex row spread marginR-10 centerV marginB-4>
            <TouchableOpacity
               onPress={goToTeamArena}
               row centerV>
               <SmartImage
                  containerStyle={{ marginVertical: 5, marginHorizontal: 5 }}
                  style={{
                     height: 50,
                     width: 50,
                     borderRadius: 160,
                     marginVertical: 6,
                     marginRight: 16,
                     backgroundColor: '#eee',
                     borderWidth: isUserRequested ? 2 : 0,
                     borderColor: Colors.smashPink,
                  }}
                  uri={avatar?.uri || 'temporaryAvatar'}
                  preview={avatar?.preview || 'temporaryPreview'}
                  // ribbonLabel={todayValue}
                  onPress={showPlayerStats}
               />

               <Text M14>
                  {name?.substring(0, 24)}{' '}
                  <Text B14 style={{ color: Colors.teamToday }}>
                     ({playerWeekScore > 0 && kFormatter(playerWeekScore) || 0})
                  </Text>
               </Text>
            </TouchableOpacity>
            {isUserRequested && false ? (
               <Text secondaryContent R12>
                  😋 wants to play!
               </Text>
            ) : (
                  <Text secondaryContent R14>
                  {emoji && emoji} {unixToFromNow(updatedAt)}
               </Text>
            )}
         </View>
         <ProgressBar
            progress={progress > 100 ? 100 : progress}
            style={{ height: 7 }}
            progressColor={Colors.teamToday}
         />
      </TouchableOpacity>
   );
};

export default inject(
   'smashStore',
   'teamsStore',
)(observer(LeaderboardContainerInWeek));
