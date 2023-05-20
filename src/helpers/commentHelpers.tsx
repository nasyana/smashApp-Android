import { moment } from 'helpers/generalHelpers';
import { doc, collection, addDoc } from "firebase/firestore";
import firebaseInstance from '../config/Firebase'; // import the firebaseInstance you created
const firestore = firebaseInstance.firestore;

export const getDayChar = (date) => {
   return moment(date, 'DDMMYYYY').format('dd');
};

export async function addComment(
   postId = false,
   comment = {},
   teamId = false,
   uid = false,
) {
   const postRef = doc(collection(firestore, 'feed'), postId);
   await addDoc(collection(postRef, 'comments'), comment);
}
