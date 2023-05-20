import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
import ItemFoodDetail from 'components/ItemFoodDetail';
import PieChart from 'components/PieChart';
import Firebase from 'config/Firebase';
import { FONTS } from 'config/FoundationConfig';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, Colors, Button } from 'react-native-ui-lib';
import ActivitiesPieChartToday from '../../components/ActivitiesPieChartToday';
import TimelineToday from '../PlayerStats/TimelineToday';
import { Dimensions } from 'react-native';
import ChallengesBreakdownList from './components/ChallengesBreakdownList';
import { inject, observer } from 'mobx-react';
import Shimmer from 'components/Shimmer';
import TeamsTodayTargets from 'modules/Home/TeamsTodayTargets';
import SectionHeader from 'components/SectionHeader';
const { width, height } = Dimensions.get('window');

const MeToday = (props) => {
   const { date, smashStore, focusUser = false, team } = props;
   const { dayKeyToHuman, todayDateKey, currentUser } = smashStore;
   const activity = props.route?.params?.activity || false;
   const humanDate = dayKeyToHuman(date);
   const [day, setDay] = useState();
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 300);
      return () => {};
   }, []);

   useEffect(() => {
      const unsubDailyDoc = Firebase.firestore
         .collection('dailyActivity')
         .doc(`${Firebase.auth.currentUser.uid}_${date}`)
         .onSnapshot((snap) => {
            if (snap.exists) {
               setDay(snap.data());
            }
         });
      return () => unsubDailyDoc;
   }, []);

   return (
      <View flex backgroundColor={Colors.background}>
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
            <ScrollView>
               <SectionHeader title="Me Today" />
               <View height={16} />
               {team && <TeamsTodayTargets day={day} />}
               {/* <TodayPoints hideDetails />
                <View height={16} /> */}
               <View paddingH-16>
                  <Box>
                     <SectionHeader
                        title="Challenges"
                        style={{ marginTop: 16 }}
                     />
                     <View height={1} backgroundColor={Colors.line} />
                     <ChallengesBreakdownList
                        today
                        activity={activity}
                        date={date || todayDateKey}
                        humanDate={humanDate}
                        focusUser={focusUser || currentUser}
                     />
                  </Box>
               </View>
               {true && (
                  <View paddingH-16>
                     <Box>
                        <View
                           row
                           paddingH-16
                           paddingT-13
                           paddingB-11
                           centerV
                           style={{
                              justifyContent: 'space-between',
                           }}>
                           <Text H14 color28>
                              Breakdown
                           </Text>
                           {/* <Button
                            label={humanDate}
                            link
                            color={Colors.buttonLink}
                        /> */}
                        </View>
                        <View height={1} backgroundColor={Colors.line} />

                        {/* <ActivitiesPieChartToday
                           date={date || todayDateKey}
                           focusUser={focusUser || currentUser}
                        /> */}
                     </Box>
                  </View>
               )}

               {/* <Leaders /> */}

               {loaded && (
                  <TimelineToday
                     date={date || todayDateKey}
                     focusUser={focusUser || currentUser}
                     showTeamData
                  />
               )}
            </ScrollView>
         )}
      </View>
   );
};

export default inject('smashStore')(observer(MeToday));
