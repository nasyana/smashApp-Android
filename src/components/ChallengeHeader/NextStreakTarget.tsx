import { View, Text } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react'
import firebaseInstance from 'config/Firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NextStreakTarget = ({smashStore, challengesStore, challengeId, color = '#333'}) => {


    const [nextStreakTarget, setNextStreakTarget] = React.useState(false);
    const {uid} = firebaseInstance?.auth?.currentUser;

    const { journeySettings = {} } = smashStore;

    const { durations = {} } = journeySettings;


    const { streaksHash,  getNextStreak,isGreaterThanHighestDuration  } = challengesStore;

  
    const streakKey = `${uid}_${challengeId}`;
    const [streakDoc, setStreakDoc] = React.useState(false)

    useEffect(() => {
    
     const streakDoc = streaksHash[streakKey] || false;
  
     setStreakDoc(streakDoc)
    
      return () => {
     
      }
    }, [streaksHash[streakKey]])


    const highestStreak = streakDoc?.highestStreak || 0;
    const onGoingStreak = streakDoc?.onGoingStreak || 0;

    const reachedHighestStreak = isGreaterThanHighestDuration(highestStreak, durations);

useEffect(() => {

const nextStreak = getNextStreak(highestStreak, durations);
setNextStreakTarget(nextStreak)
// alert(nextStreak)
  return () => {

  }
}, [])

    if(!nextStreakTarget){return null}
  return (
    <View centerV row marginT-4>
           <MaterialCommunityIcons
                        name={'target'}
                        size={14}
                        color={color}
                     />
     <Text marginL-4 R12  secondaryContent>{reachedHighestStreak ? "Woah you're a Champion! 🙌🏼🙌🏼" :(`Win ${nextStreakTarget || 'as many'} days in a row`)?.toUpperCase()}</Text>
    </View>
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(NextStreakTarget));