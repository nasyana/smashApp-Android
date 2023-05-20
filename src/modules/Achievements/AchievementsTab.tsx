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
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Routes from 'config/Routes';
// import Firebase from 'config/Firebase';
import * as StoreReview from 'expo-store-review';
import AnimatedView from 'components/AnimatedView';
import LottieAnimation from 'components/LottieAnimation';
import SectionHeader from '../../components/SectionHeader';
import firebaseInstance from 'config/Firebase';

const AchievementsTab = (props: any) => {
   const { navigate } = useNavigation();
   const { smashStore } = props;

   const [review, setReview] = useState(true);

   const { settings, uid } = smashStore;
   const { faqs = [] } = settings;

   

   let newFaqa = [...faqs].sort((a, b) => a.order - b.order);

   const goToChat = () => {
      navigate(Routes.Chat, {
         stream: {
            streamId: `${uid}_smashappchat`,
            streamName: 'Chat with us',
            smashappchat: true,
         },
      });
   };



   return (
      <View flex>
         {/* <Header title={'Achievements'} noShadow back /> */}
         <AchievementsList />
      </View>
   );
};

export default inject(
   'smashStore',
   'teamsStore',
   'challengesStore',
)(observer(AchievementsTab));

const styles = StyleSheet.create({});

export const AchievementsList = inject(
   'smashStore',
   'teamsStore',
   'challengesStore',
)(observer(({
   limit = false,
   isHome = false,
   smashStore = {},
}) => {

   const {currentUserInChallengeMap = false, currentUserHasPointsEver = false, uid} = smashStore
   const { navigate } = useNavigation();
   const [loaded, setLoaded] = useState(false);
   const handleReview = async () => {
      const availableReview = await StoreReview.isAvailableAsync();

      if (availableReview) {
         StoreReview.requestReview().then(() => {
         
            const userRef = doc(firebaseInstance.firestore, "users", uid);
            setDoc(userRef, { hasReview: true }, { merge: true });
         });
         
      }
   };
   useEffect(() => {
      const timeout = setTimeout(() => {
         setLoaded(true);
      }, 2000);

      return () => {
         if (timeout) {
            clearTimeout(timeout);
         }
      };
   }, []);

   const goToEditProfile = () => {
      navigate(Routes.EditProfile);
   };

   const goToJoinChallenge = () => {
      navigate(Routes.JoinChallenges);
   };

   const checkFirstSmash = () => {
      // if (!currentUser.inChallengeMap && !currentUser.teams) {
      //    smashStore.tutorialVideo = smashStore?.settings?.tutorials?.pushSmash;

      smashStore.dismissWizard = false;
      //    // navigate(Routes.JoinChallenges);
      //    // smashStore.setFindChallenge(true);
      //    return;
      // }
   };

   const onTouchActions = (type: string) => {
      switch (type) {
         case 'ADDED_CITY':
            goToEditProfile();
            return;
         case 'JOINED_FIRST_CHALLENGE':
            goToJoinChallenge();
            return;
         case 'SMASH_FIRST_ACTIVITY':
            checkFirstSmash();
            return;
         case 'FOLLOWED_A_PLAYER':
            return;
         case 'REACHED_1K':
            return;
         case 'REACHED_10K':
            return;
         case 'REACHED_100K':
            return;
         case 'TEN_DAYS_STREAK':
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

      const {currentUserHasPointsEver = false, currentUser} = smashStore;
      let colorProps: { tintColor?: string } = {
         tintColor: '#aaa',
      };

      switch (type) {
         case 'ADDED_CITY':
            if (currentUser?.city != '') {
               delete colorProps.tintColor;
            }
            break;
         case 'JOINED_FIRST_CHALLENGE':
            if (currentUserInChallengeMap) {
               delete colorProps.tintColor;
            }
            break;
         case 'SMASH_FIRST_ACTIVITY':
            if (currentUserHasPointsEver > 0) {
               delete colorProps.tintColor;
            }
            break;

         case 'FOLLOWED_A_PLAYER':
            if ((currentUser?.following || []).length > 0) {
               delete colorProps.tintColor;
            }
            break;
         case 'REACHED_1K':
            if (currentUserHasPointsEver >= 1000) {
               delete colorProps.tintColor;
            }
            break;
         case 'REACHED_10K':
            if (currentUserHasPointsEver >= 10000) {
               delete colorProps.tintColor;
            }
            break;
         case 'REACHED_100K':
            if (currentUserHasPointsEver >= 100000) {
               delete colorProps.tintColor;
            }
            break;
         case 'THREE_DAY_STREAK':
            if (
               (
                  currentUser?.streaks?.[3] ||
                  currentUser?.streaks?.[7] ||
                  currentUser?.streaks?.[10] ||
                  []
               ).length > 0
            ) {
               delete colorProps.tintColor;
            }
            break;
         case 'SEVEN_DAY_STREAK':
            if (
               (currentUser?.streaks?.[7] || currentUser?.streaks?.[10] || [])
                  .length > 0
            ) {
               delete colorProps.tintColor;
            }
            break;
         case 'TEN_DAY_STREAK':
            if (
               (
                  currentUser?.streaks?.[10] ||
                  currentUser?.streaks?.[14] ||
                  currentUser?.streaks?.[21] ||
                  []
               ).length > 0
            ) {
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

   const boxShadow = {
      shadowRadius: 3,
      shadowOpacity: 0.02,
      shadowColor: '#171717',
      shadowOffset: { width: -2, height: 4 },
   };

   /// 14plus 926 height

   /// 6 is 667
   // console.warn(height);

   const itemHeight = height < 760 ? height / 5.5 : height / 7.5;

   if ((isHome && currentUserHasPointsEver) || (isHome && !loaded)) {
      return null;
   }

 let label = currentUserInChallengeMap ? "You're almost a pro! Earn Some Points!" : "You're almost a pro! Join some Challenges!";
   return (
      <ScrollView
         contentContainerStyle={{
            paddingTop: isHome ? 24 : 16,
            paddingBottom: 16,
         }}>
             <SectionHeader title={label} />
         <View style={{ flexWrap: 'wrap' }} row center>
            {achievements.map((achievement, index) => {
               const image = Assets?.achievements ? Assets?.achievements[`${achievement.handle}`] : false;
               const type = achievement?.handle;
               const notDone =
                  colorHanlderAchivement(achievement?.handle, smashStore)?.tintColor ==
                  '#aaa';
               if (limit && index > limit) {
                  return null;
               }
               /**
                * TO BE REMOVED:
                * WHEN THREE_DAY_STREAK IS WORKING
                * AND WON_TEAM_TARGET IS WORKING
                */
               if (type === 'WON_TEAM_TARGET' || type === 'THREE_DAY_STREAKx')
                  return null;

               return (
                  <TouchableOpacity
                     active
                     key={index}
                     style={{
                        ...boxShadow,
                        width: '30%',
                        margin: '1%',
                        borderRadius: 10,
                        minHeight: itemHeight,
                        paddingHorizontal: 8,
                        backgroundColor: '#fff',
                     }}
                     onPress={() => onTouchActions(achievement?.handle)}>
                     <AnimatedView fade={!isHome}>
                        <View center>
                           {image && <Image
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
                           />}
                           <Text center M14>
                              {achievement.text}
                           </Text>
                        </View>
                     </AnimatedView>
                     {!notDone && (
                        <LottieAnimation
                           autoPlay
                           loop={false}
                           style={{
                              height: 50,
                              zIndex: 0,
                              top: -4,
                              right: -4,
                              position: 'absolute',
                              // backgroundColor: '#333',
                           }}
                           source={require('../../lotties/done-excited.json')}
                        />
                     )}
                  </TouchableOpacity>
               );
            })}
         </View>
      </ScrollView>
   );
}));
