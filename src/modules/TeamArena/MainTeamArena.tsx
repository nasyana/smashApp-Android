import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
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
import FollowingList from './components/FollowingList';
import InsightsScreens from './components/InsightsScreens';
import Box from '../../components/Box';
import FeedPreview from './components/FeedPreview';
import TeamScrollView from '../../components/TeamScrollView';
import SmartImage from '../../components/SmartImage/SmartImage';
import { LinearGradient } from 'expo-linear-gradient';
import StarterTask from '../Home/components/StarterTask';
import TeamHeader from 'modules/TeamArena/TeamHeader';
import Shimmer from '../../components/Shimmer';
import VotingDialog from './VotingDialog';
import TeamVoting from '../../components/TeamVoting';
import Routes from 'config/Routes';
import TeamScreens from './TeamScreens';
import Recent from 'modules/Overview/Recent';
import CustomButton from 'components/CustomButton';
import CustomButtonLinear from 'components/CustomButtonLinear';
import ButtonLinear from 'components/ButtonLinear';
import AnimatedView from 'components/AnimatedView';
import * as Haptics from 'expo-haptics';
import TeamInfoBox from './TeamHeader/TeamInfoBox';
import { Vibrate } from 'helpers/HapticsHelpers';
import { pluckSound } from 'helpers/soundHelpers';
const MainTeamArena = (props) => {
   // mobx
   const { smashStore, teamsStore, challengesStore } = props;
   const {
      currentUser,
      homeTabsIndex,
      setHomeTabsIndex,
      libraryActivitiesHash,
      levelColors,
      habitStacksHash,
      willExceedQuota,
      isPremiumMember
   } = smashStore;
   const { voteDocsHash, getDaysUntilEndWeek } = teamsStore;
   // state
   const [congratsFirstChallenge, setCongratsFirstChallenge] = useState(false);
   const [arenaIndex, setArenaIndex] = useState(0);
   const [challenges, setChallenges] = useState<any[]>([]);
   const [haveIVoted, setHaveIVoted] = useState(true);
   const [legacyActivities, setLegacyActivities] = useState(false);
   // const [isVoteDialogVisible, setIsVoteDialogVisible] = useState(false);

   // nav
   const { navigate } = useNavigation();
   const { route } = props;
   const { team: _team = {} } = props || {};

   const [isTeamJustCreated, setIsTeamJustCreated] = useState(
      route?.params?.justCreatedTeam || false,
   );

   // const [voteDoc, setVoteDoc] = useState(false);
   const voteDoc = voteDocsHash[_team.id] || false;
   const [team, setTeam] = useState(_team);
   const [loaded, setLoaded] = useState(true);

   useEffect(() => {
      const timeout = setTimeout(() => {
         setLoaded(true);
      }, 200);

      return () => {
         clearTimeout(timeout);
      };
   }, []);

   useEffect(() => {
      // }
      const unSubTeamDoc = Firebase.firestore
         .collection('teams')
         .doc(team.id)
         .onSnapshot((snap) => {
            if (snap.exists) {
               setTeam(snap.data());
               // setLoaded(true);
            }
         });

      return () => {
         if (unSubTeamDoc) {
            unSubTeamDoc();
         }
      };
   }, []);

   const { setIsVoteDialogVisible, isVoteDialogVisible } = challengesStore;
   const {
      showFollowingDialog,
      setShowFollowingDialog,
      loadingCurrentTeam,
      getCurrentTeamSnapShot,
      clearCurrentTeamSnapShot,
      getCurrentTeamWeeklySnapShot,
      clearCurrentWeeklyTeamSnapShot,
      getVoteDocsSnapShot,
      clearVoteDocsSnapShot,
      voteDocs,
      currentTeam,
      setIsTeamVoteDialogVisible,
      isTeamVoteDialogVisible,
      currentTeamWeeklyProgress,
      teamUnreads,
      myTeams
   } = teamsStore;

   // const team = currentTeam.id && !_team ? currentTeam : _team;
   const { name, motto, picture, type, joined } = team;

   const isLegacy = type === 'Game';
   const id = team?.id;
   const { uid } = Firebase.auth.currentUser;
   console.log('smashapp check render teamarena');
   const isUserJoined = currentUser?.teams?.includes(id);
   // const isUserJoined = team.joined?.includes(uid);
   const isUserInvited = team?.invited?.includes(uid);
   const isUserRequested = team?.requested?.includes(uid);

   // const docsNotVotedOn = voteDocs.filter(
   //    (vDoc) => !vDoc.voteYes.includes(uid) && !vDoc.voteNo.includes(uid),
   // );
   // const hasVotesNotVotedOn = docsNotVotedOn.length > 0;
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
         return 'Request To Join';
      else if (isUserJoined) return 'Leave Team';
      else if (isUserInvited) return 'Accept Invite';
      else if (isUserRequested) return 'Requested';
   };

   const onPressButton = () => {
      const action = getButtonLabel();

      if (action === 'Request To Join') {

     

         if(!isPremiumMember && willExceedQuota(myTeams?.length,'teamsJoinedQuota')){
            showUpgradeModal(true)
   
            return 
         }

         teamsStore.requestToAddToTeam(team, currentUser);
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
         teamsStore.requestToAddToTeam(team, currentUser);
      }
   };

   ///////////////////OLD CODE STARTS///////////////////////////
   // const [playerChallengeDoc, setPlayerChallengeDoc] = useState(false);

   const [activitySmashList, hideActivitySmashList] = useBoolean(false);

   const {
      settings,
      addLegacyActionsToActivityLibraryHash,
      returnActionPointsValue,
      showUpgradeModal
   } = smashStore;
   const [challengeData, setChallengeData] = useState({});
   const { endDateKey } = challengeData;

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
         return Firebase.firestore.collection('feed').doc(id).get();
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

   useEffect(() => {
      // fetchTeamPlayerChallenges(id);

      // const unsubscribeToTeamPlayers = Firebase.firestore.collection("users").where('id','in',[])

      id && getCurrentTeamSnapShot(id);
      id && getCurrentTeamWeeklySnapShot(id);

      return () => {
         clearCurrentTeamSnapShot();
         clearCurrentWeeklyTeamSnapShot();
      };
   }, [id, team.id]);

   const dismissCelebration = () => {
      challengesStore.celebrationModal = false;
   };

   useEffect(() => {
      id && endDateKey && getVoteDocsSnapShot(id, endDateKey);
      return () => {
         clearVoteDocsSnapShot();
      };
   }, [endDateKey]);

   // const goToProfile = (user) => {
   //    navigate(Routes.MyProfileHome, { user });
   //    // navigate(Routes.MyProfile, { user })
   // };

   const goToChat = () => {
      navigate(Routes.Chat, {
         stream: { streamId: team.id, streamName: team.name },
      });
      // navigate(Routes.MyProfile, { user })
   };

   // const showPlayerSmashesFunc = (uid) => {
   //    setFocusPlayer(uid);
   //    showPlayerSmashes(uid);
   // };

   const dismissFirstChallenge = () => {
      setCongratsFirstChallenge(false);
   };
   const dismissInsights = () => {
      challengesStore.setInsightsPlayerChallengeDoc(false);
   };

   const share = () => {
      Vibrate();
      pluckSound();
      smashStore.universalLoading = true;
      setIsTeamJustCreated(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      smashStore.shareTeam(team);
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

   currentTeam?.habitStackIds?.forEach((stackId) => {
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

   return (
      <ScrollView
         // style={{ marginTop: 50 }}
         contentContainerStyle={{
            paddingBottom: 230,
            paddingTop: 0,
         }}
         keyboardShouldPersistTaps="always"
         showsVerticalScrollIndicator={false}>
         <View
            style={{
               margin: 0,
               height: 80,
               width: width,
               backgroundColor: '#ccc',
               borderRadius: 0,
            }}>
            <SmartImage
               uri={picture?.uri}
               preview={picture?.preview}
               style={{
                  margin: 0,
                  height: 180,
                  width: width,
                  backgroundColor: '#ccc',
                  borderRadius: 0,
               }}
            />
            {picture?.uri ? (
               <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                  style={{
                     margin: 0,
                     height: 180,
                     width: width,
                     borderRadius: 0,
                     position: 'absolute',
                  }}
               />
            ) : (
               <LinearGradient
                  colors={[Colors.buttonLink, Colors.smashPink]}
                  start={{ x: 0.6, y: 0.1 }}
                  style={{
                     margin: 0,
                     height: 180,
                     width: width,
                     borderRadius: 0,
                     position: 'absolute',
                  }}
               />
            )}
         </View>
         {currentTeamWeeklyProgress >= 100 && (
            <View
               style={{
                  width: width,
                  position: 'absolute',
                  paddingTop: 55,
               }}>
               <Text white center B18>
                  🚀 WEEK TARGET SMASHED ✅
               </Text>
            </View>
         )}
         <TeamHeader
            voteDocs={voteDocs}
            showWeeklyTarget={showWeeklyTarget}
            team={team}
            isUserJoined={isUserJoined}
            legacyActivities={legacyActivities}
            joinLeaveButton={
               getButtonLabel() != 'Leave Team' && (
                  <ButtonLinear
                     marginH-0
                     marginB-16
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
                     style={{ marginBottom: 16 }}
                  />
               )
            }
            teamScrollView={
               !isUserJoined ? (
                  () => null
               ) : true ? (
                  <></>
               ) : (
                  <View row paddingH-16 paddingV-20 marginB-16 marginL-8>
                     {[1, 1, 1, 1].map((p, i) => {
                        return (
                           <View
                              key={i}
                              style={[styles.section, { marginRight: 10 }]}>
                              <Shimmer
                                 style={{
                                    height: 70,
                                    width: 70,
                                    borderRadius: 140,
                                 }}
                              />
                              <Shimmer
                                 style={{
                                    height: 10,
                                    width: 30,
                                    marginTop: 5,
                                    borderRadius: 5,
                                 }}
                              />
                           </View>
                        );
                     })}
                  </View>
               )
            }
            buttonMarkup={
               <>
                  <CustomButtonLinear
                     outline
                     textColor={Colors.buttonLink}
                     styleText={{ color: Colors.buttonLink }}
                     style={{
                        width: width - 64,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: Colors.buttonLink,
                     }}
                     // outlineColor={Colors.buttonLink}
                     title={`Votes ${
                        notVotedOn.length > 0
                           ? '(' + notVotedOn.length + ')'
                           : ''
                     }`}
                     onPress={() => {
                        setIsVoteDialogVisible(true);
                     }}
                  />
               </>
            }
            findChallengeButtonMarkup={
               <ButtonLinear
                  bordered
                  color={Colors.purple30}
                  style={{
                     width: width - 64,
                     marginBottom: 16,
                  }}
                  onPress={() => {
                     navigate(Routes.JoinTeamChallenges, {
                        teamId: team.id,
                     });
                  }}
                  title="Team Challenges"
               />
            }
         />

         {isUserJoined && !loadingCurrentTeam && <FeedPreview team={team} />}

         {isUserJoined && <Recent type="team" team={team} hideHeader />}
      </ScrollView>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(MainTeamArena));

const styles = StyleSheet.create({
   segment: { marginHorizontal: 16, marginBottom: 16, width: width - 32 },
   section: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
   },
});
