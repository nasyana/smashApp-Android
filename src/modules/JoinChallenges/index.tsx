import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HeaderWithSearch from "components/HeaderWithSearch";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";

import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { View, Colors } from "react-native-ui-lib";
import Firebase from "../../config/Firebase"
import PopularChallenges from "./PopularChallenges";
import FitnessChallenges from "./FitnessChallenges";
import LifestyleChallenges from "./LifestyleChallenges";
import CommunityChallenges from "./CommunityChallenges";
import { inject, observer } from 'mobx-react';
import AnimatedAppearance from "components/AnimatedAppearance";
import Shimmer from 'components/Shimmer';
import Header from 'components/Header';

const { height, width } = Dimensions.get('window');
const Tab = createMaterialTopTabNavigator();

const isMatched = ({ name = '' }, filterText: string) => {
   if (name) {
      return name.toLowerCase().indexOf(filterText) > -1;
   }
   return false;
};

const JoinChallenges = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props) => {


      return (
         <View flex>
            {!props.hideHeader && (
               <Header
                  title="Join Habit Stack Challenges"
                  placeholder="Find Challenge"
                  back
               />
            )}
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
                  name={Routes.PopularChallenges}
                  children={() => <PopularChallenges />}
                  options={{
                     title: 'Popular',
                  }}
               />
                 <Tab.Screen
                  name={Routes.LifestyleChallenges}
                  children={() => <LifestyleChallenges />}
                  options={{
                     title: 'Lifestyle',
                  }}
               />

               <Tab.Screen
                  name={Routes.FitnessChallenges}
                  children={() => <FitnessChallenges />}
                  options={{
                     title: 'Fitness',
                  }}
               />
             

               {/* <Tab.Screen
          name={Routes.CommunityChallenges}
          children={() => <CommunityChallenges challenges={challenges.filter(item => item.community === true)} />}
          options={{
            title: "Community",
          }}
        /> */}
            </Tab.Navigator>
         </View>
      );
   }),
);

export default JoinChallenges;

const styles = StyleSheet.create({});
