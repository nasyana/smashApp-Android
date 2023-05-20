import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
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
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';
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
import { Vibrate } from 'helpers/HapticsHelpers';
import TeamToday from 'modules/TeamArena/TeamToday';

const MainTeamArenaScreen = (props) => {
   const { smashStore, teamsStore, challengesStore, route } = props;
   const {
      currentUser,
   } = smashStore;


   const { navigate, goBack } = useNavigation();

   const { setIsVoteDialogVisible } = challengesStore;

   const {
      loadingCurrentTeam,
      voteDocs,
      currentTeamWeeklyProgress,
      currentTeam
   } = teamsStore;

   const team = currentTeam;
   const { picture } = team;

   const viewToday = () => {

      Vibrate();
       //  setHomeTabsIndex(3);
       //  goToTeamArena(team);
    
        smashStore.setQuickViewTeam({ ...team, teamToday: true }); 
    
    }


   // useEffect(() => {
    
   //    setTimeout(() => {
   //     viewToday();
   //    }, 5000);
      
   //      return () => {
          
   //      }
   //    }, [])

   const id = team?.id;
   const { uid } = Firebase.auth.currentUser;
   console.log('smashapp check render teamarena');
   const isUserJoined = currentUser?.teams?.includes(id);
   const isUserInvited = team?.invited?.includes(uid);
   const isUserRequested = team?.requested?.includes(uid);
   const showWeeklyTarget =
      (team?.actions && Object.keys(team?.actions)?.length > 0) || false;

   const getButtonLabel = () => {
      if (!isUserJoined && !isUserInvited && !isUserRequested)
         return 'Join Team';
      else if (isUserJoined) return 'Leave Team';
      else if (isUserInvited) return 'Accept Invite';
      else if (isUserRequested) return 'Requested';
   };


   const notVotedOn =
      voteDocs?.length > 0
         ? voteDocs.filter(
            (vote: any) =>
               !vote.voteYes?.includes(uid) && !vote.voteNo?.includes(uid),
         )
         : [];

   const onPressButton = () => {
      const action = getButtonLabel();

      if (action === 'Join Team') {
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
               { text: 'OK', onPress: () => { teamsStore.leaveFromTeam(team.id); goBack(); } },
            ],
         );
      } else {
         teamsStore.requestToAddToTeam(team, currentUser);
      }
   };

  


   let leaveTeam = false;
   if (getButtonLabel() === 'Leave Team') {
      leaveTeam = true;
   }
const share = async () => {

   smashStore.shareTeam(team)
}

// const isUserJoined = team?.joined?.includes(uid)


   const imageHeight = 240;

   // if(!loaded){return  <View flex center>

   //    <ActivityIndicator  size={'large'}/>
   // </View>}


   return (
      <ScrollView
         // style={{ marginTop: 50 }}
         // bounces={false}
         contentContainerStyle={{
            paddingBottom: 40,
            paddingTop: 0,
         }}
         keyboardShouldPersistTaps="always"
         showsVerticalScrollIndicator={false}>
         <View
            style={{
               margin: 0,
               height: imageHeight,
               width: width,
               backgroundColor: '#ccc',
               borderRadius: 0,
               marginTop: -150
            }}>
            <SmartImage
               uri={picture?.uri}
               preview={picture?.preview}
               style={{
                  margin: 0,
                  height: imageHeight,
                  width: width,
                  backgroundColor: Colors.smashPink,
                  borderRadius: 0,
               }}
            />
           <LinearGradient
                  colors={picture?.uri ? ['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)'] : [Colors.buttonLink, Colors.smashPink]}
                  style={{
                     margin: 0,
                     height: imageHeight,
                     width: width,
                     borderRadius: 0,
                     position: 'absolute',
                  }}
               />
                 <TouchableOpacity onPress={share} style={{top: -64, }} center><View padding-8 paddingH-12 style={{backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8}} centerV><Text R16 style={{color: 'rgba(255,255,255,1)'}}><Entypo name="share-alternative" color="#fff" size={18} /> INVITE CODE {team.code}</Text></View></TouchableOpacity>
         </View>
       
         {/* {currentTeamWeeklyProgress >= 100 && (
            <View
               style={{
                  width: width,
                  position: 'absolute',
                  paddingTop: 10,
               }}>
               <Text white center B16>
               🏆 WEEK TARGET SMASHED</Text>
            </View>
         )} */}

      <TeamHeader
            voteDocs={voteDocs}
            showWeeklyTarget={showWeeklyTarget}
            team={team}
            isUserJoined={isUserJoined}
            onPressButton={onPressButton}
            getButtonLabel={getButtonLabel}
         />
   {/* <TeamToday
           
                  team={team}
                  navigation={smashStore.navigation}
               /> */}

{/* <TouchableOpacity onPress={viewToday} padding-24><Text>asd</Text></TouchableOpacity> */}
         {/* {isUserJoined && !loadingCurrentTeam && (
            <FeedPreview team={team} />
         )} */}

         {/* {isUserJoined && (
            <DelayLoading delay={1000}><Recent type="team" team={team} hideHeader /></DelayLoading>
         )} */}
      </ScrollView>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(MainTeamArenaScreen));
