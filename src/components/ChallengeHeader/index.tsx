import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Colors, View, Text, SegmentedControlItemProps, TouchableOpacity } from "react-native-ui-lib";
import {
   AntDesign, SimpleLineIcons, MaterialIcons
} from '@expo/vector-icons';
import EpicBadge from '../../components/EpicBadge';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../config/Routes';
import firebaseInstance from '../../config/Firebase';
import { getChallengeData, getTodayData } from 'helpers/playersDataHelpers';
import ChallengeDayTargets from 'components/ChallengeDayTargets';
import Box from 'components/Box';
import SectionHeader from 'components/SectionHeader';
import { inject, observer } from 'mobx-react';
import {
   dayNumberOfChallenge, startDateLabel, since
} from 'helpers/dateHelpers';
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
const firestore = firebaseInstance.firestore;

import TodayChallengeGoalSmall from "components/TodayChallengeGoalSmall";
import CurrentPosition from "modules/ChallengeArena/components/CurrentPosition";
import DailyTargetCalendar from "components/DailyTargetCalendar";
import LinearChartChallengeLast7 from "components/LinearChartChallengeLast7";
import EpicBadgeSimpleJourney from "components/EpicBadgeSimpleJourney";
import ButtonLinear from "components/ButtonLinear";
import { hexToRgbA } from "helpers/generalHelpers";
import NextStreakTarget from "./NextStreakTarget";
import Activities from "../Challenge/Activities";
import ChangeLevel from "./ChangeLevel";
const badgeLevels = ['Beginner', 'Expert', 'Guru'];
const filterSegments: SegmentedControlItemProps[] = [
   { label: 'beginner' },
   { label: 'expert' },
   { label: 'guru' },
];







