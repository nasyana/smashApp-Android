import { View } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import {
   FlatList
} from 'react-native';
import { moderateScale } from 'helpers/scale';


import Shimmer from 'components/Shimmer';
import { width } from 'config/scaleAccordingToDevice';
import DoneRenderItem from './DoneRenderItem';
import DoneChallengeItem from './DoneChallengeItem';
import DoneGoalItem from './DoneGoalItem'

const DoneDialog = (props: any) => {
   const { smashStore, teamsStore } = props;
   const {
      stringLimit,
      kFormatter,
      completionsTeamsAndChallenges,
      multiplier,
      activtyWeAreSmashing
   } = smashStore;

   const value =  activtyWeAreSmashing ? smashStore.returnActionPointsValue(activtyWeAreSmashing) : 0;
   let pointsToAdd = parseInt(value) * parseInt(multiplier);

   const renderItem = ({ item, index }) => {
      if (!item) {
         return (
            <Shimmer
               style={{
                  height: 35,
                  marginTop: 8,
                  width: width - 72,
                  marginHorizontal: 16,
                  borderRadius: 8,
               }}
            />
         );
      }

      const target = item.selectedTarget || 0;

         if(item.goalName){

            return (
               <DoneGoalItem
                  {...{
                     item,
                     index,
                     multiplier,
                     pointsToAdd,
                     stringLimit,
                     kFormatter,
                     target,
                  }}
               />
            );
         }

      if (item.challengeType) {
         return (
            <DoneChallengeItem
               {...{
                  item,
                  index,
                  multiplier,
                  pointsToAdd,
                  stringLimit,
                  kFormatter,
                  target,
               }}
            />
         );
      } else {
         return (
            <DoneRenderItem
               {...{
                  item,
                  index,
                  multiplier,
                  pointsToAdd,
                  stringLimit,
                  kFormatter,
                  target,
               }}
            />
         );
      }
   };

   return (
      <View
         style={{
            backgroundColor: '#fff',
            marginTop: -90,
            borderRadius: 5,
            paddingVertical: 10,
            maxHeight: moderateScale(440),
         }}>
         <View paddingV-40 />
         <FlatList
            // data={completionsTeamsAndChallenges?.filter((item) => !item.goalName )}
            data={completionsTeamsAndChallenges}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 16 }}
            keyExtractor={(item, index) => item.id}
            ListEmptyComponent={
               <Shimmer
                  style={{
                     height: 55,
                     marginTop: 8,
                     width: width - 72,
                     marginHorizontal: 16,
                     borderRadius: 8,
                  }}
               />
            }
         />

         <View paddingV-10 />
      </View>
   );
};;

export default inject('smashStore', 'teamsStore')(observer(DoneDialog));
