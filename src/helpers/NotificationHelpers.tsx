import { View, Text } from 'react-native';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { moment } from 'helpers/generalHelpers';;
// import firebase from 'firebase';
// import Firebase from 'config/Firebase';
import firebaseInstance from 'config/Firebase';
import { sendNotification } from 'services/NotificationsService';
import { createCelebrationDoc } from 'helpers/CelebrationHelpers';
import { kFormatter } from 'utils/common';
import { challengeDaysSmashed } from './dateHelpers';
const endMonthKey = moment().endOf('month').format('DDMMYYYY');
const month = moment().format('MMMM');

import {
   collection, query, where, onSnapshot, getDocs, getDoc, increment, arrayRemove,
   doc,
   setDoc,
   writeBatch
} from 'firebase/firestore';

const firestore = firebaseInstance.firestore;




export const combinedTeamNotification = async (
   team,
   completion,
   weeklyActivity,
   pointsToAdd,
   currentUser
 ) => {
   if (!(team.masterIds || [])?.includes(completion?.activityMasterId)) {
     return;
   }
 
   const { name: teamName, joined } = team;
   const { myTargetToday, myScoreToday } = weeklyActivity;
   const smasherUserId = completion?.uid;
   const dayKey = completion?.dayKey;
   const { daily = {} } = weeklyActivity;
   const players = daily?.[dayKey]?.players || {};
 
   const myNewScore = myScoreToday + parseInt(pointsToAdd);
 
   const userSmashesDailyTarget =
     myScoreToday < myTargetToday &&
     myScoreToday + parseInt(pointsToAdd) >= myTargetToday;
 
   const teamWeekTarget = parseInt(team.mostRecentTarget);
   const teamWeekScore = parseInt(weeklyActivity.score);
 
   const userSmashesTeamWeeklyTarget =
     teamWeekScore < teamWeekTarget &&
     teamWeekScore + parseInt(pointsToAdd) >= teamWeekTarget;
 
   const notifications = [];
   const celebrations = [];

   for (const uid of joined) {
      const isMe = uid == smasherUserId;
      const userDocRef = doc(firestore, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data();
      const { expoPushToken } = userData || {};
  
      if (expoPushToken) {
        let messageTitle = '';
        let messageBody = '';
  
        if (userSmashesDailyTarget) {
          messageTitle = isMe
            ? 'Nice! You smashed your Daily Target!'
            : `${completion?.user?.name || 'noname'} smashed their Daily Target!`;
          messageBody = `${teamName || 'no team name'}`;
        } else if (userSmashesTeamWeeklyTarget) {
          messageTitle = `${
            completion?.user?.name || 'noname'
          } with the Week Winning Shot!!`;
          messageBody = `Team Target Smashed!! - ${team.name || 'no team name'}`;
        } else {
          const teamMemberScore = players[uid]?.score || 0;
          const overTaken =
            myScoreToday < teamMemberScore && myNewScore > teamMemberScore;
  
          if (overTaken) {
            messageTitle = isMe
              ? `Nice! You just overtook ${userData.name || 'noname'}!`
              : `🏆 ${completion?.user?.name || 'noname'} Overtook you today!!`;
            messageBody = `${currentUser.name}'s ${
              getRandomMessage()
            } in Team ${team.name || 'no team name'}`;
          }
        }
  
        if (messageTitle && messageBody) {
          const body = {
            to: expoPushToken,
            sound: 'default',
            title: messageTitle,
            body: messageBody,
          };
          notifications.push(sendNotification(body));
        }
      }

      if (isMe && userSmashesDailyTarget) {
         const celebration = {
           name: teamName,
           type: 'personal',
           timestamp: completion.timestamp,
           active: true,
           uid: smasherUserId,
           title: 'Daily Target Smashed!!',
           subtitle:
             'Spend the rest of your day as a champion or help your team.',
         };
         celebrations.push(createCelebrationDoc(celebration));
       } else if (isMe && userSmashesTeamWeeklyTarget) {
         const celebration = {
           name: team.name,
           type: 'teamweek',
           timestamp: completion.timestamp,
           active: true,
           uid: smasherUserId,
           title: `Woohoo! ${team.name} Team Weekly Target Smashed!`,
           subtitle: `${
             completion?.user?.name || 'Someone'
           } smashed the winning team shot for the week! Rest as champions or go for a weekly high score!`,
         };
         celebrations.push(createCelebrationDoc(celebration));
       }
     }
   
     await Promise.all([...notifications, ...celebrations]);
   };
   
  
export const teamNotificationOnSmashDailyTargetComplete = async (
   team,
   completion,
   weeklyActivity,
   pointsToAdd,
 ) => {
   if (!(team.masterIds || [])?.includes(completion?.activityMasterId)) {
     return;
   }
   
   
   const { name: teamName, joined } = team;
   const { myTargetToday, myScoreToday } = weeklyActivity;
   const userSmashesDailyTarget =
     myScoreToday < myTargetToday &&
     myScoreToday + parseInt(pointsToAdd) >= myTargetToday;
 
   if (!userSmashesDailyTarget) {
     return;
   }
 
   const smasherUserId = completion?.uid;
   const notifications = [];
 
   for (const uid of joined) {
     const isMe = uid == smasherUserId;
     const userDocRef = doc(firestore, 'users', uid);
     const userSnap = await getDoc(userDocRef);
     const userData = userSnap.data();
     const { expoPushToken } = userData || {};
 
     if (expoPushToken) {
       const messageTitle = isMe ? 'Nice! You smashed your Daily Target!' : `${completion?.user?.name || 'noname'} smashed their Daily Target!`;
       const body = {
         to: expoPushToken,
         sound: 'default',
         title: messageTitle,
         subtitle: `${teamName || 'no team name'}`,
       };
       notifications.push(sendNotification(body));
     }
 
     if (isMe) {
       const celebration = {
         name: teamName,
         type: 'personal',
         timestamp: completion.timestamp,
         active: true,
         uid: smasherUserId,
         title: 'Daily Target Smashed!!',
         subtitle: 'Spend the rest of your day as a champion or help your team.',
       };
       createCelebrationDoc(celebration);
     }
   }
 
   await Promise.all(notifications);
 };
 

 export const teamNotificationOnSmashDailyTeamTargetComplete = async (
   team,
   completion,
   weeklyActivity,
   pointsToAdd,
) => {
   if (!(team.masterIds || [])?.includes(completion?.activityMasterId)) {
      return;
   }
   const teamName = team.name;

   const teamTargetToday = parseInt(weeklyActivity.teamTargetToday);
   const teamTodayScore = parseInt(weeklyActivity.teamTodayScore);

   let celebration = {};

   const userSmashesTeamDailyTarget =
      teamTodayScore < teamTargetToday &&
      teamTodayScore + parseInt(pointsToAdd) >= teamTargetToday;

   if (!userSmashesTeamDailyTarget) {
      return;
   }

   const smasherUserId = completion?.uid;

   const userPromises = team.joined.map(async (uid) => {
      const isMe = uid == smasherUserId;

      const userDocRef = doc(firestore, "users", uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data();

      if (userData.expoPushToken) {
         let messageTitle = `${
            completion?.user?.name || 'noname'
         } with the Winning Shot!`;

         if (uid == smasherUserId) {
            messageTitle = `${'Nice! You'} got the Winning Shot!`;

            celebration = {
               name: team.name,
               type: 'team',
               timestamp: completion.timestamp,
               active: true,
               team: true,
               uid: smasherUserId,
               title: 'Woohoo! ' + team.name + ' Team Daily Target Smashed!',
               subtitle: `You smashed the winning team shot for the day! Rest as champions today or go for a high score!`,
            };
         } else {
            celebration = {
               name: team.name,
               type: 'team',
               timestamp: completion.timestamp,
               active: true,
               team: true,
               uid: smasherUserId,
               title: 'Woohoo! ' + team.name + ' Team Daily Target Smashed!',
               subtitle: `${
                  completion?.user?.name || 'Someone'
               } with the winning team shot for the day! Rest as champions today or go for a high score!`,
            };
         }
         const body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: messageTitle,
            subtitle: `Team Target Smashed!! - ${team.name || 'no team name'}`,
         };

         if (celebration.active) {
            createCelebrationDoc(celebration);
         }
         // !userData.followingNotificationsDisabled &&
         sendNotification(body);
      }
   });

   await Promise.all(userPromises);
};


export const teamNotificationOnSmashWeeklyTeamTargetComplete = async (
   team,
   completion,
   weeklyActivity,
   pointsToAdd
 ) => {
   if (!(team.masterIds?.includes(completion?.activityMasterId))) {
     return;
   }
 
   const teamWeekTarget = parseInt(team.mostRecentTarget);
   const teamWeekScore = parseInt(weeklyActivity.score);
 
   const userSmashesTeamWeeklyTarget =
     teamWeekScore < teamWeekTarget &&
     teamWeekScore + parseInt(pointsToAdd) >= teamWeekTarget;
 
   if (!userSmashesTeamWeeklyTarget) {
     return;
   }
 
   const smasherUserId = completion?.uid;
   const promises = team.joined.map(async (uid) => {
      const docRef = doc(collection(firestore, 'users'), uid);
      const userSnap = await getDoc(docRef);
      const userData = userSnap.data();
 
     if (userData?.expoPushToken) {
       const messageTitle = `${
         completion?.user?.name || 'noname'
       } with the Week Winning Shot!!`;
 
       const celebration = {
         name: team.name,
         type: 'teamweek',
         timestamp: completion.timestamp,
         active: true,
         uid: smasherUserId,
         title: `Woohoo! ${team.name} Team Weekly Target Smashed!`,
         subtitle: `${
           completion?.user?.name || 'Someone'
         } smashed the winning team shot for the week! Rest as champions or go for a weekly high score!`,
       };
 
       const body = {
         to: userData.expoPushToken,
         sound: 'default',
         title: messageTitle,
         subtitle: `Team Target Smashed!! - ${team.name || 'no team name'}`,
       };
 
       if (celebration.active) {
         createCelebrationDoc(celebration);
       }
 
       sendNotification(body);
     }
   });
 
   await Promise.all(promises);
 };
 

 // Add this function to calculate days on higher levels
 const getDaysOnHigherLevels = (playerChallenge, streakCount) => {

  if(parseInt(playerChallenge.selectedLevel) === 1) { return 0; }
  let daysOnHigherLevels = 0;
  let currentDate = moment();
  // Loop through streakCount days backwards
  for (let i = 0; i < streakCount; i++) {
    let dayKey = currentDate.format("DDMMYYYY");
    const dayData = playerChallenge.daily[dayKey];

    const isToday = moment(dayKey, 'DDMMYYYY').isSame(moment(), 'day')

    // Check if the user was at the selected level or higher on that day and met the goal
    if (
      dayData &&
      playerChallenge.selectedLevel > 1 &&
      dayData.selectedLevel >= playerChallenge.selectedLevel &&
      ((playerChallenge.targetType === "score" &&
        dayData.score >= playerChallenge.dailyTargets[dayData.selectedLevel]) ||
        (playerChallenge.targetType === "qty" &&
          dayData.qty >= playerChallenge.dailyTargets[dayData.selectedLevel]))
     || isToday) {
      daysOnHigherLevels++;
    }

    // Move to the previous day
    currentDate.subtract(1, 'days');
  }

  return daysOnHigherLevels;
};

const levelLabels = ['Beginner', 'Expert', 'Guru'];
export const challengeNotificationOnSmashDailyTargetComplete = async (
  playerChallenge,
  completion,
  pointsEarned,
  followers,
) => {
  const isQty = playerChallenge?.targetType == 'qty';
  const levelLabel = levelLabels[(playerChallenge?.selectedLevel - 1) || 0]
  const pointsToAdd = isQty
    ? parseInt(completion?.multiplier || 0)
    : parseInt(pointsEarned || 0);

    const selectedTodayScore = playerChallenge?.selectedTodayScore || 0;
    const selectedTodayTarget = playerChallenge?.selectedTodayTarget || 0;

    console.log('selectedTodayScore',selectedTodayScore,selectedTodayTarget)

    const newToAdd = isQty ? parseInt(completion?.multiplier || 0) : parseInt(pointsEarned || 0);

    const todayPlusNewScore = parseInt(selectedTodayScore) + newToAdd 

    const isJustSmashed = todayPlusNewScore >= parseInt(selectedTodayTarget) && parseInt(selectedTodayScore) < parseInt(selectedTodayTarget);
  
    if(!isJustSmashed) { return; }
    
  const challengeName = playerChallenge.challengeName;
  const myTargetToday = parseInt(playerChallenge.selectedTodayTarget || 0);
  const myScoreToday = parseInt(playerChallenge.selectedTodayScore || 0);

  const numberOfDaysSmashed = challengeDaysSmashed(playerChallenge) || 0;

  const userHasSmashedAllPreviousDays =
    numberOfDaysSmashed == parseInt(playerChallenge.duration) - 1;

  const userSmashedDailyTargetYesterday =
    myScoreToday < myTargetToday && myScoreToday + pointsToAdd >= myTargetToday;

  let userEarnsChallengeBadge = userSmashedDailyTargetYesterday && userHasSmashedAllPreviousDays;

  const streakRef = doc(
    firestore,
    'challengeStreaks',
    `${firebaseInstance?.auth?.currentUser?.uid}_${playerChallenge.challengeId}`
  );
  const streakSnap = await getDoc(streakRef);
  const streakDoc = streakSnap.data() || { onGoingStreak: 0 };

  let streakCount = 0;
let resetStreakCount = false;
  if (!userSmashedDailyTargetYesterday) {
    resetStreakCount = true
  }

  const smasherUserId = completion?.uid;

  const promises = [];



const challengeId = playerChallenge.challengeId || '';

  for (const uid of [...followers, firebaseInstance.auth.currentUser.uid]) {

    let higherLevelMessage = '';
    promises.push(
      (async () => {
        if (uid == smasherUserId) {
          streakCount = resetStreakCount ? 1 : (streakDoc.onGoingStreak || 0) + 1;
          const higherLevelDays = getDaysOnHigherLevels(playerChallenge, streakCount);

          const daysText = higherLevelDays > 1 ? 'days' : 'day';

           higherLevelMessage = higherLevelDays > 0 ? `🏆 You also smashed ${higherLevelDays} ${levelLabel} level ${daysText}!` : '';
          const celebration = {
            name: challengeName,
            type: 'challenge',
            timestamp: completion.timestamp,
            active: true,
            title: 'You Smashed your ' + challengeName + ' Daily Target!',
            subtitle: `Rest for the day or do some more to be even more epic! ${higherLevelMessage}`,
            uid: smasherUserId,
          };
          createCelebrationDoc(celebration);
        }

        const docRef = doc(collection(firestore, 'users'), uid);
        const userSnap = await getDoc(docRef);
        const userData = userSnap.data();

        if (!userData || !userData.expoPushToken || !userData?.inChallengeMap[challengeId]) {
          return;
        }


        const higherLevelDays = getDaysOnHigherLevels(playerChallenge, streakCount);

        const daysText = higherLevelDays > 1 ? 'days' : 'day';
        
         higherLevelMessage = (higherLevelDays > 0 && parseInt(playerChallenge?.selectedLevel) > 1) ? `🏆 They also smashed ${higherLevelDays} ${levelLabel} level ${daysText}!` : '';


        const messageTitle = `🏆 ${completion?.user?.name || 'noname'} Smashed Today's Challenge Goal!`;
        const messageBody = `${challengeName || 'no challenge name'} day goal smashed! ${
          streakCount > 1 ? "Plus you're on a " + streakCount + ' day winning streak!' : ''
        }`;


        const plusMessageForOthers = `Plus they're on a ${streakCount} day winning streak!`
        const body = {
          to: userData.expoPushToken,
          sound: 'default',
          title: uid == smasherUserId ? 'Day Target Smashed! 🚀🚀' : messageTitle,
          body: uid == smasherUserId ? `${messageBody} ${higherLevelMessage}` : `${challengeName || 'no challenge name'} day goal smashed!${streakCount > 1 ? ' ' + plusMessageForOthers : ' '}${higherLevelMessage}`,
          //  data: {postId: completion.id}
        };

        await sendNotification(body);
      })(),
    );
    }
    await Promise.all(promises);
    };
 


export const getRandomMessage = () => {
   const randomIndex = Math.floor(Math.random() * messages.length);
   return messages[randomIndex];
}

const messages = ["on fire!", "setting the leaderboard ablaze!", "heating up the competition!", "leaving the rest in the dust!", "dominating the game!", "crushing the competition!", "taking the lead by storm!", "burning up the leaderboard!", "leading the pack!", "ahead of the game!", "winning the race!", "out in front!", "ahead of the pack!", "leading the way!", "on top of the leaderboard!", "making a strong showing!", "showing the competition who's boss!", "taking the lead!", "on a roll!"];

export const notifyTeamMemberIfOvertaken = async (
   team,
   completion,
   weeklyActivity,
   pointsToAdd,
   currentUser
) => {
   if (!(team.masterIds || [])?.includes(completion?.activityMasterId)) {
      return;
   }

   const bragLine = getRandomMessage();
   const dayKey = completion?.dayKey;
   const { daily = {} } = weeklyActivity;

   const players = daily?.[dayKey]?.players || {};
   const myScoreToday = parseInt(weeklyActivity.myScoreToday);

   const myNewScore = myScoreToday + parseInt(pointsToAdd);

   const smasherUserId = completion?.uid;
   team.joined.forEach(async (uid) => {
      const isMe = uid == smasherUserId;

      const docRef = doc(collection(firestore, 'users'), uid);
      const userSnap = await getDoc(docRef);
      const userData = userSnap.data();

      const teamMemberScore = players[uid]?.score || 0;

      const overTaken =
         myScoreToday < teamMemberScore && myNewScore > teamMemberScore;

      if (!overTaken) {
         return;
      }

      if (userData.expoPushToken) {
         let messageTitle = `🏆 ${
            completion?.user?.name || 'noname'
         } Overtook you today!!`;

         if (uid == smasherUserId) {
            messageTitle = `${'Nice! You'} just overtook ${
               userData.name || 'noname'
            }!`;
         }
         const body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: messageTitle,
            body: `${currentUser.name }'s ${bragLine} in Team ${team.name || 'no team name'}`,
         };

         // !userData?.followingNotificationsDisabled &&
         sendNotification(body);
      }
   });
};



