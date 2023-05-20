import Header from 'components/Header';
import React, { useState,useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
   Modal,
} from 'react-native-ui-lib';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Routes from 'config/Routes';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import HomeHeaderWithSearch from 'components/HomeHeaderWithSearch';
import CreateGoal from 'modules/CreateGoal';
import MyGoalsList from 'modules/UserChallenges/MyGoalsList';


const Goals = (props) => {
   const { smashStore, challengesStore } = props;
   const { settings, currentUserId } = smashStore;
   const {showCreateGoalModal} = challengesStore;

   const { faqs = [] } = settings;
   const [loaded, setLoaded] = useState(false);
   // delay loading of screen for 500 ms
   useEffect(() => {
      setTimeout(() => {
       setLoaded(true)
      }, 500);
   }, []);
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

   return (
      <View flex>
         <HomeHeaderWithSearch
            title={"My Goals"}
            goals
            />
 {loaded ? <MyGoalsList /> : <View flex center><ActivityIndicator size={'large'} /></View>}

            {/* <Modal animationType={'slide'} visible={showCreateGoalModal ? true : false}>
<CreateGoal goal={showCreateGoalModal} />
</Modal> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(Goals));

const styles = StyleSheet.create({});
