import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
import ItemFoodDetail from 'components/ItemFoodDetail';
import PieChart from 'components/PieChart';
import firebaseInstance from 'config/Firebase';
import { FONTS } from 'config/FoundationConfig';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, Colors, Button } from 'react-native-ui-lib';
import ActivitiesPieChartToday from '../../components/ActivitiesPieChartToday';
import TimelineTodayInTeam from '../PlayerStats/TimelineTodayInTeam';
import { Dimensions, TouchableOpacity } from 'react-native';
import ChallengesBreakdownList from './components/ChallengesBreakdownList';
import { inject, observer } from 'mobx-react';
import Shimmer from 'components/Shimmer';
import TeamsTodayTargets from 'modules/Home/TeamsTodayTargets';
import MyTodayTeamTarget from 'modules/Home/components/MyTodayTeamTarget';
import SmashedToday from './SmashedToday';
import { collection, doc, onSnapshot } from "firebase/firestore";
const { width, height } = Dimensions.get('window');

const MeToday = (props) => {
   const {
      date,
      smashStore,
      focusUser = false,
      team,
      day: _day,
      teamsStore,
   } = props;
   const { dayKeyToHuman, todayDateKey, currentUser } = smashStore;

   const humanDate = dayKeyToHuman(date);
   const [day, setDay] = useState(_day);
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 300);
      return () => {};
   }, []);

   useEffect(() => {
      const unsubDailyDoc = onSnapshot(doc(collection(firebaseInstance.firestore, "dailyActivity"), `${firebaseInstance.auth.currentUser.uid}_${todayDateKey}`), (snap) => {
        if (snap.exists()) {
          setDay(snap.data());
        }
      });
      return () => unsubDailyDoc();
    }, []);

   return (
      <View flex>
         {/* {!loaded && (
             <Shimmer
                style={{
                   width: width - 32,
                   height: 300,
                   marginHorizontal: 16,
                   marginTop: 16,
                   borderRadius: 10,
                }}
             />
          )} */}

         {true && (
            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
               <View height={16} />

               {team && (
                  <MyTodayTeamTarget
                     day={day}
                     SPACING={16}
                     justToday
                     team={team}
                     smashStore={smashStore}
                     teamsStore={teamsStore}
                  />
               )}

               {/* <TodayPoints hideDetails />
                <View height={16} /> */}
               {/* <Box>
                  <ChallengesBreakdownList
                     today
                     date={date || todayDateKey}
                     humanDate={humanDate}
                     focusUser={focusUser || currentUser}
                  />
               </Box> */}

               {loaded && (
                  <Box>
                     <TimelineTodayInTeam
                        date={date || todayDateKey}
                        focusUser={focusUser || currentUser}
                     />
                  </Box>
               )}
               {/* <SmashedToday day={day} /> */}
            </ScrollView>
         )}
      </View>
   );
};

export default inject('smashStore', 'teamsStore')(observer(MeToday));
