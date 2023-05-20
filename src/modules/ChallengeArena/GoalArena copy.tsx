import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "components/Header";
import ButtonLinear from "components/ButtonLinear";
import Routes from "config/Routes";
import { useEffect, useState } from "react";
import {
   StyleSheet,
   ScrollView, Alert, ActivityIndicator
} from 'react-native';
import {
   Colors,
   ProgressBar,
   Text,
   View,
   TouchableOpacity,
   ActionSheet
} from 'react-native-ui-lib';
import { Feather } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import SmashButton from './components/SmashButton';
import { width } from '../../config/scaleAccordingToDevice';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import FeedPreview from './components/FeedPreview';
import SmartImage from '../../components/SmartImage/SmartImage';
import { hexToRgbA, kFormatter, moment, numberWithCommas, stringLimit } from "helpers/generalHelpers";
import { Vibrate } from '../../helpers/HapticsHelpers';
import firebaseInstance from "../../config/Firebase";
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Activities from "components/Challenge/Activities";
import GoalPlayersImFollowingScrollView from './GoalPlayersImFollowingScrollView.tsx';
import { checkInfinity } from "helpers/teamDataHelpers";
import { goalDateEnding, goalDayOf } from "helpers/dateHelpers";
import Box from "components/Box";
import GoalAvatars from "../Home/components/MyChallenge/GoalAvatars";
const Tab = createMaterialTopTabNavigator();
const imageDimensions = {  
   height: 170,
   marginBottom: 16
}
const GoalArena = (props) => {

   const { smashStore, challengesStore } = props;

   const {
      toggleMeInGoal,
      playerGoalHashByGoalId,
      goalHashByGoalId,
   } = challengesStore;

   const {setUniversalLoading} = smashStore;

   const [loading, setLoading] = useState(false);
   // const route = useRoute();
   const { route } =
   props;


   const [loadingImage, setLoadingImage] = useState('');
const { goalDoc = {}, playerGoalDoc = {} } = route?.params || {};
const goalId = goalDoc?.id || false;
// alert(JSON.stringify(goalDoc))
const { uid } = firebaseInstance.auth.currentUser;
   const [playerGoal, setPlayerGoal] = useState({});
   const [picture, setPicture] = useState(playerGoal?.picture || {});
   // const playerGoal = playerGoalHashByGoalId?.[goalId] || {};
   const { navigate, goBack, } = useNavigation();
const [showJoinOptions, setShowJoinOptions] = useState(false);
   // const goalDoc =
   //    route?.params?.goalDoc || false;

   const goalInitial = props?.route?.params?.goalDoc || false;


   console.log('playerGoal', playerGoal)
   // alert(JSON.stringify(goalDoc))

   const EditGoal = () => {

      navigate(Routes.CreateGoal, { goalDoc: goalDoc })

   }

   const [goal, setGoal] = useState(goalDoc || goalHashByGoalId?.[goalId] || {});;


   const onPressLibrary = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         aspect: [16, 9],
         durationLimit: 60,
         mediaTypes:
            Platform.OS === 'ios'
               ? ImagePicker.MediaTypeOptions.All
               : ImagePicker.MediaTypeOptions.Images,
      });
   
      if (result.cancelled) {
         
         setLoadingImage(false);
         return;
      }
      setPicture(result);
      setLoadingImage(true);
   
      const picture = await smashStore.uploadImage(result);

      // save picture in playerGoal document 
      const playerGoalDocRef = doc(firebaseInstance.firestore, "playerGoals", `${uid}_${goalId}`);
      await updateDoc(playerGoalDocRef, { picture });
      setPicture(picture);
      setLoadingImage(false);
   };

   useEffect(() => {

      const getGoal = async () => {
         if (!goalId) {
            console.warn("No goalId provided, cannot fetch goal", goalDoc);
            return;
         }

         const goalDocRef = doc(firebaseInstance.firestore, "goals", goalId);

         // Create a debounced version of setGoal
         // const debouncedSetGoal = debounce(setGoal, 300);

         // Set up an onSnapshot listener for the goalDocRef
         const unsubscribe = onSnapshot(goalDocRef, (goalDoc) => {
            if (goalDoc.exists()) {
               const goalData = goalDoc.data();
               console.log("Fetched goal data:", goalData);

               setGoal(goalData)
               // Do something with the goalData
            } else {
               setGoal(false)
               console.warn("No goal found for the given goalId");
            }
         });

         return () => {
            // Clean up the onSnapshot listener when the component is unmounted or goalId changes
            unsubscribe();
         };
      };

      getGoal();
   }, []);
   
   useEffect(() => {
      console.log('goalDocxx', goalDoc);
   
      const getPlayerGoalByGoalId = async () => {
         if (!goalId) {
            console.warn("No goalId provided, cannot fetch playerGoal", goalDoc);
            return;
         }
   
         const playerGoalDocRef = doc(firebaseInstance.firestore, "playerGoals", `${uid}_${goalId}`);
         
         // Create a debounced version of setPlayerGoal
         // const debouncedSetPlayerGoal = debounce(setPlayerGoal, 300);
   
         // Set up an onSnapshot listener for the playerGoalDocRef
         const unsubscribe = onSnapshot(playerGoalDocRef, (playerGoalDoc) => {
            if (playerGoalDoc.exists()) {
               const playerGoalData = playerGoalDoc.data();
               // console.log("Fetched playerGoal data:", playerGoalData);
   
               setPlayerGoal(playerGoalData)
               if(playerGoalData?.picture){

                  setPicture(playerGoalData?.picture || {});
               }
           
               // Do something with the playerGoalData
            } else {
               setPlayerGoal(false)
               console.warn("No playerGoal found for the given goalId");
            }
         });
   
         return () => {
            // Clean up the onSnapshot listener when the component is unmounted or goalId changes
            unsubscribe();
         };
      };
   
      getPlayerGoalByGoalId();
   }, []);
   


  

   let team = false;
   //props?.route?.params?.team || false;
  






   const { currentUser } = smashStore;
   const alreadyPlaying = goal?.joined?.includes(uid) && playerGoal.active;

   const share = () => {

      Vibrate()
      challengesStore.shareGoal(goal);
   };

   const accentColor = playerGoal?.colorStart || Colors.buttonLink;
   const getButtonActionLabel = (): string => {
      return alreadyPlaying ? 'Leave' : goal.allowOthersToHelp == true ? 'Join Goal' : 'Try to reach this goal';
   };

   const back = () => {

      // goBack();
      navigate(Routes.MainTab)
   };

   const gradientColorStart = hexToRgbA(playerGoal?.colorStart, 0.4);

   const gradientColorEnd = hexToRgbA(playerGoal?.colorEnd, 1);

   const confirmChallengeDuration = (goal, toggleFunc) => {
      challengesStore.setChallengeToJoin(goal);
   };

   const askPlayerHowTheyWantToPlay = () => {

      setShowJoinOptions(true);
      // toggleMeInGoal(goal, currentUser, false);
   }
   if (!goal.name) {
      return (
         <View flex>
            <Header
               title={'Loading Goal'}
               back
               backFn={back}
               noShadow
               titleColor={'#aaa'}
            />
         </View>
      );
   }

 

   const isAdmin = goal?.uid == uid;



