import { View, Text } from 'react-native-ui-lib'
import React, { useEffect } from 'react'
import { collection, where, query, onSnapshot, orderBy, doc } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { inject, observer } from 'mobx-react';

const Streak = ({ invertColor, playerChallenge,challengesStore }) => {

  const {setStreak, streaksHash} = challengesStore;
  console.log('render streak item')
  //  const playerChallenge = myPlayerChallengesFullHash?.[playerChallengeId]  || false;
  const streakKey = `${firebaseInstance.auth.currentUser.uid}_${playerChallenge.challengeId}`;

  // const streakDoc = streaksHash?.[streakKey] || false;
  const [streakDoc, setStreakDoc] = React.useState(streaksHash?.[streakKey] || false)

  useEffect(() => {

    const { uid } = firebaseInstance.auth.currentUser;

    const streakRef = doc(collection(firestore, "challengeStreaks"), `${uid}_${playerChallenge.challengeId}`);

    const unsubscribeToStreaks = onSnapshot(streakRef, (snap) => {
      if (snap.exists()) {
        const streak = snap.data();

        if((streak.lastUpdatedAt != streaksHash?.[streakKey]?.lastUpdatedAt && streak.id)){
          setStreak(streak);
          setStreakDoc(streak)
        }
    
        // console.log('set streak item',streak.challengeName)
      }
    });

    return () => {
      if (unsubscribeToStreaks) {
        unsubscribeToStreaks();
      }
    };
  }, []);


  const {onGoingStreak = 0, highestStreak = 0} = streakDoc;


  const hasCurrentStreak = onGoingStreak > 0;
  // console.log('render streaks', playerChallenge.challengeName, streakDoc ? 'loaded' : 'nope')
// 
  if (onGoingStreak == 0) return (<View row centerV style={{ flexWrap: 'wrap', paddingBottom: 4 }} >


    <Text secondaryContent={!hasCurrentStreak} white={invertColor} R14 >{highestStreak > 0 ? '🔥 Highest: ' + highestStreak + ' Day Streak' : 'No Streaks Yet'}</Text>
  </View>)


  return (
    <View row centerV style={{ flexWrap: 'wrap', paddingBottom: 0 }} >

      <Text R14 >🔥 {onGoingStreak > 0 && 'Current Streak: ' + onGoingStreak + ' Days!'}</Text>
    </View>
  )
}

export default inject(
  'smashStore',
  'challengesStore',
  'teamsStore',
)(observer(Streak));