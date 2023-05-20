import Firebase from '../../config/Firebase';

export const unsubscribeToChallenge = async (
   challengeId: number | string,
   setChallenge: any,
   setMounted: any
) => {
   try {
      const docRef = Firebase.firestore
         .collection('challenges')
         .doc(challengeId);
      const unsubscribeRef = docRef.onSnapshot((snaps: any) => {
         if (snaps.exists) {
            const challenge = snaps.data();
            setChallenge(challenge);
            setMounted(false);
         } else {
            setChallenge({});
            setMounted(true);
         }
      });

      return unsubscribeRef;
   } catch (error) {
      setChallenge({});
      setMounted(true);
      return Promise.reject(error);
   }
};

export const unsubscribeToPlayerChallenge = async (
   playerChallengeId: number | string,
   setPlayerChallenge: any,
   setMounted: any
) => {
   try {
      const docRef = Firebase.firestore
         .collection('playerChallenges')
         .doc(playerChallengeId);
         
      const unsubscribeRef = docRef.onSnapshot((snaps: any) => {
         if (snaps.exists) {
            const pChallenge = snaps.data();
            setPlayerChallenge(pChallenge);
            setMounted(false);
         } else {
            setPlayerChallenge({});
            setMounted(true)
         }
      });

      return unsubscribeRef;
   } catch (error) {
      setPlayerChallenge({});
      setMounted(true);
      return Promise.reject(error);
   }
};

export const unsubscribeToPlayersAheadOfMe = async (
   playerChallenge: any,
   setRank: any,
   setUsersAheadOfMe: any,
   challengesStore: any,
   setMounted: any
) => {
   let pointsToAdd = 5000;

   try {
      const uid = Firebase?.auth?.currentUser?.uid;
      const docRef = Firebase.firestore.collection('playerChallenges');
      const unsubscribeRef = docRef
         .where('following', 'array-contains', uid)
         .where('active', '==', true)
         .where('endDateKey', '==', playerChallenge.endDateKey)
         .where('score', '>', playerChallenge.score)
         .where('score', '<', playerChallenge.score + pointsToAdd)
         .where('challengeId', '==', playerChallenge.challengeId)
         .onSnapshot((snap: any) => {
            let peopleAheadOfMe = [];
            let usersAheadOfMe: Array<any> = [];

            if (!snap.empty) {
               snap.forEach((snap: any) => {
                  peopleAheadOfMe.push(
                     snap.data().user.name + snap.data().score,
                  );
                  usersAheadOfMe.push(snap.data());
               });

               const size = snap.size;

               challengesStore.setplayersAroundMeInChallenges(
                  usersAheadOfMe,
                  playerChallenge.challengeId,
               );

               setRank(size);
               setUsersAheadOfMe(usersAheadOfMe);
               setMounted(false);
            } else {
               setRank(0);
               setUsersAheadOfMe([]);
               setMounted(false);
            }
         });

      return unsubscribeRef;
   } catch (error) {
      return Promise.reject(error);
   }
};
