import { doc, setDoc, getDoc } from 'firebase/firestore';
import 'firebase/functions';

import firebaseInstance from '../config/Firebase'; // import the firebaseInstance you created
const firestore = firebaseInstance.firestore;
// USER DOC FUNCTIONS

export async function updateUserDoc(userId, data, options) {
  const userRef = doc(firestore, 'users', userId);
  await setDoc(userRef, data, options);
}

export async function getUserDoc(userId) {
  const userRef = doc(firestore, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

// export const getUserDocs = firebase.functions().httpsCallable('getUserDocs');

