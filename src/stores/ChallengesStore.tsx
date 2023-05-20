import { action, observable, computed, makeObservable, runInAction } from 'mobx';
// import Firebase from '../config/Firebase';
import { moment } from 'helpers/generalHelpers';;
// import firebase from 'firebase';
import { inject } from 'mobx-react';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { userJoinedChallengeNotification } from 'helpers/NotificationHelpers';

import {
   collection, query, where, onSnapshot, getDocs, getDoc, increment, arrayRemove,
   arrayUnion, getFirestore, orderBy,
   doc,
   setDoc,
   writeBatch,
   updateDoc,
   serverTimestamp
} from 'firebase/firestore';

import firebaseInstance from '../config/Firebase';
const firestore = firebaseInstance.firestore;
import {
   updateSelectedOption,
   VOTING_OPTIONS_TYPE,
} from 'helpers/VotingHelper';
import { makePersistable } from 'mobx-persist-store'
import { dayNumberOfChallenge, goalDateEnding, todayDateKey } from 'helpers/dateHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Share } from 'react-native';
class ChallengesStore {
   notificatonStore;

   @observable _playerChallengesLastUpdated = 0;
   @observable _challengeGoalIsBasedOn = false;
   @observable _challenges = [];
   @observable _myChallenges = [];
   @observable _goals = [];
   @observable _myPlayerChallengesFullHash = {};
   @observable _playerChallengeDoc = {};
   @observable _myChallengesHash = {};
   @observable _insightsPlayerChallengeDoc = false;
   @observable _playerChallengeHashByChallengeId = {};
   @observable _myFinishedChallenges = [];
   @observable _teamChallenges = {};
   @observable _subscribeModal = false;
   @observable _celebrationModal = false;
   @observable _isVoteDialogVisible = false;
   @observable _celebratePlayAgain = false;
   @observable _challengesHash = {};
   @observable _challengesArray = [];
   @observable _challengeToJoin = false;
   @observable _currentChallenge = {};
   @observable _streaksHash = {};
   @observable _alreadySubbedTo = {}
   @observable _goalToShare = false;
   @observable _showCreateGoalModal = false;
   @observable showStreakRepairModal = false;
   @observable selectedPlayerChallenge = null;
   @observable _myGoals = [];
   @observable _itemsToCelebrate = [
      {
         name: 'Epic Team',
         title: 'Woohoo!! You Smashed Your Daily Target!',
         subtitle:
            "Spend the rest of your day as a champion. Don't forget to check if your team needs help to hit the team target.",
      },
      {
         name: 'Legend Team',
         title: 'Woohoo!! Team Daily Target Smashed!',
         team: true,
         subtitle:
            'Goku with the winning shot! Rest as champions today or go for a high score!',
         colors: ['purple', 'black'],
      },
   ];


   constructor(notificatonStore) {
      this.notificatonStore = notificatonStore;

      this.unsub = [];
      makeObservable(this);
      makePersistable(this, { name: 'ChallengesStore2', properties: ['_goals', '_myGoals', '_streaksHash', '_challengesArray', '_myChallengesHash', '_myChallenges', '_myPlayerChallengesFullHash', '_challenges'], storage: AsyncStorage }, { delay: 500, fireImmediately: false });
   }

   @action.bound
   openStreakRepairModal(playerChallenge) {
      this.selectedPlayerChallenge = playerChallenge;
      this.showStreakRepairModal = true;
   }

   @action.bound
   closeStreakRepairModal() {
      this.showStreakRepairModal = false;
   }

   @computed get subscribeModal() {
      return this._subscribeModal;
   }
   set subscribeModal(subscribeModal) {
      this._subscribeModal = subscribeModal;
   }


   // getter and setter for showCreateGoalModal
   @computed get showCreateGoalModal() {
      return this._showCreateGoalModal;
   }
   set showCreateGoalModal(showCreateGoalModal) {
      this._showCreateGoalModal = showCreateGoalModal;
   }


   @computed get myGoals() {
      return this._myGoals;
   }
   // set myGoals(myGoals) {
   //    this._myGoals = myGoals;
   // }

   set myGoals(myGoalsArray) {


      this._myGoals = myGoalsArray.map((newGoal, index) => {
         const currentGoal = this._myGoals?.[index];
         if (currentGoal && currentGoal?.id === newGoal?.id && parseInt(currentGoal?.updatedAt) !== newGoal?.updatedAt) {
            console.log('new newMyGoal object', newGoal.goalName, currentGoal?.updatedAt, newGoal?.updatedAt);
            return newGoal;
         }

         console.log('same challenge obj');
         return currentGoal || newGoal;
      });
   }

   @computed get playerGoalHashByGoalId() {


      const hash = {}

      this.myGoals.forEach((goal) => { hash[goal?.goalId] = goal });

      return hash
   }


   @computed get goalHashByGoalId() {

      const hash = {}
      this.goals.forEach((goal) => { hash[goal?.id] = goal });

      return hash
   }

   @computed get playerGoalsHashByGoalId() {

      const hash = {}
      this.myGoals.forEach((goal) => { hash[goal?.goalId] = goal });

      return hash
   }

   // function to set showCreateGoalModal to true
   @action.bound
   setGoalModal(goal) {
      this.showCreateGoalModal = goal ? true : false;
   }


   @computed get currentChallenge() {
      return this._currentChallenge;
   }
   set currentChallenge(currentChallenge) {
      this._currentChallenge = currentChallenge;
   }

   @action.bound
   setCurrentChallenge(challenge) {

      this._currentChallenge = challenge;
   }

   @computed get challengeToJoin() {
      return this._challengeToJoin;
   }
   set challengeToJoin(challengeToJoin) {
      this._challengeToJoin = challengeToJoin;
   }

   @computed get challengeGoalIsBasedOn() {
      return this._challengeGoalIsBasedOn;
   }
   set challengeGoalIsBasedOn(challengeGoalIsBasedOn) {
      this._challengeGoalIsBasedOn = challengeGoalIsBasedOn;
   }





   @computed get streaksHash() {
      return this._streaksHash;
   }
   set streaksHash(streaksHash) {
      this._streaksHash = streaksHash;
   }

   @action.bound
   setStreak(streak) {


      if (!streak.id) return;
      console.log('set streak in streaksHash', streak.challengeName)
      this.streaksHash[streak.id] = streak;
   }

   @action.bound
   setChallengeToJoin(challenge) {
      this.challengeToJoin = challenge;
   }
   @computed get itemsToCelebrate() {
      return this._itemsToCelebrate;
   }
   set itemsToCelebrate(itemsToCelebrate) {
      this._itemsToCelebrate = itemsToCelebrate;
   }


   @computed get goals() {
      return this._goals;
   }
   set goals(goals) {
      this._goals = goals;
   }

   // set goals(goalsArray) {


   //    this._goals = goalsArray.map((newGoal, index) => {
   //      const currentGoal = this._goals?.[index];
   //      if (currentGoal && currentGoal?.id === newGoal?.id && parseInt(currentGoal?.updatedAt) !== newGoal?.updatedAt) {
   //       console.log('new newGoal object',newGoal.name,currentGoal?.updatedAt, newGoal?.updatedAt);
   //       return newGoal;
   //      }

   //      console.log('same goal obj');
   //      return currentGoal || newGoal;
   //    });
   //  }


   @computed get challengesArray() {
      return this._challengesArray;
   }
   set challengesArray(challengesArray) {
      this._challengesArray = challengesArray;
   }


   @computed get goalToShare() {
      return this._goalToShare;
   }
   set goalToShare(goalToShare) {
      this._goalToShare = goalToShare;
   }


   @action.bound
   setGoalToShare(goal) {
      this.goalToShare = goal;
   }

   @action.bound
   setChallengeGoalIsBasedOn(challenge) {

      this.challengeGoalIsBasedOn = challenge;
   }

   @computed get challengesHash() {

      const hash = {}
      this.challengesArray.forEach((challenge) => { hash[challenge?.id] = challenge });

      return hash
   }
   // set challengesHash(challengesHash)
   //    this._challengesHash = challengesHash;
   // }

