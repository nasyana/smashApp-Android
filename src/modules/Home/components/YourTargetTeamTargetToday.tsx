import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-ui-lib';
import { uid, unixToFromNow } from 'helpers/generalHelpers';

import { useNavigation } from '@react-navigation/core';
import { collection, query, where, orderBy, limit, onSnapshot, doc } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { getTeamWeeklyData } from 'helpers/teamDataHelpers';
 const YourTargetTeamTargetToday = ({teamsStore, smashStore, team}) => {

    const navigation = useNavigation();

    const {endOfCurrentWeekKey, currentTeam} = teamsStore;
    const {todayDateKey,numberWithCommas, kFormatter,setQuickViewTeam} = smashStore;

 

   //  const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};
const [weeklyActivity, setWeeklyActivity] = useState(team);


    useEffect(() => {
     
      
      const weeklyTeamKey = `${team.id}_${endOfCurrentWeekKey}`;

      const unsubscribeWeekly = onSnapshot(
         doc(collection(firestore, 'weeklyActivity'), weeklyTeamKey),
         (snap) => {
           let weeklyActivityData;
           if (snap.exists()) {
             const weeklyActivityDoc = snap.data();
             weeklyActivityData = getTeamWeeklyData(weeklyActivityDoc, team);
           }
           setWeeklyActivity(getTeamWeeklyData(weeklyActivityData, team));
         }
       );

    
    
      return () => {
        if(unsubscribeWeekly){unsubscribeWeekly()}
      }
    }, [])
    


    const goToMeToday = () => {
        Vibrate();
        smashStore.navigation = navigation;
        setQuickViewTeam({ ...team, meToday: true });
        // setHomeTabsIndex(2);
        // goToTeamArena(team);
     };
    
     const goToTeamToday = () => {
        Vibrate();
        // setHomeTabsIndex(3);
        // goToTeamArena(team);
        smashStore.navigation = navigation;
        setQuickViewTeam({ ...team, teamToday: true });
     };

     console.log('teamteam',team.myScoreToday)
     if(team?.score >= team?.target){return null}

   //   console.log('teamTodayProgress',currentTeam)
   return (
      <View>
          {/* <SectionHeader title={`Today's Targets`.toUpperCase()} style={{ marginTop: 8 }} /> */}
     
    <View flex row spread>
     
    <Box
       style={{
          flex: 1,
          margin: 0,
          padding: 16,
          marginRight: 0,
          marginLeft: 16,
       }}>
       <TouchableOpacity onPress={goToMeToday}>
          <Text R14>
         Your Score: {''}
             <Text meToday B14>{kFormatter( 
              team?.myScoreToday || 0,
              //  weeklyActivity?.daily?.[todayDateKey]?.players?.[uid()]
               //     ?.score || 0,
             )}</Text>
             {/* Your Target{' '}
             {(weeklyActivity?.myTodayProgress > 0 &&
                weeklyActivity?.myTodayProgress < 300 &&
                weeklyActivity?.myTodayProgress + '%') ||
                ''}
             {weeklyActivity?.myTodayProgres} */}
          </Text>
          <Text B28 meToday marginT-8 >
          {weeklyActivity?.myTodayProgress > 0 ?
                weeklyActivity?.myTodayProgress : 0 ||
                0}%
            
          </Text>
          <ProgressBar
             progress={
               weeklyActivity?.myTodayProgress > 100
                   ? 100
                   : weeklyActivity?.myTodayProgress
             }
             style={{
                height: 4,
                backgroundColor: '#eee',
                shadowColor: '#fff',
                marginBottom: 7,
             }}
             progressColor={Colors.meToday}
          />
          <Text secondaryContent M12>
           
           
             {weeklyActivity?.score == 0 ? 'Not Started' : weeklyActivity?.myTargetToday > 0
                ? 'Target: ' +
                  kFormatter(weeklyActivity?.myTargetToday || 0)
                : 'Weekly Target Smashed!'}
          </Text>
       </TouchableOpacity>
    </Box>
    {/* <Box
          style={{
             flex: 1,
             padding: 16,
             marginRight: 0,
             marginLeft: 16,
          }}>
          <TouchableOpacity onPress={goToTeamLeaderboard}>
             <Text>Leaders</Text>
             <LeaderboardPreview team={team} />
          </TouchableOpacity>
       </Box> */}

    <Box
       style={{
          flex: 1,
          margin: 0,
          padding: 16,
          marginRight: 16,
          marginLeft: 8,
       }}>
       <TouchableOpacity onPress={goToTeamToday}>
          <Text R14>
             Team Score:{' '}
             <Text teamToday B14>{kFormatter(
                weeklyActivity.teamTodayScore || 0,
             )}{' '}</Text>
             {/* {parseInt(weeklyActivity?.teamTodayProgress) > 0
                ? ' ' + parseInt(weeklyActivity?.teamTodayProgress) <
                  300
                   ? parseInt(weeklyActivity?.teamTodayProgress) + '%'
                   : ''
                : null} */}
          </Text>
          <Text B28 teamColor marginT-8>
            {parseInt(weeklyActivity?.teamTodayProgress) + '%'}
             {/* {kFormatter(
                weeklyActivity?.daily?.[todayDateKey]?.score || 0,
             )}{' '} */}
          </Text>
          {/* <Text>{JSON.stringify(weeklyActivity.teamTodayProgress)}</Text> */}
          <ProgressBar
             progress={
               weeklyActivity?.teamTodayProgress > 100
                   ? 100
                   : weeklyActivity?.teamTodayProgress
             }
             style={{
                height: 4,
                backgroundColor: '#eee',
                shadowColor: '#fff',
                marginBottom: 7,
             }}
             progressColor={Colors.teamColor}
          />
          <Text secondaryContent M12>
             {/* <Feather
                   name={'target'}
                   size={14}
                   color={Colors.color6D}
                /> */}

             {weeklyActivity?.score == 0 ? 'Not Started' : weeklyActivity?.teamTodayTarget > 0
                ? 'Target: ' +
                  kFormatter(weeklyActivity?.teamTodayTarget || 0)
                : 'Weekly Target Smashed!'}
          </Text>
          {/* <Text secondaryContent>
                Target 
             </Text> */}
       </TouchableOpacity>
    </Box>


    {false && (
       <Box
          style={{
             flex: 1,
             padding: 16,
             marginRight: 16,
             marginLeft: 8,
          }}>
          <TouchableOpacity onPress={goToTeamWeek}>
             <Text R14>Week Target</Text>
             <Text B28 buttonLink marginT-8>
                {kFormatter(team?.thisWeekTarget || 0)}
             </Text>
             <ProgressBar
                progress={weeklyActivity?.teamWeekProgress}
                style={{
                   height: 4,
                   backgroundColor: '#FAFAFA',
                   shadowColor: '#fff',
                   marginBottom: 7,
                }}
                progressColor={Colors.buttonLink}
             />
             <Text secondaryContent M12>
                {kFormatter(weeklyActivity?.score || 0)}(
                {weeklyActivity?.teamWeekProgress}%)
             </Text>
          </TouchableOpacity>
       </Box>
    )}

 </View>
 </View>
   )
 }
 
 export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(YourTargetTeamTargetToday));