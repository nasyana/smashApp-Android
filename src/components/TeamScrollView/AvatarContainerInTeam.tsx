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
} from 'react-native-ui-lib'; //eslint-disable-line
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer } from 'mobx-react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { GradientCircularProgress } from 'react-native-circular-gradient-progress';
import AnimatedView from 'components/AnimatedView';
import { collection, query, where, limit, onSnapshot,doc } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import {
   getDefaultWeeklyActivity,
   checkInfinity,
} from 'helpers/teamDataHelpers';
import { unixToFromNow } from 'helpers/generalHelpers';
import Routes from 'config/Routes';
import { ActivityIndicator } from 'react-native';
const AvatarContainer = (props) => {
   const { navigate } = useNavigation();
   const {
      playerId,
      player,
      smashStore,
      teamsStore,
      team,
      index = false,
   } = props;

   const {
      weeklyActivityHash,
      endOfCurrentWeekKey,
      myTeamsHash,
      setPlayersByTeamUIDHash,
      playersByTeamUIDHash
   } = teamsStore;


   const _team = myTeamsHash?.[team.id];

  
   const { todayDateKey, kFormatter, loadAndSetUserStories, currentUserId } =
      smashStore;
   const [avatar, setAvatar] = useState(_team?.playerData?.[playerId]?.picture || {});
   const [name, setName] = useState(_team?.playerData?.[playerId]?.name || '...');
   const [emoji, setEmoji] = useState('...');
   const [todayPlayer, setTodayPlayer] = useState(playersByTeamUIDHash[`${team.id}_${playerId}`] || {});
   const [updatedAt, setUpdatedAt] = useState(_team?.playerData?.[playerId]?.updatedAt || '...');
   
   const onPressApproveUsers = () => {
      navigate(Routes.CreateTeam, { teamDoc: _team, type: 'requestToJoin' });
   };

   
   useEffect(() => {
      const userDocRef = doc(firestore, "users", playerId);
      onSnapshot(userDocRef, (snap) => {
        const userDoc = snap.data();
      
        const notYetUpdated = name == "...";
      
        if (userDoc) {
          if (userDoc.name != name || notYetUpdated) {
            setName(userDoc.name);
          }
          if (userDoc?.picture?.uri != avatar?.uri || notYetUpdated) {
            setAvatar(userDoc?.picture);
          }
      
          if (userDoc?.updatedAt != updatedAt || notYetUpdated) {
            setUpdatedAt(userDoc?.updatedAt);
          }
          if (
            userDoc?.feelings?.[todayDateKey]?.emoji != emoji ||
            notYetUpdated
          ) {
            setEmoji(userDoc?.feelings?.[todayDateKey]?.emoji);
          }
        }
      });

      return () => {};
   }, [playerId]);

   useEffect(() => {

      // console.log('_team',_team.playerData)
      // setAvatar(_team?.playerData?._[playerId]?.picture || {});
      const unsub =  onSnapshot(doc(collection(firestore, 'dailyActivity'), `${team.id}_${todayDateKey}`), (snap) => {
         const todayTeamDoc = snap.data();
       
         const todayPlayers = todayTeamDoc?.players || {};
         const _todayPlayer = todayPlayers?.[playerId] || {};
        
      
         if (_todayPlayer.score != todayPlayer.score) {

            console.log('_todayPlayer2',_todayPlayer)
           setTodayPlayer(_todayPlayer);
           setPlayersByTeamUIDHash(team, {
             uid: playerId,
             ..._todayPlayer,
           });
         }
       });
       

      return () => { if(unsub){unsub()}};
   }, [playerId]);

   const [loaded, setLoaded] = useState(true);
   const showPlayerStats = () => goToProfile(player);

   const setStoriesForUser = () => {
      loadAndSetUserStories(playerId, team, temporarySmashes);
   };


   const playerTodayProgress = checkInfinity(
      (todayPlayer?.score / team?.myTargetToday) * 100,
   );

   // useEffect(() => {
   //    setTimeout(() => {
   //       setLoaded(true);
   //    }, 500);

   //    return () => {};
   // }, []);

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

   const goToProfile = () => {
      if (playerId == currentUserId) {
         navigate(Routes.MyProfile);
      } else {
         navigate(Routes.MyProfileHome, { user: { uid: playerId } });
      }
   };
   const isUserRequested =
      (_team?.requested?.includes(playerId) &&
         !_team?.joined?.includes(playerId)) ||
      false;
   const isUserAdmin = team?.admins?.includes(currentUserId) || false;

   console.log('team in avatarcontainer',team)
   if (isUserRequested) {
      return (
         <TouchableOpacity
            onPress={
               isUserRequested
                  ? isUserAdmin
                     ? onPressApproveUsers
                     : () => null
                  : setStoriesForUser
            }
            centerH
            marginR-16
            style={{ opacity: 1 }}>
         
            <SmartImage
               containerStyle={{ marginVertical: 5, marginHorizontal: 5 }}
               style={{
                  height: 63,
                  width: 63,
                  borderRadius: 160,
                  marginVertical: 6,
                  marginHorizontal: 5,
                  backgroundColor: '#eee',
                  borderWidth: isUserRequested ? 2 : 0,
                  borderColor: Colors.smashPink,
               }}
               uri={avatar?.uri || 'temporaryAvatar'}
               preview={avatar?.preview || 'temporaryPreview'}
               // ribbonLabel={todayValue}
               onPress={showPlayerStats}
            />
            {todayQty > 0 && (
               <View
                  style={{
                     // position: 'absolute',
                     // top: 37,
                     right: -8,
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
                     // position: 'absolute',
                     // top: -4,
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
  
            <TouchableOpacity onPress={goToProfile}>
               <Text style={{ ...Typography.text80 }}>
                  {name?.substring(0, 4)}{' '}
                  <Text H14 style={{ color: Colors.buttonLink }}>
                     {todayValue > 0 && kFormatter(todayValue)}
                  </Text>
               </Text>
            </TouchableOpacity>
            {isUserRequested ? (
               <Text center secondaryContent R10>
                  😋 wants to play!
               </Text>
            ) : (
               <Text center secondaryContent R10>
                  {emoji && emoji} {unixToFromNow(updatedAt)}
               </Text>
            )}
         </TouchableOpacity>
      );
   }


   // if(!isUserJoined){return null}

   return (
      <TouchableOpacity
         onPress={
            isUserRequested
               ? isUserAdmin
                  ? onPressApproveUsers
                  : () => null
               : setStoriesForUser
         }
         centerH
         marginR-12
         style={{ opacity: 1 }}>
         {loaded && (
            <View style={{
              
               justifyContent: 'center',
               alignItems: 'center',
               // zIndex: -1,
            }}>
               <GradientCircularProgress
               size={77}
                  strokeWidth={3}
               lineCap="round"
               prefill={0}
               rotation={155}
               arcSweepAngle={290}
                  withSnail
                  progress={playerTodayProgress || 0}
                  startColor={Colors.meToday}
                  middleColor={Colors.meToday}
                  endColor={Colors.blue30}
                  emptyColor={'rgba(0,0,0,0.05)'}
                 

               /> 
                 <SmartImage
            containerStyle={{ marginVertical: 5, marginHorizontal: 5 }}
            style={{
               height: 63,
               width: 63,
               borderRadius: 160,
               marginVertical: 6,
               marginHorizontal: 5,
               backgroundColor: '#eee',
               borderWidth: isUserRequested ? 2 : 0,
               position: 'absolute',
               // borderColor: Colors.smashPink,
            }}
            uri={avatar?.uri || 'temporaryAvatar'}
            preview={avatar?.preview || 'temporaryPreview'}
            // ribbonLabel={todayValue}
            onPress={showPlayerStats}
         />
            </View>
         )}

       
         {todayQty > 0 && (
            <View
               style={{
                  position: 'absolute',
                  top: 37,
                  right: -8,
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

         <TouchableOpacity onPress={goToProfile} marginT-7>
            <Text R14>
               {name?.substring(0, 4)}{' '}
               <Text H14 style={{ color: Colors.blue30 }}>
                  {todayValue > 0 && kFormatter(todayValue)}
               </Text>
            </Text>
         </TouchableOpacity>
         {isUserRequested ? (
            <Text center secondaryContent R10>
               😋 wants to play!
            </Text>
         ) : (
            <Text center secondaryContent R10>
                  {emoji && emoji} {updatedAt > 5 ? unixToFromNow(updatedAt) : 'loading..'}
            </Text>
         )}

      </TouchableOpacity>
   );
};

export default inject('smashStore', 'teamsStore')(observer(AvatarContainer));
