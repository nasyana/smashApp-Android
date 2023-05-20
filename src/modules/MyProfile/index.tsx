import { useNavigation } from '@react-navigation/core';
import Box from 'components/Box';
import Header from 'components/Header';
import Routes from 'config/Routes';

import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Platform } from 'react-native';
import {
   View,
   Text,
   Colors,
   Assets,
   Image,
   Button,
   TouchableOpacity,
} from 'react-native-ui-lib';
import ButtonLinear from '../../components/ButtonLinear';
import { FONTS } from '../../config/FoundationConfig';
import SmartImage from '../../components/SmartImage/SmartImage';
import firebaseInstance from '../../config/Firebase';
const firestore = firebaseInstance?.firestore;
// import firebase from 'firebase';
import { inject, observer } from 'mobx-react';
import { moment } from 'helpers/generalHelpers';
import Insights from '../../modules/Overview/Insights';
import StreakBadgesHighlight from '../StreakBadges/StreakBadgesHighlight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, onSnapshot, query, limit, orderBy } from "firebase/firestore";
import { where } from "firebase/firestore";
import Subscribe from 'components/Subscribe';
import StreakRepairsCounts from 'modules/StreakBadges/StreakRepairsCounts'
;

const isAndroid = Platform.OS === 'android';

const MyProfile = (props: any) => {

 
   const [userSnapShot, setUserSnapShot] = useState(false);
   const [userTodayDoc, setUserTodayDoc] = useState(false);

   const [numberOfChallenges, setNumberOfChallenges] = useState(0);
   const user = props?.route?.params?.user || false;

   const { navigate } = useNavigation();
   const { smashStore } = props;
   const { currentUser, toggleFollowUnfollow, shareProfile, currentUserId, currentUserFollowing, last30Keys,todayDateKey } = smashStore;
   const userId = user.uid || user.id;
   const isMe = userId == currentUserId || user == false;
   const isFollowing = (currentUserFollowing || [])?.includes(userId);
   const userToDisplay = userSnapShot || user || currentUser;

   // const newUpdateUIDForAllDocs = async () => {
   //    const existingUID = 'JrYwOpjdjYOZdkdmXJSTmiQs22J3';
   //    const newUID = '2JHK02sr6TNy3WeoOuOnKWJog9J2';
    
   //    const oneMonthAgo = moment().subtract('months', 1).unix();
   //    // Get all playerChallenges documents where the followers array contains the existing UID
   //    const playerChallengesQuerySnapshot = await Firebase.firestore
   //      .collection('posts')
   //      .where('active', '==', true)
   //      .where('followers', 'array-contains', existingUID)
   //      .where('timestamp', '>', oneMonthAgo)
   //    //   .where('dailyTargets', '!=', null)
   //    //   .where('challengeType', '==', 'user')
   //      .get();
    
   //    // Create a batch to update all the documents in one go
   //    const batch = Firebase.firestore.batch();
    
   //    playerChallengesQuerySnapshot.forEach(doc => {
       
   //      // Update the followers array with the new UID
   //      batch.set(doc.ref, { followers: firebase.firestore.FieldValue.arrayUnion(newUID) }, { merge: true });
   //    });
    
   //    // Commit the batch to perform all the updates
   //     batch.commit();
   //  }
   //  const getPreviousMVPs = async (teamId) => {
   //    const mvpDocRef = Firebase.firestore.collection('mvps').doc(teamId);
   //    const weeklyActivityRef = Firebase.firestore.collection('weeklyActivity');
   //    const querySnapshot = await weeklyActivityRef.where('teamId', '==', teamId).get();
   //    let mvpData = {
   //      alltimeWeekWinners: {mvp: {}},
   //      alltimeDayWinners: {},
   //      weeks: {},
   //      days: {}
   //    };
    
   //    querySnapshot.forEach(doc => {
   //      const data = doc.data();
   //      const endWeekKey = data.endWeekKey;
   //      const dayKeys = Object.keys(data.daily);
         
   //      const playerIds = (data?.playerIds || [])
   //      // get the highest scorer for the week
   //      let highestScorerId = false;
   //      let highestScore = 0;
   //      playerIds.forEach((key) => {
   //        if (data.userWeekScores[key] > highestScore) {
   //          highestScorerId = key;
   //          highestScore = data.players[key]?.score;
   //        }
   //      });
    
   //      // get the highest scorer for each day
   //      dayKeys.forEach((dayKey) => {
   //        let dailyHighestScorerId = false;
   //        let dailyHighestScore = 0;
   //        playerIds.forEach((key) => {
   //          if (data?.daily?.[dayKey]?.players[key]?.score > dailyHighestScore) {
   //            dailyHighestScorerId = key;
   //            dailyHighestScore = data?.daily[dayKey]?.players[key]?.score;
   //          }
   //        });
    
   //        // calculate the daily target
   //        const dayTarget = (data.target - data.daily[dayKey]?.target);
    

   //        if(highestScorerId){


      
   //        // add the data to the mvp object
   //        if (mvpData?.alltimeWeekWinners?.mvp?.[highestScorerId]) {
   //          mvpData.alltimeWeekWinners.mvp[highestScorerId] += 1;
   //        } else {
   //          mvpData.alltimeWeekWinners.mvp[highestScorerId] = 1;
   //        }

   //       }

   //       if(dailyHighestScorerId){

   //          if (mvpData.alltimeDayWinners[dailyHighestScorerId]) {
   //             mvpData.alltimeDayWinners[dailyHighestScorerId] += 1;
   //           } else {
   //             mvpData.alltimeDayWinners[dailyHighestScorerId] = 1;
   //           }


   //       }
         
       
        
   //      });
   //    });
    
   //    // store the MVP object in the mvps collection
   //    await mvpDocRef.set(mvpData, {merge: true});
   //  };
    
   // const updateUIDForAllDocs = async () => {
   //    const existingUID = 'JrYwOpjdjYOZdkdmXJSTmiQs22J3'; 
   //    const newUID = '2JHK02sr6TNy3WeoOuOnKWJog9J2';
   //    const unixTimestamp2MonthsAgo = moment().subtract(7, 'days').unix();
    
   //    console.log('unixTimestamp2MonthsAgo',unixTimestamp2MonthsAgo)
   //    if(!newUID){alert('asd'); return}
    
   //    const batch = Firebase.firestore.batch();
    
   //    // Update the UID for the player challenges
   //    const playerChallengesQuerySnapshot = await Firebase.firestore.collection('playerChallenges')
   //      .where('active', '==', true)
   //      .where('uid', '==', existingUID)
   //      .where('dailyTargets', '!=', null)
   //      .where('challengeType', '==', 'user')
   //      .get();
    

   //    playerChallengesQuerySnapshot.forEach((doc) => {
   //      batch.update(doc.ref, { uid: newUID });
   //    });
   //    console.log('updateUIDForAllDocs 1')
   //    // Update the UID for the teams that I have created
   //    const teamsICreatedQuerySnapshot = await Firebase.firestore.collection('teams')
   //      .where('active', '==', true)
   //      .where('uid', '==', existingUID)
   //      .get();
    
   //    teamsICreatedQuerySnapshot.forEach((doc) => {
   //      batch.update(doc.ref, { uid: newUID });
   //    });
   //    console.log('updateUIDForAllDocs 2')
   //    // Update the UID for the teams that I am in
   //    const teamsIAmInQuerySnapshot = await Firebase.firestore.collection('teams')
   //      .where('active', '==', true)
   //      .where('joined', 'array-contains', existingUID)
   //      .get();
    
   //    teamsIAmInQuerySnapshot.forEach((doc) => {
   //      batch.update(doc.ref, { joined: firebase.firestore.FieldValue.arrayRemove(existingUID) });
   //      batch.update(doc.ref, { joined: firebase.firestore.FieldValue.arrayUnion(newUID) });
   //    });
   //    console.log('updateUIDForAllDocs 3')
   //    // Update the UID for all users who are following me
   //    const followersQuerySnapshot = await Firebase.firestore.collection('users')
   //      .where('followers', 'array-contains', existingUID)
   //      .get();
    
   //    followersQuerySnapshot.forEach((doc) => {
   //      batch.update(doc.ref, { followers: firebase.firestore.FieldValue.arrayRemove(existingUID) });
   //      batch.update(doc.ref, { followers: firebase.firestore.FieldValue.arrayUnion(newUID) });
   //    });
   //    console.log('updateUIDForAllDocs 4')
   //    // Update the UID for all users who I am following
   //    const followingQuerySnapshot = await Firebase.firestore.collection('users')
   //      .where('following', 'array-contains', existingUID)
   //      .get();
    
   //  followingQuerySnapshot.forEach((doc) => {
   //  const userRef = Firebase.firestore.collection('users').doc(doc.id);
   //  batch.update(userRef, { following: firebase.firestore.FieldValue.arrayRemove(existingUID) });
   //  batch.update(userRef, { following: firebase.firestore.FieldValue.arrayUnion(newUID) });
   //  });
    
   //  console.log('updateUIDForAllDocs 5')
   //  // Update the UID for my daily activity in the last 2 months
   //  const dailyActivityQuerySnapshot = await Firebase.firestore.collection('dailyActivity')
   //  .where('uid', '==', existingUID)
   //  .where('type', '==', 'User')
   //  .where('timestamp', '>', unixTimestamp2MonthsAgo)
   //  .get();
    
   //  dailyActivityQuerySnapshot.forEach((doc) => {
  
   //  batch.update(doc.ref, { uid: newUID });
   //  });


   //  console.log('updateUIDForAllDocs 6')
    
   //  // Update the UID for posts in the last 2 months
   //  const postsQuerySnapshot = await Firebase.firestore.collection('posts')
   //  .where('uid', '==', existingUID)
   //  .where('timestamp', '>', unixTimestamp2MonthsAgo)
   //  .get();
    
   //  postsQuerySnapshot.forEach((doc) => {
   // //  const postRef = Firebase.firestore.collection('posts').doc(doc.id);
   //  batch.update(doc.ref, { uid: newUID });
   //  });
    
   //  // Commit the batch
   //  await batch.commit();

   //  console.log('updateUIDForAllDocs DONE!')
    
   //  };
   const goToUserChallenges = () => {
      navigate('UserChallenges', { user: currentUser });
   };
   // console.log('last30Keys', last30Keys)
   // console.log('last14Keys', last14Keys)
   // const regenerateFollowers = () => {
   //    /// get all users where I am in their following arary. this

   //    Firebase.firestore
   //       .collection('users')
   //       .where('following', 'array-contains', currentUser.id)
   //       .get()
   //       .then((snaps) => {
   //          const allUsersWhoFollowMe = [];
   //          snaps.forEach((snap) => {
   //             const user = snap.data();

   //             allUsersWhoFollowMe.push(user);
   //          });

   //          return allUsersWhoFollowMe.map((u) => u.id);
   //       })
   //       .then((followers) => {
   //          Firebase.firestore
   //             .collection('users')
   //             .doc(currentUser.id)
   //             .set({ followers }, { merge: true });
   //       });
   // };


   const [chats, setChats] = useState([]);

   useEffect(() => {
      if (!currentUser?.superUser) {
        return;
      }
    
      const unsub = onSnapshot(
        query(
          collection(firestore, "chats"),
          where("smashappchat", "==", true),
          where("isUser", "==", true),
          orderBy("createdAt", "desc"),
          limit(100)
        ),
        (snaps) => {
          const chatDocs = [];
          snaps.forEach((snap) => {
            const chatDoc = snap.data();
            chatDocs.push(chatDoc);
          });
    
          setChats(chatDocs.filter((chatDoc) => chatDoc.read !== true));
        }
      );
    
      return () => {
        if (unsub) {
          unsub();
        }
      };
    }, [currentUser?.superUser]);
    

   const [allPlayerChallenges, setAllPlayerChallenges] = useState([]);

   // const getPlayerChallengesCountInChallenge = (challenge) => {
   //    // console.log('challenge.id', challenge.id);
   //    return new Promise(async (resolve, reject) => {
   //       const countSnap = await Firebase.firestore
   //          .collection('playerChallenges')
   //          .where('challengeId', '==', challenge.id)
   //          .where('active', '==', true)
   //          .where('endUnix', '>', moment().unix())
   //          .get();

   //       resolve(countSnap.size || 0);
   //    });
   // };

   // const updatePlayerChallengesStartDateUnix = () => {
   //    Firebase.firestore
   //       .collection('playerChallenges')
   //       .where('active', '==', true)
   //       .where('endUnix', '>', moment().unix())
   //       .get()
   //       .then((allPlayerChallengesSnap) => {
   //          allPlayerChallengesSnap.forEach((pSnap) => {
   //             const pDoc = pSnap.data();

   //             const endDate = pDoc.endDate
   //                ? pDoc.endDate
   //                : pDoc.endDateKey
   //                ? pDoc.endDateKey
   //                : moment(pDoc.endUnix).format('DDMMYYYY');
   //             pSnap.ref.set({ endDate }, { merge: true });
   //          });
   //       });
   // };



   // const resetHighestStreaks = () => {

   //    let batch = Firebase.firestore.batch();
   //    console.log('lessgo')
   //    Firebase.firestore
   //       .collection('streaks')
   //       .where('onGoingStreak', '==', 0)
   //       .where('type', '!=', 'activity')
   //       // .where('type', '!=', 'action')
   //       .get()
   //       .then((streaksSnap) => {
   //          console.log('streaksSnap.size', streaksSnap.size)
   //          streaksSnap.forEach((streakSnap) => {

   //             // batch.update(
   //             //    streakSnap.ref,
   //             //    {
   //             //       test: 1,

   //             //    })




   //          });

   //          // batch.commit();
   //       });
   // };



   // const reCalculateStreaksForPlayerChallenges = () => {

   //    // let batch = Firebase.firestore.batch();
   //    const { uid } = Firebase.auth.currentUser;
   //    Firebase.firestore
   //       .collection('playerChallenges')

   //       .where('active', '==', true)
   //       // .where('uid', '==', uid)
   //       .get()
   //       .then(async (allPlayerChallengesSnap) => {

   //          let playerChallengesArray = []
   //          allPlayerChallengesSnap.forEach(async (pSnap) => {


   //             const pDoc = pSnap.data();
   //             playerChallengesArray.push(pDoc);





   //          });

   //          return playerChallengesArray
   //       }).then(async (pArray) => {

   //          for (let index = 0; index < pArray.length; index++) {
   //             const pDoc = pArray[index];
   //             const resetStreaksCount = await checkOnCorrectStreakCount(pDoc)
   //             const highestStreakCount = await getHighestStreakCount(pDoc);

   //             console.log('resetStreaksCountresetStreaksCount', resetStreaksCount)
   //             Firebase.firestore
   //                .collection('challengeStreaks').doc(`${pDoc.uid}_${pDoc.challengeId}`).set({ onGoingStreak: resetStreaksCount, highestStreak: highestStreakCount > resetStreaksCount ? highestStreakCount : resetStreaksCount, id: `${pDoc.uid}_${pDoc.challengeId}` }, { merge: true })

   //          }

   //       });
   // };

   // const demoDaily = {
   //    '07112022': {
   //       score: 10,
   //       target: '10'
   //    },
   //    '06112022': {
   //       score: 0,
   //       target: '10'
   //    },
   //    '05112022': {
   //       score: 0,
   //       target: '10'
   //    },
   //    '04112022': {
   //       score: 20,
   //       target: '10'
   //    },
   //    '03112022': {
   //       score: 20,
   //       target: '10'
   //    },
   //    '02112022': {
   //       score: 20,
   //       target: '10'
   //    }
   //    ,
   //    '01112022': {
   //       score: 20,
   //       target: '10'
   //    }


   // }


   async function getHighestStreakCount(pDoc) {
      const { daily = {} } = pDoc;

      return new Promise((resolve, reject) => {

         const isQty = pDoc?.targetType == 'qty' || false;
         let resetStreaksCount = 0;
         let highestStreakCount = 0;
         last30Keys.reverse().every((key, index) => {


            const dayKey = moment().subtract(index, 'days').format('DDMMYYYY')

            const day = daily[dayKey] || {};


            const score = isQty ? day?.qty : day.score;
            const target = parseInt(day?.target);



            if (score >= target) {


               resetStreaksCount++

               highestStreakCount = Math.max(highestStreakCount, resetStreaksCount);

               return true

            } else {

               resetStreaksCount = 0;
               return true
            }

         })

         resolve(highestStreakCount)

      })
   }


   // const resetStreaksCount = await checkOnCorrectStreakCount(pDoc);
   // const newArray = Array.from({ length: 90 }, () => Math.floor(Math.random() * 40));
   async function checkOnCorrectStreakCount(pDoc) {
      const { daily = {} } = pDoc;

      return new Promise((resolve, reject) => {

         const isQty = pDoc?.targetType == 'qty' || false;
         let resetStreaksCount = 0;



         last30Keys.reverse().every((key, index) => {


            const dayKey = moment().subtract(index, 'days').format('DDMMYYYY')

            const day = daily[dayKey] || {};


            const score = isQty ? day?.qty : day.score;
            const target = parseInt(day?.target);



            if (score >= target) {
               resetStreaksCount++

               return true
            } else if (index == 0) {


               return true
            } else {

               return false
            }

         })

         resolve(resetStreaksCount)

      })
   }



   // async function updateStreak(challengeId, uid, resetStreaksCount) {

   //    console.log('updateStreak', challengeId, uid, resetStreaksCount)
   //    Firebase.firestore
   //       .collection('challengeStreaks').doc(`${uid}_${challengeId}`).set({ onGoingStreak: resetStreaksCount, highestStreak: resetStreaksCount }, { merge: true })

   // }



   // const updatePlayerChallengesEndUnix = () => {
   //    Firebase.firestore
   //       .collection('playerChallenges')
   //       .where('active', '==', true)
   //       .where('endUnix', '>', moment().unix())
   //       .get()
   //       .then((allPlayerChallengesSnap) => {
   //          allPlayerChallengesSnap.forEach((pSnap) => {
   //             const pDoc = pSnap.data();

   //             const endUnix = moment(pDoc.endDate, 'DDMMYYYY').endOf('day').unix();

   //             pSnap.ref.set({ endUnix }, { merge: true });
   //          });
   //       });
   // };

   // const regenerateChallengesCount = () => {
   //    Firebase.firestore
   //       .collection('challenges')
   //       .where('active', '==', true)
   //       .get()
   //       .then(async (challengesSnap) => {
   //          challengesSnap.forEach(async (challengeSnap) => {
   //             const challenge = challengeSnap.data();

   //             const count = await getPlayerChallengesCountInChallenge(
   //                challenge,
   //             );

   //             challengeSnap.ref.set({ playing: count }, { merge: true });
   //          });
   //       });
   // };

   // useEffect(() => {
   //    Firebase.firestore
   //       .collection('playerChallenges')
   //       .where('active', '==', true)
   //       .where('endUnix', '>', moment().unix())
   //       .get()
   //       .then((snaps) => {
   //          const playerChallenges = [];
   //          snaps.forEach((snap) => {
   //             const user = snap.data();

   //             playerChallenges.push(user);
   //          });

   //          setAllPlayerChallenges(playerChallenges);
   //       });

   //    return () => {};
   // }, []);

   const showSubscriptionModal = () => {

      props.challengesStore.showSubscriptionModal(true)
   }

   // const regenerateFollowing = () => {

   //    Firebase.firestore
   //       .collection('users')
   //       .where('followers', 'array-contains', currentUser.id)
   //       .get()
   //       .then((snaps) => {
   //          const allUsersWhoFollowMe = [];
   //          snaps.forEach((snap) => {
   //             const user = snap.data();

   //             allUsersWhoFollowMe.push(user);
   //          });

   //          return allUsersWhoFollowMe.map((u) => u.id);
   //       })
   //       .then((following) => {
   //          Firebase.firestore
   //             .collection('users')
   //             .doc(currentUser.id)
   //             .set({ following }, { merge: true });
   //       });
   // };
   useEffect(() => {
      const unsubscribeToUserDoc = onSnapshot(
        doc(collection(firestore, 'users'), userId || currentUser.id),
        (userSnap) => {
          if (userSnap.exists()) {
            const userSnapShot = userSnap.data();
            setUserSnapShot(userSnapShot);
          }
        }
      );
    
      const unsubscribeToUserTodayPoints = onSnapshot(
        doc(
          collection(firestore, 'users', userId || currentUser.id, 'days'),
          moment().format('DDMMYYYY')
        ),
        (userSnap) => {
          if (userSnap.exists()) {
            const userTodayDoc = userSnap.data();
            setUserTodayDoc(userTodayDoc);
          }
        }
      );
    
      let numChallenges = 0;
      let numBadges = 0;
      const unsubscribeToUserPlayerChallenges = onSnapshot(
        query(
          collection(firestore, 'playerChallenges'),
          where('uid', '==', userId || currentUser.id),
          where('active', '==', true)
        ),
        (userSnaps) => {
          numChallenges = userSnaps.size;
          setNumberOfChallenges(numChallenges);
        }
      );
    
      return () => {
        if (unsubscribeToUserDoc) {
          unsubscribeToUserDoc();
        }
        if (unsubscribeToUserPlayerChallenges) {
          unsubscribeToUserPlayerChallenges();
        }
        if (unsubscribeToUserTodayPoints) {
          unsubscribeToUserTodayPoints();
        }
      };
    }, []);
    


   const androidComingSoon = () => {

      Alert.alert('Coming Soon!', 'Thank you for your interest and we got you! This feature is coming very soon to Android. Get Advanced Insights, Unlimited Challenges, Create Teams & More.');
   }
   let DATA = [];
   if (isMe) {

      if(isAndroid){

         DATA = [
            // {
            //    icon: Assets.icons.ic_upgrade_pro_1,
            //    title: 'Streak Badges',
            //    onPress: () => navigate(Routes.Badges),
            // },
            // {
            //    icon: Assets.icons.ic_upgrade_pro_1,
            //    title: 'Achievements',
            //    onPress: () => navigate(Routes.Achievements),
            // },
            {
               icon: Assets.icons.ic_arr_right2,
               title: 'FAQs',
               onPress: () => navigate(Routes.Faqs),
            },
            {
               icon: Assets.icons.achievements_active,
               title: 'Achievements',
               onPress: () => navigate(Routes.Achievements),
            },
            {
               icon: Assets.icons.ic_edit_profile,
               title: 'Edit Profile',
               onPress: () => navigate(Routes.EditProfile),
            },{
               icon: Assets.icons.ic_upgrade_pro,
               title: 'Get Premium',
               onPress: ()=>showSubscriptionModal(),
            },
            // {
            //   icon: Assets.icons.ic_invite_friend,
            //   title: "Settings",
            //   onPress: () => navigate(Routes.More) 
            // },
         ];



      }else{

         DATA = [
            // {
            //    icon: Assets.icons.ic_upgrade_pro_1,
            //    title: 'Streak Badges',
            //    onPress: () => navigate(Routes.Badges),
            // },
            // {
            //    icon: Assets.icons.ic_upgrade_pro_1,
            //    title: 'Achievements',
            //    onPress: () => navigate(Routes.Achievements),
            // },
            {
               icon: Assets.icons.achievements_active,
               title: 'Achievements',
               onPress: () => navigate(Routes.Achievements),
            },
            {
               icon: Assets.icons.ic_arr_right2,
               title: 'FAQs',
               onPress: () => navigate(Routes.Faqs),
            },
            {
               icon: Assets.icons.ic_edit_profile,
               title: 'Edit Profile',
               onPress: () => navigate(Routes.EditProfile),
            },{
               icon: Assets.icons.ic_upgrade_pro,
               title: 'Get Premium',
               onPress: ()=>showSubscriptionModal(),
            },
            // {
            //   icon: Assets.icons.ic_invite_friend,
            //   title: "Settings",
            //   onPress: () => navigate(Routes.More) 
            // },
         ];



      }
    
   } else {
      DATA = [
         {
            // icon: Assets.icons.ic_upgrade_pro_1,
            title: "Streak Badges",
            onPress: () => navigate(Routes.Badges)
         },
         {
            icon: Assets.icons.ic_simple_calories,
            title: 'Recent Activity',
            onPress: () =>
               navigate(Routes.Timeline, { uid: userToDisplay.uid }),
         },

         // {
         //   icon: Assets.icons.ic_invite_friend,
         //   title: "Settings",
         //   onPress: () => navigate(Routes.More)
         // },
      ];
   }

   const goToEditProfile = () => {
      navigate(Routes.EditProfile, { city: true });
   };

   const goToFollowers = () => {
      navigate('Followers', { user: userToDisplay });
   };
   const goToFollowing = () => {
      navigate('FollowingNew', { user: userToDisplay });
   };

   const goToCustomNotifications = () => {
      navigate(Routes.CustomNotifications, { user: userToDisplay });
   };


   const goToAdminScreen = () => {
      navigate(Routes.AdminScreen);
   };


   // const generatePlayerIdsInTeamWeeklyDocs = async () => {


   //    const docSnaps = await Firebase.firestore
   //       .collection('weeklyActivity')
   //       .where('endWeekKey', '==', moment().endOf('isoWeek').format('DDMMYYYY'))
   //       .get();



   //    docSnaps.forEach((docSnap) => {
   //       if (docSnap.exists) {
   //          const teamWeeklyDoc = docSnap.data();
   //          // For generating fresh team codes for all teams set below condition to true and delete codes doc in teams collection.
   //          if (teamWeeklyDoc?.teamId) {

   //             const playerIds = teamWeeklyDoc?.allPlayers ? Object.keys(teamWeeklyDoc?.allPlayers) : []

   //             docSnap.ref.set({ playerIds }, { merge: true });


   //          }
   //       }
   //    });
   // };

   // const generateTeamCodes = async () => {
   //    const docSnap = await Firebase.firestore
   //       .collection('teams')
   //       .doc('codes')
   //       .get();

   //    let existingTeamCodes: string[] = [];
   //    if (docSnap.exists) existingTeamCodes = docSnap.data().codes || [];

   //    const generateNewCode = () => {
   //       let generatedCode = ImageUpload.teamCode();

   //       while (existingTeamCodes.includes(generatedCode)) {
   //          generatedCode = ImageUpload.teamCode();
   //       }

   //       return generatedCode;
   //    };

   //    const teamDocs = await Firebase.firestore.collection('teams').get();

   //    teamDocs.forEach((docSnap) => {
   //       if (docSnap.exists) {
   //          const team = docSnap.data();
   //          // For generating fresh team codes for all teams set below condition to true and delete codes doc in teams collection.
   //          if (!team.code) {
   //             const newCode = generateNewCode();
   //             docSnap.ref.set({ code: newCode }, { merge: true });
   //             existingTeamCodes.push(newCode);
   //             Firebase.firestore
   //                .collection('teams')
   //                .doc('codes')
   //                .set(
   //                   {
   //                      codes: firebase.firestore.FieldValue.arrayUnion(
   //                         newCode,
   //                      ),
   //                   },
   //                   { merge: true },
   //                );
   //          }
   //       }
   //    });
   // };

   const goToUserHelpChats = () => navigate(Routes.UserHelpChats);
   const goToAllUsers = () => navigate(Routes.AllUsers);
   const manageHabitStacks = () => {};


   const changeMood = () => {
      smashStore.setChangeMood(true);
   };

   const clearAllAsyncStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        console.log('AsyncStorage successfully cleared');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };

    
   return (
      <View flex backgroundColor={Colors.background}>
         <Header
            back={props?.route?.params?.user}

            back
            title={'Profile'}
            // noShadow
            // color="white"

            style={
               {
                  // backgroundColor: "black",
               }
            }
         />
         <ScrollView style={{marginTop: 16}}>
            {(currentUser?.superUser || currentUser.activityManager) && isMe && false && (
               <ScrollView
                  horizontal
                  marginH-16
                  marginT-16
                  row
                  showsHorizontalScrollIndicator={false}>

{/* {currentUser?.superUser && true && <Button
                     iconSource={Assets.icons.ic_add_16}
                     label={'Update PlayerCallenges with new UID for Nase'}
                     outline={true}
                     outlineColor={Colors.grey20}
                     marginR-16
                     color={Colors.grey20}
                     labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                     onPress={newUpdateUIDForAllDocs}
                  />
                  } */}
                  {currentUser?.superUser && <Button
                     iconSource={Assets.icons.ic_add_16}
                     label={'Create Challenge'}
                     outline={true}
                     outlineColor={Colors.grey20}
                     marginR-16
                     color={Colors.grey20}
                     labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                     onPress={() => {
                        navigate(Routes.CreateChallenge);
                     }}
                  />
                  }

                  

                  {/* {currentUser.superUser && true && false && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Streaks for PlayerChallenges'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={reCalculateStreaksForPlayerChallenges}
                     />
                  )} */}


                  {(currentUser?.superUser || currentUser.activityManager) && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Manage Activities'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{
                           fontSize: 14,
                           fontFamily: FONTS.medium,
                        }}
                        onPress={() => {
                           navigate(Routes.ListActivityCategories);
                        }}
                     />
                  )}
                  {/* {currentUser?.superUser && true && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Manage Habit Stacks'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{
                           fontSize: 14,
                           fontFamily: FONTS.medium,
                        }}
                        onPress={() => {
                           navigate(Routes.ManageHabitStacks);
                        }}
                     />
                  )} */}
{/* 
                  {false && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Generate Team codes'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={generateTeamCodes}
                     />
                  )} */}

                  {/* {true &&

                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Generate TeamWeekly Activity PlayerIds'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={generatePlayerIdsInTeamWeeklyDocs}
                     />} */}

                  {/* {false && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Regenerate Followers'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={regenerateFollowers}
                     />
                  )} */}

                  {/* {true && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Reset Streaks Highest Streak'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={resetHighestStreaks}
                     />
                  )} */}
                  {/* {false && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Regenerate Following'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={regenerateFollowing}
                     />
                  )} */}

                  {/* {false && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Regenerate Challenges Count'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={regenerateChallengesCount}
                     />
                  )} */}



                  {/* {false && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Update Start Unix for all PlayerChallenges'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={updatePlayerChallengesStartDateUnix}
                     />
                  )} */}

                  {/* {currentUser.superUser && false && (
                     <Button
                        iconSource={Assets.icons.ic_add_16}
                        label={'Manage Habit Stacks'}
                        outline={true}
                        outlineColor={Colors.grey20}
                        marginR-16
                        color={Colors.grey20}
                        labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                        onPress={manageHabitStacks}
                     />
                  )} */}

                  {/* <Button
                     iconSource={Assets.icons.ic_add_16}
                     label={"JOIN"}
                     outline={true}
                     outlineColor={Colors.grey20}
                     color={Colors.grey20}
                     labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                     onPress={() => {
                        navigate(Routes.JoinChallenges);
                     }}
                  /> */}
               </ScrollView>
            )}

            <Box style={{ marginTop: 16 }}>
               <View row>
                  <View>
                  {userToDisplay?.picture?.uri && (
                    <TouchableOpacity onPress={goToEditProfile}><SmartImage
                        uri={userToDisplay?.picture?.uri || Assets.icons.avatar}
                        preview={userToDisplay?.picture?.preview || ''}
                        style={{
                           height: 60,
                           width: 60,
                           borderRadius: 80,
                           marginTop: 16,
                           marginBottom: 18,
                           marginLeft: 16,
                        }}
                     />
                     </TouchableOpacity>
                  )}
                      {currentUser?.feelings?.[todayDateKey] && (
                           <TouchableOpacity
                              onPress={changeMood}
                              style={{
                                 position: 'absolute',
                                 right: -7,
                                 backgroundColor: '#fff',
                                 borderRadius: 20,
                                 // height: 20,
                                 // width: 20,
                                 top: 8
                              }}>
                              <Text R18>
                                 {currentUser?.feelings?.[todayDateKey]?.emoji}
                              </Text>
                           </TouchableOpacity>
                        )}
                  </View>

                  <View paddingV-16 paddingL-16 flex centerV>
                     <Text R16 color6D>
                        Nickname
                     </Text>
                     <Text M18 color28 marginT-5>
                        {userToDisplay?.name}
                     </Text>
                  </View>
                  <View width={1} backgroundColor={Colors.line} />
                  <View paddingV-16 paddingL-16 flex centerV>
                     <Text R16 color6D>
                        City / Country
                     </Text>
                     {userToDisplay?.city ? (
                        <TouchableOpacity onPress={goToEditProfile}>
                           <Text M18 color28 marginT-5 buttonLink>
                              {userToDisplay?.city}
                              {/* {userToDisplay?.country?.substring(0, 10)} */}
                           </Text>
                        </TouchableOpacity>
                     ) : (
                        <TouchableOpacity onPress={goToEditProfile}>
                           <Text M18 color28 buttonLink marginT-5>
                              What City?
                           </Text>
                        </TouchableOpacity>
                     )}
                  </View>
               </View>
            </Box>
            <ButtonLinear
               title="Share My Profile Link"
               onPress={shareProfile}
               bordered
            />

