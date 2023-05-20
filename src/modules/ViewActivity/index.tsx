import Header from 'components/Header';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/core';
import { SceneMap } from 'react-native-tab-view';
import { View, Colors, Text, TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { doc, onSnapshot } from 'firebase/firestore';
import MeToday from './MeToday';
import Leaders from './Leaders';
import TimelineFull from 'modules/PlayerStats/TimelineFull';
import Box from 'components/Box';
import SectionHeader from 'components/SectionHeader';
import ActivityChallenges from 'components/ActivityChallenges';
import LinearChartActivity from 'components/LinearChartActivity';
import ActivityHabitStacks from 'components/ActivityHabitStacks';
import firebaseInstance from 'config/Firebase';
import { AntDesign } from '@expo/vector-icons';
import RecordComponent from './Record';
import ActivityJournal from 'components/ActivityJournal';
import ActivityDays from 'components/ActivityDays';
import ActivityGoals from 'components/ActivityGoals';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';

const firestore = firebaseInstance.firestore;

const ViewActivity = (props: {
   routes?: any;
   route?: any;
   smashStore?: any;
   teamsStore?: any;
}) => {
   const { params }: any = useRoute();
 
   const focusUser = params?.focusUser || false;
   const activity = props?.route?.params?.activity;
   const renderScene = SceneMap({
      MeToday: MeToday,
      Leaders: Leaders,
   });
   const [record, setRecord] = useState<boolean | any>(false);
   const { smashStore, teamsStore } = props;

   const { levelColors, returnActionPointsValue, activityCategoryLabels } =
      smashStore;
const { navigate } = useNavigation();

   useEffect(() => {
      const { uid } = firebaseInstance.auth.currentUser;
      
      const unsub = onSnapshot(
        doc(firestore, 'records', uid),
        (snap) => {
          setRecord(snap.exists() ? snap.data() : false);
        },
        (error) => {
          console.error("Error fetching records: ", error);
        }
      );
    
      return () => {
        if (unsub) {
          unsub();
        }
      };
    }, []);

   // const activityRecord = record?.activities?.[activity.id] || false;

   const last7 = true;
   const color = levelColors[activity?.level];

   const goToCreateGoal = (activity) =>
   navigate(Routes.CreateGoal, {
      activity
   });
   return (
      <View flex>
         <Header
            title={
               focusUser?.name
                  ? focusUser?.name + 'Habit/Activity (Last 7 Days)'
                  : 'Habit/Activity (Last 7 Days)'
            }
            back
            noShadow
         />

         <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
         
            <View padding-24 paddingB-0 row spread>
               <Text text50 padding-24>
                  {activity.text}
               </Text>
            </View>
            <View paddingH-24 row centerV marginT-8>
               <View style={{backgroundColor: color, width: 7, height: 7, borderRadius: 14, marginRight: 4}}/>
            <Text R14 >
                  Value: <Text R14 >{returnActionPointsValue(activity)}pts</Text>
               </Text>
               </View>

               {activity.baseActivityId && <LinearChartActivity baseActivityId={activity.baseActivityId}  activityMasterId={activity.baseActivityId}  />}
               {activity.baseActivityId && <ActivityDays activityId={activity.id} baseActivityId={activity.baseActivityId || false} />}
               <SectionHeader
               title={`${activity.text}`}
               style={{ marginTop: 16 }}
            />
            
            <LinearChartActivity activityMasterId={activity.id} />

            <ActivityDays activityId={activity.id} />
            <SectionHeader title="Records" style={{ marginTop: 16 }} />
            <RecordComponent id={activity?.id} />
            {activity.description?.length > 0 &&  <SectionHeader title="Description" style={{ marginTop: 16 }} />}
            {activity.description?.length > 0 && <Box>
               <View style={{ padding: 16 }}>
                  <Text marginV-4 secondaryContent>
                     {activity.description || 'N/A'}
                  </Text>
               </View>
            </Box>}


            <SectionHeader title="Categories" style={{ marginTop: 16 }} />
            <Box>
               <View style={{ padding: 16 }}>
                  {activity.actionCategories.map((category) => (
                     <Text secondaryContent>
                        {activityCategoryLabels[category]}
                     </Text>
                  ))}
               </View>
            </Box>

            <SectionHeader title="In Challenges" style={{ marginTop: 16 }} />
            <Box>
               <View style={{ padding: 16 }}>
                  <ActivityChallenges activity={activity} />
               </View>
            </Box>

            <SectionHeader title="Goals" style={{ marginTop: 16 }}  
            
            // subtitle={<TouchableOpacity title="Create Goal" onPress={() => goToCreateGoal(activity)}><Text R12 secondaryContent>Set a Goal with this Activity</Text></TouchableOpacity>}
            />
            <Box>
               <View style={{ padding: 16 }}>
                  <ActivityGoals activity={activity} />
               </View>
            </Box>

            <SectionHeader title="In Habit Stacks" style={{ marginTop: 0 }} />
            <Box>
               <View style={{ padding: 16 }}>
                  <ActivityHabitStacks activity={activity} />
               </View>
            </Box>
            <SectionHeader title="Recent Smashes" style={{ marginTop: 16 }} />
               <TimelineFull activity={activity} activityId={activity.id} /> 
            {/* <ActivityJournal activityId={activity?.id} /> */}
            {/* 
            
            {benefits?.length > 0 && false && <SectionHeader title="Benefits" style={{ marginTop: 16 }} />}
            {benefits?.length > 0 &&  false && <Box>
               <View style={{ padding: 16 }}>
                  {benefits ? (
                     benefits.map((benefit) => (
                        <View centerV row>
                           <AntDesign
                              name={'checkcircleo'}
                              color={Colors.secondaryContent}
                              size={10}
                              style={{ marginRight: 4 }}
                           />
                           <Text marginV-4 centerV>
                              {' '}
                              {benefit}
                           </Text>
                        </View>
                     ))
                  ) : (
                     <Text secondaryContent marginV-4>
                        N/A
                     </Text>
                  )}
               </View>
            </Box>}
          */}

         </ScrollView>
 
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(ViewActivity));
