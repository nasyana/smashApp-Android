import { useEffect, useState } from 'react';
import {
   AntDesign
} from '@expo/vector-icons';
import {
   View, Text, TouchableOpacity
} from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import { kFormatter } from 'helpers/generalHelpers';
import ActivityChallenges from 'components/ActivityChallenges';
import { doc, onSnapshot } from 'firebase/firestore';
import ActivityTeams from 'components/ActivityTeams';
import firebaseInstance from 'config/Firebase';
;
const SingleActivity = (props) => {
   const { navigate } = useNavigation();
   const {
      item,
      index,
      like,
      selectedDayKey,
      smashStore,
      challengesStore,
      currentUser,
      community,
      onLongPress
   } = props;
   const { qty = 0 } = item;
   const user = item;
   const { uid } = user;

   const [day, setDay] = useState(false);

   const { todayDateKey, levelColors, returnActionPointsValue,currentUserId } = smashStore;
   const levelIndex = parseInt(item.level) || 0;
   const color = levelColors[levelIndex];
   useEffect(() => {
      const query = doc(firebaseInstance.firestore, 'dailyActivity', `${uid}_${todayDateKey}`);
    
      const unsubToUserDailyActivity = onSnapshot(query, (daySnap) => {
        if (daySnap.exists()) {
          const day = daySnap.data();
          setDay(day);
          smashStore.userDayDoc[day.uid] = day;
        }
      });
    
      return () => {
        if (unsubToUserDailyActivity) {
          unsubToUserDailyActivity();
        }
      };
    }, []);
    

   const onPressUser = () => {
      return null;
   };
   const [open, setOpen] = useState(false);

   const pressOpen = () => { setOpen(!open) }
   const goToUserDayView = () => {
      // navigate(Routes.UserDayView, {
      //    user,
      //    dayDocId: `${uid}_${todayDateKey}`,
      //    _day: day,
      // });
      navigate(Routes.DailyDetail, {
         focusUser: user,
         dayDocId: `${uid}_${todayDateKey}`,
         _day: day,
      });
   };



   const activity = item;


   const goToSingleActivityView = () => {
      navigate(Routes.ViewActivity, { activity });
   };

   if(!activity){return null}

   return (

      <TouchableOpacity onPress={pressOpen} onLongPress={(currentUser.superUser || currentUser.activityManager) ? () => smashStore.editingActivity = activity : () => null}>

         <View style={{
               borderRadius: 6,
               marginHorizontal: 16,
               backgroundColor: '#FFF',
               paddingBottom: 12,
               overflow: 'hidden',
               marginBottom: 8,
         }}>
            <View
               row


         >


            <View paddingL-16 flex row spread>
               <View paddingT-4 style={{ maxWidth: '80%' }}>
                  <View row spread marginB-4 centerV flex>
                     <Text H14 color28 marginT-16 onPress={goToSingleActivityView} marginR-8>
                        {activity?.text || 'anon'} {' '}
                        {/* <Text M14 meToday marginL-16 marginT-16>
                        {(user?.dailyScores?.[todayDateKey] > 0 &&
                           user?.dailyScores?.[todayDateKey]) ||
                           0}
                     </Text> */}
                     </Text>

                  </View>
                  <Text secondaryContent R14>{activity.description}</Text>
                  <View style={{ marginVertical: 8 }}>
                     {/* <SectionHeader title={'In Challenges'} /> */}
                     <ActivityChallenges activity={activity} small />
                        {open && <View style={{ height: 2, backgroundColor: '#eee', marginVertical: 16 }} />}
                        {open && <ActivityTeams activity={activity} small />}
                  </View>
               </View>
               <View padding-16>
                  <Text B24 style={{ color: color }}>{kFormatter(returnActionPointsValue(activity))}</Text>
               </View>
            </View>

         </View>
            {open && <TouchableOpacity flex onPress={goToSingleActivityView} paddingH-8 centerV><Text centerV B14 style={{ textAlign: 'right' }}>Go to Activity<AntDesign name="right" size={14} /></Text></TouchableOpacity>}
         </View>
      </TouchableOpacity >
   );
};
export default SingleActivity;
