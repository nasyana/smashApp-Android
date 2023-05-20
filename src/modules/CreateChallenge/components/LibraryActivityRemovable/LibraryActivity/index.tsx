import { useNavigation } from "@react-navigation/core";
import Routes from "config/Routes";
import { shadow, width } from "config/scaleAccordingToDevice";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, Assets, Image, Colors } from "react-native-ui-lib";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import { doc, updateDoc } from "firebase/firestore";
import firebaseInstance from "config/Firebase";
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
const LibraryActivity = ({
   item,
   onPress,
   // selected,
   onLongPress = () => null,
   smashStore,
   actionsStore,
   forGoal
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
   return (
      <TouchableOpacity onPress={forGoal ? ()=>onPress(item) : onPress} onLongPress={onLongPress} onLongPress={onLongPress}>
         <View
            padding-16
            row
            backgroundColor={Colors.white}
            margin-16
            marginT-0
            centerV
            style={{
               ...shadow,
               justifyContent: 'space-between',
            }}>
            <View style={{width: width - 110}}>
               <Text M18 color={selected ? levelColor : Colors.color28}>
               {item.text} 
               {item.hideFromTeams && ' (Hide)'}
                  {/* {JSON.stringify(item)} */}
               </Text>
               <View  >
               {item?.description && <Text R14 secondaryContent>{item?.description}</Text>}{ false &&    item.useInSingleGoals && currentUser?.superUser && <Text R14 >(Can use for Single)</Text>}
              </View>
               {item?.baseActivityLabel && <Text R10 secondaryContent>{item?.baseActivityLabel}</Text>}
               <View row marginT-8 centerV>
                  <FontAwesome5
                     name={'fire-alt'}
                     color={selected ? levelColor : Colors.secondaryContent}
                     size={14}
                  />
                  {/* <Image source={Assets.icons.ic_calories_burn} /> */}
                  <Text
                     R14
                     color6D
                     marginL-4
                     marginR-24
                     // style={{ color:  }}
                  >
                     {/* Level {item.level}{' '} */}
                     {/* {item.bonus > 0 && <Text buttonLink>+{item.bonus}</Text>}  */}
                     (
                     {oldValue})
                     {/* {item?.activityValue && '(' + item?.activityValue + ')'} */}
                  </Text>
                  {/* <Image source={Assets.icons.ic_time_16} />
            <Text R14 color6D marginL-4 marginR-24>
              {item.time} mins
            </Text> */}
                  {!!item.rate && (
                     <>
                        <Image source={Assets.icons.ic_calories_burn} />
                        <Text R14 color6D marginL-4>
                           9.2
                        </Text>
                     </>
                  )}


               </View>
            </View>
                     {/* <View paddingR-16 paddingL-16> */}
            <FontAwesome
               name={selected ? 'check-circle' : 'check-circle'}
               color={selected ? levelColor : Colors.secondaryContent}
               style={{ opacity: selected ? 1 : 0.5 }}
               size={32}

            />
            {/* </View> */}
            {/* {currentUser.activityManager && <TouchableOpacity onPress={onLongPress}><Text>Edit</Text></TouchableOpacity>} */}
            {/* <Image
               source={
                  selected
                     ? Assets.icons.ic_checkbox_selected
                     : Assets.icons.ic_checkbox
               }
            /> */}
         </View>
      </TouchableOpacity>
   );
};

export default inject(
   'createChallengeStore',
   'actionsStore',
   'smashStore',
   'teamsStore',
)(observer(LibraryActivity));
const styles = StyleSheet.create({});