   @computed get alreadySubbedTo() {
      return this._alreadySubbedTo;
   }
   set alreadySubbedTo(alreadySubbedTo) {
      this._alreadySubbedTo = alreadySubbedTo;
   }


   @computed get todayDateKey() {
      const debug = false;
      const debugDateKey = '12072022';
      return debug
         ? debugDateKey
         : moment()
            // .subtract(1, 'days')
            .format('DDMMYYYY');

      // subtract(1, 'days').
   }

   @computed get playerChallengeDoc() {
      return this._playerChallengeDoc;
   }

   set playerChallengeDoc(playerChallengeDoc) {
      this._playerChallengeDoc = playerChallengeDoc;
   }

   @computed get insightsPlayerChallengeDoc() {
      return this._insightsPlayerChallengeDoc;
   }

   set insightsPlayerChallengeDoc(insightsPlayerChallengeDoc) {
      this._insightsPlayerChallengeDoc = insightsPlayerChallengeDoc;
   }

   @computed get celebratePlayAgain() {
      return this._celebratePlayAgain;
   }

   set celebratePlayAgain(celebratePlayAgain) {
      this._celebratePlayAgain = celebratePlayAgain;
   }

   @computed get playerChallengeHashByChallengeId() {

      let hash = {}
      this._myChallenges?.forEach((pc) => {

         hash[pc.challengeId] = pc;

      });

      return hash;
   }

   @action.bound
   replacePlayerChallengeInMyChallengesById(playerChallenge) {

   
     const index = this._myChallenges.findIndex((pc) => pc.id === playerChallenge.id);
     if (index === -1) return;
     this._myChallenges.splice(index, 1, playerChallenge);

     
   }

   // set playerChallengeHashByChallengeId(playerChallengeHashByChallengeId) {
   //    this._playerChallengeHashByChallengeId = playerChallengeHashByChallengeId;
   // }

   @computed get myChallengesHash() {
      return this._myChallengesHash;
   }

   set myChallengesHash(myChallengesHash) {
      this._myChallengesHash = myChallengesHash;
   }


   @computed get myFinishedChallenges() {
      return this._myFinishedChallenges;
   }

   set myFinishedChallenges(myFinishedChallenges) {
      this._myFinishedChallenges = myFinishedChallenges;
   }

   @computed get isVoteDialogVisible() {
      return this._isVoteDialogVisible;
   }

   set isVoteDialogVisible(isVoteDialogVisible) {
      this._isVoteDialogVisible = isVoteDialogVisible;
   }

   @computed get celebrationModal() {
      return this._celebrationModal;
   }

   set celebrationModal(celebrationModal) {
      this._celebrationModal = celebrationModal;
   }

   @computed get playersAroundMeInChallenges() {
      return this._playersAroundMeInChallenges;
   }

   set playersAroundMeInChallenges(playersAroundMeInChallenges) {
      this._playersAroundMeInChallenges = playersAroundMeInChallenges;
   }

   @action.bound
   setChallengesArray(array) {
      this.challengesArray = array;
   }

   async calculateAndRepairStreak(playerChallenge, dayKey = false) {

      return new Promise(async (resolve, reject) => {

         // Get challenge data
         const challenge = this?.challengesHash?.[playerChallenge.challengeId] || {};

         // Check if the target is a quantity or a score
         const isQty = challenge?.targetType == 'qty';

         // Get current server timestamp and player data
         const serverTimestamp = moment().unix();
         const uid = playerChallenge.uid;
         const challengeId = playerChallenge.challengeId;

         // Get player challenge and streak document references
         const playerChallengeDocRef = doc(firestore, "playerChallenges", `${playerChallenge.id}`);
         const streakDocRef = doc(firestore, "challengeStreaks", `${uid}_${challengeId}`);

         // Get the day to repair (either specified or yesterday)
         const dayToRepair = dayKey ? dayKey : moment().subtract(1, 'days').format('DDMMYYYY');

         // Get the player's selected challenge level (default to level 1 if not set)
         const selectedLevel = parseInt(playerChallenge.selectedLevel, 10) || 1;

         // Get the streak document and daily targets
         const streakDocSnapshot = await getDoc(streakDocRef);
         const streakDoc = streakDocSnapshot.data();
         const dailyTargets = challenge.dailyTargets || {};

         // Update the player challenge document with the repaired day score
         const dayUpdateData = isQty ? {
            qty: parseInt(dailyTargets?.[selectedLevel - 1]), target: parseInt(dailyTargets?.[selectedLevel - 1])
         } : { score: parseInt(dailyTargets?.[selectedLevel - 1]), target: parseInt(dailyTargets?.[selectedLevel - 1]) }

         await setDoc(playerChallengeDocRef, {
            daily: {
               [dayToRepair]: { ...dayUpdateData, repaired: true },

            },
            updatedAt: serverTimestamp,
         }, { merge: true });

         // Get the updated player challenge data
         const updatedPlayerChallengeSnapshot = await getDoc(playerChallengeDocRef);
         const updatedPlayerChallengeData = updatedPlayerChallengeSnapshot.data();

         // Calculate the ongoing streak
         let onGoingStreak = 0;
         let i = 0;
         let continueChecking = true;

         // Get today's key
         const todayKey = moment().format('DDMMYYYY');

         // Check if today's target has been met (if not, start from the day before)
         if ((updatedPlayerChallengeData?.daily?.[todayKey]?.score || 0) < dailyTargets?.[selectedLevel - 1]) {
            i = 1;
         }

         // Count completed days backwards to calculate ongoing streak
         while (continueChecking) {
            const dayKey = moment().subtract(i, 'days').format('DDMMYYYY');
            const dailyScore = isQty ? updatedPlayerChallengeData?.daily?.[dayKey]?.qty || 0 : updatedPlayerChallengeData?.daily?.[dayKey]?.score || 0;
            const target = updatedPlayerChallengeData?.daily?.[dayKey]?.target || playerChallenge.dailyTargets[selectedLevel - 1] || 0;

            // If the target was not met on a day, the streak is broken
            if (dailyScore < target && dayKey !== dayToRepair) {
               break;
            } else {
               onGoingStreak++;
               i++;
            }
         }

         // Update the streak document with the new ongoing streak and highest streak
         await setDoc(streakDocRef, {
            onGoingStreak: onGoingStreak,
            highestStreak: Math.max(onGoingStreak, streakDoc.highestStreak),
            updatedAt: serverTimestamp,
            lastUpdatedAt: serverTimestamp,

         }, { merge: true });

         // console.log('calculateAndRepairStreak: Fetching player challenges');
         this.fetchMyPlayerChallenges()

         // remove streakRepair count from user doc with increment(-1)
         const userDocRef = doc(firestore, "users", `${uid}`);
         await updateDoc(userDocRef, { streakRepairs: { [challengeId]: increment(-1), updatedAt: serverTimestamp } });



         resolve(onGoingStreak)

      });
   }




   async checkMyNewRank(playerChallenge, newPoints, newQty) {

      return new Promise((resolve, reject) => {


         const newDailyAverage =
            (parseInt(playerChallenge?.score) + 0) / dayNumberOfChallenge(playerChallenge);
         const dAverage = Math.ceil(newDailyAverage || 0);

         const newDailyAverageQty =
            (parseInt(playerChallenge?.qty) + 0) / dayNumberOfChallenge(playerChallenge);
         const dAverageQty = Math.ceil(newDailyAverageQty || 0);


         const { uid } = firebaseInstance.auth.currentUser;

         let dailyAvQuery;
         if (playerChallenge.targetType == 'score') {
            dailyAvQuery = query(collection(firestore, 'playerChallenges'),
               where('active', '==', true),
               where('followers', 'array-contains', uid),
               where('dailyAverage', '>', dAverage),
               where('challengeId', '==', playerChallenge.challengeId)
            );
         } else {
            dailyAvQuery = query(collection(firestore, 'playerChallenges'),
               where('active', '==', true),
               where('followers', 'array-contains', uid),
               where('dailyAverageQty', '>', dAverageQty),
               where('challengeId', '==', playerChallenge.challengeId)
            );
         }

         let peopleAheadNumber = 0
         dailyAvQuery.get().then((snaps) => {
            let peopleAheadOfMe = [];
            let usersAheadOfMe = [];

            if (!snaps.empty) {


               snaps.forEach((snap) => {
                  peopleAheadOfMe.push({
                     name: snap.data().user.name,
                     score: snap.data().score,
                  });
                  usersAheadOfMe.push(snap.data());
               });

               const size = snaps.size;

               peopleAheadNumber = peopleAheadOfMe.length + 1
               // challengesStore.setplayersAroundMeInChallenges(
               //    peopleAheadOfMe,
               //    playerChallenge.challengeId,
               // );
            } else {

            }
         });

         resolve(peopleAheadNumber)


      })

   }

