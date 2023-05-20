import Tag from 'components/Tag';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import SmartImage from '../../../../components/SmartImage/SmartImage';
import {
   View,
   Image,
   Text,
   Colors,
   Assets,
   ProgressBar,
   TouchableOpacity,
   Button,
} from 'react-native-ui-lib';
import SwipeableItem from 'components/SwipeableItem/SwipeableItem';
import Routes from '../../../../config/Routes';
import moment, { ISO_8601 } from 'moment';
import EpicBadge from '../../../../components/EpicBadge';
import { AntDesign } from '@expo/vector-icons';
import { getDay } from 'date-fns/esm';

import {
   getPlayerChallengeData,
   getDaysLeft,
} from 'helpers/playersDataHelpers';
import LinearChartChallenge from 'components/LinearChartChallenge';
import {
   daysInChallenge,
   daysLeftInChallenge,
   dayNumberOfChallenge,
} from 'helpers/dateHelpers';
import {
   challengeDaysSmashed,
   challengeDaysActive,
   getCompareChallengeDaysSmashed,
   kFormatter,
} from 'helpers/generalHelpers';
import Rank from 'nav/Rank';
import SectionHeader from 'components/SectionHeader';
import Box from 'components/Box';
import ChallengeDayTargets from 'components/ChallengeDayTargets';
import EpicBadgeSimple from 'components/EpicBadgeSimple';
import EpicBadgeSimpleJourney from 'components/EpicBadgeSimpleJourney';
import NextStreakTarget from 'components/ChallengeHeader/NextStreakTarget';
import ChallengeJourney from "components/ChallengeJourney";
import { width } from '../../../../config/scaleAccordingToDevice';
import firebaseInstance from '../../../../config/Firebase';
import { ActivityIndicator } from 'react-native';
function theRank(props) {
   return (
      <View row centerV spread>
         <Text secondaryContent marginT-8>
            You're coming {props.ordinal_suffix_of(props.myRank)}!
         </Text>
         {props.streakDoc.onGoingStreak > 0 && (
            <Text secondaryContent marginT-8>
               🔥{props.streakDoc.onGoingStreak}
            </Text>
         )}
      </View>
   );
}
const iconBox = { minWidth: 16 }
function ChallengeInfo(props) {
   const { playerChallenge } = props;
   return (
      <View >
         {/* <View row centerV>
            <AntDesign name={'star'} size={14} color={props.color} />

            <Text color6D marginL-4>
               {props.selectedScore || 0}{' '}
            </Text>
         </View> */}
         <View marginT-2 row centerV>
            {/* <View style={{ ...iconBox }} centerV> 
               <AntDesign name={'star'} size={14} color={playerChallenge.colorStart} />
            </View> */}
            <Text M12 secondaryContent >Goal Today: {playerChallenge.selectedTodayScore} / {playerChallenge.selectedTodayTarget}</Text>
         </View>
         {/* <View marginT-7 row centerV >
            <View style={{ ...iconBox }} centerV>
               <AntDesign name={'star'} size={14} color={playerChallenge.colorEnd} />
            </View>
            <Text color6D marginL-4 M12>
               DAILY AVERAGE: {kFormatter(props.dailyAverage) || 0}
            </Text>
         </View> */}
         {/* <NextStreakTarget challengeId={playerChallenge.challengeId} /> */}
         {false && <View row centerV marginT-7>
            <View style={{ ...iconBox }} centerV>
            <AntDesign name={'calendar'} size={14} color={props.color} />
            </View>
            <Text color6D marginL-4 M12>
               {daysLeftInChallenge(props.playerChallenge)} DAYS LEFT
            </Text>
         </View>}

      </View>
   );
}

const MyChallenge = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props: any) => {
      const { navigate } = useNavigation();
      const {
         playerChallengeInitial,
         challengeId,
         smashStore,
         index,
         team,
         challengesStore,
      } = props;

    

      const {
         kFormatter,
         stringLimit,
      } = smashStore;
     
      const playerChallenge =  getPlayerChallengeData(playerChallengeInitial);

      const [loaded, setLoaded] = useState(true);
      useEffect(() => {
         const loadTime = (index + 1) * 200;

         setTimeout(() => {
            setLoaded(true);
         }, loadTime + 200);

         return () => {};
      }, []);



   
  
      const goToArena = () => {
         if (team) {
            smashStore.smashEffects();
            challengesStore.setActivePlayerChallengeDocId(playerChallenge);
            navigate(Routes.ChallengeArena, { playerChallenge, team });
         } else {
            smashStore.smashEffects();
            navigate(Routes.ChallengeArena, { playerChallenge });
         }
      };
      const badgeSize = 90;

     
      if (!loaded) {
         return <ActivityIndicator />;
      }

      return (
         <View style={{ borderBottomWidth: 0, paddingHorizontal: 8, marginBottom: 8 }}>
           
      
            <TouchableOpacity
               onPress={goToArena}
               // marginH-12
               marginT-16
               marginB-0
               paddingV-8
               paddingT-8
               paddingB-16
               centerV
               style={{
                  borderRadius: 6,
                  shadowColor: '#ccc',
                  shadowOffset: {
                     height: 1,
                     width: 1,
                  },
                  shadowOpacity: 0.52,
                  shadowRadius: 12.22,
                  elevation: 3,
               }}
               backgroundColor={Colors.white}>
               <View
                  row
                  style={{
                     marginHorizontal: 0,
                     backgroundColor: '#FFF',
                     overflow: 'hidden',
                     marginBottom: 0,
                     paddingLeft: 0,
                     borderRadius: 7,
                  }}>

                  <View paddingL-24 flex paddingT-16 centerV>
                     <View paddingL-2 row paddingR-16 centerV marginB-0>
                        <Text H18 color28 style={{ fontSize: 20 }}>
                           {/* {daysInChallenge(playerChallenge)} Day{' '} */}
                           {stringLimit(playerChallenge?.challengeName, 25) ||
                              'loading'}{' '} 
                           {/* ({compareArray?.[0]}/{compareArray?.[1]}) */}
                        </Text>
                        <Rank playerChallenge={playerChallenge} colorStart={playerChallenge.colorStart} />
                        {/* <Text secondaryContent M14> (Day {playerChallenge.dayNumberOfChallenge})</Text> */}
                       </View>
                       <Text M12 marginL-2 secondaryContent >Goal Today: {playerChallenge.selectedTodayScore} / {playerChallenge.selectedTodayTarget}</Text>
{/* 
                     <ChallengeInfo
                        dailyAverage={dailyAverage}
                        playerChallenge={playerChallenge}
                        selectedTarget={selectedTarget}
                        selectedScore={selectedScore}
                        color={color}
                     /> */}
<View paddingT-16>
               <ChallengeDayTargets small item={playerChallenge} />
               </View>
                  </View>

                  <View marginH-16 marginT-16 style={{ height: badgeSize }}>
                     {/* <Text>asd</Text> */}
                     <EpicBadgeSimpleJourney
                        playerChallenge={playerChallenge}
                        kFormatter={kFormatter}
                        size={badgeSize}
                        index={index}

                     />
                  </View>
               </View>
             

            </TouchableOpacity>
        
            <View  paddingH-16 padding-4 style={{backgroundColor: '#1C1C1C', borderBottomRightRadius: 4,borderBottomLeftRadius: 4}}>
            <ChallengeJourney playerChallenge={playerChallenge} small />
            </View>
         </View>
      );
   }),
);

export default MyChallenge;
