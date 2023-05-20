import React, { useState, useEffect } from 'react';
import firebaseInstance from '../config/Firebase';
import {httpsCallable } from 'firebase/functions';
import { inject, observer } from 'mobx-react';
import AnimatedView from 'components/AnimatedView';
import { Text, View, Colors } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';

const Rank = ({playerGoal = false, smashStore, today = false, colorStart = '#000'}) => {


  const score = playerGoal.targetType == 'qty'  ? playerGoal.qty : playerGoal.score;
    const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState(null);
  
  const getPlayerGoalRank = async (goalId, uid) => {
    const getPlayerGoalRankFunction = httpsCallable(firebaseInstance.functions,'GetPlayerGoalRank');
  
    try {
      const response = await getPlayerGoalRankFunction({ goalId, uid });
      if (response.data.rank!== rank) {
        setRank(response.data.rank);
        setLoading(false);
      }
      console.log('User rank:', rank);
    } catch (error) {
      console.error('Error calling GetPlayerGoalRank function:', error);
    }
  };
  const { ordinal_suffix_of, uid } = smashStore;
  useEffect(() => {
    getPlayerGoalRank(playerGoal.goalId, playerGoal?.uid);
  }, [score,playerGoal?.uid]);


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
