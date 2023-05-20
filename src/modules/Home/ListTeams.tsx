import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, RefreshControl, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../components/SmartImage/SmartImage';
import Box from '../../components/Box';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated from 'react-native-reanimated';

import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import TeamListItem from './components/TeamListItem';

import CreateATeamButton from './CreateATeamButton';
import EnterTeamCodeButton from './EnterTeamCodeButton';
import NumberOfActiveTeams from 'components/NumberOfActiveTeams';

const ListTeams = (props) => {
   const { navigate,addListener } = useNavigation();
   const { teamsStore, smashStore } = props;
   const { myTeams, numberOfTeams, teamsWithWeeklyActivity } = teamsStore;

   const [refreshing, setRefreshing] = useState(false);
   const renderItem = React.useCallback(({ item, index }) => {

      const teamId = item.id;
      // return <View style={{borderWidth: 3, marginBottom: 8}} />
      return <TeamListItem key={item.id} teamId={item.id} index={index} team={item} />;
   }, []);


   // run onRefresh in useEffect on screen focus
   useEffect(() => {
      const unsubscribe = addListener('focus', () => {
         onRefresh();
      });
      return unsubscribe;
   }, []);

   const goToTeamLeaderboard = () => {
      navigate(Routes.TeamsLeaderboard);
   };
   const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      // alert('as')
      teamsStore.getTeams().then(() => setRefreshing(false)).catch(() => setRefreshing(false));
    }, [teamsStore]);
   console.log('team renders FULL LIST');
   const bulletSize = 10;

   console.log('check rerenders ListTeams');
   console.log('teamsWithWeeklyActivity',teamsWithWeeklyActivity)
   return (
      <View flex>
      <View flex>

         {/* {currentUser.superUser && false && (
            <ButtonLinear
               title={'Teams Leaderboard '.toUpperCase()}
               onPress={goToTeamLeaderboard}
               bordered
               color={'#aaa'}
               colors={[Colors.teamToday, Colors.teamToday]}
               style={{ marginTop: 16 }}
            />
         )} */}
  
     
         <View flex>
            <FlatList
               data={teamsWithWeeklyActivity}
               scrollEnabled={true}
               renderItem={renderItem}
               keyExtractor={(item, index) => item.id}
               // refreshing={refreshing}
               // onRefresh={onRefresh}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                  />
               }
               // ListHeaderComponent={<NumberOfActiveTeams />}
               ListFooterComponent={
                  <>
                  <View style={{ height: 16 }} />
                  <EnterTeamCodeButton boxed top={0} />
                  <CreateATeamButton boxed />
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
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ListTeams));
