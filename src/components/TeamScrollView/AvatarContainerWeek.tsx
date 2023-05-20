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
import { GradientCircularProgress } from 'react-native-circular-gradient-progress';
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
import { collection, doc, onSnapshot } from "firebase/firestore";

import { update } from 'lodash';
const AvatarContainerWeek = (props) => {
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
   const [avatar, setAvatar] = useState(team?.playerData?.[playerId]?.picture || {});
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
      const unsub = onSnapshot(doc(firestore, "users", playerId), (snap) => {
         const userDoc = snap.data();
       
         if (userDoc) {
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
         }
       });

      return () => {};
   }, [playerId]);

   // useEffect(() => {
   //    onSnapshot(doc(collection(firestore, "dailyActivity"), `${team.id}_${todayDateKey}`), (snap) => {
   //       const todayTeamDoc = snap.data();
   //       const todayPlayers = todayTeamDoc?.players || {};
   //       const _todayPlayer = todayPlayers?.[playerId] || {};
       
   //       if (_todayPlayer.score !== todayPlayer.score) {
   //         setTodayPlayer(_todayPlayer);
   //         setPlayersByTeamUIDHash(team, {
   //           uid: playerId,
   //           ..._todayPlayer,
   //         });
   //       }
   //     });

   //    return () => {};
   // }, [playerId]);

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
   const playerWeekScore = weeklyActivity?.players?.[playerId]?.score || 0;
   const playerWeekTarget = weeklyActivity?.allPlayers ? parseInt(weeklyActivity.target / Object.keys(weeklyActivity?.allPlayers).length) : 0;
   const progress = checkInfinity((playerWeekScore / playerWeekTarget) * 100);
const userWeekScore = weeklyActivity?.players?.[playerId]?.score || 0;
   
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
               : setStoriesForUser
         }
         
         marginR-12
        
         >
            <View center  marginR-10 marginB-8 marginT-10>
               <View    
               style={{
                  position: 'absolute',
                  zIndex: -1,
               }}>
            {loaded && <GradientCircularProgress
                progress={progress}
                emptyColor={'rgba(0,0,0,0.05)'}
                size={77}
                withSnail
                strokeWidth={3}
                startColor={Colors.buttonLink}
                middleColor={Colors.smashPink}
                endColor={Colors.smashPink}

                  style={{
                     position: 'absolute',
                     zIndex: -1,
                  }}
               />}
               </View>
         {/* {loaded && (
            <AnimatedCircularProgress
               size={70}
               width={6}
               lineCap="round"
               prefill={0}
               rotation={155}
               arcSweepAngle={290}
               fill={progress || 0}
               tintColor={Colors.buttonLink}
               backgroundColor={'rgba(0,0,0,0.05)'}
               style={{
                  position: 'absolute',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  zIndex: -1,
               }}
            />
         )} */}
         <SmartImage
            style={{
               height: 63,
               width: 63,
               borderRadius: 160,
               backgroundColor: '#eee',
               borderWidth: isUserRequested ? 2 : 0,
               borderColor: Colors.smashPink,
            }}
            uri={avatar?.uri || 'temporaryAvatar'}
            preview={avatar?.preview || 'temporaryPreview'}
            onPress={showPlayerStats}
         /></View>
     
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

     
         <TouchableOpacity onPress={goToProfile} paddingT-6 centerH>
            <Text R14>
               {name?.substring(0, 4)}{' '}
               <Text B14 style={{ color: Colors.buttonLink }}>
                  {userWeekScore > 0 && kFormatter(userWeekScore)}
               </Text>
            </Text>
         </TouchableOpacity>
         {isUserRequested ? (
            <Text center secondaryContent R10>
               😋 wants to play!
            </Text>
         ) : (
            <Text center secondaryContent R10>
               {emoji && emoji} {updatedAt?.length == 3 ? updatedAt : unixToFromNow(updatedAt)}
            </Text>
         )}
     
      </TouchableOpacity>
   );
};

export default inject('smashStore', 'teamsStore')(observer(AvatarContainerWeek));
