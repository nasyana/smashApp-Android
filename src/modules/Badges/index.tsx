import Header from "components/Header";
import React, { useState, useEffect } from "react";
import { View, Text, Colors, Assets, Image } from "react-native-ui-lib";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { FlatList, SectionList, ScrollView } from "react-native"
import { shadow, width } from "config/scaleAccordingToDevice";
import { FONTS } from "config/FoundationConfig";
import BadgeItem from './components/BadgeItem';
import { inject, observer } from 'mobx-react';
import Firebase from '../../config/Firebase';
import { moment } from 'helpers/generalHelpers';;
import EpicBadgeProfile from 'components/EpicBadgeProfile';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { daysInChallenge, daysInMonthOfPlayerChallenge } from "helpers/dateHelpers";
import { challengeDaysSmashed } from "helpers/generalHelpers";
import { AntDesign } from "@expo/vector-icons";
const _ = require('lodash');
const Badges = (props) => {
   const { smashStore } = props;
   const { kFormatter } = smashStore;
   const [challenges, setChallenges] = useState([]);
   const [loadingMessage, setLoadingMessage] = useState('Checking Badges...')
   useEffect(() => {
      const { uid } = Firebase.auth.currentUser;

      const newChallengesDate = 1663977525;
      const unsubscribeToChallenges = Firebase.firestore
         .collection('celebrations')
         .where('uid', '==', uid)
         .where('type', '==', 'challengeStreak')
         .onSnapshot((snaps) => {
            if (!snaps.empty) {
               const challengesArray = [];

               snaps.forEach((snap) => {
                  const challenge = snap.data();

                  challengesArray.push(challenge);
               });

               setChallenges(challengesArray);
               if (challengesArray.length == 0) {
                  setLoadingMessage('No Badges Yet')
               }

            }
         });

      return () => {
         if (unsubscribeToChallenges) {
            unsubscribeToChallenges();
         }
      };
   }, []);


   const renderItem = React.useCallback(({ item, index }) => {
      return (
         <View padding-8 row>
            <View><Text center R14>{item.streak} Day {item.name}</Text>
               <Text center secondaryContent R12>{item.dateFinished}</Text>
            </View>
         </View>
      );
   }, []);

   const wonChallenge = (playerChallenge) => {

      return challengeDaysSmashed(playerChallenge) >= daysInChallenge(playerChallenge)
   }

   console.log('challenges', challenges)

   const newPostsArray = challenges
      // .filter((c) => c.duration != 'weekly')
      // .filter((c) => c.selectedScore > 10)
      // .filter((c) => c.followers?.length > 0)
      // .filter((c) => wonChallenge(c))
      .map((p) => {
         return {
            ...p,
            dateKey: moment(p.timestamp, 'X').startOf('month').format('X'),
            dateFinished: moment(p.timestamp, 'X').format('Do MMM'),
            targets: p.targets,
         };
      });
   const groupBy = _.groupBy(newPostsArray, 'dateKey');

   let finalData = Object.keys(groupBy).map((key) => {
      return { title: key, data: groupBy[key] };
   });

   // finalData = []
   return (
      <View flex backgroundColor={Colors.background}>
         <Header title="Badges" back />

         {/* <SectionList
        sections={finalData}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => <Text >Ended: {title}</Text>}
        numColumns={3}
      /> */}
         <ScrollView>
            {finalData.length == 0 && (
               <Text R14 color6D center marginT-32>
                  {loadingMessage}
               </Text>
            )}
            {finalData.length > 0 &&
               finalData
                  .map((timeframe) => {
                     return (
                        <View
                           key={timeframe.title}
                           flex
                           style={{ width: width }}>
                           <FlatList
                              data={timeframe.data}
                              scrollEnabled={false}
                              numColumns={2}

                              showsVerticalScrollIndicator={false}
                              ListHeaderComponent={() => (
                                 <View
                                    style={{
                                       width: width,
                                       padding: 5,
                                       paddingHorizontal: 15,
                                       backgroundColor: '#eee',
                                    }}>
                                    <Text R12 center>
                                       {moment(timeframe.title, 'X').format(
                                          'MMM YYYY',
                                       )}
                                    </Text>
                                 </View>
                              )}
                              style={{ width: '100%', flex: 1, borderWidth: 0 }}
                              contentContainerStyle={{
                                 padding: 0,
                                 alignItems: 'center',
                                 width: '100%',
                              }}
                              keyExtractor={(i, _) => i.toString()}
                              renderItem={renderItem}
                              horizontal={false}
                              numColumns={3}
                              scrollEventThrottle={16}
                           />
                        </View>
                     );
                  })
                  .reverse()}
         </ScrollView>
      </View>
   );
};

export default inject("smashStore", "challengesStore")(observer(Badges));
