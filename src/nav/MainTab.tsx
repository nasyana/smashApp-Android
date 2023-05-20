
import React, { useState, useEffect, useRef } from 'react';
import { Platform, Modal, FlatList } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { collection, where, onSnapshot,query,setDoc,doc, getDoc } from "firebase/firestore";
import {
   Assets,
   Colors,
   View,
} from 'react-native-ui-lib';
import MainTabRenderItem from './MainTabRenderItem';
import Routes from 'config/Routes';
import { inject, observer } from 'mobx-react';
import SmashButtonMenu from './SmashButtonMenu';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import firebaseInstance from 'config/Firebase';
import ActivityHome from 'modules/ActivityHome';
import * as Linking from 'expo-linking';
import Goals from 'modules/Goals';

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
   }),
});

// Import the lazily loaded components
const StreaksHome = React.lazy(() => import('modules/Home/StreaksHome'));
const TeamMainScreen = React.lazy(() => import('modules/TeamMainScreen'));
const Achievements = React.lazy(() => import('modules/Achievements'));


const Tab = createBottomTabNavigator();

const MainTab = (props) => {

   const { teamsStore, challengesStore, smashStore } = props;
   const { navigate } = useNavigation();

   const navigation = useNavigation();
   const notificationListener = useRef();
   const responseListener = useRef();


   const setPushToken = (token) => {
      const { uid } = firebaseInstance.auth.currentUser;
    
      if (token) {
        setDoc(doc(collection(firebaseInstance.firestore, "users"), uid), { expoPushToken: token }, { merge: true });
      }
    };



   useEffect(() => {

      asyncUseEffectFunction();
    
      return () => {
    
      };
    }, []);

   
   const asyncUseEffectFunction = async () => {

      const { teamsStore, challengesStore, smashStore } = props;

      smashStore.setUniversalLoading('initialloading');

      
      console.log('run asyncUseEffectFunction')

      challengesStore.fetchChallenges();
      challengesStore.fetchMyPlayerChallenges();
      challengesStore.fetchGoals();
      challengesStore.fetchPlayerGoals();
     
  
     
         
       teamsStore.fetchMyTeams();
      
      teamsStore.subscribeToMyTeamWeeklyDocs();
  
      smashStore.setUniversalLoading(false);
   };

useEffect(() => {
 
   teamsStore.getFriends();
   teamsStore.getTeams();

   return () => {

   };
}, [smashStore.todayDateKey]);

   useEffect(() => {


      const handleDeepLink = (url) => {
         let data = Linking.parse(url);


         if (data) {
            if (data.scheme === 'https' || data.queryParams.teamId) {
               let deepLink = data.queryParams.link;
               var regex = /[?&]([^=#]+)=([^&#]*)/g,
                  params = {},
                  match;
               while ((match = regex.exec(deepLink))) {
                  params[match[1]] = match[2];
               }
               if (params.teamId) {
                  // alert(params.teamId)

                  // this.props.smashStore.newGame = params.teamId;
                  navigate(Routes.TeamArena, { team: { id: params.teamId }, fromPushNotification: true });
                  // Linking.removeEventListener('url');
               } else if (data?.queryParams?.teamId) {
                  // console.log('yes we have a team ixd',JSON.stringify(data))
                  navigate(Routes.TeamArena, {
                     team: { id: data?.queryParams?.teamId }, fromPushNotification: true
                  });

                  // Linking.removeEventListener('url');
               } else if (data?.queryParams?.challengeId) {
                  // console.log('yes we have a team ixd',JSON.stringify(data))
                  navigate(Routes.ChallengeArena, {
                     playerChallenge: {
                        challengeId: data?.queryParams?.challengeId,
                        challengeName: 'Loading...',
                     },
                  });

                  // Linking.removeEventListener('url');
               } else if (data?.queryParams?.playerId) {
                  // console.log('yes we have a team ixd',JSON.stringify(data))
                  navigate(Routes.MyProfileHome, {
                     user: {
                        uid: data?.queryParams?.playerId,
                        id: data?.queryParams?.playerId,
                        name: 'Loading...',
                     },
                  });

                  // Linking.removeEventListener('url');
               } else {
                  // alert('else');
                  // getInitialURL();
               }
            }
         }
      };

      const getInitialURL = async () => {
         const initialUrl = await Linking.getInitialURL();

         if (initialUrl) {
            // alert(JSON.parse(initialUrl))
            handleDeepLink(initialUrl);
            // Linking.removeEventListener('url');
         }
      };

      getInitialURL();

      const subsciptionToListner = Linking.addEventListener('url', (event) => {
         handleDeepLink(event.url);
      });

      return () => subsciptionToListner.remove();
   }, []);



   // useEffect(() => {
   //    smashStore.navigation = navigation;

   //    return () => { };
   // }, []);

   // useEffect(() => {
   //    setTimeout(() => {
   //       smashStore.setCheckPermissions(true);
   //    }, 3000);

   //    return () => { };
   // }, []);


   useEffect(() => {

      const { teamsStore, smashStore } = props;
      smashStore.navigation = navigation;
      const { myTeamsHash } = teamsStore;

      const goToChallengeArena = (playerChallengeId) => {
         const playerChallengeRef = doc(firebaseInstance.firestore, 'playerChallenges', playerChallengeId);
         getDoc(playerChallengeRef)
           .then((docSnap) => {
             if (docSnap.exists()) {
               const playerChallenge = docSnap.data();
               navigate('ChallengeArena', { playerChallenge });
             } else {
               alert('Player Challenge Does Not Exist!!');
             }
           })
           .catch((error) => {
             console.log('Error getting player challenge:', error);
             alert('An error occurred while trying to get the player challenge');
           });
       };
       
       const gotToTeamArena = (teamId) => {
         const teamRef = doc(firebaseInstance.firestore, 'teams', teamId);
         getDoc(teamRef)
           .then((docSnap) => {
             if (docSnap.exists()) {
               const team = docSnap.data();
               navigate('TeamArena', { team });
             } else {
               alert('Team Does Not Exist!!');
             }
           })
           .catch((error) => {
             console.log('Error getting team:', error);
             alert('An error occurred while trying to get the team');
           });
       };
       
       const goToUserProfile = (userId) => {
         const userRef = doc(firebaseInstance.firestore, 'users', userId);
         getDoc(userRef)
           .then((docSnap) => {
             if (docSnap.exists()) {
               const user = docSnap.data();
               navigate('MyProfileHome', { user });
             } else {
               alert('User Does Not Exist!!');
             }
           })
           .catch((error) => {
             console.log('Error getting user:', error);
             alert('An error occurred while trying to get the user');
           });
       };
       

      registerForPushNotificationsAsync().then((token) => setPushToken(token)).then(() => {

         smashStore.setCheckPermissions(true);
      });

      // notificationListener.current =
      //    Notifications.addNotificationReceivedListener((notification) => {
      //       setNotification(notification);
      //    });

      responseListener.current =
         Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response?.notification?.request?.content?.data;

            const teamId = data?.teamId;
            const type = data?.type || false;

            const playerChallengeId = data?.playerChallengeId;

            const userId = data?.userId;

            const postId = data.postId;
            const post = data.post || false;

            const goalId = data.goalId || false;

            ///// Team Invite - on Press open team

            ///// Wants to Play - Sent to admin and on press open team.

            ///// You've been accepted into Team. - onPress open team

            //// You've been overtaken (Team) - OnPress Open Team

            if(goalId){
     
               navigate(Routes.GoalArena, { goalDoc: { id: item.goalId } });
           
         }

            if (teamId) {
               if (type == 'requestToJoin') {
                  const team = myTeamsHash?.[teamId];
                  ///showRequestsModal
                  teamsStore.setCurrentTeam(team);
                  navigate(Routes.CreateTeam, {
                     teamId,
                     teamDoc: team,
                     type: type,
                  });
               } else {
                  gotToTeamArena(teamId);
               }
            }

            //// Challenge Progess Like - On press Open Challenge

            //// You've been overtaken - OnPress Open Challenge

            if (playerChallengeId) {
               goToChallengeArena(playerChallengeId);
            }

            //// Follow Notification - Blah has followed you. - Open Blah's Profile.

            if (userId) {
               goToUserProfile(userId);
            }

            ///// Story Like or Reaction - Open Story in Story View.

            if (postId) {
               navigate(Routes.SinglePost, { postId: postId, tempPost: post })
               // goToPost(postId);
               // smashStore.stories = data?.smash
               //    ? [data.smash]
               //    : [{ id: postId }];
               // smashStore.storyIndex = 0;
            }

            /////
            console.log(response);
         });

      return () => {
         Notifications.removeNotificationSubscription(
            notificationListener.current,
         );
         // Notifications.removeNotificationSubscriiption(responseListener.current);
      };
   }, []);



   return (
      <View flex>
         <Tab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
            
         >
            <Tab.Screen
               name={Routes.ActivityHome}
               component={ActivityHome}
               options={{ headerShown: false }}
            />
            <Tab.Screen
               name={Routes.StreaksHome}
               component={StreaksHome}
               options={{ headerShown: false }}
            />
            <Tab.Screen
               name={Routes.TeamMainScreen}
               component={TeamMainScreen}
               options={{ headerShown: false }}
            />
            <Tab.Screen
               name={Routes.Goals}
               component={Goals}
               options={{ headerShown: false }}
            />
               {/* <Tab.Screen
               name={Routes.Achievements}
               component={Achievements}
               options={{ headerShown: false }}
            /> */}
         </Tab.Navigator>
         <SmashButtonMenu />
         {/* <SmashButtonMenuAndroid /> */}

      </View>
   );
};
//@ts-ignore
const MyTabBar = inject(
   'smashStore',
   'notificatonStore',
   'challengesStore',
   'teamsStore',
)(
   observer(
      ({
         state,
         navigation,
         smashStore
      }) => {




         // const { notificationCount = 0 } = notificatonStore;
         const IMAGES = [

            {
               active: Assets.icons.activity_active,
               inActive: Assets.icons.activity_inactive,
               label: 'Activity',
               name: Routes.ActivityHome,
               iconName: 'activity',
            },
            {
               inActive: Assets.icons.star_inactive,
               active: Assets.icons.star_active,
               label: 'Streaks',
               name: Routes.StreaksHome,
               iconName: 'checksquareo',
            },
            {
               inActive: Assets.icons.achievements_inactive,
               active: Assets.icons.achievements_active,
               label: '',
               name: '',
               iconName: 'home',
            },

            {
               active: Assets.icons.teams_active,
               inActive: Assets.icons.teams_inactive,
               label: ' Teams',
               name: Routes.TeamMainScreen,
               iconName: 'team',
            },
            // {
            //    active: Assets.icons.ic_workout_active,
            //    inActive: Assets.icons.ic_workout_normal,
            //    label: ' FAQs',
            //    name: Routes.Faqs,
            //    iconName: 'infocirlceo',
            // },


            // {
            //    inActive: Assets.icons.achievements_inactive,
            //    active: Assets.icons.achievements_active,
            //    label: 'Achievements',
            //    // name: Routes.AllMyActivitiesList,
            //    // name: Routes.Notification,
            //    name: Routes.Achievements,
            //    // iconName: 'hearto',
            //    iconName: 'Trophy',
            // },
            {
               inActive: Assets.icons.challenges_inactive,
               active: Assets.icons.challenges_active,
               label: 'Goals',
               // name: Routes.AllMyActivitiesList,
               // name: Routes.Notification,
               name: Routes.Goals,
               // iconName: 'hearto',
               iconName: 'Trophy',
            },
            
            
            // {
            //    inActive: Assets.icons.ic_exercire_normal,
            //    active: Assets.icons.ic_exercire_active,
            //    label: 'Activities',
            //    name: Routes.AllMyActivitiesList,
            //    iconName: 'lightning-bolt',
            //    library: 'MaterialCommunityIcons'
            // },
            // {
            //    inActive: Assets.icons.profile_inactive,
            //    active: Assets.icons.profile_active,
            //    label: 'My Profile',
            //    name: Routes.MyProfile,
            //    iconName: 'user',
            // },
         ];
         const renderItem = ({ item, index }) => {
            // if (index === 2) {
            //   return <View key={index} style={{ flex: 2 }} />;
            // }
            return (
              <MainTabRenderItem
                key={item.label}
                item={item}
                index={index}
                navigation={navigation}
              />
            );
          };
        



         console.log('render MyTabBar');
         return (
            <View
            style={{
              backgroundColor: Colors.contentW,
              paddingBottom: Platform.OS === 'android' ? 8 : 16,
              paddingHorizontal: 24
            }}>
            <FlatList
              data={IMAGES}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.label.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                paddingVertical: 8,
                paddingHorizontal: 0,
                flexGrow: 1, // Add flexGrow to make the container take up the full width
                justifyContent: 'space-between', // Distribute the items evenly across the screen
              }}
            />
          </View>
         );
      },
   ),
);


async function registerForPushNotificationsAsync() {
   let token;
   if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== 'granted') {
         // alert('Failed to get push token for push notification!');
         return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
   } else {
      // alert('Must use physical device for Push Notifications');
   }

   if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
         name: 'default',
         importance: Notifications.AndroidImportance.MAX,
         vibrationPattern: [0, 250, 250, 250],
         lightColor: '#FF231F7C',
      });
   }

   return token;
}

export default inject("smashStore", "challengesStore", "teamsStore")(observer(MainTab));