   @action
   setplayersAroundMeInChallenges(players, challengeId) {
      this.playersAroundMeInChallenges[challengeId] = players || [];
   }

   // @computed get myChallengeRankByChallengeId() {
   //    const rankHash = this.playersAroundMeInChallenges;
   //    const newRankHash = {};
   //    Object.keys(rankHash).forEach((challengeId) => {
   //       newRankHash[challengeId] =
   //          parseInt(rankHash[challengeId]?.length + 1) || 1;
   //    });

   //    return newRankHash;
   // }

   @computed get challenges() {
      return this._challenges;
   }

   set challenges(challenges) {
      this._challenges = challenges;
   }

   @computed get numTeamChallengeTargetsCompletedToday() {
      return this.myChallengesFull.filter(
         (t) =>
            t.selectedTodayScore >= t.selectedTodayTarget &&
            t.challengeType == 'team',
      ).length;
   }

   @computed get numUserChallengeTargetsCompletedToday() {
      return Object.values(this.myChallengesFull).filter(
         (t) =>
            t.selectedTodayScore >= t.selectedTodayTarget &&
            t.challengeType != 'team',
      ).length;
   }

   @computed get numUserChallengeTargetsToday() {
      return Object.values(this.myChallenges).filter((t) => t.challengeType != 'team')
         .length;
   }

   @computed get numTeamChallengeTargetsToday() {
      return Object.values(this.myChallengesFull).filter((t) => t.challengeType == 'team')
         .length;
   }

   @computed get numChallenges() {
      return Object.values(this.myChallenges).length;
   }

   @computed get numCompletedChallenges() {
      return Object.values(this.myChallengesFull).filter(
         (c) => c.selectedScore > c.selectedTarget,
      ).length;
   }

   @computed get myPlayerChallengesFullHash() {

      // return this._myPlayerChallengesFullHash
      const hash = {};

      this.myChallengesFull.forEach((playerChallenge) => {
         hash[playerChallenge.id] = playerChallenge;
      });

      return hash;
   }

   // set myPlayerChallengesFullHash(myPlayerChallengesFullHash) {
   //    this._myPlayerChallengesFullHash = myPlayerChallengesFullHash;
   // }

   @computed get playerChallengeIds() {

      return this.myChallenges.map((p) => p.id);
   }


   @computed get playerChallengeIdsOrdered() {


      // let playerChallenges = [...this.myChallenges];
      // let filter = (c) => c.challengeType == 'user';
      //set playerChallengeIdsOrdered in AsyncStorage

      return this.myChallenges?.map((p) => { return p.id });
      // return playerChallenges.sort((a, b) => myPlayerChallengesFullHash?.[a.id]?.todayProgress - myPlayerChallengesFullHash?.[b.id]?.todayProgress).map((c) => c.id)
   }

   @action.bound
   checkIfPlayerChallengeTargetJustReached(playerChallengeId, completion) {
      const playerChallenge =
         this.myPlayerChallengesFullHash?.[playerChallengeId] || {};
      const scoreJustNow =
         playerChallenge.targetType == 'points'
            ? completion.points
            : completion?.multiplier;

      const selectedTodayScore = playerChallenge?.selectedTodayScore || 0;
      const selectedTodayTarget = playerChallenge?.selectedTodayTarget || 0;

      const userJustSmashedDailyChallengeTarget =
         selectedTodayScore > selectedTodayTarget &&
         selectedTodayScore - scoreJustNow < selectedTodayTarget;

      return userJustSmashedDailyChallengeTarget;
   }

   @action
   setChallenges(challenges: any[]) {
      this.challenges = challenges;
   }


   // set myChallenges(myChallenges) {
   //    this._myChallenges = myChallenges;

   // }

   set playerChallengesLastUpdated(playerChallengesLastUpdated) {
      this._playerChallengesLastUpdated = playerChallengesLastUpdated;
   }

   // getter and setter for playerChallengesLastUpdated
   @computed get playerChallengesLastUpdated() {
      return this._playerChallengesLastUpdated;
   }


   set myChallenges(newPlayerChallenges) {


      this._myChallenges = newPlayerChallenges.map((newChallenge, index) => {
         const currentChallenge = this._myChallenges?.[index];
         if (currentChallenge && currentChallenge?.id === newChallenge?.id && parseInt(currentChallenge?.updatedAt) !== newChallenge?.updatedAt) {
            console.log('new pChallenge object', newChallenge.challengeName, currentChallenge?.updatedAt, newChallenge?.updatedAt);
            return newChallenge;
         }

         console.log('same challenge obj');
         return currentChallenge || newChallenge;
      });
   }

   @computed get myChallenges() {
      return this._myChallenges;
   }

   @computed get playerChallenges() {
      return this.myChallenges.slice();
   }



   @computed get numChallengeTargetsToday() {

      return this.myChallenges?.length || 0;
   }

   @computed get myTodayIncompleteChallenges() {



      return this.playerChallenges?.filter((playerChallenge) => {

         const { dailyTargets = {}, selectedLevel = 1 } = playerChallenge;

         const selectedIndex = parseInt(selectedLevel) - 1 || 0;

         const score = playerChallenge?.targetType == 'points' ? (playerChallenge?.daily?.[this.todayDateKey]?.score || 0) : playerChallenge?.daily?.[this.todayDateKey]?.qty || 0;

         if (score < (playerChallenge?.daily?.[this.todayDateKey]?.target || dailyTargets?.[selectedIndex])) {

            return true;
         }
         if (score == 0) {

            return true
         }

      }
      )

   }

   @computed get myTodayCompletedChallenges() {



      return this.playerChallenges?.filter((playerChallenge) => {


         const { dailyTargets = {}, selectedLevel = 1 } = playerChallenge;
         const selectedIndex = parseInt(selectedLevel) - 1 || 0;
         const score = playerChallenge?.targetType == 'points' ? (playerChallenge?.daily?.[this.todayDateKey]?.score || 0) : (playerChallenge?.daily?.[this.todayDateKey]?.qty || 0)

         // console.log('playerChallenge?.daily?.[this.todayDateKey]?.target',(playerChallenge?.daily?.[this.todayDateKey]?.target || dailyTargets?.[selectedIndex]), score)
         return score >= (parseInt(playerChallenge?.daily?.[this.todayDateKey]?.target) || dailyTargets?.[selectedIndex]);
      }
      )

   }

   @computed get myChallengesFull() {
      return Object.values(this._myPlayerChallengesFullHash);
   }

   // set myChallengesFull(myChallengesFull) {
   //    this._myChallengesFull = myChallengesFull;
   // }


   @computed get myChallengesHashByChallengeId() {
      const challengeHash = {};

      this._myChallenges.forEach((playerChallenge) => {
         challengeHash[playerChallenge?.challengeId] = playerChallenge;
      });

      return challengeHash;
   }


   @action.bound
   updatePlayerChallengeDocInStore(playerChallenge) {

      // find the playerChallenge in the myChallenges array and update it with playerChallenge
      const playerChallengeIndex = this.myChallenges.findIndex(
         (p) => p.id == playerChallenge.id,
      );
      this.myChallenges[playerChallengeIndex] = playerChallenge;
   }



   @action.bound
   setMyPlayerChallengesHash(playerChallengeFull) {


      this.myPlayerChallengesFullHash[playerChallengeFull.id] = playerChallengeFull;
      this.playerChallengeHashByChallengeId[playerChallengeFull.challengeId] = playerChallengeFull;
   }

