import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "components/Header";
import ButtonLinear from "components/ButtonLinear";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React, { useEffect, useState } from "react";
import {
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   ScrollView,
   Modal,
   Alert,
   Platform,
} from 'react-native';
import {
   Assets,
   Colors,
   View,
   Button,
} from 'react-native-ui-lib';
import { shadow } from 'config/scaleAccordingToDevice';
import { AntDesign, Feather } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import ChallengeHeader from '../../components/ChallengeHeader';
import Firebase from '../../config/Firebase';
import SmashButton from './components/SmashButton';
import { bottom, height, width } from '../../config/scaleAccordingToDevice';
import useBoolean from '../../hooks/useBoolean';
import { useNavigation, useRoute } from '@react-navigation/core';
import FeedPreview from './components/FeedPreview';
import SmartImage from '../../components/SmartImage/SmartImage';
import ChallengeJourney from "components/ChallengeJourney";
import { hexToRgbA } from "helpers/generalHelpers";
import ChallengeArenaScreensx from "./components/ChallengeArenaScreensx";
import {Vibrate} from '../../helpers/HapticsHelpers';
import InitialChallengeGuide from 'components/InitialChallengeGuide';
const Tab = createMaterialTopTabNavigator();
const ChallengeArena = (props) => {


   const [congratsFirstChallenge, setCongratsFirstChallenge] = useState(false);
   const [loading, setLoading] = useState(false);
   const [arenaIndex, setArenaIndex] = useState(0);
   const { navigate, goBack, } = useNavigation();
   const route = useRoute();
   const playerChallengeInitial =
      props?.route?.params?.playerChallenge || false;

      const challengeInitial = props?.route?.params?.challenge || false;
   const comeFromChallengeList = props?.route?.params?.comeFromChallengeList || false;
   // const [playerChallenge, setPlayerChallenge] = useState(
   //    playerChallengeInitial,
   // );





   const { uid } = Firebase.auth.currentUser;

   let team = false;
   //props?.route?.params?.team || false;
   const { smashStore, challengesStore } = props;

   const {
      toggleMeInChallenge,
      playerChallengeHashByChallengeId,
      challengesHash,
      setCurrentChallenge
   } = challengesStore;

   const challengeId =
      playerChallengeInitial?.challengeId || challengeInitial?.id;

   const challenge = challengesHash?.[challengeId] || false;

   const playerChallenge =
      playerChallengeHashByChallengeId?.[challengeId] || false;

   const picture = playerChallenge?.picture || challenge?.picture;




   useEffect(() => {

      setCurrentChallenge(challenge);
      
      return () => {
         // setCurrentChallenge(false);
      }
   }, [])


   const goToProfile = (user) => {

      if (user.uid === uid) {
         navigate(Routes.MyProfile, { user });
      } else {

         navigate(Routes.MyProfileHome, { user });
      }

   };


 
   const { currentUser } = smashStore;
   const alreadyPlaying = playerChallenge.id;

   const share = () => {

      Vibrate()
      smashStore.shareChallenge(challenge);
   };

   const accentColor = playerChallenge?.colorStart || Colors.buttonLink;
   const getButtonActionLabel = (): string => {
      return alreadyPlaying ? 'Leave' : 'Join Challenge';
   };

   const back = () => {

      goBack();
   };

   const gradientColorStart = hexToRgbA(playerChallenge?.colorStart, 0.4);

   const gradientColorEnd = hexToRgbA(playerChallenge?.colorEnd, 1);

   const confirmChallengeDuration = (challenge, toggleFunc) => {
      challengesStore.setChallengeToJoin(challenge);
   };
   if (!challenge.name) {
      return (
         <View flex>
            <Header
               title={'Loading Challenge'}
               back
               backFn={back}
               noShadow
               titleColor={'#aaa'}
            />
         </View>
      );
   }

console.log('render ChallengeArena');
   return (
      <View flex>
         <Header
            title={team ? 'Team Challenge' : 'Habit Stack Challenge'}
            back
            backFn={back}
            noShadow
            titleColor={'#aaa'}
            challengeId={challengeId}
            rightFn={share}
            btnRight={
               <TouchableOpacity onPress={share}>
                  <Feather name={'share'} size={25} color={'#333'} />
               </TouchableOpacity>
            }
         />
         <View
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
         </View>  
         <ScrollView
            contentContainerStyle={{ paddingBottom: 90, paddingTop: 40 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            bounces={true}>
            <View style={{ backgroundColor: Colors.colorF2 }}>
            <ChallengeJourney playerChallenge={playerChallenge} challenge={challenge} showLabel />
            {/* </View> */}

            <ChallengeHeader
               playerChallenge={playerChallenge}
               // loading={loading}
               {...{
                  smashStore,
                  challenge,
                  challengesStore,
                  challengeId,
                  alreadyPlaying,
                  accentColor,
               }}
            />

            <View marginB-16>
               <ButtonLinear
                  style={{ marginBottom: 16 }}
                  color={alreadyPlaying ? '#aaa' : null}
                  bordered={alreadyPlaying ? true : false}
                  title={getButtonActionLabel()}
                  size="small"
                  fullWidth={true}
                  onPress={() => {
                     if (alreadyPlaying) {
                        Alert.alert(
                           'Are you sure?',
                           'You will need to start this challenge from the beginning if you leave before the challenge finishes then return.',
                           [
                              {
                                 text: 'Cancel',
                                 onPress: () => console.log('Cancel Pressed'),
                                 style: 'cancel',
                              },
                              {
                                 text: 'OK',
                                 onPress: () => {
                                    toggleMeInChallenge(
                                       challenge,
                                       currentUser,
                                       alreadyPlaying,
                                       {
                                          startDate:
                                             playerChallenge.startDate || false,
                                          endDate:
                                             playerChallenge.endDate || false,
                                          duration:
                                             playerChallenge.duration || false,
                                       },
                                    );
                                    goBack();
                                 },
                              },
                           ],
                        );
                     } else {
                        confirmChallengeDuration(challenge);
                     }
                  }}
               />

               {alreadyPlaying && !loading && (
                  <FeedPreview challengeId={challenge.id} />
               )}
            </View>

               {alreadyPlaying && (
               <><ChallengeArenaScreensx challenge={challenge} />
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
            </View></ScrollView>
         {alreadyPlaying && (
            <SmashButton
               challenge={challenge}
               masterIds={challenge.masterIds}
            />
         )}



         {/* <Dialog
            panDirection={PanningProvider.Directions.DOWN}
            visible={challengesStore.insightsPlayerChallengeDoc}
            onDismiss={dismissInsights}
            overlayBackgroundColor={Colors.Black54}
            containerStyle={{
               justifyContent: 'flex-end',
               backgroundColor: Colors.white,
               width: '100%',
               paddingBottom: bottom,
            }}
            width="100%"
            bottom>
            <View style={{ height: height / 1.5, width: '100%' }}>
               <ActivitiesPieChart />
               <PlayerStats close={hidePlayerSmashes} challengeId={challenge.id} uid={focusPlayer || uid} endDateKey={challengeData?.endDateKey} inModal={true} />
               <InsightsScreens />
            </View>
         </Dialog> */}

         {/* <Modal
            visible={
               props.challengesStore.subscribeModal == 'challengeArena'
                  ? true
                  : false
            }
            onDismiss={() => null}
            overlayBackgroundColor={Colors.Black54}
            animationType="slide"
            containerStyle={{
               justifyContent: 'flex-end',
               backgroundColor: Colors.white,
               width: '100%',
               paddingBottom: bottom,
            }}
            width="100%">
            <View style={{ minHeight: height - height / 3 }}>
               <Subscribe />
            </View>
         </Modal> */}
         <InitialChallengeGuide challenge={challenge} playerChallenge={playerChallenge} />
      </View>
   );
};;;;;;;;;

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(ChallengeArena));

const styles = StyleSheet.create({
  segment: { marginHorizontal: 16, marginBottom: 16, width: width - 32 }
});

