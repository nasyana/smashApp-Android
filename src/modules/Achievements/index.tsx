import Header from 'components/Header';
import React, { useState } from 'react';
import { Colors, Text, View } from 'react-native-ui-lib';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FONTS } from 'config/FoundationConfig';
import Routes from 'config/Routes';
import AchievementsTab from './AchievementsTab';
import StreakBadgesTab from 'modules/StreakBadges/StreakBadgesTab';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HomeHeaderWithSearch from 'components/HomeHeaderWithSearch';



const Tab = createMaterialTopTabNavigator();

function Achievements() {


const isIOS  = Platform.OS === 'ios';
const insets = useSafeAreaInsets();
const iosStyle = isIOS ? { paddingTop: insets.top - 16, height: getStatusBarHeight(true) + 16 + insets.top } : {};

 
   return (
      <View flex >
         <Header back title={'Achievements'}  />
         <Tab.Navigator
            lazy={false}
            tabBarOptions={{
               tabStyle: { minWidth: 0 },
               showIcon: true,
               scrollEnabled: false,
               labelStyle: {
                  fontFamily: FONTS.heavy,
                  fontSize: 14,
               },
               activeTintColor: '#333' || Colors.buttonLink,
               inactiveTintColor: Colors.color6D,
               indicatorStyle: {
                  backgroundColor: '#aaa' || Colors.buttonLink,
               },
            }}>
            <Tab.Screen
               children={renderFirstPage}
               name={Routes.Achievements}
               options={{
                  title: 'Achievements',
               }}
            />
            <Tab.Screen
               name={Routes.StreakBadges}
               children={renderSecondPage}
               options={{
                  title: 'Streak Badges',
               }}
            />
         </Tab.Navigator>
      </View>
   );
}

function renderFirstPage() {
   return <AchievementsTab />;
}

function renderSecondPage() {
   return <StreakBadgesTab />;
}

export default Achievements;
