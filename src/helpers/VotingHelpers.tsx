import firebaseInstance from '../config/Firebase';
const firestore = firebaseInstance.firestore;


export const checkIfIHaveVoted = (voteDoc) => {
  

   const { uid } = firebaseInstance.auth.currentUser;
   const add10k = voteDoc?.add10k || [];
   const add20k = voteDoc?.add20k || [];
   const remove10k = voteDoc?.remove10k || [];
   const keepTheSameTarget = voteDoc?.keepTheSameTarget || [];

   const allVotes = [...add10k, ...remove10k, ...keepTheSameTarget, ...add20k];

   return allVotes.includes(uid) || false;
};

export const howManyVotes = (voteDoc) => {

   const add10k = voteDoc?.add10k || [];
   const add20k = voteDoc?.add20k || [];
   const remove10k = voteDoc?.remove10k || [];
   const keepTheSameTarget = voteDoc?.keepTheSameTarget || [];

   const allVotes = [...add10k, ...remove10k, ...keepTheSameTarget, ...add20k];

   return allVotes?.length || 0;
};

export const hasSomeoneVoted = (voteDoc) => {

   const add10k = voteDoc?.add10k || [];
   const add20k = voteDoc?.add20k || [];
   const remove10k = voteDoc?.remove10k || [];
   const keepTheSameTarget = voteDoc?.keepTheSameTarget || [];

   const allVotes = [...add10k, ...remove10k, ...keepTheSameTarget, ...add20k];

   return allVotes?.length > 0 || false;
};
