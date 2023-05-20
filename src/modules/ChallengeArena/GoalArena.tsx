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
import { Feather, Ionicons } from '@expo/vector-icons';
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
import MyGoalHeader from "modules/Home/components/MyChallenge/MyGoalHeader";
import MyGoalDeadline from "modules/Home/components/MyChallenge/MyGoalDeadline";
import LottieAnimation from "components/LottieAnimation";
import PersonalityTree from 'components/PersonalityTree';
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
const { goalDoc = false} = route?.params || {};
const goalId = goalDoc?.id || false;
const goal = goalHashByGoalId?.[goalId] || goalDoc;

const [playerGoal, setPlayerGoal] = useState(playerGoalHashByGoalId?.[goalId] || {});
// const playerGoal = playerGoalHashByGoalId?.[goalId] || {};
const { uid } = firebaseInstance.auth.currentUser;
   const [picture, setPicture] = useState(playerGoal?.picture || {});
   const { navigate, goBack, } = useNavigation();

   console.log('playerGoal', playerGoal)

 
   const EditGoal = () => {


      const theGoal = goalDoc.id ? goalDoc : goal || {}
// alert(JSON.stringify(theGoal))
// return
      navigate(Routes.CreateGoal, { goalDoc: theGoal })

   }

   


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






   const { currentUser } = smashStore;
   console.log('goal?.joined?.includes(uid) ',goal?.joined?.includes(uid), playerGoal.active )
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



   if (!goal?.name) {
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



const dayOf = goal.allowOthersToHelp ? goal?.start ? goalDayOf(goal?.start) : 1 : 1;
const dateEnding = goal.start &&  goal.endDuration ? goalDateEnding(goal.start, goal.endDuration) : moment().format('ll');
const totalDays = goal?.endDuration;
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
      subtitle: `You're playing to reach ${kFormatter(goalDoc.target)}${ptsLabel} 🔥🔥🔥 ${goal.endDuration} days! Day 1 is today. You can see the leaderboard at the bottom of this screen. Good luck!`,
      button: "Got it! Let's Go!",
      nextFn: false,
   };


   toggleMeInGoal(goal, currentUser, false, 'competitor');
}

const shareGoal = () => {

   Vibrate()
   challengesStore.setGoalToShare(goal);

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
   console.log('render GoalArena');


   const goToChat = () => {
      navigate(Routes.Chat, {
         stream: { streamId: goal.id,streamName: goal.name },isGoal: true,
      });
   };

   // check if toDate is a functinos on goal?.start?.toDate()

   if(!goal || !goal.start){return}


   useEffect(() => {
      // console.log('goalDocxx', goalDoc);
   
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
   return (
      <View flex  style={{backgroundColor: Colors.darkBg}}>
         <Header
            title={'Goal'}
            back
            color={'#fff'}
            backFn={back}
            dark
            noShadow
            titleColor={'#aaa'}
            challengeId={goalId}
            rightFn={share}
            // btnRight={
            //    <View row>
            //       {isUserJoined && (
            //          <TouchableOpacity
            //             onPress={goToChat}
            //             style={{ marginRight: 16 }}>
            //             <Ionicons
            //                name={'chatbox-ellipses-outline'}
            //                size={25}
            //                color={'#333'}
            //             />
            //          </TouchableOpacity>
            //       )}

            //       <TouchableOpacity onPress={onPressEditTeam}>
            //          <Feather name={'share'} size={25} color={'#333'} />
            //       </TouchableOpacity>
            //    </View>
            // }
            btnRight={
               <View row>
                    {goal.allowOthersToHelp && <TouchableOpacity
                        onPress={goToChat}
                        style={{ marginRight: 16 }}>
                        <Ionicons
                           name={'chatbox-ellipses-outline'}
                           size={25}
                           color={'#fff'}
                        />
                     </TouchableOpacity>}
                  
                  <TouchableOpacity onPress={share} >
                     <Feather name={'share'} size={25} color={'#fff'} />
                  </TouchableOpacity>
                  {isAdmin && (
                     <TouchableOpacity marginL-16 onPress={EditGoal}>
                        <Feather name={'settings'} size={25} color={'#fff'} />
                     </TouchableOpacity>
                  )}
               </View>
            }
         />

           
         <ScrollView
            contentContainerStyle={{ paddingBottom: 90, paddingTop: 0 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            bounces={true}>

               {/* <PersonalityTree /> */}
            <View style={{ backgroundColor: Colors.darkBg, paddingTop: 16 }}>

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
    


</Box>}
{/* <Text>{JSON.stringify(Object.keys(goal))}</Text> */}
{!playerGoal && <View center padding-16 paddingH-24 style={{backgroundColor: Colors.darkBg}}>
   
   <LottieAnimation loop={false} source={require('../../lotties/badge-trophy.json')} style={{ width: 70, height: 70 }} />
   {goal.allowOthersToHelp ? <Text R14 white center>Join the team to help {goal?.user?.name} reach the goal before the deadline!</Text> : <Text  white R14 center>Join {goal?.user?.name} by trying to reach the goal yourself and motivate and/or challenge eachother!</Text>}</View>}

               <Box style={{ marginTop: 8, paddingTop: 8, paddingBottom: 16 }}>
               
   {/* <GoalAvatars goal={goal} /> */}
   <MyGoalHeader goalId={goal.id} goalDocFromNav={goalDoc} playerGoal={playerGoal}/>
   <MyGoalDeadline goalId={goal.id} goalDocFromNav={goalDoc}  />      
                  
               </Box>
               {/* <Box style={{ marginTop: 0 }}> */}
                  <View paddingH-24 paddingB-24 marginT-16>
                     <Activities dark masterIds={goal?.masterIds} notPressable={!alreadyPlaying} dark />
                  </View>
               {/* </Box> */}
               {alreadyPlaying && !loading && (
                  <FeedPreview dark goalId={goal.id} />
               )}
            </View>


            {true && <View marginB-16 style={{backgroundColor: Colors.darkBg}} backgroundColor={Colors.colorF2}>

                 {alreadyPlaying && <View marginT-24 >
                     <ButtonLinear title={goal.allowOthersToHelp ? 'PROMOTE THE GOAL' : 'PROMOTE YOUR GOAL'} onPress={shareGoal} />
                     </View>}
               {!isAdmin && <ButtonLinear
                  style={{ marginVertical: 16 }}
                  color={alreadyPlaying ? '#aaa' : null}
                  bordered={alreadyPlaying ? true : false}
                  title={isAdmin ? 'EDIT GOAL' : getButtonActionLabel()}
                  size="small"
                  fullWidth={true}
                  onPress={() => {

                     if(isAdmin){
                        EditGoal()

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
               />}
 {!alreadyPlaying &&  <Text center>Help {goal?.user?.name} to reach {kFormatter(goal.target)} by {goal?.start?.toDate ? moment(goal?.start?.toDate()).add(goal?.endDuration,'days').format('MMM Do YYYY'): 'no start date'}</Text>}

               {alreadyPlaying && (
                  <>
                     <GoalPlayersImFollowingScrollView dark goal={goal} />
                

                  </>
               )}

            </View>}</ScrollView>
         {alreadyPlaying && (
            <SmashButton
               goal={goal}
               masterIds={goal.masterIds}
            />
         )}


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

