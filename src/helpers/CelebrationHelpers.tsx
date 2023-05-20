import { View, Text } from 'react-native';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { moment } from 'helpers/generalHelpers';;
import {
   collection, query, where, onSnapshot, getDocs, getDoc, increment, arrayRemove,
   arrayUnion, 
   doc,
   setDoc,
   writeBatch,updateDoc
} from 'firebase/firestore';
import { sendNotification } from 'services/NotificationsService';
import ImageUpload from 'helpers/ImageUpload';
import { todayDateKey } from 'helpers/dateHelpers';

import firebaseInstance from '../config/Firebase'; // import the firebaseInstance you created
const firestore = firebaseInstance.firestore;



 export const createCelebrationDoc = async (celebration) => {
   const { type, name, timestamp, challengeId = false } = celebration;
   const id = `${type}_${timestamp.toString()}` || ImageUpload.uid();

   setDoc(
      doc(collection(firestore, 'celebrations'), id),
      { ...celebration, id }
   );

   if (celebration.uid && challengeId) {
      setDoc(
         doc(collection(firestore, 'users'), celebration.uid),
         {
            challengesSmashed: {
               [challengeId]: {
                  [celebration.duration]: arrayUnion(celebration),
               },
            },
         },
         { merge: true }
      );
   }
};

export const dismissCelebration = (celebration) => {
   updateDoc(
      doc(collection(firestore, 'celebrations'), celebration.id),
      { active: false }
   );
};