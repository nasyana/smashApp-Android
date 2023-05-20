import React, { useCallback } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import TodayTeamTargetListItem from './components/TodayTeamTargetListItem';
import EnterTeamCodeButton from './EnterTeamCodeButton';
import CreateATeamButton from './CreateATeamButton';
;

const TeamsTodayTargetsList = (props) => {
   const { navigate } = useNavigation();
   const { teamsStore, smashStore, activity } = props;
   const { myTeams,teamsWithWeeklyActivity } = teamsStore;
   const { currentUserHasPointsEver, smashing } = smashStore;



   const renderItem = useCallback(({ item, index }) => {
      const teamId = item.id;
      return <TodayTeamTargetListItem key={teamId} tempTeam={item} teamId={teamId} index={index} />;
   }, [teamsWithWeeklyActivity.length]);

   const showWizard = () => { smashStore.dismissWizard = false; }

   // if (smashing) { return null }
   console.log('TeamsTodayTargetsList render')
   return (
      <View>
         {( !currentUserHasPointsEver) && <TouchableOpacity onPress={showWizard} row spread paddingH-24 paddingT-16><Text R14></Text><Text R14 secondaryContent>How do I get points?</Text></TouchableOpacity>}
         <FlatList
            data={teamsWithWeeklyActivity}
            scrollEnabled={true}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListFooterComponent={activity ? () => null : <View paddingT-24><CreateATeamButton boxed /><EnterTeamCodeButton boxed /></View>}
         />
      </View>

   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamsTodayTargetsList));
