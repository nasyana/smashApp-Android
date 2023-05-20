import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
   View, TouchableOpacity
} from 'react-native-ui-lib'; //eslint-disable-line
import { inject, observer } from 'mobx-react';
import Firebase from '../../config/Firebase';
import AvatarContainer from './AvatarContainer';
import { useNavigation } from '@react-navigation/core';
import { moment } from 'helpers/generalHelpers';
import { AntDesign } from '@expo/vector-icons';
import { Vibrate } from 'helpers/HapticsHelpers';
import Friends from './Friends';
import 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrentUserAvatar from './CurrentUserAvatar';
;

const FriendsScrollView = (props, ref) => {
   const { navigate } = useNavigation();

   const {
      smashStore,
   } = props;
   
   const {
      shareProfile,
   } = smashStore;

   


   const shareNotice = () => {
      smashStore.simpleCelebrate = {
         name: `Share Your Profile Link!`,
         title: `Connect Up!`,
         subtitle: `Share your profile link with your friends or family so you can connect  🔥`,
         button: "Share Link",
         nextFn: shareProfile,
         bottomFn: () => smashStore.simpleCelebrate = false,
         buttonTwoText: 'Not Now'
      };
      Vibrate();




   }

   const pressAvatar = (player) => {
      navigate('MyProfileHome', { user: player });
   };




   console.log('check rerenders FriendsScrollView');


   return (

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, marginBottom: 8 }}>
         <View row centerV>
               <CurrentUserAvatar smashStore={smashStore} pressAvatar={pressAvatar} index={0} />
            <Friends  />
            <View paddingB-32><TouchableOpacity onPress={shareNotice} style={{ width: 70, height: 70, borderRadius: 100, marginLeft: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' }}>
               <AntDesign
                  name={'addusergroup'}
                  size={28}
                  color={'#aaa'}
               /></TouchableOpacity>
            </View>
         </View>
      </ScrollView>

   );
};

export default inject('smashStore')(observer(FriendsScrollView));