   @action.bound
   setAllMyPlayerChallengesHash(allPlayerChallengeFull, allPlayerChallengeHashByChallengeId) {

      return
      this.myPlayerChallengesFullHash = allPlayerChallengeFull
      this.playerChallengeHashByChallengeId = allPlayerChallengeHashByChallengeId;
   }


   @action.bound
   showSubscriptionModal(bool) {

      this.subscribeModal = bool
   }

   @action.bound
   setIsVoteDialogVisible(bool) {
      this.isVoteDialogVisible = bool;
   }

   @action.bound
   async setInsightsPlayerChallengeDoc(doc) {
      if (doc === false) {
         this.insightsPlayerChallengeDoc = doc;
      }
      if (doc === undefined) {
         return;
      }
      if (doc) {
         this.insightsPlayerChallengeDoc = doc;

         this.unsubscribeToInsightsPlayerChallengeDoc = onSnapshot(doc(firestore, "playerChallenges", doc.id), (snap) => {
            if (snap.exists()) {
               const docData = snap.data();
               this.insightsPlayerChallengeDoc = docData;
            }
         });
      } else {
         this.insightsPlayerChallengeDoc = doc;
         if (this.unsubscribeToInsightsPlayerChallengeDoc) {
            this.unsubscribeToInsightsPlayerChallengeDoc();
         }
      }
   }

   @action.bound
   async subscribeToPlayerChallengeDoc(docId) {

      const unsubscribeToChallengeDoc = await onSnapshot(
         doc(firestore, 'playerChallenges', docId),
         (snap) => {
            if (snap.exists()) {
               const doc = snap.data();
               this.playerChallengeDoc = doc;
            }
         }
      );

      return unsubscribeToChallengeDoc;
   }


   getEndDateKey(challenge) {
      const { duration } = challenge;

      let endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
      let endUnix = moment().endOf('isoWeek').unix();

      if (duration == 'weekly') {
         endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
         endUnix = moment().endOf('isoWeek').unix();
      }
      if (duration == 'monthly') {
         endDateKey = moment().endOf('month').format('DDMMYYYY');
         endUnix = moment().endOf('month').unix();
      }

      return endDateKey;
   }

   @action.bound
   getEndUnix(challenge) {
      const { duration } = challenge;

      let endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
      let endUnix = moment().endOf('isoWeek').unix();

      if (duration == 'weekly') {
         endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
         endUnix = moment().endOf('isoWeek').unix();
      }
      if (duration == 'monthly') {
         endDateKey = moment().endOf('month').format('DDMMYYYY');
         endUnix = moment().endOf('month').unix();
      }

      return endUnix;
   }

   getDaysLeft(challenge, plusText) {
      const { duration } = challenge;

      let endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
      let endUnix = moment().endOf('isoWeek').unix();

      if (duration == 'weekly') {
         endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
         endUnix = moment().endOf('isoWeek').unix();
      }
      if (duration == 'monthly') {
         endDateKey = moment().endOf('month').format('DDMMYYYY');
         endUnix = moment().endOf('month').unix();
      }

      var todaysdate = moment();
      const eventdate = moment(endDateKey, 'DDMMYYYY');

      const daysLeft = eventdate.diff(todaysdate, 'days') + 1;

      if (plusText) {
         return daysLeft == 1
            ? daysLeft + ' day left'
            : daysLeft + ' days left';
      } else {
         return daysLeft + 1;
      }
   }

   @computed get activePlayerChallengeDoc() {
      const { activePlayerChallengeDocId } = this;
      return this.myChallengesHash[activePlayerChallengeDocId] || false;
   }

   @action.bound
   getChallengeData(challenge) {
      const endDateKey = this.getEndDateKey(challenge);
      const daysLeft = this.getDaysLeft(challenge);
      const daysLeftWithText = this.getDaysLeft(challenge, true);

      const shortDateName =
         challenge.duration == 'monthly'
            ? moment().endOf('month').format('MMM')
            : moment().endOf('isoWeek').format('DD/MM');

      const startDateLabel =
         challenge.duration == 'monthly'
            ? moment().startOf('month').format('DD/MM/YYYY')
            : moment().endOf('isoWeek').format('DD/MM/YYYY');
      const endDateLabel =
         challenge.duration == 'monthly'
            ? moment().endOf('month').format('DD/MM/YYYY')
            : moment().endOf('isoWeek').format('DD/MM/YYYY');
      return {
         daysLeft: daysLeft, // days left number
         daysLeftWithText, // days left with text at the end
         endDateKey: endDateKey, // end date key DDMMYYYY
         numberOfActivities: challenge?.masterIds?.length, // number of masterIds added
         numberOfPlayers:
            challenge?.challengeTimeframes?.[endDateKey]?.playing || 0, // number
         shortDateName, // //Short String DD/MM
         startDateLabel,
         endDateLabel,
         ...challenge,
      };
   }

   @action.bound
   getGradients() {
      const pinkPurpleGradient = ['#C33764', '#1D2671'];
      const fitnessGradient = ['#192840', '#2440dd'];
      const greyGradient = ['#eee', '#ccc'];
      const goldGradient = ['gold', 'black'];

      return {
         pinkPurpleGradient,
         fitnessGradient,
         greyGradient,
         goldGradient,
      };
   }

   @action.bound
   getPlayerChallengeData(playerChallenge, level) {
      const targets = playerChallenge?.targets || false;
      const selectedLevel = level || playerChallenge?.selectedLevel || 1;
      const todayKey = this.todayDateKey;
      const selectedTarget = targets[selectedLevel] || 0;
      const startDateLabel =
         playerChallenge?.duration == 'monthly'
            ? moment().startOf('month').format('DD/MM/YYYY')
            : moment().endOf('isoWeek').format('DD/MM/YYYY');
      const endDateLabel =
         playerChallenge?.duration == 'monthly'
            ? moment().endOf('month').format('DD/MM/YYYY')
            : moment().endOf('isoWeek').format('DD/MM/YYYY');
      const selectedScore =
         playerChallenge?.targetType == 'qty'
            ? playerChallenge?.qty
            : playerChallenge?.score;
      const todayScore = parseInt(
         playerChallenge?.daily?.[todayKey]?.score || 0,
      );
      const todayQty = parseInt(playerChallenge?.daily?.[todayKey]?.qty || 0);
      const hasReachedTarget = selectedScore > selectedTarget;
      const durationLabel =
         playerChallenge?.duration == 'weekly' ? 'Weekly' : 'Monthly';
      const {
         pinkPurpleGradient,
         fitnessGradient,
         greyGradient,
         goldGradient,
      } = this.getGradients();
      const selectedIndex = selectedTarget ? selectedTarget - 1 : 0;
      let selectedGradient = fitnessGradient;
      if (selectedLevel == 2) {
         selectedGradient = pinkPurpleGradient;
      }
      if (selectedLevel == 3) {
         selectedGradient = goldGradient;
      }

      let progress = hasReachedTarget
         ? 100
         : (parseInt(selectedScore) / parseInt(selectedTarget)) * 100;
      return {
         selectedTarget,
         selectedScore,
         startDateLabel,
         endDateLabel,
         todayScore,
         todayQty,
         hasReachedTarget,
         progress,
         selectedGradient,
         durationLabel,
      };
   }

   // @action
   // loadPlayers(challengeData) {

   //     this.unsubscribeToPlayers = await Firebase.firestore.collection('playerChallenges').where('active', '==', true).where('endDateKey', '==', challengeData.endDateKey).where('challengeId', '==', challenge.id).orderBy("score", 'desc').onSnapshot((snaps) => {

   //         if (!snaps.empty) {

   //             const playersArray = []

   //             snaps.forEach((snap) => {

   //                 const challenge = snap.data();

   //                 playersArray.push(challenge)
   //             })

   //             this.playersByChallengeIdHash[challengeData.id] = playersArray;

   //         }

   //     })
   // }

   @action.bound
   clearStore() {
      this.myChallenges = [];
      this.myFinishedChallenges = [];
   }

   @action
   setActivePlayerChallengeDocId(doc) {
      this.activePlayerChallengeDocId = doc.id;
   }

