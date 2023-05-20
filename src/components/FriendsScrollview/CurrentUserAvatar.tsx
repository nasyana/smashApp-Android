import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
   View, TouchableOpacity
} from 'react-native-ui-lib'; //eslint-disable-line
import { inject, observer } from 'mobx-react';
import Firebase from '../../config/Firebase';
import CurrentUserAvatarContainer from './CurrentUserAvatarContainer';
import { useNavigation } from '@react-navigation/core';
import { moment } from 'helpers/generalHelpers';
import { AntDesign } from '@expo/vector-icons';
import { Vibrate } from 'helpers/HapticsHelpers';
import Friends from './Friends';
import 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CurrentUserAvatar = ({smashStore, pressAvatar}) => {

    const {currentUser} = smashStore;
    const {uid} = currentUser;
  return (
    <View style={[styles.section, { borderRightWidth: 0 }]}>
               <CurrentUserAvatarContainer
                  player={currentUser}
                  me={true}
                  playerId={uid}
                  {...{ pressAvatar }}
                  index={0}
               />
            </View>
  )
}

export default CurrentUserAvatar

const styles = StyleSheet.create({
    container: {
       padding: 25,
       paddingTop: 0,
    },
    section: {
       flexDirection: 'column',
       alignItems: 'center',
       justifyContent: 'space-between',
       marginBottom: 0,
    },
 });
 