
import { doc, setDoc, collection, query, where, getDocs, writeBatch, arrayUnion } from 'firebase/firestore';
import firebaseInstance from '../config/Firebase';
import moment from 'moment';
const firestore = firebaseInstance.firestore;
class CreateChallengeStore {
   createChallengeDoc(challenge) {

   
      const challengeRef = doc(collection(firestore, 'challenges'));
      return setDoc(challengeRef, {...challenge, id: challengeRef.id});
   }

   updateChallengeDoc(challenge) {

     
      const challengeRef = doc(firestore, 'challenges', challenge.id);

      return setDoc(challengeRef, { ...challenge }, { merge: true }).then(() => {
         const playerChallengesQuery = query(
            collection(firestore, 'playerChallenges'),
            where('challengeId', '==', challenge.id),
            where('active', '==', true),
         );

         getDocs(playerChallengesQuery).then((snaps) => {
            snaps.forEach((snap) => {
               setDoc(
                  snap.ref,
                  {
                     // targets: challenge.targets,
                     imageHandle: challenge.imageHandle || false,
                     updatedAt: challenge.updatedAt,
                     // target: challenge.target || 0,
                     targetType: challenge.targetType || 'score',
                     // targetTwo: challenge?.targetTwo || 0,
                     // targetThree: challenge.targetThree || 0,
                     masterIds: challenge.masterIds,
                     colorStart: challenge.colorStart || false,
                     colorEnd: challenge.colorEnd || false,
                     picture: challenge?.picture || false,
                     dailyTargets: challenge?.dailyTargets || {},
                     challengeName: challenge?.name || 'noname',
                     unit: challenge?.unit || 'units',
                  },
                  { merge: true },
               );
            });
         });
      });
   }

   createGoalDoc(challenge, currentUser) {


      return new Promise<void>(async (resolve, reject) => {
         
    const uid = currentUser.uid;
         const userToAdd = {
            name: currentUser.name,
            uid: currentUser.uid,
            picture: currentUser.picture || false,
         };
 
      console.log('createGoalDoc',challenge)


      const challengeRef = doc(collection(firestore, 'goals'));

      const goal = {user: {name: currentUser?.name, picture: currentUser?.picture, uid: currentUser?.uid }, ...challenge, id: challengeRef.id, joined: [firebaseInstance.auth.currentUser.uid], startDate: moment().unix(), startUnix: moment().unix(),users: arrayUnion(userToAdd),
      usersMap: { [uid]: userToAdd }, updatedAt: moment().unix(), createdAt: moment().unix() };


      await setDoc(challengeRef, goal, { merge: true });

      resolve(goal)

   })
   }

   async updateGoalDoc(goal) {
      console.log('updateGoalDoc', goal);
      const firestore = firebaseInstance.firestore;
      const goalRef = doc(firestore, 'goals', goal.id);
    
      const batch = writeBatch(firestore);
    
      batch.set(goalRef, { ...goal }, { merge: true });
    
      const playerGoalsQuery = query(
        collection(firestore, 'playerGoals'),
        where('goalId', '==', goal.id),
        where('active', '==', true),
      );
    
      const snaps = await getDocs(playerGoalsQuery);
    
      snaps.forEach((snap) => {
        const playerGoalRef = snap.ref;
        batch.set(
          playerGoalRef,
          {
            imageHandle: goal.imageHandle || false,
            updatedAt: goal.updatedAt,
            target: goal.target || 0,
            targetType: goal.targetType || 'score',
            masterIds: goal.masterIds,
            colorStart: goal.colorStart || false,
            colorEnd: goal.colorEnd || false,
            picture: goal?.picture || false,
            goalName: goal?.name || 'noname',
            description: goal?.description || 'no description',
          },
          { merge: true },
        );
      });
    
      await batch.commit();
    }
    
  
}

export default CreateChallengeStore;
