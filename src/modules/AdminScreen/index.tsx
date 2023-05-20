import Header from 'components/Header';
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Routes from 'config/Routes';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import AdminNavigation from 'components/AdminNavigation';
// import firebase from 'firebase';

const AdminScreen = (props) => {
   const { smashStore } = props;
   const { settings } = smashStore;
   const { faqs = [] } = settings;

   let newFaqa = [...faqs].sort((a, b) => a.order - b.order);
   const { navigate } = useNavigation();



 
  
    if(!smashStore.currentUser.superUser){return null}
   return (
      <View flex>
         <Header
            title={"Admin Screen"}
            noShadow
            back

         />
     
         <ScrollView>
            <AdminNavigation />
         {/* <CopyUserData userFrom={usersCollection} userTo={usersCollection} /> */}
            {/* <SectionHeader title="Streaks Leaderboard" top={32} /> */}
            {/* <StreaksLeaderboard /> */}


            {/* <SectionHeader title="Messaging" top={32} />
            <EditDynamicFields collection={'generalSettings'} docId={'messaging'} /> */}

         </ScrollView>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(AdminScreen));

 

