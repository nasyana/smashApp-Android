import React from 'react';
import { FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import {View, Text} from 'react-native-ui-lib'
import TodayTargetChallengesListItem from '../modules/Home/components/TodayTargetChallengesListItem/TodayTargetChallengesListItem';


const MyTodayIncompleteChallenges = ({challengesStore}) => {

  const {myTodayIncompleteChallenges} = challengesStore;
    const MemoizedTodayTargetChallengesListItem = React.memo(TodayTargetChallengesListItem);

    const renderItem = React.useCallback(({ item, index }) => {

   
      const playerChallengeId = item?.id;
      if(!playerChallengeId){return  null}
      return (
        <MemoizedTodayTargetChallengesListItem
        
        key={playerChallengeId}
            playerChallengeId={playerChallengeId}
            // goToChallengeArena={goToChallengeArena}
       
            incomplete
            initialPC={item}
        
          key={playerChallengeId}
        />
      );
    }, [myTodayIncompleteChallenges.length]);

  return (

    <FlatList

    estimatedItemSize={190}
    data={myTodayIncompleteChallenges}
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
 )(observer(MyTodayIncompleteChallenges));

