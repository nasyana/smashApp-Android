import firebaseInstance from 'config/Firebase';

// import { uniqueId } from 'lodash';
import { collection, where, query, orderBy, limit, onSnapshot, doc } from "firebase/firestore";
// import firebase from 'firebase';
const firestore = firebaseInstance.firestore;

export const commentListener = (postId, setCommentList) => {
   const commentsRef = query(
     collection(firestore, "posts", postId, "comments"),
     orderBy("timestamp", "asc"),
     limit(37)
   );
 
   const unsubscribe = onSnapshot(commentsRef, (querySnapshot) => {
     const allComments = [];
     querySnapshot.forEach((doc) => {
       allComments.push(doc.data());
     });
     setCommentList(allComments);
   });
 
   return unsubscribe;
 };


 export const journalListener = (primaryId, setCommentList, dayKey = false) => {
   const { uid = false } = firebaseInstance.auth.currentUser;
 
   if (dayKey) {
     const q = query(
       collection(firestore, "journals"),
       where("dayKey", "==", dayKey),
       where("idTags", "array-contains", primaryId),
       where("uid", "==", uid),
       orderBy("timestamp", "asc"),
       limit(17)
     );
 
     return onSnapshot(q, (querySnapshot) => {
       const allComments = [];
       querySnapshot.forEach((doc) => {
         allComments.push(doc.data());
       });
       setCommentList(allComments);
     });
   } else {
     const q = query(
       collection(firestore, "journals"),
       where("idTags", "array-contains", primaryId),
       where("uid", "==", uid),
       orderBy("timestamp", "asc"),
       limit(17)
     );
 
     return onSnapshot(q, (querySnapshot) => {
       const allComments = [];
       querySnapshot.forEach((doc) => {
         allComments.push(doc.data());
       });
       setCommentList(allComments);
     });
   }
 };



 export const replyListener = (postId, replyCommentId, setRepliesList) => {

  // alert('as')
  const replyCommentsRef = collection(firestore, 'posts', postId, 'comments', replyCommentId, 'replies');
  const q = query(replyCommentsRef, orderBy('timestamp', 'asc'), limit(17));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const allReplies = [];
    querySnapshot.forEach((doc) => {
      allReplies.push(doc.data());
    });

    setRepliesList(allReplies);
  }, (error) => {
    console.error("Error listening to document changes: ", error);
  });

  return unsubscribe;
};

