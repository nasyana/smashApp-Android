import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import AnimatedView from '../../../components/AnimatedView';
import {
   View,
   Text,
   Colors,
   TouchableOpacity
} from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import { AntDesign } from '@expo/vector-icons';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import { width, height } from 'config/scaleAccordingToDevice';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import SectionHeader from 'components/SectionHeader';
import TeamScrollViewWeek from 'components/TeamScrollView/TeamScrollViewWeek';
import ConfettiLottie from './TodayTeamTargetListItemComponents/ConfettiLottie';
import WeekSmashed from './TodayTeamTargetListItemComponents/WeekSmashed';
import TeamUnreads from './TodayTeamTargetListItemComponents/TeamUnreads';

import Leaders from 'components/Leaders';
import TeamToday from '../../../modules/TeamArena/TeamToday';
import NumberOfVotesForTeam from 'components/NumberOfVotesForTeam';

function PlayerWantsToJoin(props) {
   return (
      <TouchableOpacity
         onPress={props.onPressApproveUsers}
         row
         style={{
            backgroundColor: Colors.smashPink,
            alignItems: 'center',
            justifyContent: 'center',
            // marginBottom: 24,
            width: width / 2,

            paddingVertical: 8,

            // width: 25,
            // height: 25,

            borderRadius: 25,
         }}>
         <AntDesign name="adduser" size={16} color={Colors.white} />
         <Text white B14>
            {props.team?.requested?.length}{' '}
            {props.team?.requested?.length == 1
               ? 'Player wants to join!'
               : 'Players want to join!'}
         </Text>
      </TouchableOpacity>
   );
}



const TeamListItem = ({ smashStore, teamId, index, teamsStore, team }) => {

   
   const {
      setHomeTabsIndex,
      setQuickViewTeam,
      currentUser,
   } = smashStore;


   // const team = myTeams?.[index] || {};
   const [weekDone, setWeekDone] = useState(false);
   const { navigate } = useNavigation();



   const goToTeamArenaPre = () => {
      Vibrate();
      setHomeTabsIndex(0);
      goToTeamArena(team);
   };
   const goToTeamArena = (team, initialIndex) => {
      navigate(Routes.TeamArena, { team, initialIndex: 0 || 0 });
   };


   const goToTeamChat = () => {
      navigate('Chat', {
         stream: { streamId: team.id, streamName: team.name },
         streamId: team.id,
         streamName: team.name,
      });
   };



   const onPressApproveUsers = (props) => {
      navigate(Routes.CreateTeam, { teamDoc: team, type: 'requestToJoin' });
   };

   const isUserAdmin = () => {
      // console.warn(currentUser.uid);

      return team?.admins ? team?.admins?.includes(currentUser.uid) : false;
   };

   // const thisWeekActivity = weeklyActivityHash?.[`${team.id}_${endOfCurrentWeekKey}`] || {};
   // console.log('weekDone', weekDone, team.name);
   return (
      <>

         <AnimatedView
            fade
            onPress={goToTeamArenaPre}
            style={{
               marginBottom: 0,
               flex: 1,
               marginTop: 0,
               // backgroundColor: '#fff',
               paddingBottom: 16,
               // borderBottomWidth: 10,
               borderTopWidth: index == 0 ? 0 : 10,
            }}>
            <ConfettiLottie team={team} />
            <>
               <SectionHeader
                  // line
                  // larger
                  title={`${team.name}` + ` (${parseInt(team?.teamWeekProgress || 0)}%)`}
                  subtitle={
                     <View row centerV>
                        <TeamUnreads relative
                           {...{ smashStore, teamsStore, team, goToTeamChat }}
                        />
                        <TouchableOpacity row centerV onPress={goToTeamArenaPre} style={{ borderWidth: 0, borderColor: '#333' }}>
                           <Text H12 buttonLink marginR-0 paddingB-0 marginB-0>
                              LEADERBOARD
                           </Text>
                           <AntDesign
                              name="right"
                              size={12}
                              color={Colors.buttonLink}
                           />
                        </TouchableOpacity>


                     </View>
                  }
                  onPress={goToTeamArenaPre}
                  style={{ marginTop: weekDone ? 0 : 24 }}
               />


               {team?.requested?.length > 0 && isUserAdmin() && (
                  <View padding-16 style={{ flexWrap: 'wrap' }}>
                     <PlayerWantsToJoin
                        team={team}
                        onPressApproveUsers={
                           onPressApproveUsers
                        }></PlayerWantsToJoin>
                  </View>
               )}

               <TeamScrollViewWeek
                  team={team}
                  home
                  onPressApproveUsers={onPressApproveUsers}
               />




               <View style={{ height: 24 }} />


                        
               {team?.scores && team?.score > 0 && true && <View><SectionHeader title="Team Day Targets" />
               <View style={{ paddingHorizontal: 16 }}><WeeklyDayTargets
                     {...{ team }}
                     color={Colors.blue10}
                  /></View>
                 </View>}
               {team?.scores && team?.score > 0 && false && <View style={{ paddingHorizontal: 16 }}>
                  <Leaders
                     leaders
                     {...{ team }}
                     color={Colors.blue10}
                  /></View>}


               {/* <TeamToday noScroll

                  team={team}
                  navigation={smashStore.navigation}
               /> */}
               <View
                  style={{
                     marginRight: 8,
                     marginTop: 0,
                     width: '100%',
                     paddingHorizontal: 16,
                     overflow: 'hidden',
                     top: 0,
                  }}>
                  <ConfettiLottie team={team} />

               </View>
               <WeekSmashed {...{ smashStore, teamsStore, team }} />
               <NumberOfVotesForTeam team={team} />

            </>
         </AnimatedView>
      </>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamListItem));