   checkArrayOrderAndIds(array1, array2) {
      // If the arrays have different lengths, return true
      if (array1.length !== array2.length) {
         return true;
      }

      // Create a set of IDs from array1
      const idSet = new Set(array1.map((obj) => obj.id));

      // Check if any ID in array2 is not in the ID set
      return array2.some((obj) => !idSet.has(obj.id));
   }

   checkScoreDifference = (array1, array2, dateKey) => {
      // Check if the arrays have different lengths
      if (array1.length !== array2.length) {
         return true;
      }

      // Create a map of scores from array1
      const scoreMap = new Map(array1.map((obj) => [obj.id, obj.daily?.[dateKey]?.score ?? 0]));

      // Check if any score in array2 is different from the score in scoreMap
      return array2.some((obj) => {
         const score = obj.daily?.[dateKey]?.score ?? 0;
         return score !== scoreMap.get(obj.id);
      });
   }

   @action.bound
   async setMyChallengesInAsyncStorage() {
      await AsyncStorage.setItem('myChallenges', JSON?.stringify(this.myChallenges));

   }


   @action.bound
   async fetchChallenges() {


      const q = query(
         collection(firebaseInstance.firestore, 'challenges'),
         where('active', '==', true),
         where('new', '==', true)
      );


      const unsub = onSnapshot(q, (snaps) => {
         if (!snaps.empty) {
            const challengesArray = [];

            snaps.forEach((snap) => {
               const challenge = snap.data();
               challengesArray.push(challenge);
            });

            this.setChallengesArray(challengesArray);
         }
      });


      this.unsub.push(unsub);
   }

   @action.bound
   async fetchMyPlayerChallenges() {
      const uid = firebaseInstance?.auth?.currentUser?.uid;

      const q = query(
         collection(firestore, 'playerChallenges'),
         where('active', '==', true),
         where('uid', '==', uid),
         where('challengeType', '==', 'user'),
         where('dailyTargets', '!=', null)
      );

      const snaps = await getDocs(q);
      if (!snaps.empty) {
         const newChallengesArray = snaps.docs.map((doc) => {
            const data = doc.data();
            delete data.smashes;
            return data;
         });

         console.log('setting new challenges array');

         // Check if there's any change in length or updatedAt values
         if (newChallengesArray.length !== this._myChallenges.length ||
            !newChallengesArray.every((newChallenge, index) =>
               newChallenge.updatedAt === this._myChallenges[index]?.updatedAt)) {

            console.log('Set new challenges array in fetchMyPlayerChallenges');
            // Update the _myChallenges property directly
            runInAction(() => {
               this._myChallenges = newChallengesArray;
            });
         } else {
            console.log('Skip setting new challenges array in fetchMyPlayerChallenges');
         }
      }
   }


   @action.bound
   fetchPlayerGoals() {
      const uid = firebaseInstance?.auth?.currentUser?.uid;

      const q = query(
         collection(firestore, 'playerGoals'),
         where('active', '==', true),
         where('uid', '==', uid)
      );

      const unsubscribe = onSnapshot(q, (snaps) => {
         if (!snaps.empty) {
            const newGoalsArray = snaps.docs.map((doc) => {
               const data = doc.data();
               delete data.smashes;
               return data;
            });



            // Check if there's any change in length or updatedAt values
            if (newGoalsArray.length !== this._myGoals.length ||
               !newGoalsArray.every((newChallenge, index) =>
                  newChallenge.updatedAt === this._myGoals[index]?.updatedAt)) {

               console.log('Set new playerGoals array in fetchMyPlayerGoals');
               // Update the _myChallenges property directly
               runInAction(() => {
                  this._myGoals = newGoalsArray;
               });
            } else {
               console.log('Skip setting new playerGoals array in fetchMyPlayerGoals', this._myGoals?.length);
            }
         }
      });

      // Call unsubscribe() when you want to stop listening for updates
      // You can store the unsubscribe function and call it when needed, e.g., componentWillUnmount in a React component
   }


   @action.bound
   removeGoalFromStore(goalId) {

      // remove from goals array

      const newGoalsArray = this.goals.filter(goal => goal.id !== goalId);

      this.goals = newGoalsArray;

   }
   @action.bound
   async fetchGoals(initial = false) {
      const uid = firebaseInstance?.auth?.currentUser?.uid;

      const q = query(
         collection(firestore, 'goals'),
         where('active', '==', true),
         where('joined', 'array-contains', uid)
      );

      const snaps = await getDocs(q);
      if (!snaps.empty) {
         const newGoalsArray = snaps.docs.map((doc) => {
            return doc.data();

         });



         if (initial) {

            const highestExistingUpdatedAt = Math.max(...this.goals.map(goal => goal.updatedAt));
            const highestNewUpdatedAt = Math.max(...newGoalsArray.map(goal => goal.updatedAt));

            if (highestNewUpdatedAt > highestExistingUpdatedAt) {
               console.log('setting new goals array', newGoalsArray.length, this.goals.length);

               runInAction(() => {
                  this.goals = newGoalsArray;
               });
            } else {
               console.log('no goals with higher updatedAt found');
            }


         } else {
            this.goals = newGoalsArray;

         }

      }
   }

   @action.bound
   mergeGoalWithStore(goal) {
      // merge by finding index of goal with same id then merge contents with new goal then replace that index by index

      const index = this.goals.findIndex(existingGoal => existingGoal.id === goal.id);

      if (index !== -1) {
         this.goals[index] = { ...this.goals[index], ...goal };
      }

      // else {
      //   this.goals.push(goal);
      // }
   }






   // @action.bound
   // async fetchMyFinishedPlayerChallengesForVoting() {
   //    const uid = firebaseInstance?.auth?.currentUser?.uid;

   //    if (this.unsubscribeToFinishedChallenges) {
   //       this.unsubscribeToFinishedChallenges();
   //    }

   //    this.unsubscribeToFinishedChallenges = onSnapshot(
   //       query(
   //          collection(firestore, 'playerChallenges'),
   //          where('uid', '==', uid),
   //          where('active', '==', true),
   //          where('endUnix', '<', moment().unix()),
   //       ),
   //       (snaps) => {
   //          if (!snaps.empty) {
   //             const challengesArray = [];

   //             snaps.forEach((snap) => {
   //                const playerChallenge = snap.data();

   //                if (playerChallenge?.challengeType == 'team') {
   //                } else {
   //                   challengesArray.push(playerChallenge);
   //                }
   //             });

   //             console.log('finishedchallengesArray', challengesArray);
   //             this.myFinishedChallenges = challengesArray;
   //          }
   //       },
   //    );
   // }


   @computed
   get playerChallengesWhereStreakLost() {
      const yesterday = moment().subtract(1, 'days');
      const dayBeforeYesterday = moment().subtract(2, 'days');
      const yesterdayKey = yesterday.format('DDMMYYYY');
      const dayBeforeYesterdayKey = dayBeforeYesterday.format('DDMMYYYY');

      return this.playerChallenges.filter((playerChallenge) => {
         const selectedLevel = parseInt(playerChallenge.selectedLevel, 10);
         const targetScore = playerChallenge.dailyTargets[selectedLevel - 1];
         const dayBeforeYesterdayScore = playerChallenge?.daily?.[dayBeforeYesterdayKey]?.score;
         const yesterdayScore = playerChallenge?.daily?.[yesterdayKey]?.score;

         // Check if the day before yesterday had a completed streak (score >= targetScore)
         // and yesterday's streak was lost (score < targetScore)
         return dayBeforeYesterdayScore >= targetScore && yesterdayScore < targetScore;
      });
   }
   @action.bound
   removeFinishedChallengeFromArray(index) {
      this.celebratePlayAgain = true;
      setTimeout(() => {
         this.myFinishedChallenges.splice(index, 1);
         this.celebratePlayAgain = false;
      }, 2000);
   }

   @action.bound
   isGreaterThanHighestDuration(duration, durationsMap) {
      // Get the highest duration value from the durationsMap object
      const highestDuration = Math.max(...Object.values(durationsMap).map(level => level.duration));

      // Check if the given duration is equal to or greater than the highest duration value
      return duration >= highestDuration;
   }

