import React from 'react'
import { Dimensions, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { View, Colors, Assets, Image } from "react-native-ui-lib";
import LottieAnimation from 'components/LottieAnimation';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import { inject, observer } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import { Vibrate } from 'helpers/HapticsHelpers';
import { largeDevice } from 'config/scaleAccordingToDevice';
const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
function onlyUnique(value, index, self) {
   return self?.indexOf(value) === index;
}
const SmashButtonMenu = (props) => {

   if(!isAndroid){return null}
   const { smashStore, challengesStore, teamsStore } = props;
   const { setMasterIdsToSmash, smashEffects, activityList, currentUser } =
      smashStore;
      const loading = false //activityList?.length === 0 && currentUser?.allPointsEver > 0;
   const { myTeams, allTeamHabitStackIds } = teamsStore;


   const allMasterIdsInArray = challengesStore.myChallenges?.map(
      (challenge: any) => {
         return [...(challenge.masterIds || [])];
      },
   );

   const allTeamMasterIdsInArray = myTeams?.map((team: any) => {
      return [...(team.masterIds || [])];
   });

   let allHabitStackMasterIdsInArray = [];


   myTeams.forEach((team) => {

      // add all team.masterIds and team.singleMasterIds to allHabitStackMasterIds array, spread them so they are all ids in the array
      const masterIds = team?.masterIds?.filter((id) => !team?.hideMasterIds?.includes(id)) || [];
      const singleMasterIds = team?.singleMasterIds?.filter((id) => !team?.hideMasterIds?.includes(id)) || [];

      const newArray = [...masterIds, ...singleMasterIds];
      allHabitStackMasterIdsInArray = mergeArrays(allHabitStackMasterIdsInArray, newArray);


   })

   const allHabitMasterIds =
      [...new Set(allHabitStackMasterIdsInArray.flat(1))] || [];

   const allMasterIds = [...new Set(allMasterIdsInArray.flat(1))] || [];
   const allTeamMasterIds = [...new Set(allTeamMasterIdsInArray.flat(1))] || [];

   const { navigate } = useNavigation();
   // const goToCamera = () => { navigate(Routes.TakeVideo) }

   const hasMasterIds =
      [...allMasterIds, ...allTeamMasterIds, ...allHabitMasterIds]?.length > 0;

   const smashActivities = () => {
      if (!hasMasterIds) {
         smashStore.tutorialVideo = smashStore?.settings?.tutorials?.pushSmash;

         smashStore.dismissWizard = true;
         // navigate(Routes.JoinChallenges);
         // smashStore.setFindChallenge(true);
         return;
      }

      smashStore.dismissWizard = true;
      smashEffects();
      // Vibrate();
      setMasterIdsToSmash(
         [...allMasterIds, ...allTeamMasterIds, ...allHabitMasterIds].filter(
            onlyUnique,
         ),
      );
   };


   if (
      // smashStore.gotPermissions &&
      // noChallengesOrTeams &&
      !smashStore.dismissWizard
   ) {
      return (
         <View
            style={{
               position: 'absolute',
               width,
               height: isAndroid ? height + 40 : height,
               top: 0,
               backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <View
               style={{
                  borderRadius: 70,
                  height: 70,
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: (Platform.OS === 'android' ? 0 : 30) + 130,
                  left: width / 2 - 35,
               }}>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     height: 200,
                     zIndex: 0,
                  }}
                  source={require('../lotties/arrow-down.json')}
               />
            </View>

            <TouchableOpacity
               onPress={smashActivities}
               style={{
                  backgroundColor: '#111',
                  borderRadius: 70,
                  height: 70,
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: Platform.OS === 'android' ? 30 : 30,
                  left: width / 2 - 35,
               }}>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     width: 85,
                     height: 85,
                     zIndex: 99999,
                    
                  }}
                  source={require('./components/lotties/smashButton.json')}
               />

               {/* <Image source={Assets.icons.smashIcon} style={{
                       width: 70,
                       height: 70,
                   }} /> */}
            </TouchableOpacity>
         </View>
      );
   }
   if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return (
         <TouchableOpacity
            onPress={smashActivities}
            style={{
               backgroundColor: loading ? 'rgba(0,0,0,0.2)' : '#111',
               borderRadius: 70,
               height: 70,
               width: 70,
               alignItems: 'center',
               justifyContent: 'center',
               position: 'absolute',
               bottom: Platform.OS === 'android' ? 0 : largeDevice ? 30 : 10,
               left: width / 2 - 35,
            }}>
            {loading ? <ActivityIndicator color="white"  /> : <LottieAnimation
               autoPlay
               loop={true}
               style={{
                  width: 85,
                  height: 85,
                  zIndex: 99999,
               }}
               source={require('./components/lotties/smashButton.json')}
            />}

            {/* <Image source={Assets.icons.smashIcon} style={{
                       width: 70,
                       height: 70,
                   }} /> */}
         </TouchableOpacity>
      );
   }

   return (
      <TouchableOpacity
         onPress={smashActivities}
         style={{
            backgroundColor: '#111',
         }}>
         <LinearGradient
            colors={['#FF6243', '#FF0072']}
            style={{
               borderRadius: 35,
               height: 70,
               width: 70,
               alignItems: 'center',
               justifyContent: 'center',
               position: 'absolute',
               bottom: Platform.OS === 'android' ? 0 : 30,
               left: width / 2 - 35,
            }}>
            {loading ? <ActivityIndicator /> : <LottieAnimation
               autoPlay
               loop={true}
               style={{
                  width: 85,
                  height: 85,
                  zIndex: 99999,
                  elevation: 99999,
               }}
               source={require('./components/lotties/smashButton.json')}
            />}

            {/* <Image source={Assets.icons.smashIcon} style={{

                    width: 70,
                    height: 70,

                }} /> */}
         </LinearGradient>
      </TouchableOpacity>
   );
};;;;

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(SmashButtonMenu));



function mergeArrays(arr1, arr2) {
   // Create a new Set from arr1 and arr2
   const set = new Set([...arr1, ...arr2]);
   // Use the spread operator to convert the Set back to an array and return it
   return [...set];
}