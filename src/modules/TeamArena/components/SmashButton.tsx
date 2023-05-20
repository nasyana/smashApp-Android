import React from 'react'
import { Dimensions, TouchableOpacity, Modal, Platform } from 'react-native';
import { View, Colors, Assets, Image, Text } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import Routes from '../../../config/Routes';
import { inject, observer } from 'mobx-react';
import TakeVideo from '../../../modules/Smash/TakeVideo';
import LottieAnimation from 'components/LottieAnimation';
import { LinearGradient } from 'expo-linear-gradient';
import DissapearingArrow from 'components/DissapearingArrow';
const { width, height } = Dimensions.get('window');

const SmashButton = (props) => {
   const { team, smashStore, teamsStore,isTeamJustCreated } = props;
   const { navigate } = useNavigation();

   const [justCreated, setJustCreated] = React.useState(isTeamJustCreated);

   const { setMasterIdsToSmash, habitStacksHash } =
      smashStore;

   const {  currentTeam } = teamsStore;
   let allHabitStackMasterIdsInArray = [];

   currentTeam?.habitStackIds?.forEach((stackId) => {
      const stackActivities = habitStacksHash?.[stackId]?.masterIds || [];

      allHabitStackMasterIdsInArray = [
         ...allHabitStackMasterIdsInArray,
         ...stackActivities,
      ];
   });

   const allHabitMasterIds =
      [...new Set(allHabitStackMasterIdsInArray.flat(1))] || [];

   const teamMasterIds = team?.masterIds || [];
   const allMasterIdsToSmash = [...allHabitMasterIds, ...teamMasterIds].filter(id => !currentTeam?.hideMasterIds?.includes(id));

   const smashActivities = () => {

      setJustCreated(false)
      if (allMasterIdsToSmash?.length > 0) {
         setMasterIdsToSmash(allMasterIdsToSmash);
      } else {
         navigate(Routes.SetWeeklyActivities, {
            teamDoc: team,
         });
      }
   };

   if (Platform.OS === 'android') {
      return (
         <View
            style={{
               position: 'absolute',
               bottom: 40,
               width,
               alignItems: 'center',
               justifyContent: 'center',
            }}>
                  {justCreated && <DissapearingArrow center bottom={60} stay/>}
            <TouchableOpacity
               onPress={smashActivities}
               style={{
                  backgroundColor: '#111',
                  borderRadius: 70,
                  height: 70,
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     width: 85,
                     height: 85,
                     zIndex: 99999,
                  }}
                  source={require('./lotties/smashButton.json')}
               />
            </TouchableOpacity>
        
         </View>
      );
   }

   return (
  
      <View
         style={{
            position: 'absolute',
            bottom: 40,
            width,
            alignItems: 'center',
            justifyContent: 'center'
         }}>
           {justCreated && <DissapearingArrow center bottom={60} stay/>}
         <TouchableOpacity onPress={smashActivities}>
            <LinearGradient
               colors={['#FF6243', '#FF0072']}
               style={{
                  backgroundColor: Colors.buttonLink,
                  borderRadius: 35,
                  height: 70,
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     width: 85,
                     height: 85,
                     zIndex: 99999,
                  }}
                  source={require('./lotties/smashButton.json')}
               />
               {/* <Image source={Assets.icons.smashIcon} style={{

                    width: 70,
                    height: 70,

                }} /> */}
            </LinearGradient>
         </TouchableOpacity>
  
      </View>
 
   );
};
export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(SmashButton));