   @action.bound
   getNextStreak(highestStreak, durationsMap) {

      const durations = Object.values(durationsMap)
      // console.log('highestStreak',highestStreak,JSON.stringify(durations))
      // Initialize a variable to store the next highest streak
      let nextHighestStreak = durations?.[0]?.duration;

      // Iterate through the durations object
      for (let i = 0; i < durations.length; i++) {
         // Get the current journey setting
         let level = durations[i];
         console.log('level', level)
         // Check if the durations key of the current journey setting is higher than the current streak
         if (level.duration >= highestStreak) {


            // If it is, update the next highest streak
            nextHighestStreak = level.duration;
            break;
         }
      }

      // Return the next highest streak
      return nextHighestStreak;
   }

   @action.bound
   getStreakDocByChallengeId(challengeId) {

      const { uid } = firebaseInstance.auth.currentUser;

      const streakKey = `${uid}_${challengeId}`;
      const streakDoc = this?.streaksHash?.[streakKey] || {}


      if (challengeId == null) {
         return null;
      }

      return streakDoc || false;

   }




   async playSound() {
      const { sound } = await Audio.Sound.createAsync(
         require('../../assets/sounds/select.mp3')
      );
      // setSound(sound);

      await sound.playAsync();
   }


   @action.bound
   removeFromChallengesStore(challengeId) {
      // delete this.myChallengesHash[challengeId];

      // delete this.playerChallengeHashByChallengeId[challengeId];

      var filtered = this.myChallenges.filter(function (c) {
         return c.challengeId != challengeId;
      });

      // must be _challenges to bypass setter
      this._myChallenges = filtered;

      let playerChallenge = this.playerChallengeHashByChallengeId?.[challengeId];
      delete this.playerChallengeHashByChallengeId?.[challengeId];

      if (playerChallenge) delete this.myPlayerChallengesFullHash?.[playerChallenge.id];


   }


   @action.bound
   removeFromPlayerGoalsStore(goalId) {
      // delete this.myChallengesHash[goalId];

      // delete this.playerChallengeHashBygoalId[goalId];

      var filtered = this.myGoals.filter(function (c) {
         return c.goalId != goalId;
      });
      console.log('removeFromPlayerGoalsStore', this.myGoals, filtered)
      // must be _challenges to bypass setter
      this.myGoals = filtered;


      var filtered2 = this.goals.filter(function (c) {
         return c.id != goalId;
      });
      console.log('removeFromPlayerGoalsStore', this.goals, filtered)
      // must be _challenges to bypass setter
      this.goals = filtered2;

   }


   @action.bound
   async leaveChallenge(
      challenge,
      currentUser,
      alreadyPlaying,
      { startDate = false, endDate = false, duration = false },
   ) {
      // const checkIfShowSubscribeToPremium = () => {
      //    return this.myChallenges?.length > 1;
      // };

      // if (checkIfShowSubscribeToPremium() && !alreadyPlaying) {
      //    this.subscribeModal = 'challengeArena';
      //    return;
      // }
      const { uid } = firebaseInstance.auth.currentUser;
      const challengeId = challenge?.id;

      const existingPlayerChallenge =
         this?.playerChallengeHashByChallengeId?.[challengeId];
      let challengeDateKey = `${startDate}_${endDate}` || false;

      let endUnix =
         moment(endDate, 'DDMMYYYY').unix() || this.getEndUnix(challenge);
      let masterIds = challenge.masterIds || [];

      if (alreadyPlaying) {
         await updateDoc(doc(collection(firestore, 'users'), uid), {
            inChallenge: arrayRemove(challenge.id),
            inChallengeArray: arrayRemove(challenge.id),
            inChallengeMap: { [challenge.id]: false }
         });

         await updateDoc(doc(collection(firestore, 'challenges'), challenge.id), {
            playing: increment(-1),
         });

         await setDoc(
            doc(
               collection(firestore, 'playerChallenges'),
               existingPlayerChallenge?.id || `${uid}_${challenge.id}_${challengeDateKey}`
            ),
            {
               followers: [],
               active: false,
               uid: uid,
               updatedAt: parseInt(Date.now() / 1000),
               timestamp: parseInt(Date.now() / 1000),
               leftEarly: parseInt(Date.now() / 1000),
            },
            { merge: true }
         );

         this.removeFromChallengesStore(challenge.id);
      }
   }

   @action.bound
   async toggleMeInChallenge(
      challenge,
      currentUser,
      alreadyPlaying,
      { startDate = moment().format('DDMMYYYY'),
         endDate = moment().add(89, 'days').format('DDMMYYYY'), duration = 90 },
   ) {

      if (!endDate) {
         return;
      }
      const { id: challengeId, dailyTargets = {}, masterIds = [], name: challengeName, actions = {}, colorStart = '#333', colorEnd = '#333' } = challenge;
      const { uid } = firebaseInstance.auth.currentUser;
      // const challengeId = challenge?.id;

      const existingPlayerChallenge =
         this?.playerChallengeHashByChallengeId?.[challengeId];
      let batch = writeBatch(firestore)
      // let dailyTargets = challenge?.dailyTargets || {};
      let challengeDateKey = `${startDate}_${endDate}`;
      let endUnix =
         moment(endDate, 'DDMMYYYY').endOf('day').unix();
      // let masterIds = challenge.masterIds || [];

      if (alreadyPlaying) {
         const userRef = doc(firestore, 'users', uid);
         batch.set(userRef, { inChallengeArray: increment(-1), inChallengeMap: { [challengeId]: false } }, { merge: true });

         const challengeRef = doc(firestore, 'challenges', challengeId);
         batch.update(challengeRef, { playing: increment(-1) });

         const playerChallengeRef = doc(firestore, 'playerChallenges', existingPlayerChallenge?.id || uid + '_' + challengeId + '_' + challengeDateKey);
         batch.set(playerChallengeRef, { followers: [], active: false, uid: uid, leftEarly: Math.floor(Date.now() / 1000), updatedAt: Math.floor(Date.now() / 1000), timestamp: Math.floor(Date.now() / 1000) }, { merge: true });

         this.removeFromChallengesStore(challengeId);
      } else {
         // userJoinedChallengeNotification(challenge, currentUser);

         const userRef = doc(firestore, 'users', uid);
         batch.set(userRef, { inChallengeArray: arrayUnion(challengeId), inChallengeMap: { [challengeId]: true }, updatedAt: Math.floor(Date.now() / 1000) }, { merge: true });

         const challengeRef = doc(firestore, 'challenges', challengeId);
         batch.update(challengeRef, { playing: increment(1) });

         const playerChallengeRef = doc(firestore, 'playerChallenges', `${uid}_${challengeId}_${challengeDateKey}`);
         batch.set(playerChallengeRef, {
            isPrivate: currentUser.isPrivate || false,
            actions: actions,
            duration: duration,
            followers: [...(currentUser?.followers || []), uid] || [uid],
            following: [...(currentUser?.following || [])] || [],
            id: `${uid}_${challengeId}_${challengeDateKey}`,
            active: true,
            challengeName: challengeName || false,
            challengeType: 'user',
            masterIds,
            endUnix,
            challengeDateKey,
            startDate,
            endDate,
            selectedLevel: 1,
            dailyTargets,
            dailyAverage: 0,
            dailyAverageQty: 0,
            score: 0,
            qty: 0,
            startDateKey: startDate,
            colorStart: colorStart || false,
            colorEnd: colorEnd || false,
            user: {
               name: currentUser.name,
               id: currentUser.id,
               picture: currentUser.picture || false,
            },
            challengeId: challengeId,
            target: parseInt(challenge?.target),
            targets: challenge?.targets || false,
            targetType: challenge?.targetType || 'qty',
            unit: challenge?.unit || false,
            picture: challenge?.picture || false,
            badgeDecorationPicture:
               challenge?.badgeDecorationPicture || false,
            uid: uid,
            updatedAt: Math.floor(Date.now() / 1000),
            timestamp: Math.floor(Date.now() / 1000),
         }, { merge: true });
      }

      await batch.commit().then(() => {

         setTimeout(() => {
            this.fetchMyPlayerChallenges();
         }, 500);

      });

   }


