import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { achievements } from 'helpers/generalHelpers';
import { height } from 'config/scaleAccordingToDevice';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import * as StoreReview from 'expo-store-review';

const HorizontalAchievements = (props: any) => {
   const { navigate } = useNavigation();
   const { smashStore } = props;

   const [review, setReview] = useState(true);

   const { settings,currentUserId } = smashStore;
   const { faqs = [] } = settings;

   let newFaqa = [...faqs].sort((a, b) => a.order - b.order);

   const boxShadow = {
      shadowRadius: 3,
      shadowOpacity: 0.02,
      shadowColor: '#171717',
      shadowOffset: { width: -2, height: 4 },
   };

   const goToChat = () => {
      navigate(Routes.Chat, {
         stream: {
            streamId: `${currentUserId}_smashappchat`,
            streamName: 'Chat with us',
            smashappchat: true,
         },
      });
   };


   const handleReview = async () => {
      const availableReview = await StoreReview.isAvailableAsync();

      if (availableReview) {
         StoreReview.requestReview().then(() => {
            Firebase.firestore.collection('users').doc(currentUserId).set({ hasReview: true }, { merge: true })
         })
      }
   };

   const onTouchActions = (type: string) => {
      switch (type) {
         case 'ADDED_CITY':
            return;
         case 'JOINED_FIRST_CHALLENGE':
            return;
         case 'FOLLOWED_A_PLAYER':
            return;
         case 'REACHED_1K':
            return;
         case 'REACHED_10K':
            return;
         case 'REACHED_100K':
            return;
         case 'WON_A_CHALLENGE':
            return;
         case 'ADDED_REVIEW':
            handleReview();
            return;
         case 'THREE_DAY_STREAK':
            return;
         case 'THREE_CHALLENGES':
            return;
         case 'CREATE_A_TEAM':
            return;
         case 'WON_TEAM_TARGET':
            return;
         default:
            return;
      }
   };

   const colorHanlderAchivement = (type: string) => {
      let colorProps: { tintColor?: string } = {
         tintColor: '#aaa',
      };

      const {currentUser } = smashStore;

      switch (type) {
         case 'ADDED_CITY':
            if (currentUser?.city != 'SmashVille') {
               delete colorProps.tintColor;
            }
            break;
         case 'JOINED_FIRST_CHALLENGE':
            if (currentUser?.inChallengeMap) {
               delete colorProps.tintColor;
            }
            break;
         case 'FOLLOWED_A_PLAYER':
            if ((currentUser?.following || []).length > 0) {
               delete colorProps.tintColor;
            }
            break;
         case 'REACHED_1K':
            if (currentUser?.allPointsEver >= 1000) {
               delete colorProps.tintColor;
            }
            break;
         case 'REACHED_10K':
            if (currentUser?.allPointsEver >= 10000) {
               delete colorProps.tintColor;
            }
            break;
         case 'REACHED_100K':
            if (currentUser?.allPointsEver >= 100000) {
               delete colorProps.tintColor;
            }
            break;
         case 'WON_A_CHALLENGE':
            if ((currentUser?.challengesSmashed || []).length > 0) {
               delete colorProps.tintColor;
            }
            break;
         case 'ADDED_REVIEW':
            if (currentUser?.hasReview) {
               delete colorProps.tintColor;
            }
            break;
         case 'THREE_CHALLENGES':
            if ((currentUser?.challengesSmashed || []).length >= 3) {
               delete colorProps.tintColor;
            }
            break;
         case 'THREE_DAY_STREAK':
            break;
         case 'CREATE_A_TEAM':
            if (currentUser?.createdAteam) {
               delete colorProps.tintColor;
            }
            break;
         case 'WON_TEAM_TARGET':
            break;
         default:
            return;
      }

      return colorProps;
   };

   

   return (
      <View flex>

         <ScrollView contentContainerStyle={{ paddingTop: 16 }}>
            <View style={{ flexWrap: 'wrap' }} row center>
               {achievements.map((achievement, index) => {
                  const image = Assets.achievements[`${achievement.handle}`];
                  const type = achievement?.handle;

                  /**
                   * TO BE REMOVED:
                   * WHEN THREE_DAY_STREAK IS WORKING
                   * AND WON_TEAM_TARGET IS WORKING
                   */
                  if (type === 'WON_TEAM_TARGET' || type === 'THREE_DAY_STREAK') return null;

                  return (
                     <TouchableOpacity
                        active
                        key={index}
                        style={{
                           ...boxShadow,
                           width: '30%',
                           margin: '1%',
                           borderRadius: 10,
                           height: height / 7,
                           paddingHorizontal: 8,
                           backgroundColor: '#fff',
                        }}
                        onPress={() => onTouchActions(achievement?.handle)}>
                        <View center>
                           <Image
                              source={image}
                              style={[
                                 {
                                    height: 50,
                                    width: '100%',
                                    marginTop: 12,
                                    marginBottom: 8,
                                 },
                                 colorHanlderAchivement(achievement?.handle),
                              ]}
                           />
                           <Text center>{achievement.text}</Text>
                        </View>
                     </TouchableOpacity>
                  );
               })}
            </View>
         </ScrollView>
      </View>
   );
};

export default inject(
   'smashStore',
   'teamsStore',
   'challengesStore',
)(observer(HorizontalAchievements));

const styles = StyleSheet.create({});
