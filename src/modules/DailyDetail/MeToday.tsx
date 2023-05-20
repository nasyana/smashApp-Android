import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import ItemFoodDetail from "components/ItemFoodDetail";
import PieChart from "components/PieChart";
import firebaseInstance from "config/Firebase";
const firestore = firebaseInstance.firestore;
import { FONTS } from "config/FoundationConfig";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View, Colors, TouchableOpacity } from "react-native-ui-lib";
import ActivitiesPieChartToday from "../../components/ActivitiesPieChartToday"
import TimelineToday from "../PlayerStats/TimelineToday";
import { Dimensions } from "react-native"
import ChallengesBreakdownList from "./components/ChallengesBreakdownList";
import { inject, observer } from 'mobx-react';
import Shimmer from "components/Shimmer";
import TeamsTodayTargets from 'modules/Home/TeamsTodayTargets';
import SectionHeader from 'components/SectionHeader';
import TodaySmashes from "modules/Home/components/TodaySmashes";
import ActivityJournal from "components/ActivityJournal";
import AnimatedView from 'components/AnimatedView'
import { dayStatusTextFromPoints } from "helpers/generalHelpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import { doc, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const MeToday = (props) => {
   const { date, smashStore, focusUser = false, team, uid} = props;
   const { dayKeyToHuman, todayDateKey, currentUser } = smashStore;

   // const humanDate = dayKeyToHuman(date);
   const [day, setDay] = useState(false);
   // const [loaded, setLoaded] = useState(false);
   
   // useEffect(() => {
   //    setTimeout(() => {
   //       setLoaded(true);
   //    }, 300);
   //    return () => {};
   // }, []);

   useEffect(() => {
      const unsubDailyDoc = onSnapshot(doc(firestore, 'users', uid, 'days', date), (snap) => {
        if (snap.exists()) {
          setDay(snap.data());
        }
      });
      return unsubDailyDoc;
    }, [date]);

   return (
      <View >
      
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32, paddingTop: 0 }}>
                  
                  {/* {currentUserMoodToday && <SectionHeader title={currentUserMoodToday} />} */}
                  {/* <SectionHeader title={day.score ? dayStatusTextFromPoints(day.score) + ' DAY ' + mood : moment(date, 'DDMMYYYY').format('Do MMM YYYY')} 
                  subtitle={<TouchableOpacity row style={{padding: 16}} onPress={()=> smashStore.setCommentPost({...day, journal: true})}><MaterialCommunityIcons name="book-open-page-variant" size={18} color={'#aaa'}/><Text M12 secondaryContent marginL-4>{day.journalCount}</Text></TouchableOpacity>}
                  /> */}
               
               {/* <View height={16} /> */}
               {/* {team && <TeamsTodayTargets day={date} />} */}
               {/* <TodayPoints hideDetails />
                <View height={16} /> */}
            
            {/* <ActivitiesPieChartToday
                           date={date || todayDateKey}
                           focusUser={focusUser || currentUser}
                        /> */}

{/* <ChallengesBreakdownList
                        today
                        date={date || todayDateKey}
                        humanDate={humanDate}
                        focusUser={focusUser || currentUser}
                     /> */}
                  <TodaySmashes day={day} uid={uid} horizontal dayKey={date} day={day} />
                  
             
           
                 {/* <ActivityJournal dayKey={date} /> */}
            </ScrollView>
         )}
      </View>
   );
};

export default inject("smashStore")(observer(MeToday));
