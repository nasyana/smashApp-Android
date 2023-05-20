import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import TeamListItem from './TeamListItem';
import CustomButtonLinear from '../../components/CustomButtonLinear';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import { ITeamDoc } from 'modules/CreateTeam';
import { inject, observer } from 'mobx-react';
export interface ITeamListItem {
   name: string;
   motto: string;
   picture: any;
}

const testData = [
   { name: 'Smashers 007', motto: 'smash everything' },
   { name: 'Avengers', motto: 'save the world' },
   { name: 'Smashers 007', motto: 'smash everything' },
   { name: 'Avengers', motto: 'save the world' },
   { name: 'Smashers 007', motto: 'smash everything' },
   { name: 'Avengers', motto: 'save the world' },
   { name: 'Smashers 007', motto: 'smash everything' },
   { name: 'Avengers', motto: 'save the world' },
];

function MyTeamsHome(props) {
   const { navigate } = useNavigation();
   const [data, setData] = useState<ITeamDoc[]>([]);
   const { smashStore } = props;
   const onPressCreateTeam = () => {
      if (false) {
         props.challengesStore.subscribeModal = 'home';
      } else {
         navigate(Routes.CreateTeam);
      }
   };

   const renderEmptyComponent = () => (
      <View marginV-24>
         <Text R14 color6D center marginB-16>
            You have no teams yet.
         </Text>
      </View>
   );

   const renderHeaderComponent = () => (
      <View marginB-120>
         <CustomButtonLinear
            title={'Create Team'}
            fullWidth
            onPress={onPressCreateTeam}
            loader={undefined}
            style={styles.createButton}
            styleText={styles.createButtonText}
            styleLinear={styles.createButtonLinear}
         />
      </View>
   );

   const goToTeamScreen = useCallback((item) => {
      smashStore.smashEffects();
      navigate(Routes.TeamArena, { team: item });
   }, []);

   const renderItem: ListRenderItem<ITeamListItem> = ({ item }) => {
      return (
         <TeamListItem
            name={item.name}
            id={item.id}
            team={item}
            actions={item?.actions || false}
            motto={item.motto}
            picture={item.picture}
            goToTeamScreen={() => goToTeamScreen(item)}
         />
      );
   };

   useEffect(() => {
      const { uid } = Firebase.auth.currentUser;

      // const legacyUnsubscribe = Firebase.firestore
      //    .collection('feed')
      //    .where('joinedUsers', 'array-contains', uid)
      //    .where('lifestyle', '==', 'week')
      //    .where('active', '==', true)
      //    .onSnapshot((snaps: any) => {
      //       if (!snaps.empty) {
      //          const legacyTeams: ITeamDoc[] = [];
      //          snaps.forEach((doc: any) => {
      //             if (!doc.exists) return;
      //             const team = doc.data();
      //             legacyTeams.push({
      //                ...team,
      //                name: team.text || 'nada',
      //                motto: team.motto || 'no motto',
      //                joined: team.joinedUsers || [],
      //                actions: team.masterIds || [],
      //             });
      //          });
      //          setData((data) => [...data, ...legacyTeams]);
      //       }
      //    });
      const unsubscribe = Firebase.firestore
         .collection('teams')
         .where('active', '==', true)
         .where('joined', 'array-contains', uid)
         .onSnapshot((snaps: any) => {
            if (!snaps.empty) {
               const teams: ITeamDoc[] = [];
               snaps.forEach((doc: any) => {
                  if (!doc.exists) return;
                  const team = doc.data();
                  teams.push(team);
               });
               setData(teams);
            }
         });

      return unsubscribe;
   }, []);

   return (
      <View>
         <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.name.toString()}
            ListEmptyComponent={renderEmptyComponent}
            // ListFooterComponent={renderHeaderComponent}
            style={styles.listContainer}
         />
      </View>
   );
}

export default inject('smashStore', 'challengesStore')(observer(MyTeamsHome));

const styles = StyleSheet.create({
   listContainer: {},
   createButton: {
      //  width: 120,
      height: 50,
   },
   createButtonText: {
      fontSize: 12,
   },
   createButtonLinear: {
      paddingHorizontal: 8,
   },
});