const dayOf = goal?.start ? goalDayOf(goal?.start) : 1;
const dateEnding = goal.start &&  goal.endDuration ? goalDateEnding(goal.start, goal.endDuration) : moment().format('ll');
const totalDays = playerGoal?.endDuration;
const percent = checkInfinity((dayOf / totalDays) * 100) || 0;
const roundPercentOfDays = percent < 1 ? Math.ceil(percent / 100) : percent;

const scoreLabel = playerGoal.targetType == 'qty' ? 'Quantity' : 'Score';

let playerGoalScore = goal.targetType == 'qty' ? playerGoal?.qty || 0 : playerGoal?.score || 0;


const contribution = goal.targetType == 'qty' ?  goal.contributionQty || 0 : goal.contributionScore || 0;

const score = goal?.allowOthersToHelp ? contribution : playerGoalScore;

const progress = checkInfinity(score / goal.target * 100) || 0 // get percentage of goal completed using goal.target and score 
const roundUpToClosestTenth = progress < 1 ? Math.ceil(progress / 100)  : progress// round up to closest percent

const daysRemainingInGoal = (totalDays - dayOf) || totalDays;

const ptsLabel = goal.targetType == 'qty' ? '' : 'pts';

const joinGoalAsContributor = () => {

   smashStore.simpleCelebrate = {
      name: `You joined ${goalDoc.name} Goal!`,
      title: `Nice!`,
      subtitle: `Help ${goalDoc?.user?.name} Reach ${kFormatter(goalDoc.target)} 🔥🔥🔥 ${daysRemainingInGoal} days left and ${score == 0 ? 'noone has scored yet!' : 'so far '+ score + ' '+ ptsLabel }!`,
      button: "Got it! Let's Go!",
      nextFn: false,
   };

   toggleMeInGoal(goal, currentUser, false, 'contributor');
}

