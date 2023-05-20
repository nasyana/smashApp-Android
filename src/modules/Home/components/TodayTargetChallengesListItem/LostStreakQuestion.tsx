import { TouchableOpacity, Text } from 'react-native-ui-lib'
import { inject, observer } from 'mobx-react';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react';
import { isInFuture } from 'helpers/dateHelpers';

const LostStreakQuestion = ({smashStore, challengesStore, playerChallenge: pChallenge, dayKey = false}) => {


  const [fixed, setFixed] = useState(false)

  const playerChallenge = challengesStore?.playerChallengesHash?.[pChallenge.id] || pChallenge;
  const { currentUser } = smashStore;
  const streakRepairs = currentUser?.streakRepairs || {};
  const hasStreakRepairsCount = streakRepairs?.[playerChallenge?.challengeId] > 0 ? streakRepairs?.[playerChallenge?.challengeId] : 0;
  const key = dayKey || smashStore?.todayDateKey
  const isQty = playerChallenge?.challengeType == 'qty'
  const score = isQty ? playerChallenge?.daily?.[key]?.qty : playerChallenge?.daily?.[key]?.score
  const hide = isInFuture(dayKey) || score >= playerChallenge?.daily?.[key]?.target || playerChallenge?.daily?.[key]?.repaired || false

  // get playerChallenge from store hash
 
  const setStreak = () => {

    smashStore.simpleCelebrate = {
      name: `Repair Streak!`,
      title: `Repair ${playerChallenge.challengeName} Streak!`,
      subtitle: `Aww you lost your streak yesterday! You have ${hasStreakRepairsCount} streak ${hasStreakRepairsCount == 1 ? 'repair' : 'repairs'} for ${playerChallenge.challengeName} if you want to use it?`,
      button: "Repair",
      buttonTwoText: "No Thanks",
      repair: true,
      dayKey: true,
      playerChallenge: playerChallenge,
      nextFn: async () => {
        
       const streak = await challengesStore.calculateAndRepairStreak(playerChallenge, dayKey)   
        // setTimeout(() => {
        
        smashStore.simpleCelebrate = { repaired: true, title: `${playerChallenge.challengeName} Streak Repaired!`,subtitle: `All Set! You're on a ${streak} Day Streak!🔥` }
        setFixed(true);
      // }, 1000)
    },
      bottomFn: () =>  {
        
        smashStore.simpleCelebrate = false; 
      
      
      }}
    }

    if(hide || fixed || !hasStreakRepairsCount){return null}
  return (
    <TouchableOpacity paddingH-24 right row centerV onPress={setStreak}>
      <Text B14>You lost your streak!😢</Text>
    </TouchableOpacity>
  )
}


export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(LostStreakQuestion));