   @action.bound
   async toggleMeInGoal(
      challenge,
      currentUser,
      alreadyPlaying = false,
      joinType = 'contributor',
   ) {

   
      const userToAdd = {
         name: currentUser.name,
         uid: currentUser.uid,
         picture: currentUser.picture || false,
      };
      const startDate = joinType == 'contributor' ? challenge.startDate : moment().unix();


      const endDate = joinType == 'contributor' ? moment(challenge.startUnix, 'X').add(challenge.endDuration, 'days').unix() : moment().add(challenge.endDuration, 'days').unix();

      const { id: goalId, dailyTargets = {}, masterIds = [], name: goalName, actions = {}, colorStart = '#333', colorEnd = '#333' } = challenge;
      const { uid } = firebaseInstance.auth.currentUser;
   
      let batch = writeBatch(firestore)

      let challengeDateKey = `${startDate}_${endDate}`;
      let endUnix =
         moment(endDate, 'DDMMYYYY').endOf('day').unix();


      if (alreadyPlaying) {

         // IF ALREADY PLAYING BOOLEAN IS SET TO TRUE THEN 
         //1. REMOVE USER FROM GOAL, 
         //2. REMOVE GOALID FROM USER INGOALARRAY AND 
         //3. SET PLAYERGOAL TO FALSE

         const userRef = doc(firestore, 'users', uid);
         batch.set(userRef, { inGoalArray: arrayRemove(goalId), inGoalMap: { [goalId]: false } }, { merge: true });

         const goalRef = doc(firestore, 'goals', goalId);
         batch.update(goalRef, { playing: increment(-1), joined: arrayRemove(uid), users: arrayRemove(userToAdd), updatedAt: Math.floor(Date.now() / 1000) });

         const playerGoalRef = doc(firestore, 'playerGoals', uid + '_' + goalId);
         batch.set(playerGoalRef, { followers: [], active: false, uid: uid, leftEarly: Math.floor(Date.now() / 1000), updatedAt: Math.floor(Date.now() / 1000), timestamp: Math.floor(Date.now() / 1000) }, { merge: true });
         this.fetchGoals();
         this.removeFromPlayerGoalsStore(goalId);
      } else {


     // IF ALREADY PLAYING BOOLEAN IS SET TO FALSE THEN 
     // 1. ADD USER TO GOAL,
     // 2. ADD GOALID TO USER INGOALARRAY AND INGOALMAP
       // 3. CHECK IF CHALLENGE EXISTS IN CHALLENGESHASH
       // 4. GET PLAYERGOAL IF EXISTS
         // 5. IF PLAYERGOAL EXISTS BUT NOT ACTIVE, SET IT TO ACTIVE. 
         const userRef = doc(firestore, 'users', uid);
         batch.set(userRef, { inGoalArray: arrayUnion(goalId), inGoalMap: { [goalId]: true }, updatedAt: Math.floor(Date.now() / 1000) }, { merge: true });
    
         const goalRef = doc(firestore, 'goals', goalId);
         batch.set(goalRef, {
            playing: increment(1), joined: arrayUnion(uid), users: arrayUnion(userToAdd),
            usersMap: { [uid]: userToAdd }
         }, { merge: true });

         const endDuration = challenge.endDuration;

   


         const existingChallenge = this?.challengesHash?.[challenge?.challengeId];
         const doIAlreadyHaveAPlayerChallenge = this.myChallengesHashByChallengeId?.[challenge?.challengeId]
         const playerGoalRef = doc(firestore, 'playerGoals', `${uid}_${goalId}`);

         console.log('update5')
         /// get the doc
         const docSnap = await getDoc(playerGoalRef);

         console.log('update6')
         // check if it exists
         if (docSnap.exists()) {
            console.log('update6.5')
            batch.set(playerGoalRef, { active: true, leftEarly: false, updatedAt: Math.floor(Date.now() / 1000) }, { merge: true });

        

            console.log('update9', existingChallenge);
            
            if (!doIAlreadyHaveAPlayerChallenge && existingChallenge) {

               console.log('e truexistingChallenge')

               // this.toggleMeInChallenge(
               //    existingChallenge,
               //    currentUser,
               //    false,
               //    {})
            } else {
               console.log('else')
               // get the challenge doc from challenges collection
               const challengeRef = doc(firestore, 'challenges', challenge.challengeId);
               const challengeDocSnap = await getDoc(challengeRef);
               // check if it exists
               if (challengeDocSnap.exists()) {

                  console.log('challengeDocSnap.exists()')
                  const challengeData = challengeDocSnap.data();
                  // this.toggleMeInChallenge(
                  //    challengeData,
                  //    currentUser,
                  //    false,
                  //    {})

               }


            }

         } else {

            console.log('update7')
            batch.set(playerGoalRef, {
               isPrivate: currentUser.isPrivate || false,
               actions: actions,
               endDuration: endDuration,
               followers: [...(currentUser?.followers || []), uid] || [uid],
               following: [...(currentUser?.following || [])] || [],
               id: `${uid}_${goalId}`,
               active: true,
               goalName: goalName || false,
               challengeType: 'user',
               challengeId: challenge?.challengeId || false,
               joinType,
               masterIds,
               endUnix,
               challengeDateKey,
               dailyTargets,
               dailyAverage: 0,
               dailyAverageQty: 0,
               score: 0,
               qty: 0,
               startDateKey: startDate,
               colorStart: colorStart || false,
               colorEnd: colorEnd || false,
               joined: arrayUnion(uid),
               user: {
                  name: currentUser.name,
                  id: currentUser.id,
                  picture: currentUser.picture || false,
               },
               startDate,
               start: joinType == 'contributor' ? challenge.start : serverTimestamp(),
               goalId: goalId,
               target: parseInt(challenge?.target),
               targets: challenge?.targets || false,
               targetType: challenge?.targetType || 'qty',
               unit: challenge?.unit || false,
               badgeDecorationPicture:
                  challenge?.badgeDecorationPicture || false,
               uid: uid,
               updatedAt: Math.floor(Date.now() / 1000),
               timestamp: Math.floor(Date.now() / 1000),
            }, { merge: true });


            console.log('update8')

            // check if we need to also toggleMeInChallenge if the user does not already have a challenge with the challengeId

        

            console.log('update9', existingChallenge);

            if (!doIAlreadyHaveAPlayerChallenge && existingChallenge) {

               console.log('e truexistingChallenge')

               // this.toggleMeInChallenge(
               //    existingChallenge,
               //    currentUser,
               //    false,
               //    {})
            } else {
               console.log('else')
               // get the challenge doc from challenges collection
               const challengeRef = doc(firestore, 'challenges', challenge.challengeId);
               const challengeDocSnap = await getDoc(challengeRef);
               // check if it exists
               if (challengeDocSnap.exists()) {

                  console.log('challengeDocSnap.exists()')
                  // const challengeData = challengeDocSnap.data();
                  // this.toggleMeInChallenge(
                  //    challengeData,
                  //    currentUser,
                  //    false,
                  //    {})

               }


            }


         }
      }

      await batch.commit().then(() => {

         setTimeout(async () => {
            await this.fetchGoals();
            // await this.fetchMyPlayerGoals();
            // setUniversalLoading(false);
         }, 500);

      });

   }

   @action.bound
   continueChallenge(challenge) {
      /// changing endUnix
      //// chaneging endDate
   }


   async onShare(inviteInfo) {
      try {
         const result = await Share.share({
            message: inviteInfo,
         });

         if (result.action === Share.sharedAction) {
            if (result.activityType) {
               // shared with activity type of result.activityType
            } else {
               // shared
            }
         } else if (result.action === Share.dismissedAction) {
            // dismissed
         }
      } catch (error) {
         //   alert(error.message);
      }
   }

   @action.bound
   async shareGoal(goal) {
      try {



         const goalGame = goal.name || 'noname';


         //   ${teamLink.shortLink}/?teamId=${goal.id}
         const inviteInfo = `Come join me on SmashApp for my Goal to reach ${goal.target}! (${goalGame}) -  ${goal?.code ? 'Goal Code is: ' + goal?.code : ' | '
            }. Get the app here: https://smashapp.com.au/`;
         // ${teamLink.shortLink}/?teamId=${team?.id}`;

         this.onShare(inviteInfo);
      } catch (error) {
         // Handle the error here
         console.error(error);
      } finally {
         this.universalLoading = false;
      }
   }

