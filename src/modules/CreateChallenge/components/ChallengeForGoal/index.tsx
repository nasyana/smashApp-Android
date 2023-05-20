import { useNavigation } from "@react-navigation/core";
import Routes from "config/Routes";
import { shadow, width } from "config/scaleAccordingToDevice";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { View, Text, Assets, Image, Colors, TouchableOpacity, Button } from "react-native-ui-lib";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import { doc, updateDoc } from "firebase/firestore";
import firebaseInstance from "config/Firebase";
import Activities from "components/Challenge/Activities";
import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
interface Props {
   item: {
      text: string;
      level: number;
      time: number;
      rate: number;
      isActive: boolean;
   };
   onPress: () => void;
   selected: boolean;
}
const ChallengeForGoal = ({
   item,
   onPress,
   // selected,
   onLongPress = () => null,
   smashStore,
   actionsStore,
   forGoal,
}: Props) => {
   const oldValue = smashStore.returnActionPointsValue(item);

   const { levelColors, currentUser } = smashStore;
   const levelColor = levelColors[item.level];
   // console.log('actionsStore.selectedActions',actionsStore.selectedActions)


   const selected = actionsStore.selectedActions.some(action => action.id === item.id);

   const updateActivityToSetHideOnGoalsBooleanToTrue = async () => {

       // Alert to confirm
     Alert.alert(
            'Hide Activity',
            'Are you sure you want to hide this activity from your goals?',
            [
               {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
               },
               { text: 'OK', onPress: async () => {   

                  if(item.hideOnGoals){

                     const postRef = doc(firebaseInstance.firestore, 'feed', item.id)
                     await updateDoc(postRef, { hideOnGoals: false });

                  }else{

                     const postRef = doc(firebaseInstance.firestore, 'feed', item.id)
                     await updateDoc(postRef, { hideOnGoals: true });
                  }

              
            
            
            
            } }
            ]
         );

      

    


   }
   const size = 50;

   const icon = Assets.icons?.[item?.imageHandle || 'smashappicon']
   return (
      <TouchableOpacity marginV-8   >
         <Box >
         
         
         <View
      
            row
            backgroundColor={Colors.white}
            margin-16
            marginT-24
            centerV
            style={{
               ...shadow,
               justifyContent: 'space-between',
            }}>
              <View marginB-16 center style={{backgroundColor: item.colorStart || '#333', borderRadius: (size + 5) / 2, width: size + 5, height: size + 5, marginLeft: 0, marginRight: 4}}>
               <Image
             source={icon}
               style={{
                  height: size,
                  width: size,
                  borderRadius: size / 2,
                  
               }}
            /></View> 
            <View flex paddingH-16 marginB-16>
               <Text M18 color={selected ? levelColor : Colors.color28}>
               {item.name} 
               {/* {JSON.stringify(item?.masterIds)} */}
               {item.hideFromTeams && ' (Hide)'}
                  {/* {JSON.stringify(item)} */}
               </Text>
               <View  >
               {item?.description && <Text R14 secondaryContent>{item?.description}</Text>}{ false &&    item.useInSingleGoals && currentUser?.superUser && <Text R14 >(Can use for Single)</Text>}
              </View>
               {item?.baseActivityLabel && <Text R10 secondaryContent>{item?.baseActivityLabel}</Text>}
            
            </View>
            

         </View>
         <View paddingH-16>
         <Activities masterIds={item?.masterIds} notPressable={true} />
         </View>
         <ButtonLinear style={{marginBottom: 24, marginTop: 16}} title="Choose" onPress={forGoal ? ()=>onPress(item) : onPress} onLongPress={onLongPress} />
         </Box>
      </TouchableOpacity>
   );
};

export default inject(
   'createChallengeStore',
   'actionsStore',
   'smashStore',
   'teamsStore',
)(observer(ChallengeForGoal));
const styles = StyleSheet.create({});
