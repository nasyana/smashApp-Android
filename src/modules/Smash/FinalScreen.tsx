import { useState, useRef, useEffect } from 'react';

import {
   Image, Platform,
   StyleSheet,
   Dimensions,
   TouchableOpacity
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Incubator, View, Text, Colors } from 'react-native-ui-lib';
import AnimatedView from 'components/AnimatedView';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';

// import firebase from 'firebase';
import firebaseInstance from '../../config/Firebase';
import ImageUpload from '../../helpers/ImageUpload';
import { FONTS } from 'config/FoundationConfig';
import ButtonLinear from 'components/ButtonLinear';
import RecentActionSmashesFinal from 'components/RecentActionSmashes';
import LottieAnimation from 'components/LottieAnimation';
import { moment } from 'helpers/generalHelpers';
import { getDefaultWeeklyActivity } from 'helpers/teamDataHelpers';
;
const uid = firebaseInstance.auth.currentUser?.uid;
const isAndroid = Platform.OS === 'android';
const FinalScreen = (props: any) => {
   const [comment, setComment] = useState('');

   const {
      smashStore,
      teamsStore,
      challengesStore,
   } = props;
   const { myTeams, weeklyActivityHash, myTeamsHash } = teamsStore;
   const {
      capturedPicture = false,
      capturedVideo = false,
      activtyWeAreSmashing,
      currentUser,
      todayDateKey,
      stringLimit,
      endWeekKey,
      levelColors,
      multiplier,
      selectMultiplier,
      setSelectMultiplier
   } = smashStore;
   const { myChallenges, myPlayerChallengesFullHash,myGoals, goalHashByGoalId } = challengesStore;
   let videoUrl: any = useRef(false);

   const [inTeamArray, setInTeamArray] = useState([]);
   const [inChallengesArray, setInChallengesArray] = useState([]);
   const [inTeamNameArray, setInTeamNameArray] = useState([]);
   const [inGoalsArray, setInGoalsArray] = useState([])
   const hasImage =
   smashStore.capturedPicture || smashStore.capturedVideo || smashStore.manuallySkipped;
   const [addText, setAddText] = useState(false);


   const ref = useRef<AnimatedLottieView>(null);

   useEffect(() => {
      ref.current?.play();

      return () => {
         ref.current?.reset();
      };
   }, []);

   const getInTeamArray = () => {
      return myTeams
        .filter((t: any) => t.masterIds.includes(activtyWeAreSmashing.id))
        .map((team) => {
          const weeklyActivity =
            weeklyActivityHash?.[`${team.id}_${endWeekKey}`] || getDefaultWeeklyActivity(team);
    
          return {
            picture: team.picture || {},
            title: team.name || '',
            selectedScore: weeklyActivity?.teamWeekScore || 0,
            selectedTarget: weeklyActivity?.thisWeekTarget || 0,
            itemType: 'Team Target',
            targetType: 'points',
            myScoreToday:
              weeklyActivity?.daily?.[todayDateKey]?.players?.[uid]?.score || 0,
            myTargetToday: weeklyActivity?.myTargetToday || false,
            teamScoreToday: weeklyActivity?.teamTodayScore || 0,
            teamTargetToday: weeklyActivity?.teamTargetToday || false,
            unit: false,
            team: { joined: team.joined, name: team.name },
            id: team.id,
            weeklyActivity,
          };
        });
    };
    
    const getInChallengesArray = () => {
      return myChallenges
        .filter((t: any) => t.masterIds.includes(activtyWeAreSmashing.id))
        .map((playerChallenge) => {
          return {
            ...playerChallenge,
            picture: playerChallenge.picture || {},
            title: playerChallenge.challengeName || '',
            selectedScore: playerChallenge.selectedScore || 0,
            selectedTarget: playerChallenge.selectedTarget || 0,
            itemType: 'Challenge Target',
            targetType: playerChallenge?.targetType || false,
            scoreToday: 0,
            targetToday: 0,
            challenge: true,
            id: playerChallenge.id,
          };
        });
    };
    
    const getInTeamNameArray = () => {
      return myTeams
        .filter((t: any) => t.masterIds.includes(activtyWeAreSmashing.id))
        .map((t) => t.name);
    };
    
    const getGoals = () => {

     
      return myGoals
        .filter((t: any) => t.masterIds.includes(activtyWeAreSmashing.id))
        .map((t) => {return {...t, goalDoc: goalHashByGoalId?.[t.goalId] || {}}});
    };
    
    useEffect(() => {
      const inTeamArray = getInTeamArray();
      const inChallengesArray = getInChallengesArray();
      const inTeamNameArray = getInTeamNameArray();
      const goals = getGoals();
    
      setInChallengesArray(inChallengesArray);
      setInTeamArray(inTeamArray);
      setInTeamNameArray(inTeamNameArray);
      setInGoalsArray(goals);
    }, []);

   const preSmash = async () => {

      smashStore.setUniversalLoading(true);
      // smashStore.setShowRocket(true);
      // setTimeout(() => {
      //    smashStore.setShowRocket(false);
      // }, 2000);
      smashStore.setSmashing(true);
      // smashStore.smashEffects();

      smashStore.setCompletionsTeamsAndChallenges([
         ...inChallengesArray,
         ...inTeamArray,
         ...inGoalsArray
      ]);

      playSound();
     
 
      const multiplier = parseInt(smashStore.multiplier);
      const { weeklyActivityHash } = teamsStore;

      const id = ImageUpload.uid();
      const uid = firebaseInstance?.auth?.currentUser?.uid;
      let completion = {
         id,
         active: true,
         inTeam: inTeamArray.map((t)=> t.id),
         inChallenges: inChallengesArray.map((c)=> c.challengeId),
         teamNames: [...inTeamNameArray],
         showInFeed: currentUser?.publicFeedDisabled ? false : true,
         showPicture: true,
         activityMasterId: activtyWeAreSmashing.id,
         multiplier: multiplier || 1,
         value: smashStore.returnActionPointsValue(activtyWeAreSmashing),
         timestamp: parseInt(Date.now() / 1000),
         updatedAt: parseInt(Date.now() / 1000),
         dayKey: moment().format('DDMMYYYY'),
         type: 'smash',
         user: {
            name: currentUser.name,
            picture: currentUser?.picture || false,
         },
         activityName: activtyWeAreSmashing.text,
         uid: uid,
         comment,
         text: comment,
         level: activtyWeAreSmashing?.level,
         bonus: activtyWeAreSmashing?.bonus,
         capturedVideo,
      };

      let pointsToAdd =
         parseInt(completion.value) * parseInt(completion.multiplier);
      smashStore.completion = {
         completion,
         pointsToAdd,
         picture: capturedPicture,
         capturedVideo,
         multiplier: multiplier || 1,
      };


      setTimeout(() => {
      smashStore.smash(
         completion,
         capturedPicture,
         false,
         capturedVideo,
         weeklyActivityHash,
      );
      smashStore.setUniversalLoading(false);

      }, 2000);
 


// if(completion?.text?.length > 0){

//    const commentId = ImageUpload.uid();
   
//    let idTags = [uid];

//       if(completion?.id){idTags.push(completion?.id)}
//       if(completion?.activityMasterId){idTags.push(completion?.activityMasterId)}
//       if(activtyWeAreSmashing?.baseActivityId){idTags.push(activtyWeAreSmashing?.baseActivityId)}
//       if(completion?.dayKey){idTags.push(completion?.dayKey)}

//    const newComment = {
//       text: completion?.text,
//       id: commentId,
//       uid,
//       idTags,
//       activityMasterId: completion?.activityMasterId || false,
//       baseActivityId: (completion?.baseActivityId || false),
//       dayKey: completion?.dayKey || false,
//       primaryId: completion?.id || false,
//       timestamp:parseInt(Date.now() / 1000),
//       postId: completion.id || false,
//       postOwner: uid,
//       postType: completion?.type || 'smash',
//       commentOwnerName: smashStore?.currentUser?.name || 'noname',
//       picture: smashStore.currentUser.picture,
//    };



//    const journalRef = doc(collection(firestore, 'journals'), commentId);

//    setDoc(journalRef, newComment).then(() => {
//      if (completion.type == 'smash') {
//        const postRef = doc(collection(firestore, 'posts'), completion.id);
//        updateDoc(postRef, { journalCount: increment(1) });
//      }
//    });



// }
     

  
   };

   async function playSound() {
      const { sound } = await Audio.Sound.createAsync(
         require('../../sounds/celebrate-log.mp3'),
      );
      await sound.playAsync();
   }

   const tempColor = levelColors?.[parseInt(activtyWeAreSmashing?.level) || 0];

  

 

   const imageWidth = capturedPicture?.width;
   const imageHeight = capturedPicture?.height;

   const quotient = imageHeight / imageWidth;
   const isFromLibrary = capturedPicture?.library;
   const newHeight = quotient * width;

   const cancel = () => {
      smashStore.setCapturedPicture(false);
      smashStore.setCapturedVideo(false);
      smashStore.setManuallySkipped(false);
      smashStore.multiplier = 1;
      setSelectMultiplier(false);
   };

   const pressAddText = () => {
      setAddText(!addText);
   };

   const changeMultiplier = () => {
      setSelectMultiplier(true);
   };
   if(!hasImage){return null}
   return (
      <View
      style={{
         position: 'absolute',
         top: 0,
         width: '100%',
         height: '100%',
      }}>
         
      <View
         style={{ flex: 1, backgroundColor: isFromLibrary ? '#000' : '#fff' }}>
         {capturedVideo?.uri && (
            <Video
               source={{ uri: (capturedVideo && capturedVideo?.uri) || '' }}
               rate={1.0}
               volume={1.0}
               isMuted={false}
               resizeMode="cover"
               shouldPlay
               isLooping
               style={{ position: 'absolute', width, height: isAndroid ? height + 30 : height }}
            />
         )}

         {isFromLibrary ? (
            <View style={styles.mainContainer}>
               <Image
                  source={{ uri: capturedPicture?.uri }}
                  style={[
                     styles.mainContainer,
                     {
                        height: isAndroid ? height + 40 : newHeight,
                        position: 'absolute',
                        top: height / 2 - newHeight / 2,
                     },
                  ]}
               />
            </View>
         ) : (
            <Image
               source={{ uri: capturedPicture?.uri }}
               style={[styles.mainContainer]}
            />
         )}
         {isFromLibrary ? (
            <LinearGradient
               colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,2)']}
               style={{
                  margin: 0,
                  height: isAndroid ? height + 40 : height,
                  width: width,
                  borderRadius: 0,
                  position: 'absolute',
               }}
            />
         ) : (
            <LinearGradient
               colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,3)']}
               style={{
                  margin: 0,
                  height: isAndroid ? height + 40 : height,
                  width: width,
                  borderRadius: 0,
                  position: 'absolute',
               }}
            />
         )}

         {!capturedPicture && !capturedVideo && (
            <LinearGradient
               colors={[tempColor, 'rgba(0,0,0,1)', tempColor]}
               style={{
                  margin: 0,
                  height: height,
                  width: width,
                  borderRadius: 0,
                  position: 'absolute',
               }}
            />
         )}
         <View
            style={{
               width,
               padding: 16,
               paddingTop: 20,
               alignItems: 'flex-start',
               position: 'absolute',
               bottom: height / 2,
               // moderateScale(120),
            }}>
            <View
               style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
               }}>
               {!selectMultiplier && (
                  <AnimatedView>
                     <LottieAnimation
                        loop={true}
                        autoPlay={true}
                        source={require('../../lotties/fire.json')}
                        style={{
                           width: 100,
                           height: 100,
                           zIndex: 99999,
                        }}
                     />
                  </AnimatedView>
               )}
               <View>
                  <TouchableOpacity onPress={changeMultiplier}>
                     <Text
                        white
                        // marginR-16
                        // paddingL-16
                        center={multiplier == 1}
                        B18
                        style={{ fontSize: 60, letterSpacing: -5 }}>
                        {multiplier}x
                     </Text>
                  </TouchableOpacity>
                  <Text
                     white
                     // marginR-16
                     R18
                     center={multiplier == 1}
                     style={{ fontSize: 20, marginTop: -10 }}>
                     {stringLimit(smashStore.activtyWeAreSmashing?.text, 20)}
                  </Text>
               </View>
            </View>
         </View>
       
         {!addText && comment?.length > 0 && (
            <View
               style={{
                  width: width,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: height / 2,
               }}>

               <View
                  style={{
                     backgroundColor: 'rgba(0,0,0,0.7)',
                     padding: 15,
                  }}>
                  <Text white style={{ fontFamily: FONTS.heavy, fontSize: 18 }}>
                     {comment}
                  </Text>
               </View>
            </View>
         )}

         {addText && (
            <View
               style={{
                  width: width,
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: height / 2,
               }}>
               <View
                  style={{
                     backgroundColor: 'rgba(0,0,0,0.7)',
                     // padding: 15,
                  }}>
                  <Incubator.TextField
                     placeholder=" "
                     value={comment}
                     color="#fff"
                     autoFocus={true}
                     multiline={true}
                     onChangeText={setComment}
                     keyboardType="default"
                     placeholderTextColor={Colors.rgba(191, 186, 182, 1)}
                     // fieldStyle={{ fontFamily: FONTS.black, fontSize: 18 }}
                     // labelStyle={{ fontFamily: FONTS.heavy }}
                     style={{ fontFamily: FONTS.heavy, fontSize: 18 }}
                     containerStyle={{
                        // height: 40,
                        maxWidth: width - width / 5,
                        padding: 15,
                        borderWidth: 0,
                        borderRadius: 50,
                        marginBottom: 0,

                        borderColor: Colors.rgba(191, 186, 182, 1),
                        // backgroundColor: 'rgba(0,0,0,0.5)',
                        // maxWidth: width || moderateScale(220),
                     }}
                  />
               </View>
            </View>
         )}

         <TouchableOpacity
            onPress={cancel}
            style={{
               position: 'absolute',
               left: 25,
               top: 25,
               width: 100,
               height: 70,
               alignContent: 'center',
               justifyContent: 'center',
            }}>
            <AntDesign name="arrowleft" size={30} color="#fff" />
         </TouchableOpacity>

         {(!addText || (!addText && comment?.length > 0)) && (
            <TouchableOpacity
               onPress={pressAddText}
               style={{
                  position: 'absolute',
                  top: 40,
                  right: 40,
                  width: 40,
                  height: 40,
                  backgroundColor: '#fff',
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               {/* <AntDesign name={'picture'} size={40} color={'#fff'} /> */}
               <Text B18 style={{ letterSpacing: -1 }}>
                  Aa
               </Text>
            </TouchableOpacity>
         )}

         {addText && (
            <TouchableOpacity
               onPress={pressAddText}
               style={{
                  position: 'absolute',
                  top: 40,
                  right: 20,
                  width: 70,
                  height: 40,
                  backgroundColor: 'transparent',
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               {/* <AntDesign name={'picture'} size={40} color={'#fff'} /> */}
               <Text R18 white style={{ letterSpacing: 0 }}>
                  Done
               </Text>
            </TouchableOpacity>
         )}

         {!addText && (
            <View
               style={{
                  borderWidth: 0,
                  borderColor: '#fff',
                  width,
                  position: 'absolute',
                  bottom: Platform.OS === 'android' ? 100 : 20,
                  right: 0,
                  alignItems: 'flex-end',
               }}>
               {!addText && (
                  <ButtonLinear title="Add Points" onPress={preSmash} />
               )}
                 {/* <Text white>{JSON.stringify(inTeamArray)}</Text> */}
            </View>
         )}

         <RecentActionSmashesFinal actionId={activtyWeAreSmashing.id} />
      </View>
    {/* <DoneDialog /> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'teamsStore',
   'challengesStore',
)(observer(FinalScreen));

const styles = StyleSheet.create({
   mainContainer: {
      width: width,
      height: isAndroid ? height + 30 : height,
      zIndex: 0,
   },
   bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      position: 'absolute',
      bottom: 0,
      zIndex: 10,
      width: '100%',
      height: 100,
      paddingHorizontal: 24,
      backgroundColor: 'transparent',
   },
   titleContainer: {
      position: 'absolute',
      width: Dimensions.get('window').width,
      top: height / 10,
      paddingHorizontal: 10,
   },
   title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: 12,
   },
   pickerContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
      width: 80,
   },
});


function cloneObject(obj) {
   return JSON.parse(JSON.stringify(obj));
 }