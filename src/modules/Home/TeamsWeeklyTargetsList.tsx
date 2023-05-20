import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../components/SmartImage/SmartImage';
import Box from '../../components/Box';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated from 'react-native-reanimated';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import WeekTeamTargetListItem from './components/WeekTeamTargetListItem';
import TargetTypesScreens from './TargetTypesScreens';
import LottieAnimation from 'components/LottieAnimation';
import SectionHeader from 'components/SectionHeader';
import CreateATeamButton from './CreateATeamButton';
import TeamTargetSectionHeader from './TeamTargetSectionHeader';
import EnterTeamCodeButton from './EnterTeamCodeButton';

const TeamsTodayTargets = (props) => {
   const { navigate } = useNavigation();
   const { teamsStore, smashStore } = props;
   const { myTeamIds, numberOfTeams } = teamsStore;

   const { currentUser, teamsView } = smashStore;

   const goToCreateTeam = () => {
      navigate(Routes.CreateTeam);
   };
   const [loaded, setLoaded] = useState(true);
   const renderItem = React.useCallback(({ item, index }) => {
      return <WeekTeamTargetListItem key={item} teamId={item} index={index} />;
   }, []);

   // useEffect(() => {
   //    setTimeout(() => {
   //       setLoaded(true);
   //    }, 2000);

   //    return () => {};
   // }, []);

   const goToTeamLeaderboard = () => {
      navigate(Routes.TeamsLeaderboard);
   };

   console.log('team renders FULL LIST Weekly');
   const bulletSize = 10;
   // if (!loaded || teamsView != 'thisweek') {
   //    return null;
   // }
   console.log('check rerenders TeamsWeeklyTargetsList');
   return (
      <ScrollView>
      <View flex>
         {/* {currentUser.superUser && (
            <TouchableOpacity
               onPress={goToTeamLeaderboard}
               padding-24
               style={{ backgroundColor: 'transparent' }}>
               <Text B12 white style={{ textAlign: 'right', color: '#aaa' }}>
                  {'Teams Leaderboard '.toUpperCase()}
                  <AntDesign name="right" />
               </Text>
            </TouchableOpacity>
         )} */}

            {/* <TeamTargetSectionHeader /> */}

         {currentUser.superUser && false && (
            <ButtonLinear
               title={'Teams Leaderboard '.toUpperCase()}
               onPress={goToTeamLeaderboard}
               bordered
               color={'#aaa'}
               colors={[Colors.teamToday, Colors.teamToday]}
               style={{ marginTop: 16 }}
            />
         )}
         {numberOfTeams > 0 && loaded && false && (
            <SectionHeader
               title={'Team Targets'.toUpperCase()}
               style={{ marginTop: 0 }}
               // subtitle={

               // }
            />
         )}
         {numberOfTeams > 0 && false && (
            <View row paddingL-24>
               <View row centerV marginR-4>
                  <View
                     style={{
                        height: bulletSize,
                        width: bulletSize,
                        backgroundColor: Colors.meToday,
                        marginHorizontal: 4,
                     }}
                  />
                  <Text secondaryContent R12>
                     You Today
                  </Text>
               </View>
               <View row centerV marginR-4>
                  <View
                     style={{
                        height: bulletSize,
                        width: bulletSize,
                        backgroundColor: Colors.teamToday,
                        marginHorizontal: 4,
                     }}
                  />
                  <Text secondaryContent R12>
                     Team Today
                  </Text>
               </View>
               {true && (
                  <View row centerV>
                     <View
                        style={{
                           height: bulletSize,
                           width: bulletSize,
                           backgroundColor: Colors.buttonLink,
                           marginHorizontal: 4,
                        }}
                     />
                     <Text secondaryContent R12>
                        Team Week
                     </Text>
                  </View>
               )}
            </View>
         )}
         <View flex>
            <FlatList
               data={myTeamIds}
               scrollEnabled={false}
               renderItem={renderItem}
               keyExtractor={(item, index) => item}
               ListFooterComponent={
                  <>
                  <View style={{ height: 16 }} />
            <CreateATeamButton boxed />
            <EnterTeamCodeButton boxed top={0} />
            </>
               }
               contentContainerStyle={{
                  paddingTop: 8,
                  paddingBottom: 0,
                  // backgroundColor: '#333',
               }}
               // ListEmptyComponent={
               //    <View paddingH-32 paddingT-24>
               //       <Text secondaryContent>
               //          Partner up with a player you're following and is also
               //          following you to create a team.
               //       </Text>
               //    </View>
               // }
            />
         </View>
      </View>
      </ScrollView>
   );
};;;

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamsTodayTargets));
