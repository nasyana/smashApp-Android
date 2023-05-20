import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HeaderWithSearch from 'components/HeaderWithSearch';
import {FONTS} from 'config/FoundationConfig';
import Routes from 'config/Routes';

import React, {useState, useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {View, Colors} from 'react-native-ui-lib';
import Firebase from '../../config/Firebase';

import {inject, observer} from 'mobx-react';
import FitnessChallenges from './FitnessChallenges';
import LifestyleChallenges from './LifestyleChallenges';
import PopularChallenges from './PopularChallenges';

const {height, width} = Dimensions;
const Tab = createMaterialTopTabNavigator();

const isMatched = ({name = ''}, filterText: string = '') => {
   if (name) {
      return name.toLowerCase().indexOf(filterText) > -1;
   }
   return false;
};

const JoinTeamChallenges = inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(
   observer((props) => {
      const {filterText, teamsStore} = props;
      const [loaded, setLoaded] = useState(false);
      const [challenges, setChallenges] = useState([]);
      const {currentTeam} = teamsStore;

      useEffect(() => {
         setLoaded(true);
         // setTimeout(() => {
         //   setLoaded(true)
         // }, ((props.index + 1) * 100) + 370);

         const unsubscribeToChallenges = Firebase.firestore
            .collection('challenges')
            .where('active', '==', true)
            .where('new', '==', true)
            .where('challengeType', '==', 'team')
            .onSnapshot((snaps) => {
               if (!snaps.empty) {
                  const challengesArray = [];

                  snaps.forEach((snap) => {
                     const challenge = snap.data();
                     challengesArray.push(challenge);
                  });

                  setChallenges(challengesArray);
               }
            });

         return () => {
            if (unsubscribeToChallenges) {
               unsubscribeToChallenges();
            }
         };
      }, []);

      return (
         <View flex>
            {!props.hideHeader && (
               <HeaderWithSearch
                  back
                  title={`${
                     currentTeam.name ? currentTeam.name : ''
                  } > Join Challenge`}
                  placeholder="Find Challenge"
               />
            )}
            <Tab.Navigator
               lazy={false}
               tabBarOptions={{
                  tabStyle: {minWidth: 0},
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
                  children={() =>
                     loaded ? (
                        <PopularChallenges
                           challenges={challenges.filter(
                              (item) =>
                                 item.popular === true &&
                                 isMatched(item, filterText),
                           )}
                        />
                     ) : null
                  }
                  options={{
                     title: 'Popular',
                  }}
               />

               <Tab.Screen
                  name={Routes.FitnessChallenges}
                  children={() =>
                     loaded ? (
                        <FitnessChallenges
                           challenges={challenges.filter(
                              (item) =>
                                 item.fitness === true &&
                                 isMatched(item, filterText),
                           )}
                        />
                     ) : null
                  }
                  options={{
                     title: 'Fitness',
                  }}
               />
               <Tab.Screen
                  name={Routes.LifestyleChallenges}
                  children={() =>
                     loaded ? (
                        <LifestyleChallenges
                           challenges={challenges.filter(
                              (item) =>
                                 item.lifestyle === true &&
                                 isMatched(item, filterText),
                           )}
                        />
                     ) : null
                  }
                  options={{
                     title: 'Lifestyle',
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

export default JoinTeamChallenges;

const styles = StyleSheet.create({});
