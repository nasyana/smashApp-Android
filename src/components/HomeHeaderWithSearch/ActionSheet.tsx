import React from 'react';
import Routes from 'config/Routes';
import { ActionSheet, View } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';
const ActionSheetScreen = ({ setVisible, smashStore }: any) => {
   const navigation = useNavigation();
   const { homeActionsVisible } = smashStore
   return (
      <ActionSheet
         title="Actions"
         message={'Join a new Challenge or Create a Team'}
         cancelButtonIndex={2}
         destructiveButtonIndex={2}
         useNativeIOS={true}
         migrateDialog
         containerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 10,
         }}
         options={[
            {
               label: 'Join New Challenge',
               onPress: () => navigation.navigate(Routes.JoinChallenges),
            },
            {
               label: 'Create New Group',
               onPress: () => navigation.navigate(Routes.CreateTeam),
            },
            { label: 'Cancel', onPress: () => null }

         ]}
         visible={homeActionsVisible}
         onDismiss={() => setVisible(false)}
      />
   );
};

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ActionSheetScreen));
