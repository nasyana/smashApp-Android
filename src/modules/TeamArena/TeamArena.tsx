import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import {
   Colors,
   Dialog,
   Text,
   View,
   Button,
   ButtonSize,
   PanningProvider,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import Firebase from '../../config/Firebase';
import SmashButton from './components/SmashButton';
import { bottom, height, width } from '../../config/scaleAccordingToDevice';
import useBoolean from '../../hooks/useBoolean';
import { useNavigation } from '@react-navigation/core';
import Shimmer from '../../components/Shimmer';
import Routes from 'config/Routes';

import ButtonLinear from 'components/ButtonLinear';
import AnimatedView from 'components/AnimatedView';
import * as Haptics from 'expo-haptics';
import TeamInfoBox from './TeamHeader/TeamInfoBox';
import { Vibrate } from 'helpers/HapticsHelpers';
import { pluckSound } from 'helpers/soundHelpers';
import SectionHeader from 'components/SectionHeader';
import MainTeamArenaScreen from './MainTeamArenaScreen';
import TeamScreenseNew from './TeamScreenseNew';
import TeamScreenseTabView from './TeamScreenseTabView'
import DelayLoading from 'components/DelayLoading';
import { collection, query, where, limit, onSnapshot,doc,getDoc } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
import LottieAnimation from 'components/LottieAnimation';
import { httpsCallable } from 'firebase/functions';
const firestore = firebaseInstance.firestore;
const TeamArena = (props) => {
   // mobx
   const { smashStore, teamsStore, challengesStore } = props;
   const {
      currentUser,
      currentUserId,
      libraryActivitiesHash,
      levelColors,
      habitStacksHash,
      currentUserHasPointsEver
   } = smashStore;
   const {  getDaysUntilEndWeek } = teamsStore;



   // nav
   const { navigate } = useNavigation();
   const { route } = props;
   const { team: _team = {}, fromPushNotification = false } = route?.params || {};

   const [isTeamJustCreated, setIsTeamJustCreated] = useState(
      route?.params?.justCreatedTeam || false,
   );

   // alert(JSON.stringify(_team))
   const [team, setTeam] = useState(_team);
   const [loaded, setLoaded] = useState(true);

      const isAdmin = currentUserId == team.uid;
   


     
useEffect(() => {

   setCurrentTeam(team)
   const uid = firebaseInstance.auth.currentUser.uid;
   const getSingleTeamWithWeeklyActivity = httpsCallable(firebaseInstance.functions, 'GetSingleTeamWithWeeklyActivity');
 
   // Set up a real-time listener
   const unsubscribe = onSnapshot(doc(firestore, 'teams', team.id), async (snapshot) => {
     const teamData = snapshot.data();


 
   //   alert()
     const { endOfCurrentWeekKey, todayDateKey } = teamsStore; // Make sure to define and update `endWeekKey` in your store
//  alert('asd')
     try {
       console.log('try', team.id, endOfCurrentWeekKey, uid)
       const result = await getSingleTeamWithWeeklyActivity({ uid, endWeekKey: endOfCurrentWeekKey, teamId: team.id, dayKey: todayDateKey });
 
       console.log('result.data Team Arena', result.data)
       const combinedTeam = {...result.data, habitStackIds: teamData.habitStackIds,masterIds: teamData.masterIds, singleMasterIds: teamData?.singleMasterIds, hideMasterIds: teamData?.hideMasterIds}
       setCurrentTeam(combinedTeam);
       setTeam(combinedTeam)
      //  if (result.data?.updatedAt !== teamData.updatedAt) {
         // // alert('yes update')
         // setCurrentTeam({...teamData,...result.data});
      //  }
 
     } catch (error) {
       console.error('Error fetching team with weekly activity:', error);
     }
   });
 
   // Clean up listener on unmount
   return () => unsubscribe();
 
 }, [team.id]); // Depend on team.id so useEffect runs again if team.id changes


   const { setIsVoteDialogVisible } = challengesStore;
   const {
  
 
      getVoteDocsSnapShot,
      clearVoteDocsSnapShot,
      voteDocs,
      teamUnreads,
      setCurrentTeam,
      currentTeam
   } = teamsStore;

   // const team = currentTeam.id && !_team ? currentTeam : _team;
   const { name, motto, picture, type, joined } = team;



//   useEffect(() => {
   
//    const sub = onSnapshot(doc(collection(firebaseInstance.db, "teams"), team.id), (doc) => {
//       const team = doc.data();
//       setCurrentTeam(team);
//     });
 
//    return () => {
//       if(sub){sub()}
//    }
//  }, [team.id])

 const theTeam = currentTeam || team;
   const id = team?.id;
   const { uid } = firebaseInstance.auth.currentUser;
   console.log('smashapp check render teamarena');
   const isUserJoined = (theTeam)?.joined?.includes(uid);
   const isUserInvited = theTeam?.invited?.includes(uid);
   const isUserRequested = theTeam?.requested?.includes(uid);


   const notVotedOn =
      voteDocs?.length > 0
         ? voteDocs.filter(
              (vote: any) =>
                 !vote.voteYes?.includes(uid) && !vote.voteNo?.includes(uid),
           )
         : [];

   useEffect(() => {
      notVotedOn.length > 0 && setIsVoteDialogVisible(true);
   }, [notVotedOn.length]);

   const getButtonLabel = () => {
      if (!isUserJoined && !isUserInvited && !isUserRequested)
         return 'Join Team';
      else if (isUserJoined) return 'Leave Team';
      else if (isUserInvited) return 'Accept Invite';
      else if (isUserRequested) return 'Requested';
   };

   const onPressButton = () => {
      const action = getButtonLabel();

      if (action === 'Request To Join') {
         teamsStore.joinTeamInstantly(navTeam.id, uid,navTeam);
         // teamsStore.requestToAddToTeam(team, currentUser);
      } else if (action === 'Requested') {
         teamsStore.cancelRequestToAddToTeam(team.id);
      } else if (action === 'Accept Invite') {
         teamsStore.acceptInviteToTeam(team.id, false, team, currentUser);
      } else if (action === 'Leave Team') {
         Alert.alert(
            'Are you sure?',
            'If you leave the team you will have to request access again to come back.',
            [
               {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
               },
               { text: 'OK', onPress: () => teamsStore.leaveFromTeam(team.id) },
            ],
         );
      } else {
         teamsStore.joinTeamInstantly(team.id, uid,team);
         navigate(Routes.ActivityHome);
         
         // teamsStore.requestToAddToTeam(team, currentUser);
      }
   };

   ///////////////////OLD CODE STARTS///////////////////////////

   // const [challengeData, setChallengeData] = useState({});
   // const { endDateKey } = challengeData;

   useEffect(() => {
      if (challengesStore.celebrationModal) {
         setIsVoteDialogVisible(false);
      }

      return () => {};
   }, [challengesStore.celebrationModal]);



   useEffect(() => {
      //// Get all activity documents that are in the activities array in team doc.
      const allDocsToGetInArray = team?.masterIds || [];

      const arrayOfMasterIdPromises = allDocsToGetInArray.map((id) => {
         const docRef = doc(collection(firestore, 'feed'), id);
         return getDoc(docRef);
       });
       
      Promise.all(arrayOfMasterIdPromises).then((allIdSnaps) => {
         const activities = [];

         const fullActivities = [];

         allIdSnaps.forEach((idSnap) => {
            const masterActivityDoc = idSnap.data();

            fullActivities.push(masterActivityDoc);
            activities.push({
               level: masterActivityDoc.level,
               text: masterActivityDoc.text,
               id: masterActivityDoc.id,
            });
         });

         // addLegacyActionsToActivityLibraryHash(fullActivities);

         // setLegacyActivities(activities);
      });
      return () => {};
   }, [team.id]);

 

   const dismissCelebration = () => {
      challengesStore.celebrationModal = false;
   };
   const {endOfCurrentWeekKey} = teamsStore;
   useEffect(() => {


      id && endOfCurrentWeekKey && getVoteDocsSnapShot(id, endOfCurrentWeekKey);
      return () => {
         clearVoteDocsSnapShot();
      };
   }, [endOfCurrentWeekKey]);



   const goToChat = () => {
      navigate(Routes.Chat, {
         stream: { streamId: team.id, streamName: team.name },
      });
   };

 

   const onPressEditTeam = () => {

      if(isAdmin){
         smashStore.setTeamActionsVisible({team: team, access: 'admin'})
      }else{
         smashStore.setTeamActionsVisible({team: team, access: false})

      }

   };

   const share = () => {

   
      Vibrate();
      pluckSound();
      smashStore.universalLoading = true;
      setIsTeamJustCreated(false);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setTimeout(() => {
         smashStore.simpleCelebrate = {
            name: `Share Your Team Link!`,
            title: `Share Team!`,
            subtitle: `Share your Team link and Team Code with your friends or family to invite them to your Team! 🔥`,
            button: "Share Link",
            nextFn: async () => {
               
          
               smashStore.shareTeam(team);
             await teamsStore.fetchMyTeams(); 
            
            }
         };
      }, 500);


   };

   const goToTeamToday = () => {
      navigate('TeamInsights', { team });
   };

   // if (loadingCurrentTeam) {
   //    return (
   //       <View>
   //          <Shimmer style={{ height: 300, width: width - 32, left: 16 }} />
   //       </View>
   //    );
   // }

 

   const showWeeklyTarget =
      (team?.actions && Object.keys(team?.actions)?.length > 0) || false;

   const requested = getButtonLabel() == 'Requested';

   let leaveTeam = false;
   if (getButtonLabel() === 'Leave Team') {
      leaveTeam = true;
   }

   const actions = team?.actions || {};


   let allHabitStackMasterIdsInArray = [];

   team?.habitStackIds?.forEach((stackId) => {
      const stackActivities = habitStacksHash?.[stackId]?.masterIds || [];

      allHabitStackMasterIdsInArray = [
         ...allHabitStackMasterIdsInArray,
         ...stackActivities,
      ];
   });
   const allHabitMasterIds =
      [...new Set(allHabitStackMasterIdsInArray.flat(1))] || [];

   const activities =
      allHabitMasterIds?.length > 0
         ? allHabitMasterIds.map((id) => libraryActivitiesHash?.[id])
         : Object.values(actions);

   const activitiesByCategory = activities.reduce((prev, curr) => {
      const category = curr?.actionCategory?.[0];
      if (!category) return prev;
      if (!prev[category]) {
         prev[category] = [];
      }
      prev[category].push(curr);
      return prev;
   }, {});

   const showVid = () => {
      smashStore.tutorialVideo =
         smashStore?.settings?.tutorials?.teams?.firstPreTeam;
   };


   const [loadFromNotifications, setLoadFromNotifications] = useState(false);

   useEffect(() => {

      if (fromPushNotification) {

         setLoadFromNotifications(true);

         setTimeout(() => {
            setLoadFromNotifications(false);
         }, 2000);

      }


   }, []);

   if (loadFromNotifications) {

      return <View flex center>

         <ActivityIndicator />
      </View>
   }


   if (!isUserJoined) {
      return (<View flex>
      <Header title={'Team'} back noShadow titleColor={'#aaa'} />
      <View flex center>
      <ActivityIndicator />
      </View>
      </View>)
      return 
      return (
         <View flex>
            <Header title={'Team'} back noShadow titleColor={'#aaa'} />

            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
               <View paddingH-24 paddingT-32>
                  <Text R14 secondaryContent>
                     Hey {currentUser.name},
                  </Text>
                  <Text R14 secondaryContent>
                     Come and help us reach our team goal this week!{' '}
                  </Text>
               </View>
               {/* <View style={{ height: 16 }} /> */}
               <TeamInfoBox
                  name={name}
                  motto={motto}
                  team={team}
                  showWeeklyTarget={showWeeklyTarget}
                  teamsStore={teamsStore}
                  activitiesCount={team?.activities?.length}
                  teamCount={team?.joined?.length}
                  remainingDays={getDaysUntilEndWeek()}
                  thisWeekTarget={team.mostRecentTarget}
               />

               <View style={{ height: 16 }} />
               {/* <ButtonLinear
                  marginH-0
                  marginT-16
                  minus={16}
                  bordered={leaveTeam ? true : requested}
                  color={
                     leaveTeam
                        ? '#aaa'
                        : requested
                        ? '#aaa'
                        : '#fff' || Colors.buttonLink
                  }
                  title={getButtonLabel()}
                  size={'small' as ButtonSize}
                  fullWidth={false}
                  onPress={onPressButton}
                  style={{ marginBottom: 0 }}
               /> */}

               {requested && (
                  <View marginT-16 >
                     <ButtonLinear
                        onPress={showVid}
                        // bordered
                        title="Learn How To Play"
                     />

                  </View>
               )}
               <View paddingH-24 paddingT-24>

                  <Text R14 secondaryContent marginB-16>
                     While you're waiting to be approved, check out the habits/activities in this team that you can smash to earn points for
                     this team once you are accepted.
                  </Text>
               </View>

               {true && (
                  <View marginT-16>
                     {Object.entries(activitiesByCategory).map(
                        ([category, selectActivities]) => {
                           return (
                              <View>
                                 <SectionHeader
                                    title={
                                       smashStore.activityCategoryLabels[
                                          category
                                       ]
                                    }
                                    top={8}
                                 />
                                 <View
                                    style={{
                                       flexDirection: 'row',
                                       flexWrap: 'wrap',
                                       marginHorizontal: 16,
                                       paddingBottom: 16,
                                    }}>
                                    {selectActivities.map((a) => {
                                       const isSelected =
                                          smashStore?.activtyWeAreSmashing
                                             ?.id == a?.id;

                                       const color = levelColors?.[a.level];
                                       return (
                                          <TouchableOpacity
                                             key={a.id}
                                             onPress={() =>
                                                !isUserJoined
                                                   ? null
                                                   : setMasterIdsToSmash([
                                                        a?.id,
                                                     ])
                                             }
                                             centerV
                                             style={{
                                                backgroundColor: '#fff',
                                                borderRadius: 16,
                                                padding: 4,
                                                paddingHorizontal: 8,
                                                margin: 3,
                                                marginLeft: 0,
                                                marginVertical: 3,
                                                // marginBottom: 8,
                                                // paddingLeft: 18,
                                             }}
                                             row>
                                             <View
                                                style={{
                                                   width: 4,
                                                   height: 4,
                                                   borderRadius: 8,
                                                   backgroundColor: color,
                                                   marginRight: 4,
                                                }}
                                             />
                                             <Text secondaryContent R14>
                                                {a?.text || 'nnada'}{' '}
                                             </Text>
                                          
                                          </TouchableOpacity>
                                       );
                                    })}
                                 </View>
                              </View>
                           );
                        },
                     )}
                  </View>
               )}

              
            </ScrollView>
         </View>
      );
   }


   if (!loaded) {
      return (
         <View flex>
            <Header
               title={name || 'Team'}
               back
               noShadow
               titleColor={'#aaa'}
               btnRight={
                  <View row>
                     {isUserJoined && (
                        <TouchableOpacity
                           onPress={goToChat}
                           style={{ marginRight: 16 }}>
                           <Ionicons
                              name={'chatbox-ellipses-outline'}
                              size={25}
                              color={'#333'}
                           />
                        </TouchableOpacity>
                     )}

                     <TouchableOpacity onPress={onPressEditTeam}>
                        <Feather name={'share'} size={25} color={'#333'} />
                     </TouchableOpacity>
                  </View>
               }
            />
            {/* <Shimmer
               style={{
                  margin: 0,
                  height: 70,
                  width: width,
                  backgroundColor: '#ccc',
                  borderRadius: 0,
               }}
            /> */}
            <Shimmer
               style={{
                  margin: 0,
                  height: 170,
                  width: width,
                  backgroundColor: '#ccc',
                  borderRadius: 0,
               }}
            />
            <Shimmer
               style={{
                  height: 150,
                  width: width - 48,
                  position: 'absolute',
                  left: 24,
                  top: 157,
                  borderRadius: 7,
               }}
            />
         </View>
      );
   }

   const thisTeamUnreads = teamUnreads?.[`${team.id}_${currentUserId}`] || 0;


   if (isTeamJustCreated) {
      return (
         <View flex center style={{backgroundColor: '#fff'}}>
            <View paddingH-32 marginB-16>
               <View center>
            <LottieAnimation
            autoPlay
            loop={false}
            style={{
               height: 200,
               zIndex: 0,
            
            }}
            source={require('../../../src/lotties/share.json')}
         /></View>
               <Text B18 marginB-0 center secondaryContent>
                  {team.name} Created.
               </Text>
               <Text B24 marginB-8 center>
                  Invite some players!
               </Text>
            </View>
            {/* <ButtonLinear title="View Tutorial" />
      <ButtonLinear onPress={skipTutorial} title="Skip Tutorial, I'm an expert" bordered style={{marginTop: 16}}/> */}
            <ButtonLinear
               onPress={share}
               title=" Share Invite Code "
               // style={{ paddingHorizontal: 40 }}
            />
            <View padding-16 style={{ width: width - 48 }}>
               <Text center R14 color6D>
                  Share this invite link & code to the players you want in your
                  team. They can use the link and enter the code.
               </Text>
            </View>
         </View>
      );
   }
const onPressBack = () => {
      navigate(Routes.MainTab);
   };

   return (
      <View flex>
         <Header
            title={name || 'Team'}
            back
            backFn={onPressBack}
            titleColor={'#aaa'}
            btnRight={
               <View row>
                  {isUserJoined && (
                     <TouchableOpacity
                        onPress={goToChat}
                        style={{ marginRight: 16, flexDirection: 'row' }}>
                        {thisTeamUnreads > 0 && (
                           <AnimatedView>
                              <Text
                                 B18
                                 style={{ color: '#F26E6E', paddingRight: 4 }}>
                                 {thisTeamUnreads}
                              </Text>
                           </AnimatedView>
                        )}
                        <Ionicons
                           name={'chatbox-ellipses-outline'}
                           size={25}
                           color={'#333'}
                        />
                     </TouchableOpacity>
                  )}

                  {isUserJoined && (
                     <TouchableOpacity onPress={onPressEditTeam}>
                        <Feather name={'settings'} size={25} color={'#333'} />
                     </TouchableOpacity>
                  )}
               </View>
            }
         />
         {isUserJoined ? <TeamScreenseTabView team={team} /> : <MainTeamArenaScreen team={team} />}

       


         {isUserJoined && <SmashButton team={team} isTeamJustCreated={route?.params?.justCreatedTeam && !currentUserHasPointsEver}/>}
         

         {/* <Dialog
            panDirection={PanningProvider.Directions.DOWN}
            visible={challengesStore.celebrationModal ? true : false}
            onDismiss={() => dismissCelebration()}
            overlayBackgroundColor={Colors.Black54}
            animationType="slide"
            containerStyle={{
               justifyContent: 'flex-end',
               backgroundColor: Colors.white,
               width: '100%',
               paddingBottom: bottom,
            }}
            width="100%"
         >
            <View
               style={{
                  height: height - 400,
                  width: '100%',
                  paddingTop: '20%',
               }}>
               <View paddingT-32 marginB-32>
                  <Text B24 center>
                     {challengesStore.celebrationModal &&
                        challengesStore.celebrationModal}
                  </Text>
               </View>
               <ButtonLinear
                  style={{ width: width - 88 }}
                  title="Got It!"
                  onPress={dismissCelebration}>
                  <Text>Got It!</Text>
               </ButtonLinear>
            </View>
         </Dialog> */}

      </View>
   );
};;

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamArena));

const styles = StyleSheet.create({
   segment: { marginHorizontal: 16, marginBottom: 16, width: width - 32 },
   section: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
   },
});
