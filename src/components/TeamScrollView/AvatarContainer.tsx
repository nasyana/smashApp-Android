import React, { useState, useEffect } from 'react'
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
} from 'react-native-ui-lib'; //eslint-disable-line
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer } from 'mobx-react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AnimatedView from 'components/AnimatedView';
import Firebase from 'config/Firebase';
import {
   getDefaultWeeklyActivity,
   checkInfinity,
} from 'helpers/teamDataHelpers';
import Routes from 'config/Routes';
import { unixToFromNow } from 'helpers/generalHelpers';
import { update } from 'lodash';
const AvatarContainer = (props) => {
   const { navigate } = useNavigation();
   const {
      playerId,

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
    const unsub =  Firebase.firestore
         .collection('users')
         .doc(playerId)
         .onSnapshot((snap) => {
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

      return () => {if(unsub){unsub()}};
   }, [playerId]);

   useEffect(() => {
    const unsub =  Firebase.firestore
         .collection('dailyActivity')
         .doc(`${team.id}_${todayDateKey}`)
         .onSnapshot((snap) => {
            const todayTeamDoc = snap.data();

            const todayPlayers = todayTeamDoc?.players || {};
            const _todayPlayer = todayPlayers?.[playerId] || {};

            if (_todayPlayer.score != todayPlayer.score) {
               setTodayPlayer(_todayPlayer);
               setPlayersByTeamUIDHash(team, {
                  uid: playerId,
                  ..._todayPlayer,
               });
            }
         });

      return () => {if(unsub){unsub()}};
   }, [playerId]);

   const [loaded, setLoaded] = useState(true);
   const showPlayerStats = () => goToProfile(player);

   const setStoriesForUser = () => {
      // console.warn('playerId', playerId);

      loadAndSetUserStories(playerId, team, temporarySmashes);
   };

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
   const playerTodayScore = todayPlayer?.score || 0;
   const playerTodayTarget = weeklyActivity.myTargetToday || 0;
   const progress = checkInfinity((playerTodayScore / playerTodayTarget) * 100);
   const todayValue = todayPlayer.score || 0;
   const todayQty = todayPlayer?.smashes?.length || 0;
   // if (!todayValue) {
   //    return null;
   // }

   return (
      <TouchableOpacity onPress={setStoriesForUser} centerH marginR-10>
         {loaded && (
            <AnimatedCircularProgress
               size={75}
               width={3.5}
               lineCap="round"
               prefill={0}
               rotation={155}
               arcSweepAngle={290}
               fill={progress || 0}
               tintColor={Colors.blue30}
               backgroundColor={'rgba(0,0,0,0.05)'}
               style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: -1,
               }}
            />
         )}
         <SmartImage
            containerStyle={{ marginVertical: 5, marginHorizontal: 5 }}
            style={{
               height: 63,
               width: 63,
               borderRadius: 160,
               marginVertical: 6,
               marginHorizontal: 5,
               backgroundColor: '#eee',
            }}
            uri={avatar?.uri || 'temporaryAvatar'}
            preview={avatar?.preview || 'temporaryPreview'}
            // ribbonLabel={todayValue}
            onPress={showPlayerStats}
         />
         {todayQty > 0 && (
            <View
               style={{
                  position: 'absolute',
                  top: 37,
                  right: 0,
                  backgroundColor: Colors.green30,
                  height: 32,
                  width: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 37,
               }}>
               <Text
                  T24B
                  style={{
                     color: '#fff',
                     fontSize: 14,
                  }}>
                  {kFormatter(todayQty || 0)}
               </Text>
            </View>
         )}
         {progress >= 100 && loaded && (
            <View
               style={{
                  position: 'absolute',
                  top: -4,
                  right: -8,
                  backgroundColor: 'transparent' || Colors.white,
                  height: 37,
                  width: 37,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 37,
               }}>
               <AnimatedView>
                  <Text R18>✅</Text>
               </AnimatedView>
            </View>
         )}

         {/* {emoji && (
            <View
               style={{
                  position: 'absolute',
                  top: -4,
                  left: -8,
                  backgroundColor: 'transparent' || Colors.white,
                  height: 30,
                  width: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 37,
                  backgroundColor: '#fff',
               }}>
               <AnimatedView>
                  <Text R18>{emoji}</Text>
               </AnimatedView>
            </View>
         )} */}
         <TouchableOpacity onPress={goToProfile}>
            <Text style={{ ...Typography.text80 }}>
               {name?.substring(0, 4)}{' '}
               <Text B14 style={{ color: Colors.buttonLink }}>
                  {todayValue > 0 && kFormatter(todayValue)}
               </Text>
            </Text>
         </TouchableOpacity>
         <Text center secondaryContent R10>
            {unixToFromNow(updatedAt)} {emoji && emoji}
         </Text>
         {/* <View
            style={{
               position: 'absolute',
               top: 15,
               right: -15,
            }}>
            <Text style={{ fontSize: 30 }}>{placing}</Text>
         </View> */}
      </TouchableOpacity>
   );
};

export default inject('smashStore', 'teamsStore')(observer(AvatarContainer));
