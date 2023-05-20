import React, { useEffect, useRef } from 'react';
import { getDayChar, getDayNum, getDayShort, isToday, kFormatter } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { isDateInPast, hexToRgbA } from 'helpers/generalHelpers';
import { useNavigation } from '@react-navigation/core';

import { width } from 'config/scaleAccordingToDevice';
import { ScrollView } from 'react-native';
import Routes from 'config/Routes';
import { Vibrate } from 'helpers/HapticsHelpers';
import SectionHeader from './SectionHeader';
const ChallengeDayTargets = (props) => {
   const { navigate } = useNavigation();

   const {baseActivityId = false} = props


   const goToActivitiesListLast7 = () => {
    navigate(Routes.ActivitiesListLast7);
    //navigate to ActivitiesListLast7
 }
   const { smashStore, activityId, showLabel = false, all = false, customLabel = false } = props;
//    const numDays = daysInChallenge(item);
   const { last7Keys, stringLimit,  currentUserHasPointsEver, libraryActivitiesHash,activity } =
      smashStore;

      
      const activityDoc = libraryActivitiesHash?.[activityId] || {}

   const meTodayRgb = baseActivityId ? hexToRgbA(Colors.smashPink, 0.3) : hexToRgbA(Colors.meToday, 0.3);

//    const rgba3 = hexToRgbA(item.colorStart, 0.3);

   // const gotToTargetsToday = (date) => {
   //    navigate('SingleChallengeDay',{date})
   // }

   const size = width / 11;
   const totalCount = last7Keys.reduce((acc, dayKey) => {
    let count = all ? activity[dayKey]?.qty : activity[dayKey]?.activityQuantities?.[activityId] || 0;
    if(baseActivityId){ count = activity[dayKey]?.baseActivityQuantities?.[baseActivityId] || 0}
    return acc + count;
  }, 0);

  const scrollViewRef = useRef(null);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  const noData = totalCount == 0;

  const goToActivity = () => {

      navigate(Routes.ViewActivity, {activity: activityDoc})
   }


  if(noData){return null}
  if(noData && all){return null}
  if(!currentUserHasPointsEver){return null}
if(totalCount == 0){return  <View paddingH-16 paddingV-8 marginH-16 style={{backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 4, marginTop: 8, borderRadius: 8}}><Text R12 secondaryContent>Not smashed ({activityDoc.text})</Text></View>}
   return ( 
  <View>
   {all && <SectionHeader title="Habits Last 7" top={16} style={{marginBottom: 0, paddingBottom: 8}} subtitle={<TouchableOpacity onPress={goToActivitiesListLast7}><Text R12 secondaryContent>See All Habits</Text></TouchableOpacity>} />}
    <View padding-16 marginH-16 style={{backgroundColor: '#fff', marginBottom: 4, marginTop: 8, borderRadius: 8}}>
        {showLabel && <View row spread centerV marginB-8><Text B18 >{activityDoc.text}</Text><TouchableOpacity onPress={goToActivity}><Text R14 secondaryContent>Activity Stats</Text></TouchableOpacity></View>}
        {customLabel && <View row><Text M18 >{customLabel}</Text></View>}
        {/* <ScrollView horizontal ref={scrollViewRef} 
         onContentSizeChange={() =>
               scrollViewRef.current.scrollToEnd({ animated: true })
            } 
            showsHorizontalScrollIndicator={false}> */}
      <View  row spread marginT-0 marginB-8 style={{ flexWrap: 'wrap' }}>
         {last7Keys.map((dayKey, index) => {
            const past = isDateInPast(dayKey);
            const dateNumber = index + 1;

            const day = activity?.[dayKey];

            let count = all ? activity?.[dayKey]?.qty || 0 : activity?.[dayKey]?.activityQuantities?.[activityId] || 0;
            
            if(baseActivityId){

               count = activity?.[dayKey]?.baseActivityQuantities?.[baseActivityId] || 0
            }
            const today = isToday(dayKey);
            const isFuture = !past && !today;
            // const gameWon = dayScore >= dailyTarget;


  const goToDailyDetail = (dayKey) => {

    // if(!isPremiumMember){
    //    showUpgradeModal(true)

    //    return 
    // }

    Vibrate();
    navigate(Routes.DailyDetail, { showHeader: true, dayKey });

 };

            return (
                <View centerV>
                    <Text
                    center
                           secondaryContent
                           style={{
                          color: 'rgba(0,0,0,0.5)',
                              textDecorationLine: today ? 'underline' : 'none',
                              fontSize: 12,
               
                           }}>
                           {stringLimit(getDayShort(dayKey), 3, false)}
                        </Text>
               <TouchableOpacity
                  marginR-2
                  marginL-2
                  marginT-8
                  marginB-0
                  key={dayKey}
                  onPress={() => goToDailyDetail(dayKey)}
                //   onPress={() =>
                //      isFuture
                //         ? null
                //         : navigate('SingleChallengeDay', {
                //              date: dayKey,
                //              dayKey,
                //              dayScore,
                //              dayTarget: dailyTarget,
                //              progress,
                //              gameWon,
                //              playerChallenge: item,
                //              currentUser,
                //           })
                //   }
                  style={{
                     borderRadius: 24,
                     alignContent: 'center', alignItems: 'center', justifyContent: 'center',
                     height: size, width: size,
                     backgroundColor: count > 0 ? meTodayRgb : 'rgba(0,0,0,0.1)',
                  }}>

                  
                  {/* <GradientCircularProgress
                     emptyColor={past ? rgba : '#eee'}
                     // style={{ position: 'absolute' }}
                     size={size}
                     startColor={item.colorStart}
                     middleColor={item.colorStart}
                     endColor={item.colorEnd}
                     progress={progress ? progress > 100 ? 100 : progress : gameWon ? 100 : 0}
                     rotation={0}
                     strokeWidth={4}
                     style={{ marginHorizontal: 2, paddingBottom: 4 }}
                     fillLineCap="round"
                     withSnail
                     tintColor={
                        progress > 0 // Means there is a target today and a score.
                           ? item.colorStart // If there is a target today and score then show endColor
                           : gameWon
                           ? Colors.green30 // Else if game is won and no progress that day, show Green,
                           : '#ccc'
                     }

                     backgroundColor={past ? rgba : '#eee'} /> */}


                  <Text
                           
                           B12
                           style={{
                              fontWeight: 'bold',
                              position: 'absolute',
                              textDecorationLine: today ? 'underline' : 'none',
                              fontSize: 12,
                              color: count > 0  ?  '#333' : 'rgba(0,0,0,0.5)' 
               
                           }}>
                           {getDayNum(dayKey)}
                        </Text>

                  {count > 0 && (
                     <View style={{ position: 'absolute', bottom: 18, borderRadius: 30, right: -7, height: 20, width: 20, backgroundColor: baseActivityId  ? Colors.smashPink : Colors.meToday, alignItems: 'center', justifyContent: 'center', }}>
                        <Text R10 white>{kFormatter(count)}</Text>
                        {/* <AntDesign name="check" color={'#fff'} size={8} /> */}
                     </View>
                     // <LottieAnimation
                     //    autoPlay
                     //    loop={false}
                     //    style={{
                     //       // width: 200,
                     //       height: 50,
                     //       zIndex: 99999,
                     //       top: 2,
                     //       right: -5,
                     //       position: 'absolute',
                     //    }}
                     //    source={require('../lotties/done-excited.json')}
                     // />
                  )}
                  {/* {count > 0 && (
                     <View style={{ position: 'absolute', top: 0, right: -2 }}>
                        <Text R12>{count}</Text>
                     </View>
                  )} */}
                  {today && (
                     <View
                        style={{
                           width: '100%',
                           justifyContent: 'center',
                           alignItems: 'center',
                           position: 'absolute',
                           bottom: -14,
                        }}>
                        <View
                           style={{
                              height: 5,
                              width: 5,
                              borderRadius: 14,
                              backgroundColor: Colors.meToday,
                              marginTop: 7,
                           }}
                        />
                     </View>
                  )}

               </TouchableOpacity>
               </View>
            );
         })}
      </View>
      {/* </ScrollView> */}
      </View>
  </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ChallengeDayTargets));
