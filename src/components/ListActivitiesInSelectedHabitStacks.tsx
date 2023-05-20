import { View, Text } from 'react-native-ui-lib';
import React from 'react';
import {StyleSheet} from 'react-native';
import { inject, observer } from 'mobx-react';
import SmashItemInHabitStack from 'components/SmashItemInHabitStack';
import Box from 'components/Box';
import SectionHeader from './SectionHeader';





const LEVEL_COLORS = {
   Quick: '#2FA2DE',
   Easy: '#3366E6',
   Medium: '#643895',
   Hard: '#C90035',
   Crazy: '#93063E',
 };
 
 const LevelDisplay = () => {
   return (
     <View style={[styles.container, {flexWrap: 'wrap', marginTop: 16, marginBottom: 16}]}>
       {Object.entries(LEVEL_COLORS).map(([label, color]) => (
         <View row centerV>
         <View key={label} style={[{ backgroundColor: color, width: 7, height: 7, marginLeft: 8, borderRadius: 4 }]} />
           <Text marginL-4 R12 >{label.toUpperCase()}</Text>
         </View>
       ))}
     </View>
   );
 };
 



const ListActivitiesInSelectedHabitStacks = (props) => {
   const { teamsStore, smashStore,addRemoveActivity } = props;
   const { currentTeam } = teamsStore;
   const { habitStacksHash, libraryActivitiesHash } = smashStore;
   const smashes = [];

   const habitStacks =
      currentTeam?.habitStackIds?.map((sid) => habitStacksHash?.[sid]) || [];

      if (habitStacks.length == 0) {
         return null;
      }
      const {hideMasterIds = []} = currentTeam;
      
   return (
      <View style={{ marginTop: 8, marginBottom: 24 }}>

         <LevelDisplay />
         {habitStacks.map((stack) => {
            const actions = stack?.masterIds
               ? stack.masterIds.map((id) => libraryActivitiesHash?.[id])
               : [];
            return (
               <View>
                  <SectionHeader
                     title={stack.name}
                     style={{ marginLeft: 0, marginTop: 16 }}
                  />
                  <View row style={{ flexWrap: 'wrap' }} marginT-0>
                     {actions?.length > 0 &&
                        actions?.map((item) => {

                           const isHidden = hideMasterIds.includes(item.id);


                           return (<SmashItemInHabitStack
                              key={item.id}
                              activity={item}
                              isHidden={isHidden}
                              addRemoveActivity={addRemoveActivity}
                           />)
         })}
                     {actions.length == 0 && (
                        <Text secondaryContent>No smashes yet today</Text>
                     )}
                  </View>
               </View>
            );
         })}
      </View>
   );
};

 const styles = StyleSheet.create({
   container: {
     flexDirection: 'row',
   //   justifyContent: 'space-between',
   },
   item: {
     padding: 10,
     borderRadius: 5,
     margin: 10,
     width: 80,
     alignItems: 'center',
   },
   label: {
     color: 'white',
     fontWeight: 'bold',
   },
 });

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ListActivitiesInSelectedHabitStacks));
