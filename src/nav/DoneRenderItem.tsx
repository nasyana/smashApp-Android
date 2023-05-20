import React, { useState, useEffect } from 'react';
import { Text, View, Colors } from 'react-native-ui-lib';
import { Audio } from 'expo-av';
import { inject, observer } from 'mobx-react';


import { Ionicons } from '@expo/vector-icons';

import SmartImage from '../components/SmartImage/SmartImage';
import _ from 'lodash';

import AnimatedView from 'components/AnimatedView';

import Shimmer from 'components/Shimmer';
import { width, height } from 'config/scaleAccordingToDevice';


import LottieAnimation from 'components/LottieAnimation';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { kFormatter } from 'helpers/generalHelpers';
import Ranking from './Ranking';
import {getTeamWeeklyData} from 'helpers/teamDataHelpers';

const DoneRenderItem = (props) => {
   const { item, index, stringLimit, smashStore } =
      props;

   
      const {multiplier, activtyWeAreSmashing} = smashStore;

const value =  smashStore.returnActionPointsValue(activtyWeAreSmashing);
let pointsToAdd = parseInt(value) * parseInt(multiplier);

   const { settings } = smashStore;
   // const weeklyActivity = getTeamWeeklyData(item?.weeklyActivity, item.team) || {}; 
   // setWeeklyActivity(weeklyActivity);
  const [weeklyActivity, setWeeklyActivity] = useState(getTeamWeeklyData(item?.weeklyActivity, item.team));
   const { temporaryImages = {} } = settings;

   const { noTeamImage = '' } = temporaryImages;

   async function playSound(index) {
      const { sound } = await Audio.Sound.createAsync(
         require('../sounds/gather.wav'),
      );
      // setSound(sound);
      await sound.playAsync();
   }
   const [loaded, setLoaded] = useState(false);




   
   useEffect(() => {
// alert('asd')
  
      // alert(JSON.stringify(item?.weeklyActivity));
    
      // setTimeout(() => {
         playSound();
        
         setLoaded(true);
         setWeeklyActivity(getTeamWeeklyData(item?.weeklyActivity, item.team))
      // }, (index == 0 ? 100 : index + 1) * 700);

      return () => {};
   }, []);


   const myTodayScore = (weeklyActivity.myScoreToday || 0) + pointsToAdd || pointsToAdd;

   const remainingToday = weeklyActivity.myTargetToday - myTodayScore || false;

   const myTargetToday = weeklyActivity?.myTargetToday || 0;

   const myTodayProgress =
      myTargetToday <= 0 ? 100 : (myTodayScore / myTargetToday) * 100 || 0;

   if (!loaded) {
      return (
         <Shimmer
            style={{
               height: 55,
               marginTop: 8,
               width: width - 72,
               marginHorizontal: 16,
               borderRadius: 8,
            }}
         />
      );
   }

 

   return (
      <AnimatedView >
         <View
            style={{
               shadowColor: '#333',
               shadowOffset: {
                  width: 0,
                  height: 1,
               },
               shadowOpacity: 0.05,
               shadowRadius: 4.22,
               elevation: 3,
            }}
            key={index}
            duration={7000}>
            <View
               style={{
                  borderBottomWidth: 0,
                  borderBottomColor: '#e6e6e6',
                  paddingHorizontal: 24,
                  shadowColor: '#333',
                
                  shadowOffset: {
                     width: 0,
                     height: 1,
                  },
                  shadowOpacity: 0,
                  shadowRadius: 4.22,
                  elevation: 3,
               }}>
               <View
                  style={{
                     marginTop: 8,
                     marginBottom: 8,
                     flexDirection: 'row',
                     backgroundColor: '#333',
                     borderRadius: 8,
                     padding: 8
                  }}>
                  <SmartImage
                     uri={item?.picture?.uri || noTeamImage}
                     preview={item?.picture?.preview || ''}
                     style={{
                        height: 40,
                        width: 40,
                        borderRadius: 5,
                        backgroundColor: '#333',
                        borderWidth: 0,
                        borderColor: '#333',
                     }}
                  />
                  <View
                     style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: 16,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}>
                     <View left centerV>
                        {/* <Ionicons
                           name="people-sharp"
                           size={14}
                           style={{
                              marginRight: 15,
                              color: Colors.teamToday,
                           }}
                        /> */}
                        <Text B14 centerV>
                           <View row centerV>
                              <Text B14 white>
                                 {stringLimit(item.title, 16)?.toUpperCase()}{' '}
                              </Text>
                              <Ranking
                                 // hideWhenSmashing
                                 // newPoints={pointsToAdd}
                                 // newQty={multiplier}
                                 loadIndex={index}
                                 team={item}
                                 colorStart={item.colorStart}
                                 // ranking={3}
                              />
                           </View>
                           {/* <Text meToday>
                              +
                              {item?.targetType == 'qty'
                                 ? multiplier + ' ' + item?.unit?.length > 0
                                    ? multiplier + item?.unit
                                    : multiplier + ' Smashed'
                                 : pointsToAdd + ' pts'}{' '}
                           </Text> */}
                        </Text>
                        <AnimatedView>
                           <Text
                              B14
                              white>
                              {remainingToday && remainingToday > 0 ? (
                                 <Text secondaryContent R12 white>
                                    {kFormatter(remainingToday)} left today
                                    {/* (
                                    {kFormatter(myTargetToday)}) */}
                                 </Text>
                              ) : (
                                 <Text R12 white>
                                       {myTodayScore > 0 ? kFormatter(myTodayScore) : pointsToAdd}
                                    {myTargetToday > 0
                                       ? ' / ' + kFormatter(myTargetToday)
                                       : ' Bonus!'}
                                 </Text>
                              )}
                           </Text>
                        </AnimatedView>
                     </View>
                  </View>
                  {myTodayProgress >= 100 ? (
                     <LottieAnimation
                        autoPlay
                        loop={false}
                        style={{
                           height: 50,
                           zIndex: 0,
                           top: 0,
                           right: 3,
                           position: 'absolute',
                        }}
                        source={require('./../lottie/celebration8.json')}
                     />
                  ) : (
                     <AnimatedCircularProgress
                        size={45}
                        fill={myTodayProgress > 100 ? 100 : myTodayProgress}
                        rotation={0}
                        width={5}
                        style={{ marginHorizontal: 0 }}
                        fillLineCap="round"
                        tintColor={Colors.meToday}
                        backgroundColor={'#eee'}>
                        {(fill) => (
                           <View centerV centerH>
                              <Text
                                 secondaryContent
                                 M12
                                 style={{
                                    // fontWeight: 'bold',

                                    // fontSize: 12,
                                    color: Colors.meToday,
                                 }}>
                                 {parseInt(fill)}%
                              </Text>
                           </View>
                        )}
                     </AnimatedCircularProgress>
                     // <Text
                     //    R14
                     //    center
                     //    style={{
                     //       width: 40,
                     //       color: item.colorEnd || '#333',
                     //    }}>
                     //    {myTodayProgress > 0 ? myTodayProgress : 0}%
                     // </Text>
                  )}
               </View>
            </View>
         </View>
      </AnimatedView>
   );
};

export default inject('smashStore', 'teamsStore')(observer(DoneRenderItem));
