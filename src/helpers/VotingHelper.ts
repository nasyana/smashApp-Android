import firebaseInstance from '../config/Firebase';
const firestore = firebaseInstance.firestore;
import { doc, setDoc, getDoc,arrayRemove,arrayUnion } from "firebase/firestore";

export type optionMajorityFnMapper = {
   [key: string]: (majorityNumber?: number) => void;
};

// returns majority option, if there is a majority in any option.
// if it returns a majority option, then runMajorityFunction(option)
export const updateSelectedOption = async (
   voteDocId: string,
   selectedOption: string,
   options: string[],
   optionMajorityFnMapper: optionMajorityFnMapper,
   membersLength: number,
) => {
   const { uid } = firebaseInstance.auth.currentUser;

   let firebaseValues: any = {};
   // Add user to selected option and remove him from other options.
   options.forEach((option: string) => {
      if (option === selectedOption)
         firebaseValues[option] = arrayUnion(uid);
      else
         firebaseValues[option] =
            arrayRemove(uid);
   });

   await setDoc(doc(firestore, 'votes', voteDocId), firebaseValues, { merge: true });

   const docSnap = await getDoc(doc(firestore, 'votes', voteDocId));

   if (docSnap.exists) {
      const voteDoc = docSnap.data();
      return checkForMajority(
         voteDoc,
         options,
         optionMajorityFnMapper,
         membersLength,
      );
   }
   return null;
};

const checkForMajority = (
   voteDoc: any,
   options: string[],
   optionMajorityFnMapper: optionMajorityFnMapper,
   membersLength: number,
) => {
   options.forEach((option: string) => {
      const votesForOption = voteDoc[option] || [];
      const isOptionGotMajority =
         votesForOption.length > Math.floor(membersLength / 2);
      // console.log(
      //    `option: ${option} votesForOption: ${votesForOption.length} ${isOptionGotMajority}`,
      // );

      if (isOptionGotMajority) {
         optionMajorityFnMapper[option] &&
            optionMajorityFnMapper[option](votesForOption.length);
      }
   });
};

