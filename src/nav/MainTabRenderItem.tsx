
import React, { useState, useEffect, useRef } from 'react';
import { Platform, Modal, FlatList } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';

import {
   Assets,
   Colors,
   Image,
   Text,
   View,
} from 'react-native-ui-lib';
import Ripple from 'react-native-material-ripple';

import { bottom, height, width } from 'config/scaleAccordingToDevice';
import useBoolean from 'hooks/useBoolean';
import Routes from 'config/Routes';
// import Achievements from 'modules/Achievements';
import { inject, observer } from 'mobx-react';
import SmashButtonMenu from './SmashButtonMenu';
import SmashButtonMenuAndroid from './SmashButtonMenuAndroid'
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import Firebase from 'config/Firebase';

import ActivityHome from 'modules/ActivityHome';
import AllMyActivitiesList from 'modules/AllMyActivitiesList';
// import TeamMainScreen from 'modules/TeamMainScreen';
import * as Linking from 'expo-linking';
import TeamTabNumber from 'components/TeamTabNumber';

const MainTabRenderItem = ({ item, index, smashStore, navigation }) => {


    // const { navigate } = useNavigation();

    // const navigation = useNavigation();

    const {setMenuState, menuState = {}} = smashStore;
    let { label, inActive, active, name } = item;
    const isFocused = index == menuState.index;
  
    const onPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    //   if (index == 0) {
    //     smashStore.setHomeTabsIndex(0);
    //     smashStore && smashStore.setFindChallenge(false);
    //   }
      if (!isFocused && !!name) {
        navigation?.navigate(name);
        setMenuState({index: index})
      }
    };
  
    if (index === 2) {
      return (
        <View
          style={{
            flex: 1.4,
            height: 50,
            width: width / 5.5
          }}
          key={index}
        />
      );
    }
    return (
      <Ripple
        key={index}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        style={{
          flex: 1,
          height: 55,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={isFocused ? active : inActive} style={{ width: width / 8, height: width / 8, marginHorizontal: 4 }} />
  
        {!!label && (
          <Text
            R10
            style={{
              color: isFocused
                ? Colors.buttonLink
                : Colors.color6D,
            }}>
            {label}
          </Text>
        )}
      </Ripple>
    );
  };

  export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(MainTabRenderItem));