export const notifyFollowersIfIHaveOvertaken = async (
   playerChallenge,
   completion,
   pointsEarned,
   followers,
) => {
   let celebration = {};
   const isQty = playerChallenge?.targetType == 'qty';


   const challengeName = playerChallenge.challengeName;



   const smasherUserId = completion?.uid;

   [...followers, firebaseInstance.auth.currentUser.uid].forEach(async (uid) => {



      const isMe = uid == smasherUserId;
      if (isMe) return 

      const docRef = doc(collection(firestore, 'users'), uid);
      const userSnap = await getDoc(docRef);
      const userData = userSnap.data();


    const querySnapshot = await query(
      collection(firestore, 'playerChallenges'),
      where('uid', '==', uid),
      where('active', '==', true)
);
if (querySnapshot.empty) {
  return;
}
const playerChallengeSnaps = querySnapshot.docs;

      let messageTitle = `🏆 ${completion?.user?.name || 'noname'
         } has overtaken you!`;

      let messageBody = `${challengeName || 'no challenge name'} day goal smashed!`


      const body = {
         to: userData.expoPushToken,

         sound: 'default',
         title: messageTitle,
         body: messageBody,
      };



      if (userData.expoPushToken) {
         // !userData.followingNotificationsDisabled &&
         sendNotification(body);
      }
   });
};

export const userJoinedChallengeNotification = async (challenge, user) => {
   const challengeId = challenge?.id || false;
   const challengeName = challenge?.name || 'noname';
   const { followers = [] } = user;
   // console.warn('followersx', followers, challengeId);
   [...followers].forEach(async (uid) => {
   
      
      const docRef = doc(collection(firestore, 'users'), uid);
      const userSnap = await getDoc(docRef);
      const userData = userSnap.data();


      if (!userData?.inChallengeMap?.[challengeId]) {
         return;
      }

      if (userData.expoPushToken) {
         let messageTitle = `${
            user?.name || 'noname'
         } joined ${challengeName}!`;

         const body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: messageTitle,
            subtitle: `Lessgo!`,
         };

         // !userData.followingNotificationsDisabled &&
         sendNotification(body);
      }
   });
};