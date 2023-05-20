import { FlatList, ScrollView,StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View, Colors, TouchableOpacity } from 'react-native-ui-lib';
import Box from 'components/Box';
import firebaseInstance from 'config/Firebase';
import { collection, doc, onSnapshot } from "firebase/firestore";
import SmashItemLog from 'components/SmashItemLog';
import { inject, observer } from 'mobx-react';
import { moment, stringLimit } from 'helpers/generalHelpers';;
import SectionHeader from 'components/SectionHeader';
import SectionDiv from 'components/SectionDiv';
import LinearChart from 'components/LinearChart';

import { dayKeyToHuman } from 'helpers/dateHelpers';
import { useNavigation, useRoute } from '@react-navigation/core';
import Routes from 'config/Routes';
import { SingleActivity } from '../../../components/Challenge/Activities';
import {width} from 'helpers/DimensionHelpers'
export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
const DOT_SIZE = 4
const TodaySmashes = ({ smashStore, horizontal = false, dayKey = false, day = false, top = 16, team = false }) => {


   const firestore = firebaseInstance?.firestore;
   const { uid } = firebaseInstance.auth.currentUser;
   const { todayDateKey, currentUser, currentUserHasPointsEver, libraryActivitiesHash,getCurrentUserMood, getLevelColor,stringLimit,navigation } = smashStore;

   const mood = getCurrentUserMood(todayDateKey) || false;
   // const [dailyActivity, setDailyActivity] = useState(todayActivity);
   const [smashes, setSmashes] = useState( day ? day.smashes : !dayKey ? smashStore.todayActivity?.smashes || [] : []);

   useEffect(() => {
      if (!dayKey) {
         setSmashes(smashStore.todayActivity?.smashes || []);
      }
   }, [dayKey, smashStore.todayActivity?.smashes]);

   
   const {navigate} = navigation ? navigation : useNavigation();

   const goToActivitiesListLast7 = () => {
      navigate(Routes.ActivitiesListLast7);
      //navigate to ActivitiesListLast7
   }
   useEffect(() => {

    if(day){return}
      const unsubscribe = onSnapshot(
        doc(
          collection(
            doc(collection(firestore, "users"), uid),
            "days"
          ),
          dayKey || todayDateKey
        ),
        (snap) => {
          if (!snap.exists()) {
            // Handle if document does not exist
          } else {
            const userDailyDoc = snap.data();
    
            if (smashes?.length !== userDailyDoc.smashes.length) {
              setSmashes(userDailyDoc.smashes);
            }
          }
        }
      );
      return () => unsubscribe();
    }, [dayKey]);


   const isToday = !dayKey || dayKey == todayDateKey;

   const headerDate = isToday ? 'Activity Today' : 'Activity ' + dayKeyToHuman(dayKey || todayDateKey);

   const timestamps = smashes.map((item) => item.timestamp);
   const minTimestamp = Math.min(...timestamps);
   const maxTimestamp = Math.max(...timestamps);
 
   // Calculate the total time range in minutes
   const totalTime = (maxTimestamp - minTimestamp) / 60;

   const mergedActivities = Object.values(smashes.reduce((acc, activity) => {
      const { activityMasterId, points, multiplier } = activity;
      if (!acc[activityMasterId]) {
        acc[activityMasterId] = {
          ...activity,
          id: `${activityMasterId}_${Date.now()}`,
        };
      } else {
        acc[activityMasterId].points += points;
        acc[activityMasterId].multiplier += multiplier;
      }
      return acc;
    }, {}));



// Calculate the height of each stacked item
const ITEM_HEIGHT = 24;
const ITEM_MARGIN = 4;
const ITEM_PADDING = 8;
const STACKED_ITEM_HEIGHT = ITEM_HEIGHT + ITEM_MARGIN + ITEM_PADDING;

// Calculate the total number of stacked smashes
let totalStacked = 0;
for (let i = 0; i < smashes.length; i++) {
  const timestamp = smashes[i].timestamp;
  let count = 1;
  for (let j = i + 1; j < smashes.length; j++) {
    const nextTimestamp = smashes[j].timestamp;
    if (nextTimestamp - timestamp <= 3600) {
      count++;
    } else {
      break;
    }
  }
  totalStacked += count;
}


if(currentUser.name && !currentUser.allPointsEver){return null}
   return (
      <>
         <View paddingB-16 style={{paddingTop: top ? top: 0 }}>
            <SectionHeader title={`${headerDate}`} style={{ marginTop: top }} />
  
            <Box>
               <View paddingT-48={smashes?.length > 0} paddingT-16={smashes.length == 0}>
              


                  <LinearChart

                     animate={{
                        onExit: {
                           duration: 200
                        }
                     }}
                     type={EnumTypeChart.week}
                     height={200}
                     // chartColor={color}
                     isToday={isToday}
                     smashes={smashes || []}
                     // legacySmashes={legacySmashes}
                     // isLegacy={isLegacy}
                     smashStore={smashStore}

                  />

{/*                   
<View row style={{ width: width - 114, left: 24, position: 'absolute', top: 48}}>
{smashes.map((item, index) => {
    // Calculate the left offset of each dot based on the timestamp
    const timestamp = item.timestamp;
    const timeFromStart = (timestamp - minTimestamp) / 60;
    const leftOffset = (timeFromStart / totalTime) * 100;

    // Check how many timestamps are within an hour of this timestamp
    let count = 1;
    for (let i = index + 1; i < smashes.length; i++) {
      const nextTimestamp = smashes[i].timestamp;
      if (nextTimestamp - timestamp <= 3600) {
        count++;
      } else {
        break;
      }
    }

    // Adjust the vertical position of the activity name based on the count
    let topOffset = -(8 + (count - 1) * 12);

    return (
      <TouchableOpacity onPress={()=>goToPost(item.id)} row centerV style={{backgroundColor: '#fff', left: `${leftOffset}%`, top: topOffset, position: 'absolute'}}>
       
        <View>
         <View row centerV>
         <View
          key={item.id}
          style={[styles.dot, {  backgroundColor: getLevelColor(item.points) }]}
        />
        <Text R10 marginL-4>{stringLimit(item.activityName, 10, false)} <Text R10 marginL-4>{moment(item.timestamp, 'X').format('hh:mm')}</Text></Text>
        </View>
        </View>
      </TouchableOpacity>
    );
  })}
</View> */}
                  <View  marginT-8 marginH-16 marginB-16 >
               {mergedActivities
                  && mergedActivities.map((s,i) => {
                        const activity = libraryActivitiesHash?.[s.activityMasterId] || {};
                       return <SingleActivity  day={day} key={s.activityMasterId} activity={activity} smashStore={smashStore} showAllPointsEarned={true} points={s.points || 0}/>;
                    })
                  }
            </View>
            
            </View></Box>

            {/* <SectionHeader title="Challenges Breakdown" style={{ marginTop: 16 }} />

            <ChallengesBreakdownList today date={todayDateKey} focusUser={currentUser} />
            <TeamsBreakdownList /> */}
            {/* <PlayerToday focusUser={uid} top={0} /> */}
            {/* <ScrollView contentContainerStyle={{ paddingLeft: 16 }} showsHorizontalScrollIndicator={false} horizontal={horizontal} row style={{ flexWrap: 'wrap' }} marginT-16>
            {smashes &&
               smashes.map((item) => (
                  <SmashItemLog key={item.id} activity={item} />
               ))}
            {smashes.length == 0 && (
               <Text secondaryContent>No smashes yet today</Text>
            )}
            </ScrollView> */}
         {/* </Box> */}
      </View>
         {/* <SectionDiv /> */}
      </>
   );
};

const styles = StyleSheet.create({
   row: {
     flexDirection: 'row',
     height: DOT_SIZE,
     alignItems: 'center',
     paddingRight: 32
   },
   dot: {
     width: DOT_SIZE,
     height: DOT_SIZE,
     borderRadius: DOT_SIZE / 2,
     backgroundColor: 'black',
     
   },
 });

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodaySmashes));
