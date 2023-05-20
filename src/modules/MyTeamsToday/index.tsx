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
import TeamsTodayTargetsList from 'modules/Home/TeamsTodayTargetsList';
import TeamQuickViewModal from 'components/CommentsModal/TeamQuickViewModal';



const SinglePost = (props) => {
   const { smashStore } = props;
   const { settings, currentUserId } = smashStore;

   const { faqs = [] } = settings;

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
         <Header
            title={"My Teams Today"}
            noShadow
            back

         />

<TeamsTodayTargetsList activity /> 

      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(SinglePost));

const styles = StyleSheet.create({});