   @action.bound
   async joinChallenge(
      challenge,
      currentUser,
      { startDate = false, endDate = false, duration = false },
   ) {
      const checkIfShowSubscribeToPremium = () => {
         return this.myChallenges?.length > 1;
      };

      if (!endDate) {
         return;
      }
      // if (checkIfShowSubscribeToPremium() && !alreadyPlaying) {
      //    this.subscribeModal = 'challengeArena';
      //    return;
      // }
      const { uid } = firebaseInstance.auth.currentUser;
      const challengeId = challenge?.id;
      let dailyTargets = challenge?.dailyTargets || {};
      let challengeDateKey = `${startDate}_${endDate}`;
      let endUnix = moment(endDate, 'DDMMYYYY').endOf('day').unix();
      let masterIds = challenge.masterIds || [];

      userJoinedChallengeNotification(challenge, currentUser);

      await updateDoc(doc(collection(firestore, 'users'), uid), {
         inChallenge: arrayUnion(challenge.id),
         inChallengeArray: arrayUnion(challenge.id),
         inChallengeMap: { [challenge.id]: true }
      }, { merge: true });

      await updateDoc(doc(collection(firestore, 'challenges'), challenge.id), {
         playing: increment(1)
      }, { merge: true });

      await updateDoc(doc(collection(firestore, 'playerChallenges'), uid + '_' + challenge.id + '_' + challengeDateKey), {
         actions: challenge?.actions || {},
         duration: duration || challenge.duration,
         followers: [...(currentUser?.followers || []), uid] || [],
         following: [...(currentUser?.following || [])] || [],
         id: uid + '_' + challenge.id + '_' + challengeDateKey,
         active: true,
         challengeName: challenge.name || false,
         challengeType: 'user',
         masterIds,
         dailyAverage: 0,
         score: 0,
         qty: 0,
         endUnix,
         challengeDateKey,
         dailyTargets,
         startDate,
         endDate,
         startDateKey: startDate,
         colorStart: challenge.colorStart || false,
         colorEnd: challenge.colorEnd || false,
         user: {
            name: currentUser.name,
            id: currentUser.id,
            picture: currentUser.picture || false,
         },
         challengeId: challenge.id,
         target: parseInt(challenge?.target),
         targets: challenge?.targets || false,
         targetType: challenge?.targetType || 'qty',
         unit: challenge?.unit || false,
         picture: challenge?.picture || false,
         badgeDecorationPicture: challenge?.badgeDecorationPicture || false,
         uid: uid,
         updatedAt: parseInt(Date.now() / 1000),
         timestamp: parseInt(Date.now() / 1000)
      }, { merge: true });
      // this.fetchMyPlayerChallenges()
   }

   async isVoteDocPresent(voteDocId: string) {
      return new Promise(async (resolve, reject) => {
         const docSnap = await getDoc(doc(firestore, 'votes', voteDocId));

         if (docSnap.exists()) {
            resolve(docSnap.data());
         } else {
            resolve(false);
         }

      });
   }

   //// Find where magority no...
   //// set playerChallenge to active = false

   /// when toggle in challenge - check if doc exists then make active instead of resetting playerChallenge.

   @action.bound
   async toggleTeamInChallenge(challenge, team, alreadyPlaying) {
      const { uid } = Firebase.auth.currentUser;

      let endDateKey = this.getEndDateKey(challenge);
      let endUnix = this.getEndUnix(challenge);
      let masterIds = challenge.masterIds || [];
      let players = team?.joined || [];
      const {
         id: teamID,
         name: teamName,
         picture: teamPicture,
         joined = [],
      } = team;

      const voteDocId = `${teamID}_${challenge.id}_${endDateKey}`;
      const voteDoc = await this.isVoteDocPresent(voteDocId);

      // if vote doc does not exist create one and exit.
      if (!voteDoc) {
         console.log(
            'toggleTeamInChallenge: Vote Doc does not exist, creating new one...',
         );
         await setDoc(doc(collection(firestore, 'votes'), voteDocId), {
            teamId: teamID,
            challengeId: challenge.id,
            name: challenge.name,
            picture: challenge.picture || false,
            endDateKey: endDateKey,
            endUnix: endUnix,
            voteYes: FieldValue.arrayUnion(uid),
         }, { merge: true });
         return;
      }

      const majorityYesFn = async () => {
         if (alreadyPlaying) return;
         console.log('toggleTeamInChallenge: MajorityYes');
         await setDoc(doc(collection(firestore, 'teams'), teamID), {
            inChallenge: {
               [endDateKey]: arrayUnion(challenge.id),
            },
            inChallengeMap: {
               [endDateKey]: {
                  [challenge.id]: true
               }
            },
         }, { merge: true });

         await setDoc(doc(collection(firestore, 'challenges'), challenge.id), {
            challengeTimeframes: {
               [endDateKey]: {
                  playing: increment(1),
               },
            },
         }, { merge: true });

         await setDoc(doc(collection(firestore, 'playerChallenges'), `${teamID}_${challenge.id}_${endDateKey}`), {
            duration: challenge.duration,
            teamId: teamID,
            players,
            badgeDecorationPicture: challenge?.badgeDecorationPicture || false,
            id: `${teamID}_${challenge.id}_${endDateKey}`,
            active: true,
            challengeName: challenge.name || false,
            challengeType: 'team',
            masterIds,
            colorStart: challenge.colorStart || false,
            colorEnd: challenge.colorEnd || false,
            endUnix,
            endDateKey,
            user: {
               name: teamName,
               id: teamID,
               picture: teamPicture || false,
            },
            team,
            qty: increment(0),
            score: increment(0),
            challengeId: challenge.id,
            target: parseInt(challenge?.target),
            targets: challenge?.targets || false,
            targetType: challenge?.targetType || 'qty',
            unit: challenge.unit || false,
            uid: uid,
            updatedAt: Date.now() / 1000,
            timestamp: Date.now() / 1000,
         }, { merge: true });

         this.isVoteDialogVisible = false;
         if (this.setTimeout) {
            clearTimeout(this.setTimeout);
         }
         this.setTimeout = setTimeout(() => {
            this.celebrationModal = `Your Team is now playing ${challenge.name}!`;
         }, 200);
      };

      const majorityNoFn = async () => {
         if (!alreadyPlaying) return;
         console.log('toggleTeamInChallenge: MajorityNo');

         await updateDoc(doc(firestore, 'teams', teamID), {
            inChallenge: {
               [endDateKey]: arrayRemove(challenge.id)
            },
            inChallengeMap: {
               [endDateKey]: {
                  [challenge.id]: false
               }
            }
         });

         await updateDoc(doc(firestore, 'challenges', challenge.id), {
            challengeTimeframes: {
               [endDateKey]: {
                  playing: increment(-1)
               }
            }
         });

         await updateDoc(doc(firestore, 'playerChallenges', `${teamID}_${challenge.id}_${endDateKey}`), {
            active: false,
            uid: uid,
            updatedAt: parseInt(Date.now() / 1000),
            timestamp: parseInt(Date.now() / 1000)
         });
         this.removeFromChallengesStore(challenge.id);
      };

      const { voteYes = [], voteNo = [] } = voteDoc;

      // if user already in yes that means he voted no.
      const isUserVotedNo = voteYes?.includes(uid);
      const isUserVotedYes =
         voteNo?.includes(uid) ||
         (!voteYes?.includes(uid) && !voteNo?.includes(uid));

      const yesOrNoOptions = ['voteYes', 'voteNo'];
      const yesOrNoMajorityFnMapper = {
         voteYes: majorityYesFn,
         voteNo: majorityNoFn,
      };

      if (isUserVotedYes)
         updateSelectedOption(
            voteDocId,
            'voteYes',
            yesOrNoOptions,
            yesOrNoMajorityFnMapper,
            players.length,
         );

      if (isUserVotedNo)
         updateSelectedOption(
            voteDocId,
            'voteNo',
            yesOrNoOptions,
            yesOrNoMajorityFnMapper,
            players.length,
         );
   }
}


export default ChallengesStore;