const ChallengeHeader = (props) => {
   const [filterSegmentIndex, setfilterSegmentIndex] = useState(0);
   const { navigate } = useNavigation();

   const {
      smashStore,
      challengesStore,
      challenge,
      accentColor,
   } = props;


   const {
      kFormatter,
      stringLimit,
      setMasterIdsToSmash,
      journeySettings = {}
   } = smashStore;


   const {
      playerChallengeHashByChallengeId,
   } = challengesStore;

   const challengeId = challenge?.id || playerChallenge?.challengeId || false;

   const playerChallenge = playerChallengeHashByChallengeId?.[challengeId] || false;

   const playerChallengeDoc = playerChallenge || challenge;

   const alreadyPlaying = playerChallenge;
   
   const { uid } = firebaseInstance.auth.currentUser;

   const challengeName = playerChallenge?.challengeName || challenge.name;
 

   const { dailyTargets = {} } = challenge;

   const durations = Object.values(journeySettings?.durations) || [];

   const goToChallengeArena = () => {
      smashStore.smashEffects();
      navigate(Routes.ChallengeArena, {
         uid,
         challengeId: playerChallenge.challengeId,
         playerChallenge,
      });
   };

  
 
 
   // const onChangeLevel = (index) => {
   //    setfilterSegmentIndex(index);
   //    setPlayerChallengeLevel(index + 1);
   // };

   const playerChallengeData = playerChallengeDoc;

   const selectedLevel =
      playerChallengeDoc?.selectedLevel > 0
         ? parseInt(playerChallengeDoc?.selectedLevel)
         : 1;
   const colorEnd = playerChallenge?.colorEnd || '#000';

   const rgbaEnd = hexToRgbA(colorEnd, 0.8);

   const smashActivities = () => {
      playerChallenge?.masterIds ? setMasterIdsToSmash(playerChallenge?.masterIds) : null;
   };



   return (
      <View>

         {/* <View
            flex
            centerV
            

            marginB-8
            style={{ marginTop: 0 }}> */}

               <ChangeLevel {...{badgeLevels, challengeId, setfilterSegmentIndex, playerChallengeDoc}} />
           
        
        
         {/* </View> */}

         <View padding-16 row centerV>

            <View marginL-16 flex paddingR-16>
               {/* <TouchableOpacity
                  onPress={() =>
                     (smashStore.tutorialVideo =
                        smashStore?.settings?.tutorials?.challenges?.firstChallenge)
                  }>
                  <Text>View Tutorial</Text>
               </TouchableOpacity> */}
               <Text B18 color28>
                  {stringLimit(challengeName, 25)}
               </Text>
               <View row marginT-8>
                  <View centerV row>
                     <MaterialIcons
                        name={'person-pin'}
                        size={14}
                        color={colorEnd}
                     />
                     <Text R12 color6D marginL-4>
                        {challenge.playing || 0} PARTICIPATING
                     </Text>
                     
                  </View>
                  
               </View>
          
            
                     {/* <Text marginL-4 R12 marginT-4 secondaryContent>{challenge?.description}</Text> */}
                   <NextStreakTarget challengeId={playerChallenge?.challengeId || challenge.id} color={colorEnd} />
                     
                 
            </View>
            <View centerV>
               <View>
                  {alreadyPlaying ? <EpicBadgeSimpleJourney
                     {...{ kFormatter, playerChallengeData }}
                     playerChallenge={playerChallengeDoc}
                     displayType="selectedTarget"
                     challenge={challenge}
                     challengeData={getChallengeData(challenge) || false}
                     size={100}
                     hideDate={alreadyPlaying ? false : true}
                  /> : <EpicBadge
                     {...{ kFormatter, playerChallengeData }}
                     playerChallenge={playerChallengeDoc}
                     displayType="selectedTarget"
                     challenge={challenge}
                     challengeData={getChallengeData(challenge) || false}
                  // hideDate={alreadyPlaying ? false : true}
                  />}
               </View>
            </View>
         </View>
                     

         {/* {alreadyPlaying && <SectionHeader title="Your Current Position" />} */}

             
         {/* <SectionHeader title="Your Current Challenge:" />
<Box><View padding-16>
                  <Text center R14 marginT-0 secondaryContent >Get a 7 Day Win Streak!</Text></View></Box> */}


         {alreadyPlaying && (
            <>
               {/* <SectionHeader title="Goal Today" top={8} /> */}
               <View row flex>

                  <TodayChallengeGoalSmall
                  {...{
                     playerChallenge,
                     goToChallengeArena,
                  }}
               />
                  <CurrentPosition
                     playerChallenge={playerChallengeDoc}
                     smashStore={smashStore}
                     accentColor={accentColor}
                     playerChallengeData={playerChallengeData}

                  />

               </View>
      
               {alreadyPlaying && <ButtonLinear title="SMASH" colors={[colorEnd, rgbaEnd]} onPress={smashActivities} />}
               {/* <ChallengePlayersImFollowingScrollView  {...{ smashStore, challengesStore, challenge }} /> */}
               {alreadyPlaying && <SectionHeader
                  title="Last 7 Days Stats"
                  style={{ marginTop: 16 }}
                  subtitle={
                     <Text R12 centerV secondaryContent marginR-8>
                        Day {dayNumberOfChallenge(playerChallenge)}
                        {/* of{' '}
                        {daysInChallenge(playerChallenge)}{' '} */}
                     </Text>
                  }
               />}
               {alreadyPlaying && (
                  <View paddingR-16><LinearChartChallengeLast7
                     playerChallenge={playerChallenge}
                     graphHeight={100}
                  /></View>
               )}

               {alreadyPlaying && <SectionHeader

                  style={{ marginTop: 16 }}
                  title="Last 7 Days Targets"
                  // subtitle={
                  //    <Text centerV secondaryContent>
                  //       Day {dayNumberOfChallenge(playerChallenge)} of{' '}
                  //       {daysInChallenge(playerChallenge)}{' '}
                  //    </Text>
                  // }
               />}
               {/* <Box style={{ paddingHorizontal: 16, paddingBottom: 8 }}> */}
               {alreadyPlaying && <View paddingH-16><ChallengeDayTargets item={playerChallenge} /></View>}
               {/* </Box> */}

               <SectionHeader title="Daily Target Calendar" top={16} />
               <DailyTargetCalendar item={playerChallenge} />

               {/* <SectionHeader
                  style={{ marginTop: 16 }}
                  title="Streaks"
                  subtitle={<Text centerV secondaryContent></Text>}
               />*/}
               {/* <ChallengeStreaks challenge={challenge} challengesStore={challengesStore} /> */}

            </>
         )}

         {alreadyPlaying && (
            <View row marginB-16 marginH-16>
               <SimpleLineIcons name={'calendar'} size={18} color={Colors.color6D} />
               <Text R14 marginH-16>
                  Playing since {startDateLabel(playerChallenge)} - ( {since(playerChallenge)} )
               </Text>
            </View>
         )}


<SectionHeader title={'Habits Included'} top={16} />
<Box>
            <View paddingH-24 paddingT-24 paddingB-16>
         <Activities masterIds={challenge?.masterIds} notPressable={false} />
         </View>
         </Box>
         
         <View style={{height: 16}} />


         {/* <ChallengeActivities challenge={challenge} challengesStore={challengesStore} smashStore={smashStore} alreadyPlaying={alreadyPlaying} /> */}

         <View row marginB-0 marginH-16>
            <SimpleLineIcons name={'badge'} size={18} color={Colors.color6D} />
            <View marginH-16>
               <Text R14 marginB-16>
                  There are {durations.length} streaks badges available for this challenge. Reach the
                  daily goal for {durations?.map((d, index) => {

                     const isLast = durations.length - 1 === index;

                     const isSecondToLast = durations.length - 2 === index;

                     const separator = isSecondToLast ? ' or ' : isLast ? ' days. ' : ', '
                     return (d.duration + separator)

                  })}
               </Text>

               {/* {alreadyPlaying && false && (
                  <Text R14>View your badges on your profile.</Text>
               )} */}
            </View>
         </View>

         <View row marginB-16 marginH-16>
            <SimpleLineIcons name={'star'} size={18} color={Colors.color6D} />
            <View marginH-16>
               <Text R14 marginB-16>
                  {`There are 3 daily (${challenge?.targetType == 'qty'
                     ? challenge.unit
                     : 'points '}) goal levels for this challenge:`}
               </Text>
               {dailyTargets ? (
                  Object.keys(dailyTargets).map((t, i) => {
                     const level = badgeLevels[i];
                     return (
                        <View marginV-4>
                           <Text H14 color={Colors.black} marginL-0 style={{ paddingLeft: 0 }}>

                              {level.toUpperCase()}:{' '}
                              <Text R14>
                                 {kFormatter(dailyTargets[i])}

                                 /day
                              </Text>
                           </Text>
                        </View>
                     );
                  })
               ) : (
                  <Text>No targets</Text>
               )}
            </View>
         </View>

         {/* {alreadyPlaying && (
            <View row marginB-16 marginH-16>
               <Fontisto name={'play'} size={12} color={Colors.color6D} />
               <Text R14 marginH-16>
                  To Play, Press the Smash Button at the Bottom, Center of your
                  screen.
               </Text>
            </View>
         )} */}

         {/* {alreadyPlaying && false && (
            <View row marginB-16 marginH-16>
               <Fontisto name={'hashtag'} size={12} color={Colors.color6D} />
               <Text R14 marginH-16>
                  Post your achievements on social media: Tag Us
                  @smashappchallenges #SmashAppChallenges.
               </Text>
            </View>
         )} */}
      </View>
   );
};

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ChallengeHeader));

const styles = StyleSheet.create({});

