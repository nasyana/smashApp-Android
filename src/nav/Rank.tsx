import React, { useState, useEffect } from 'react';
import firebaseInstance from '../config/Firebase';
import {httpsCallable } from 'firebase/functions';
import { inject, observer } from 'mobx-react';
import AnimatedView from 'components/AnimatedView';
import { Text, View, Colors } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';

const Rank = ({playerChallenge = false, smashStore, today = false, colorStart = '#000'}) => {

    const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState(null);
  
  const getRank = async () => {

    setLoading(true);
    try {
        const getRankFn = httpsCallable(firebaseInstance.functions,'GetPlayerRank');

      const response = playerChallenge?.challengeId ? await getRankFn({ challengeId: playerChallenge.challengeId, uid:playerChallenge.user.id  }) : setRank(10);
   
    // alert(JSON.stringify(response, null, 2));
    // if rank is different setRank
    if (response.data.rank!== rank) {
      setRank(response.data.rank);
      setLoading(false);
    }
    
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const { ordinal_suffix_of, uid } = smashStore;
  useEffect(() => {
    getRank();
  }, [playerChallenge?.dailyAverage]);


  if(loading){

    return <ActivityIndicator />
  }
  return   <AnimatedView
  style={{
     backgroundColor: today ? Colors.meToday : colorStart,
     borderRadius: 10,
     paddingHorizontal: 4,
     minHeight: 18,
     alignItems: 'center',
     justifyContent: 'center',
  }}

>
  <Text white B14 >
     <AntDesign name={'star'} size={10} />
     {rank > 0 ? ordinal_suffix_of(rank) : ''}
  </Text>
</AnimatedView>
  return (
    <View>
      {rank ? (
        <Text>Your rank: {rank}</Text>
      ) : (
        <Text>Loading rank...</Text>
      )}
    </View>
  );
};
export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(Rank));
