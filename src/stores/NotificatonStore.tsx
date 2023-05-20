import { action, observable, computed, makeObservable } from 'mobx';
import { collection, query, where, limit, orderBy, onSnapshot,increment, updateDoc, setDoc, getDoc,doc } from 'firebase/firestore';
import firebaseInstance from '../config/Firebase';

const firestore = firebaseInstance.firestore;
import { moment } from 'helpers/generalHelpers';;
// import firebase from 'firebase';
import { NotificationType } from 'constants/Type';
import { sendNotification } from 'services/NotificationsService';
class NotificatonStore {
   unsubscribeNotifications = null;
   unsubscribeNotificationCount = null;
   @observable _myNotifications = [];
   // @observable notificationCount = 0;

   constructor() {
      makeObservable(this);
   }

   @observable _notifications = [];

   @computed get notifications() {
      return this._notifications;
   }

   set notifications(notifications) {
      this._notifications = notifications;
   }

   @computed get myNotifications() {
      return this._myNotifications;
   }

   set myNotifications(myNotifications) {
      this._myNotifications = myNotifications;
   }

   @observable _notificationCount = 0;

   @computed get notificationCount() {
      return this._notificationCount;
   }

   set notificationCount(notificationCount) {
      this._notificationCount = notificationCount;
   }

   @observable _activityNotificationCount = 0;

   @computed get activityNotificationCount() {
      return this._activityNotificationCount;
   }

   set activityNotificationCount(activityNotificationCount) {
      this._activityNotificationCount = activityNotificationCount;
   }

   @observable _inviteNotificationCount = 0;

   @computed get inviteNotificationCount() {
      return this._inviteNotificationCount;
   }

   set inviteNotificationCount(inviteNotificationCount) {
      this._inviteNotificationCount = inviteNotificationCount;
   }


   @computed get realNotificationsCount() {

      const allUnread = this.myNotifications.filter((noti) => noti.unread == true) || [];

  
      return allUnread?.length || 0;
   }

   @computed get allUnread() {

     return this.myNotifications.filter((noti) => noti.unread == true) || [];

 
   }

   @computed get hasNotifications(){

      return parseInt(this.realNotificationsCount || 0) > 0;
   }

   @action.bound
   initNotifications(uid) {
  

      if (this.unsubscribeNotifications) this.unsubscribeNotifications();

      this.unsubscribeNotifications = onSnapshot(
         query(collection(firestore, 'Notifications'), where('receiverUser', '==', uid), limit(7), orderBy('timestamp', 'desc')),
         (snapshot) => {
           this.myNotifications = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
         },
         (error) => {
           console.error('Error in Notifications', error);
         }
       );
    

      // if (this.unsubscribeNotificationCount)
      //    this.unsubscribeNotificationCount();

      // this.unsubscribeNotificationCount = Firebase.firestore
      //    .collection('NotificationCounters')
      //    .doc(uid)
      //    .onSnapshot((doc) => {
      //       if (doc.exists) {
      //          const { activityCount, inviteCount, totalCount } = doc.data();
      //          this.notificationCount = totalCount;
      //          this.activityNotificationCount = activityCount;
      //          this.inviteNotificationCount = inviteCount;
      //       } else {
      //          this.notificationCount = 0;
      //          this.activityNotificationCount = 0;
      //          this.inviteNotificationCount = 0;
      //       }
      //    });
   }

   @action
   async  addNewNotificationDoc(notiData) {
      console.log("addNewNotificationDoc");
      const itemId = notiData.itemId || "empty";
      const { type = "na" } = notiData;
      const dayKey = moment().format("DDMMYYYY");
      const { uid } = firebaseInstance.auth.currentUser;
      const notiRef = doc(firebaseInstance.firestore, "Notifications", `${type}_${itemId}_${uid}`);
      
      try {
      await setDoc(
      notiRef,
      {
      ...notiData,
      id: notiRef.id,
      unread: true,
      dayKey,
      goalId: notiData?.goalId,
      count: increment(1),
      },
      { merge: true }
      );  const userSnap = await getDoc(doc(firebaseInstance.firestore, "users", notiData.receiverUser));
      const userData = userSnap.data();
    
      //PushNotification
      if (userData.expoPushToken) {
         if (notiData.challenge) {
            const body = {
               to: userData.expoPushToken,
               sound: "default",
               title: notiData.title,
               subtitle: notiData.challenge?.name,
               data: { challenge: notiData?.challenge || false, goal: notiData?.goalId || false },
            };
            sendNotification(body);
         }
      }
   } catch (error) {
      console.log("Error adding notification document: ", error);
      }
      }
   @action
   async resetNotificationCount(type) {
      console.log('resetNotificationCount');
      const { uid } = firebaseInstance.auth.currentUser;
      const notiCounterRef = doc(firestore, "NotificationCounters", uid);
      const docSnap = await getDoc(notiCounterRef);
      if (docSnap.exists()) {
        await updateDoc(notiCounterRef, {
          [`${type}Count`]: increment(1),
          totalCount: increment(1)
        });
      } else {
        await setDoc(notiCounterRef, {
          [`${type}Count`]: increment(1),
          totalCount: increment(1)
        });
      }

      setTimeout(() => {
         this.notifications &&
            this.notifications.forEach(async (noti) => {
               if (!noti.id) return;
           
const notiRef = doc(firestore, "Notifications", noti.id);
await setDoc(notiRef, { unread: false }, { merge: true });
            });
      }, 2 * 60 * 1000); // update as read after 2mins once user views them.
   }

   @action
   async incrementNotificationCounter(type, uid) {
      console.log('incrementNotificationCounter');
      const notiCounterRef = doc(collection(firestore, "NotificationCounters"), uid);
      const docSnap = await getDoc(notiCounterRef);
      
      if (docSnap.exists()) {
        await updateDoc(notiCounterRef, {
          [`${type}Count`]: increment(1),
          totalCount: increment(1),
        });
      } else {
        await setDoc(notiCounterRef, {
          [`${type}Count`]: increment(1),
          totalCount: increment(1),
        });
      }
   }


   @action
   async decrementNotificationCounter(type: string, uid: string) {
      console.log('decrementNotificationCounter');
      const notiCounterRef = doc(collection(firestore, 'NotificationCounters'), uid);
      const docSnapshot = await getDoc(notiCounterRef);
      if (docSnapshot.exists()) {
         await updateDoc(notiCounterRef, {
            [`${type}Count`]: increment(-1),
            totalCount: increment(-1),
         }, { merge: true });
      } else {
         await setDoc(notiCounterRef, {
            [`${type}Count`]: increment(-1),
            totalCount: increment(-1),
         }, { merge: true });
      }
   }
   
}

export default NotificatonStore
