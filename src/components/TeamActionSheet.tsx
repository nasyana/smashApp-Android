import React from 'react';
import { Alert } from 'react-native';
import Routes from 'config/Routes';
import { ActionSheet, View } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';
import { pluckSound } from 'helpers/soundHelpers';
import { Vibrate } from 'helpers/HapticsHelpers';
const TeamActionSheet = ({ setVisible, smashStore, teamsStore }: any) => {
   const { teamActionsVisible,currentUserId } = smashStore

   if (!teamActionsVisible) { return null }

   const navigation = useNavigation();

   const { currentUser } = smashStore;

   const { team = {} } = teamActionsVisible;
   const isAdmin = currentUserId == team?.uid;

   const openLibraryActivities = () => {
      teamsStore.setShowLibraryActivitiesModal('activities');
   };

   const openHabitStacks = () => {
      teamsStore.setShowLibraryActivitiesModal('habitStacks');
   };

   const setManualTeamToVote = () => {
      teamsStore.manualTeamToVoteOn = teamActionsVisible?.team;
   };

   const share = () => {
      Vibrate();
      pluckSound();
      smashStore.universalLoading = true;
      // setIsTeamJustCreated(false);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setTimeout(() => {
         smashStore.simpleCelebrate = {
            name: `Share Your Team Link!`,
            title: `Share Team!`,
            subtitle: `Share your Team link and Team Code with your friends or family so they can join the Team! 🔥`,
            button: "Share Link",
            nextFn: () => smashStore.shareTeam(team)
         };
         // smashStore.checkCameraPermissions(true);
      }, 500);


   };

   const leaveTeam = () => {


      Alert.alert(
         'Are you sure?',
         'If you leave the team you will have to request access again to come back.',
         [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            { text: 'OK', onPress: () => { teamsStore.leaveFromTeam(team.id); navigation?.goBack(); } },
         ],
      );

   }
   const changeTarget = () => {

      if (isAdmin) {

         teamsStore.setShowSetWeeklyTargetModal(team);
      } else {

         teamsStore.manualTeamToVoteOn = team;

      }

   }

   let showAdminOptions = teamActionsVisible?.access == 'admin';

   let showOptions = [

      {
         label: '🎯 Change Weekly Target',
         onPress: () => changeTarget(),
      },
      {
         label: '🔗 Share Link',
         onPress: () => share(),
      },
      {
         label: '👋 Leave Team',
         onPress: () => leaveTeam(),
      },

      { label: 'Cancel', onPress: () => null }

   ]


   if (showAdminOptions) {

      showOptions = [
         {
            label: '⚙️ Team Settings',
            onPress: () => navigation.navigate(Routes.CreateTeam, { teamDoc: team }),
         },
         {
            label: '🎯 Change Weekly Target',
            onPress: () => changeTarget(),
         },
         {
            label: '🔗 Share Team Code' + ' - (' +team.code+ ')',
            onPress: () => share(),
         },

         {
            label: '✨ Manage Habit Stacks',
            onPress: () => openHabitStacks(),
         },
         {
            label: '⛹ Tweak Habits/Activities',
            onPress: () => openLibraryActivities(),
         },
         { label: 'Cancel', onPress: () => null }

      ]

   }
   
   return (
      <ActionSheet
         title={"Team Actions"}
         message={'Manage Team Stuff'}
         //  cancelButtonIndex={showAdminOptions ? 4 : 2}
         //  destructiveButtonIndex={showAdminOptions ? 4 : 2}
         useNativeIOS={true}
         migrateDialog
         containerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 10,
         }}
         showCancelButton={true}
         options={showOptions}
         visible={teamActionsVisible}
         onDismiss={() => smashStore.setTeamActionsVisible(false)}
      />
   );
};

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TeamActionSheet));