const joinGoalAsCompetitor = () => {

   smashStore.simpleCelebrate = {
      name: `You joined ${goalDoc.name} Goal!`,
      title: `Nice!`,
      subtitle: `You're playing to reach ${kFormatter(goalDoc.target)}${ptsLabel} 🔥🔥🔥 ${goal.endDuration} days! Day 1 is today. Good luck!`,
      button: "Got it! Let's Go!",
      nextFn: false,
   };


   toggleMeInGoal(goal, currentUser, false, 'competitor');
}



   let showOptions = [

      {
         label: '🎯 Help to reach target',
         onPress: () => joinGoalAsContributor(),
      },
      {
         label: '🔗 Clone Goal',
         onPress: () => joinGoalAsCompetitor(),
      }

   ]

   const qtyUnit = goal.targetType == 'qty' ? stringLimit((Object.values(goal?.actions)[0]?.text || 'units'), 10) :  'points';
   const playingLabel = goal.targetType == 'qty' ? 'Playing' : 'Participating';
   console.log('render ChallengeArena');
   return (
      <View flex>
         <Header
            title={'Goal'}
            back
            backFn={back}
            noShadow
            titleColor={'#aaa'}
            challengeId={goalId}
            rightFn={share}
            btnRight={
               <View row>
                  <TouchableOpacity onPress={share} >
                     <Feather name={'share'} size={25} color={'#333'} />
                  </TouchableOpacity>
                  {isAdmin && (
                     <TouchableOpacity marginL-16 onPress={EditGoal}>
                        <Feather name={'settings'} size={25} color={'#333'} />
                     </TouchableOpacity>
                  )}
               </View>
            }
         />
         {/* <View
            style={{
               margin: 0,
               height: 100,
               width: width,
               backgroundColor: '#ccc',
               borderRadius: 0,
               position: 'absolute', top: 20
            }}>
            <SmartImage
               uri={picture?.uri}
               preview={picture?.preview}
               style={{
                  margin: 0,
                  height: 300,
                  width: width,
                  backgroundColor: '#ccc',
                  borderRadius: 0,
               }}
            />
         </View> */}
           
         <ScrollView
            contentContainerStyle={{ paddingBottom: 90, paddingTop: 0 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            bounces={true}>
            <View style={{ backgroundColor: Colors.colorF2, paddingTop: 16 }}>

            {false &&<Box style={{  paddingTop: 16, marginTop: 24 }}>
            <TouchableOpacity onPress={onPressLibrary} center  style={{...imageDimensions}}>
       <SmartImage
          uri={picture?.uri}
          preview={picture?.preview}
          style={{
           ...imageDimensions,
            width: width - 64,
            borderColor: '#eee',
            borderRadius: 4,
            borderWidth: 1,
            position: 'absolute',
          }}
        />


          {loadingImage ? <ActivityIndicator /> : !picture?.uri && <Text R14 style={{margin: 16, textAlign: 'center'}}>{'Select Personal Motivational Image'}</Text>}
      </TouchableOpacity>
    
    
{/* <Text grey10 text60 margin-8 marginH-24>{targetTypeHeaders[targetTypeIndex]} Target to Reach</Text>
<View height={1} backgroundColor={Colors.line} marginB-16 /> */}


</Box>}

               <Box style={{ marginTop: 8, paddingTop: 8 }}>
                  <View

                     style={{
                        marginHorizontal: 0,
                        backgroundColor: '#FFF',
                        // overflow: 'hidden',
                        marginBottom: 0,
                        paddingLeft: 0,
                        borderRadius: 7,
                        paddingBottom: 24
                     }}>

                     <View paddingL-24 flex paddingT-16 centerV>
                        <View paddingL-0 paddingR-16 centerV marginB-8>
                        <Text R12 secondaryContent>
                              {goal.allowOthersToHelp ? goal.name : 'Personal Goal' || 'loading'}{' '}
                           </Text>
                        <View spread row paddingR-8 centerV>
                        <View row centerV>
                        {/* {!goal.allowOthersToHelp && <GoalRank playerGoal={playerGoal} /> } */}
                        <Text H18 color28  style={{ fontSize: 18, marginLeft:  0}}>
                           {/* {stringLimit(goal?.name, 25) ||  'loading'}{' '}  */}
                           Reach {kFormatter(goal?.target)} {qtyUnit}
                        </Text>
                        
                        </View>

                       <View style={{backgroundColor: '#eee', paddingHorizontal: 8, borderRadius: 8}}>
                        <Text M12 secondaryContent >
                               {/* {stringLimit(goal?.name, 25) ||  'loading'}{' '}  */}
                               {goal.endDuration} DAYS
                        </Text>
                        </View>
                       
                        </View>
                       
                      
                         
                           {/* stringLimit(goal?.description, 55) */}
                        </View>
                      
                        <View row spread paddingR-24 centerV>
                        <View row centerV>
                        
                       {goal.allowOthersToHelp && <Text M12 marginL-0 secondaryContent >{goal?.joined?.length} {playingLabel}</Text>}
                       <GoalAvatars goal={goal} />
                       </View>
                     <View/>
                       <Text M12 marginL-2 secondaryContent >Target: {numberWithCommas(playerGoal.target)}</Text>

                       </View>

                     </View>

                     <View row paddingH-24 marginV-8 >
                  <View row centerV paddingR-8><Text B14>{score}</Text><Text R14>/</Text><Text B14>{kFormatter(goal.target)}</Text></View>
                  <View flex>
               <ProgressBar
                  progress={roundUpToClosestTenth}
                  progressColor={goal.colorEnd}
                  style={{height: 24}}

               /></View>
               </View>
   {/* <GoalAvatars goal={goal} /> */}

                     <View row spread paddingH-24 marginT-8>
                        <Text M12 marginL-2 secondaryContent >Day: {dayOf}</Text>
                        <Text M12 marginL-2 secondaryContent >Ends: {dateEnding} ({goal.endDuration} days)</Text>

                     </View>
                     <View paddingH-24 marginV-8>
                        <ProgressBar
                           progress={roundPercentOfDays}
                           progressColor={playerGoal.colorStart}
                           style={{ height: 4 }}
                        /></View>

                  </View>
               </Box>
               {/* <Box style={{ marginTop: 0 }}> */}
                  <View paddingH-24 paddingB-24 marginT-16>
                     <Activities masterIds={goal?.masterIds} notPressable={!alreadyPlaying} />
                  </View>
               {/* </Box> */}
               {alreadyPlaying && !loading && (
                  <FeedPreview goalId={goal.id} />
               )}
            </View>


            {true && <View marginB-16 backgroundColor={Colors.colorF2}>
                    
               <ButtonLinear
                  style={{ marginVertical: 16 }}
                  color={alreadyPlaying ? '#aaa' : null}
                  bordered={alreadyPlaying ? true : false}
                  title={isAdmin ? 'EDIT GOAL' : getButtonActionLabel()}
                  size="small"
                  fullWidth={true}
                  onPress={() => {

                     if(isAdmin){
                        EditGoal()
                        // Alert that you can't leave because you're the admin 
                        // Alert.alert(
                        //    'You are the admin of this goal',
                        //    'You cannot leave this goal. You can delete it or edit it.',
                        //    [
                        //       {
                        //          text: 'Cancel',
                        //          onPress: () => console.log('Cancel Pressed'),
                        //          style: 'cancel',
                        //       },
                        //       {
                        //          text: 'Edit',
                        //          onPress: () => {
                        //             EditGoal()
                        //          },
                        //       }
                        //    ],
                        // );

                        return
                     }
                     if (alreadyPlaying) {
                        Alert.alert(
                           'Are you sure?',
                           'Are you sure you want to opt out of this goal?',
                           [
                              {
                                 text: 'Cancel',
                                 onPress: () => console.log('Cancel Pressed'),
                                 style: 'cancel',
                              },
                              {
                                 text: 'OK',
                                 onPress: () => {

                                 
                               

                                    toggleMeInGoal(
                                       goalDoc,
                                       currentUser,
                                       alreadyPlaying,
                                     false,
                                     setUniversalLoading

                                    );

                                 
                                    goBack();
                                 },
                              },
                           ],
                        );
                     } else {

                     
                        if(goal.allowOthersToHelp){

                               
                        joinGoalAsContributor()
                    

                        }else{

                           joinGoalAsCompetitor()
                        }
                    
                        // askPlayerHowTheyWantToPlay()
                     }
                  }}
               />
 {!alreadyPlaying && <Text center>Help {goal?.user?.name} to reach {kFormatter(goal.target)} by {moment(goal.start.toDate()).add(goal.endDuration,'days').format('MMM Do YYYY')}</Text>}

               {alreadyPlaying && (
                  <>
                     <GoalPlayersImFollowingScrollView goal={goal} />
                     {/* <ChallengeArenaScreensx challenge={goalDoc} /> */}
                     {/* {isAndroid ?   <ChallengePlayersImFollowingScrollView  {...{ smashStore, challengesStore, challenge }} /> : <ChallengeArenaScreensx challenge={challenge} />} */}
                     {/* <CommunityList /> */}
                     {/* <ChallengePlayersImFollowingScrollView  {...{ smashStore, challengesStore, challenge }} /> */}
                     {/* <PlayersImFollowing  playerChallengeDoc={playerChallengeDoc} share={share}/> */}
                     {/* <ChallengePlayerScreens

                  /> */}

                  </>
               )}

               {/* <Feed challengeId={challenge.id} {...{ arenaIndex, players, smashStore, challengesStore, goToProfile, challengeIsSingleActivity, challenge, showPlayerSmashes }} /> */}

               {/* <PlayerStats close={hidePlayerSmashes} challengeId={challenge.id} uid={focusPlayer || uid} endDateKey={challengeData?.endDateKey} arenaIndex={arenaIndex} /> */}
            </View>}</ScrollView>
         {alreadyPlaying && (
            <SmashButton
               goal={goal}
               masterIds={goal.masterIds}
            />
         )}


<ActionSheet
         title={"How would you like to join?"}
         message={'Help to reach the goal or compete against others?'}
         //  cancelButtonIndex={showAdminOptions ? 4 : 2}
         //  destructiveButtonIndex={showAdminOptions ? 4 : 2}
         useNativeIOS={true}
         migrateDialog
         containerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 10,
         }}
         showCancelButton={true}
         options={showOptions}
         visible={showJoinOptions}
         onDismiss={() => setShowJoinOptions(false)}
      />

      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(GoalArena));

const styles = StyleSheet.create({
   segment: { marginHorizontal: 16, marginBottom: 16, width: width - 32 }
});

