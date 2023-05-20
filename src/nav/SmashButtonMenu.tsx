import React, { useEffect } from 'react'
import { Dimensions, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { View, Colors, Assets, Image } from "react-native-ui-lib";
import LottieAnimation from 'components/LottieAnimation';
import { inject, observer } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import { Vibrate } from 'helpers/HapticsHelpers';
import { largeDevice } from 'config/scaleAccordingToDevice';
const { width, height } = Dimensions.get('window');
function onlyUnique(value, index, self) {
   return self?.indexOf(value) === index;
}
const isAndroid = Platform.OS === 'android'
const SmashButtonMenu = (props) => {
   
   if(isAndroid){return null}
   console.log('render SmashButtonMenu');
   const loading = false 
   // useEffect(() => {
    
     
   //   return () => {
      
   //   }
   // }, [])
   

   const smashActivities = () => {
      const { smashStore = {}, challengesStore = {}, teamsStore = {} } = props;
      const { setMasterIdsToSmash, smashEffects} =
         smashStore;
    
      const { myTeams = [] } = teamsStore;

      const {myGoals = []} = challengesStore
   
  
      // smashStore.universalLoading = true;


      // setTimeout(() => {

         const allMasterIdsInArray = challengesStore.myChallenges?.map(
            (challenge: any) => {
               return [...(challenge.masterIds || [])];
            },
         ) || [];
      
         const allTeamMasterIdsInArray = myTeams?.map((team: any) => {
            return [...(team.masterIds || [])];
         });
      
         let allHabitStackMasterIdsInArray = [];
      
         let allGoalMasterIds = [];

         myGoals.forEach((goal) => {
            const masterIds = goal?.masterIds?.filter((id) => !goal?.hideMasterIds?.includes(id)) || [];

            allGoalMasterIds = mergeArrays(allGoalMasterIds, masterIds);
         });



         myTeams.forEach((team) => {
      
            // add all team.masterIds and team.singleMasterIds to allHabitStackMasterIds array, spread them so they are all ids in the array
            const masterIds = team?.masterIds?.filter((id) => !team?.hideMasterIds?.includes(id)) || [];
            const singleMasterIds = team?.singleMasterIds?.filter((id) => !team?.hideMasterIds?.includes(id)) || [];
      
            const newArray = [...masterIds, ...singleMasterIds] || [];
            allHabitStackMasterIdsInArray = mergeArrays(allHabitStackMasterIdsInArray, newArray);
      
         })
      
         const allHabitMasterIds =
            [...new Set(allHabitStackMasterIdsInArray.flat(1))] || [];
      
         const allMasterIds = [...new Set(allMasterIdsInArray.flat(1))] || [];
         const allTeamMasterIds = [...new Set(allTeamMasterIdsInArray.flat(1))] || [];
      
         const hasMasterIds =
            [...allMasterIds, ...allTeamMasterIds, ...allHabitMasterIds, ...allGoalMasterIds]?.length > 0;
         
   
     
         if (!hasMasterIds) {
            smashStore.tutorialVideo = smashStore?.settings?.tutorials?.pushSmash;
            smashStore.dismissWizard = true;
            return;
         }
   
         smashStore.dismissWizard = true;
         smashEffects();
     
         smashStore.setActivtyWeAreSmashing(false)
         smashStore.setCapturedPicture(false);
         smashStore.setCapturedVideo(false);
         smashStore.setManuallySkipped(false);
         smashStore.multiplier = 1;
         setMasterIdsToSmash( [...allMasterIds, ...allTeamMasterIds, ...allHabitMasterIds, ...allGoalMasterIds].filter( onlyUnique, ), );
         // smashStore.universalLoading = false;
         
      // }, 300);
      
   };

 

   if (
      !props.smashStore.dismissWizard
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
            <LottieAnimation
               autoPlay
               loop={true}
               style={{
                  width: 85,
                  height: 85,
                  zIndex: 99999,
                  elevation: 99999,
               }}
               source={require('./components/lotties/smashButton.json')}
            />
         </LinearGradient>
      </TouchableOpacity>
   );
};

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