import * as Notifications from 'expo-notifications';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Firebase from '../config/Firebase';

const db = firebase.firestore();
const notificationsRef = db.collection('notifications');

notificationsRef.onSnapshot(querySnapshot => {
  let badgeNumber = 0;
  querySnapshot.forEach(doc => {
    if(!doc.data().read) {
        badgeNumber++;
    }
  });
  Notifications.setBadgeCountAsync(badgeNumber);
});


export const subToBadgeNotifications = () => { 


    const unsubscribe = Firebase.firestore.collection('notifications').onSnapshot((querySnapshot) => {
        let badgeNumber = 0;
        querySnapshot.forEach(doc => {
        if(!doc.data().read) {
            badgeNumber++;
        }
        });
        Notifications.setBadgeCountAsync(badgeNumber);
    });
    
    return unsubscribe;
   

}

