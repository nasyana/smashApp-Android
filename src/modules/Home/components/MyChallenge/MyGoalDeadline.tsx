import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import {
   View, Text,
   Colors, TouchableOpacity, ProgressBar
} from 'react-native-ui-lib';
import Routes from '../../../../config/Routes';

import { goalDateEnding, goalDayOf } from 'helpers/dateHelpers';
import { ActivityIndicator } from 'react-native';
import { numberWithCommas } from 'helpers/generalHelpers';
import { checkInfinity } from 'helpers/teamDataHelpers';
import { width } from 'config/scaleAccordingToDevice';
import { doc, onSnapshot } from 'firebase/firestore';
import { debounce } from 'lodash';
import firebaseInstance from 'config/Firebase';
import GoalAvatars from './GoalAvatars';
import MyGoalHeader from './MyGoalHeader'
const MyGoal = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props: any) => {
      const { navigate } = useNavigation();
      const {
         smashStore,
         challengesStore,
         index,
         goalId,
         goalDocFromNav = false
      } = props;

   
      const {
      } = smashStore;
     
      const uid = firebaseInstance?.auth?.currentUser?.uid;

      const [playerGoal, setPlayerGoal] = useState( {});

      const [loaded, setLoaded] = useState(true);
      useEffect(() => {
         const loadTime = (index + 1) * 200;

         setTimeout(() => {
            setLoaded(true);
         }, loadTime + 200);

         return () => {};
      }, []);



     
      if (!loaded) {
         return <ActivityIndicator />;
      }
      
      const goal = goalDocFromNav || challengesStore?.goals?.find(goal => goal.id == goalId) || {};

      /// If the goal is a contribution goal, then use the goal's start date to calculate the dayOf otherwise use the playerGoal's start date as it will be relative to the user's start date. 
      const dayOf = goal.allowOthersToHelp ? goalDayOf(goal.start) : goalDayOf(playerGoal.start);
      const dateEnding = goal.allowOthersToHelp ?  goalDateEnding(goal.start, goal.endDuration) : goalDateEnding(playerGoal.start, goal.endDuration);
      const totalDays = goal.endDuration;
      const percent = checkInfinity((dayOf / totalDays) * 100) || 0;
      const roundPercentOfDays = percent < 1 ? Math.ceil(percent / 100) : percent;
      const daysRemainingInGoal = (totalDays - dayOf) || totalDays;
  
      return (
       
                  <View>
<View row spread paddingH-24 marginT-8>
                       <Text M12 marginL-2 secondaryContent >Day {dayOf}</Text>
                       <Text M12 marginL-2 secondaryContent >Ends in {daysRemainingInGoal} days ({dateEnding})</Text>

                       </View>
                       <View paddingH-24 marginV-8>
               <ProgressBar
                  progress={roundPercentOfDays }
                  progressColor={goal.colorStart}
                  style={{height: 4}}
               /></View>
               </View>
      );
   }),
);

export default MyGoal;
