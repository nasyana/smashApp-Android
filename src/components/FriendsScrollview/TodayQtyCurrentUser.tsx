import React, { useState, useRef, useEffect } from 'react';

import {
   TouchableOpacity,
} from 'react-native';
import LottieAnimation from 'components/LottieAnimation';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors } from 'react-native-ui-lib';
import { Audio } from 'expo-av';
import AnimatedView from 'components/AnimatedView';
import firebaseInstance from '../../config/Firebase';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { checkIsSameDay } from 'helpers/dateHelpers';
const TodayQty = ({ smashStore, setStoriesForUser, me = false }) => {



  const todayQty = smashStore.todayActivity?.smashes?.length || 0;
   const [showAnimation, setShowAnimation] = useState(false);
   const { kFormatter } = smashStore;
   const [hasLoadedInitially, setHasLoadedInitially] = useState(false);

   // const [todayPlayer, setTodayPlayer] = useState(smashStore?.friendsTodayDocsHash?.[player?.uid]);
   // const todayQty = todayPlayer?.smashes?.length || 0;

   const prevTodayQtyRef = useRef(0);
   const loadCountRef = useRef(0);
   const prevTodayQty = prevTodayQtyRef.current;
   const playSound = async (index) => {
      const { sound } = await Audio.Sound.createAsync(
         require('../../sounds/gather.wav'),
      );

      await sound.playAsync();
   }

   // useEffect(() => {
   //    if(false){
   //       // setTodayPlayer(todayActivity)
   //    } else {
   //       const unsubscribe = onSnapshot(
   //          doc(collection(firebaseInstance.firestore, "users",player?.uid, 'days'),`${smashStore.todayDateKey}`),
   //          (snap) => {
   //             const userDay = snap.data();

   //             if(!userDay?.score || smashStore?.friendsTodayDocsHash?.[player?.uid]?.updatedAt != userDay?.updatedAt && userDay?.updatedAt && player){

   //                console.log('TodayQty setUserToday', player?.updatedAt,userDay?.updatedAt)
   //             setUserToday(userDay || {});
   //             }
   //          }
   //       );
   //       return () => unsubscribe();
   //    }
   // }, [player?.uid]);

   // const setUserToday = async (userDay) => {
   //    const localFriendDayDoc = smashStore?.friendsTodayDocsHash?.[player?.uid]?.updatedAt || 0;
   //    const isSameDay = checkIsSameDay(localFriendDayDoc.updatedAt, userDay?.updatedAt);
      
   //    if(userDay?.updatedAt > 0 && (smashStore?.friendsTodayDocsHash?.[player?.uid]?.updatedAt != userDay?.updatedAt) || !isSameDay){
   //       setTodayPlayer(userDay);
   //       setFriendsTodayDocsHash({id: player?.uid, uid: player?.uid, picture: player?.picture || false, name: player?.name || false, smashes: userDay?.smashes || [], score: userDay?.score || 0, updatedAt: userDay?.updatedAt});
   //    }
   // }

   // useEffect(() => {
     
   // }, [todayQty]);

   useEffect(() => {

      
      if (todayQty !== prevTodayQty) {
         if (hasLoadedInitially) {
            if (prevTodayQty !== 0) {
               playSound();
            }
            setShowAnimation(true);
            setTimeout(() => {
               setShowAnimation(false);
            }, 1500);
         } else {
            setHasLoadedInitially(true);
         }

         // prevTodayQtyRef.current = todayQty;
      }

      // prevTodayQtyRef.current = todayQty;

      return () => {}
   }, [todayQty]);

   // if(true)return null;
   console.log('render TodayQty',todayQty,prevTodayQty,todayQty)

   if (todayQty > 0) {

      if (showAnimation) {

         return (<View style={{
            position: 'absolute',
            top: 27,
            left: 50,
            // backgroundColor: Colors.green30,
            height: 42,
            width: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 37,
         }}><LottieAnimation
               autoPlay
               loop={true}
               style={{
                  height: 50

               }}
               source={require('../../lotties/points.json')}
            /></View>)
      }
      
      return (

         <TouchableOpacity
            onPress={setStoriesForUser}
            style={{
               position: 'absolute',
               top: 37,
               left: 50,
               backgroundColor: Colors.green30,
               height: 32,
               width: 32,
               alignItems: 'center',
               justifyContent: 'center',
               borderRadius: 37,
            }}>
            <View key={todayQty}>
               <Text
                  T24B
                  style={{
                     color: '#fff',
                     fontSize: 14,
                  }}>
                  {todayQty > 0 ? kFormatter(todayQty || 0) : 0}
               </Text>
            </View>
         </TouchableOpacity>)
   } else {

      return null
   }
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TodayQty));