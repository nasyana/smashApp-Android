import Box from "components/Box";

import Firebase from 'config/Firebase';
import { FONTS } from 'config/FoundationConfig';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, Colors, Button, TouchableOpacity } from 'react-native-ui-lib';

import BarChart from '../../components/BarChart';
import UserLast7 from '../../components/BarChart/UserLast7';
import { inject, observer } from 'mobx-react';
import SectionHeader from 'components/SectionHeader'

import Shimmer from 'components/Shimmer';
import { Vibrate } from "helpers/HapticsHelpers";
import { useNavigation } from "@react-navigation/native";
import Routes from "config/Routes";
import { ActivityIndicator } from "react-native";
const Insights = (props) => {
   const { smashStore, user = false } = props;


   const { navigate } = useNavigation();
   const { currentUserHasPointsEver,hasActivity = false, getLast7ForUser } = smashStore;

   const [loaded, setLoaded] = useState(false);


   const [last7Days, setLast7Days] = useState([]);
   

   useEffect(() => {

      if(!user){  
         setLoaded(true);
          return
         }
    const getLast7 = async () => {

      const last7Days = await getLast7ForUser(user.uid);

      setLast7Days(last7Days);
      setLoaded(true)
      }
      getLast7();

      
     return () => {
       
     }
   }, [user.uid])


   const goToActivitiesListLast7 = () => {
      navigate(Routes.ActivitiesListLast7);
      //navigate to ActivitiesListLast7
   }

   const goToDailyDetail = (dayKey, uid = false) => {


      Vibrate();
      navigate(Routes.DailyDetail, { showHeader: true, dayKey, uid });

   };

   useEffect(() => {
      smashStore.getDailyActivity();
   
     return () => {
       
     }
   }, [])
   

console.log('render insights');

   if (!loaded) {
      return (
         <View flex center style={{height: 180}}>
         {/* <View height={16} /> */}
         <SectionHeader title="Last 7 Days" style={{ marginTop: 16 }}/>

         <ActivityIndicator />
         {/* <Shimmer
            style={{
               height: 180,
               marginHorizontal: 16,
               borderRadius: 7,
               marginVertical: 16,
            }}
         /> */}
         </View>
      );
   }
   if(!currentUserHasPointsEver || !hasActivity){return null}
   console.log('insights render')
   return (
      <View flex>
         {/* <View height={16} /> */}
         <SectionHeader title="Last 7 Days" style={{ marginTop: 0 }} subtitle={<TouchableOpacity onPress={goToActivitiesListLast7}><Text R12 secondaryContent>See All Habits</Text></TouchableOpacity>}/>
         <Box>
            {user ? <UserLast7 user={user} last7Days={last7Days} goToDailyDetail={goToDailyDetail} height={170} showVerticalAxis={false} /> : <BarChart goToDailyDetail={goToDailyDetail} height={170} showVerticalAxis={false} />}
         </Box>
      </View>
   );
};
export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(Insights));