{/* <ButtonLinear
               title="getPreviousMVPs"
               onPress={()=>getPreviousMVPs('o7UwAXTUpAztRdnMrcOx')}
               bordered
            /> */}


            {currentUser?.superUser && (
               <ButtonLinear
                  title={'Help User Chats (' + chats.length + ')'}
                  onPress={goToUserHelpChats}
                  bordered
                  color={'#aaa'}
                  style={{ marginTop: 16 }}
               />
            )}

            {/* {currentUser?.superUser && (
               <ButtonLinear
                  title={'All Users'}
                  onPress={goToAllUsers}
                  bordered
                  color={'#aaa'}
                  style={{ marginTop: 16 }}
               />
            )} */}

            {currentUser?.superUser && false && (
               <ButtonLinear
                  title={'Go To Custom Notifications'}
                  onPress={goToCustomNotifications}
                  bordered
                  color={'#aaa'}
                  style={{ marginTop: 16 }}
               />
            )}

            {currentUser?.superUser && (
               <ButtonLinear
                  title={'Go To Admin Screen'}
                  onPress={goToAdminScreen}
                  bordered
                  color={'#aaa'}
                  style={{ marginTop: 16 }}
               />
            )}


{currentUser?.superUser && (
               <ButtonLinear
                  title={'Clear Asnyc'}
                  onPress={clearAllAsyncStorage}
                  bordered
                  color={'#aaa'}
                  style={{ marginTop: 16 }}
               />
            )}



            <View style={{ height: 16 }} />
            <Box>
               <View row>
                  <TouchableOpacity
                     paddingV-16
                     paddingL-16
                     flex
                     onPress={goToUserChallenges}>
                     <Text R16 color6D>
                        Challenges
                     </Text>
                     <Text M36 color28 marginR-16>
                        {numberOfChallenges}
                        <Text R18 color28></Text>
                     </Text>
                  </TouchableOpacity>
                  <View width={1} backgroundColor={Colors.line} />
                  <View paddingV-16 paddingL-16 flex>
                     <TouchableOpacity onPress={goToFollowing}>
                        <Text R16 color6D>
                           Following
                        </Text>
                        <View row centerV>
                           <Text M36 color28 marginR-16>
                              {userToDisplay?.following?.length || 0}
                              <Text R18 color28></Text>
                           </Text>

                           {/* <Image source={Assets.icons.graph} /> */}
                        </View>
                     </TouchableOpacity>
                  </View>

                  <View width={1} backgroundColor={Colors.line} />
                  <View paddingV-16 paddingL-16 flex>
                     <TouchableOpacity onPress={goToFollowers}>
                        <Text R16 color6D>
                           Followers
                        </Text>
                        <View row centerV>
                           <Text M36 color28 marginR-16>
                              {userToDisplay?.followers?.length || 0}
                              <Text R18 color28></Text>
                           </Text>
                        </View>
                     </TouchableOpacity>
                  </View>
               </View>
            </Box>

            <StreakBadgesHighlight user={userToDisplay} />

            {!isMe && (
               <Button
                  outline={isFollowing}
                  marginH-16
                  marginB-16
                  onPress={() => toggleFollowUnfollow(userToDisplay?.uid)}>
                  <Text white={!isFollowing}>
                     {isFollowing ? 'Following' : 'Follow'}
                  </Text>
               </Button>
            )}

            {true && (
               <Box>
                  <Text H14 color28 uppercase marginT-13 marginB-11 marginL-16>
                     {userToDisplay.name}
                  </Text>
                  <View height={1} backgroundColor={Colors.line} />
                  {DATA.map((item, index) => {
                     return (
                        <React.Fragment key={index}>
                           <TouchableOpacity
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 padding: 16,
                              }}
                              onPress={item.onPress}>
                              <Image
                                 source={item.icon}
                                 style={{
                                    width: 32,
                                    height: 32,
                                 }}
                              />
                              <Text M16 color28 marginL-16>
                                 {item.title}
                              </Text>
                           </TouchableOpacity>
                           <View height={1} backgroundColor={Colors.line} />
                        </React.Fragment>
                     );
                  })}
               </Box>
            )}

   <StreakRepairsCounts currentUser={currentUser} />
            {false && (
               <View paddingH-16>
                  <View row spread marginB-16>
                     <Text flex>Challenge</Text>
                     <Text flex>User</Text>
                     <Text flex>start</Text>
                     <Text flex>Dur</Text>
                     <Text flex>end</Text>
                  </View>
                  {allPlayerChallenges.map((p) => {
                     return (
                        <TouchableOpacity>
                           <View row spread>
                              <Text flex>
                                 {p?.challengeName?.substring(0, 7)}
                              </Text>
                              <Text flex>{p?.user?.name?.substring(0, 3)}</Text>
                              <Text flex>{p?.startDateKey}</Text>
                              <Text flex>{p?.duration}</Text>
                              <Text flex>{p.endDateKey}</Text>
                           </View>
                        </TouchableOpacity>
                     );
                  })}
               </View>
            )}

            <Insights />
            <Subscribe/>
            {/* <PlayerToday focusUser={currentUser} /> */}
         </ScrollView>
      </View>
   );
};

export default inject('smashStore', 'challengesStore')(observer(MyProfile));

const styles = StyleSheet.create({
  btnLinear: {
    width: 32,
    height: 32,
    marginHorizontal: 0,
    alignSelf: 'center',
  },
  linear: {
    paddingHorizontal: 0,
  },
  txtLinear: {
    fontSize: 15,
    fontFamily: FONTS.heavy,
  },
  btnDay: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
