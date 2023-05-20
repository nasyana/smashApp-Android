


import React from 'react';
import { FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import {View, Text} from 'react-native-ui-lib'

import TodayTargetChallengesListItem from '../modules/Home/components/TodayTargetChallengesListItem/TodayTargetChallengesListItem';



const MyTodayCompletedChallenges = ({challengesStore}) => {

  const {myTodayCompletedChallenges} = challengesStore;

  
    const MemoizedTodayTargetChallengesListItem = React.memo(TodayTargetChallengesListItem);

    const renderItem = React.useCallback(({ item, index }) => {
        
      const playerChallengeId = item?.id;

      if(!playerChallengeId){return null}
  
      return (
        <MemoizedTodayTargetChallengesListItem
      
            playerChallengeId={playerChallengeId}
      
            initialPC={item}
        
          key={playerChallengeId}
        />
      );
    }, [myTodayCompletedChallenges.length]);


  return ( 
    <FlatList
    // horizontal={true}
    estimatedItemSize={190}
  
    data={myTodayCompletedChallenges}
    renderItem={renderItem}
    keyExtractor={(item, index) => {
      return item.id || index + 'N';
    }}
    />
  )
}

export default inject(
    'smashStore',
    'challengesStore',
    'teamsStore',
 )(observer(MyTodayCompletedChallenges));