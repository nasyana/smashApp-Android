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
import ActivityDays from 'components/ActivityDays';



const ActivitiesListLast7 = (props) => {
   const { smashStore } = props;
   const { settings, currentUser,currentUserId } = smashStore;

   const activitiesToShow = props?.route?.params?.activitiesToShow || false
   const { faqs = [] } = settings;

   let favoriteActivities = currentUser?.activityQuantities
   ? Object.keys(currentUser.activityQuantities).sort(
        (a, b) =>
           currentUser?.activityQuantities?.[b] -
           currentUser?.activityQuantities?.[a],
     )
   : [];


   let newFaqa = [...faqs].sort((a, b) => a.order - b.order);
   const { navigate } = useNavigation();

   const goToChat = () => {
      navigate(Routes.Chat, {
         stream: {
            streamId: `${currentUserId}_smashappchat`,
            streamName: 'Chat with us',
            smashappchat: true,
         },
      });
      // navigate(Routes.MyProfile, { user })
   };
const finalActivitiesToShow = activitiesToShow || favoriteActivities;
   return (
      <View flex>
         <Header
            title={"Habits"}
            noShadow
            back
         />

   <ScrollView contentContainerStyle={{padding: 8, paddingBottom: 30}}>
   {finalActivitiesToShow && finalActivitiesToShow?.map((id)=>{

         return <ActivityDays key={id} activityId={id} showLabel />
   })}
</ScrollView>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ActivitiesListLast7));

const styles = StyleSheet.create({});
