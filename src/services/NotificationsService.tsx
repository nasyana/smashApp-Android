import axios from 'axios';
import firebaseInstance from 'config/Firebase';
import {
   collection, query, where, onSnapshot, getDocs, getDoc, increment, arrayRemove,
   arrayUnion, serverTimestamp, getFirestore,orderBy,
   doc,
   setDoc,
   writeBatch
} from 'firebase/firestore';
const firestore = firebaseInstance.firestore;
export const sendNotification = async (reqData) => {
   // {to, sound, title}

   if(!reqData)return 

   const config = {
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
   };
   const body = JSON.stringify(reqData);

   try {
      const res = await axios.post(
         'https://exp.host/--/api/v2/push/send',
         body,
         config,
      );
   } catch (err) {
      console.error('Error Sending Notification', err);
   }
};


export const sendNotificationToUser = async (
   title = 'oops no title',
   subtitle = 'oops no subtitle',
   toUID,
) => {
   
   const userDoc = doc(firestore, 'users', toUID);
   const userSnap = await getDoc(userDoc);
   const userData = userSnap.data();

   //PushNotification
   if (userData.expoPushToken) {
      const body = {
         to: userData.expoPushToken,
         sound: 'default',
         title: title,
         subtitle: subtitle,
      };
      sendNotification(body);
   }

   // const config = {
   //    headers: {
   //       Accept: 'application/json',
   //       'Content-Type': 'application/json',
   //    },
   // };
   // const body = JSON.stringify(reqData);

   // try {
   //    const res = await axios.post(
   //       'https://exp.host/--/api/v2/push/send',
   //       body,
   //       config,
   //    );
   // } catch (err) {
   //    console.error('Error Sending Notification', err);
   // }
};





const getUser = async (uid) => {
   const userRef = doc(firestore, 'users', uid);
   const userSnap = await getDoc(userRef);
 
   if (userSnap.exists()) {
     const user = userSnap.data();
     return user;
   } else {
     return null;
   }
 };
export const sendEpicNotification = async (
   uid,
   message,
   data,
   subtitle = '',
) => {
   const userGettingNotifified = await getUser(uid);

   const config = {
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
   };

   const body = JSON.stringify({
      to: userGettingNotifified?.expoPushToken,
      title: message,
      data: data,
      subtitle,
   });

   try {
      const res = await axios.post(
         'https://exp.host/--/api/v2/push/send',
         body,
         config,
      );
   } catch (err) {
      console.error('Error Sending Notification', err);
   }
};


export const sendSuperUserNotification = async (uid, title, subtitle, body
) => {


   const userGettingNotifified = await getUser(uid);

   const config = {
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
   };

   const mBody = JSON.stringify({
      to: userGettingNotifified?.expoPushToken,
      title: title,
      subtitle,
      body
   });

   try {
      const res = await axios.post(
         'https://exp.host/--/api/v2/push/send',
         mBody,
         config,
      );
   } catch (err) {
      console.error('Error Sending Notification', err);
   }
};