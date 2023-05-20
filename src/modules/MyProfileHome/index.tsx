/* default libs */
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import {inject, observer} from 'mobx-react';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   onSnapshot,
   query,
   setDoc,
   where
 } from 'firebase/firestore';
import { bottom, height, width } from 'config/scaleAccordingToDevice';
/* components modules */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Box from 'components/Box';
import Header from 'components/Header';
import SmartImage from '../../components/SmartImage/SmartImage';
import Insights from '../../modules/Overview/Insights';
import ChallengesBreakdownList from '../../modules/Overview/components/ChallengesBreakdownList';
import TimelineToday from 'modules/PlayerStats/TimelineToday';

/* styles */
import { styles } from './styles';
import { ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import {
   View,
   Text,
   Colors,
   Assets,
   Image,
   Button,
   TouchableOpacity,
} from 'react-native-ui-lib';
import Subscribe from 'components/Subscribe';
/* config firebase*/
import firebaseInstance from '../../config/Firebase';

const firestore = firebaseInstance.firestore;
import { FONTS } from '../../config/FoundationConfig';
import PlayerBadgesHorizontalScrollview from './PlayerBadgesHorizontalScrollview';
import SectionHeader from 'components/SectionHeader';
import ButtonLinear from 'components/ButtonLinear';
import FollowButton from 'modules/Notification/FollowButton';
import StreakBadgesMonth from 'modules/StreakBadges/StreakBadgesMonth';
import StreakBadgesHighlight from '../StreakBadges/StreakBadgesHighlight';
const MyProfileHome = (props: any) => {
   const { navigate, goBack, replace } = useNavigation();
   const { smashStore, teamsStore } = props;
   const {
      currentUser,
      setHomeTabsIndex,
      currentUserId,
      currentUserFollowing
   } = smashStore;

   const [loading, setLoading] = useState(false);
   const user = props?.route?.params?.user || false;
   const [userSnapShot, setUserSnapShot] = useState(user);
   const [userTodayDoc, setUserTodayDoc] = useState(false);
   const [numberOfChallenges, setNumberOfChallenges] = useState(0);
   

   const userId = user.uid || user.uid;
   const isMe = userId == currentUserId || user == false;
   const userSnapshot = userSnapShot;
   const isFollowing = currentUser?.following?.includes(userSnapshot.uid);


   
 

   //  if (currentUser?.subscription == 'SmashOne') {
   //     showModal = false;
   //  }
   useEffect(() => {
      const unsubscribeToUserTodayPoints = onSnapshot(doc(collection(firestore, 'users', user.uid, 'days'), moment().format('DDMMYYYY')), (userSnap) => {
        if (userSnap.exists()) {
          const userTodayDoc = userSnap.data();
          setUserTodayDoc(userTodayDoc);
        }
      });
    
      return () => {
        if (unsubscribeToUserTodayPoints) {
          unsubscribeToUserTodayPoints();
        }
      };
    }, [user.uid]);
    
    useEffect(() => {
      let numChallenges = 0;
      const unsubscribeToUserPlayerChallenges = onSnapshot(query(collection(firestore, 'playerChallenges'), where('uid', '==', user.uid), where('active', '==', true)), (userSnaps) => {
        numChallenges = userSnaps.size;
        setNumberOfChallenges(numChallenges);
      });
    
      return () => {
        if (unsubscribeToUserPlayerChallenges) {
          unsubscribeToUserPlayerChallenges();
        }
      };
    }, [user.uid]);
    

    useEffect(() => {
      console.log('userIdx', user.uid);
      const unsubscribeToUserDoc = onSnapshot(doc(collection(firestore, 'users'), user.uid), (userSnap) => {
        if (userSnap.exists()) {
          const userSnapShot = userSnap.data();
          setUserSnapShot(userSnapShot);
          console.log('userSnapShot', userSnapShot);
        }
      });
    
      return () => {
        if (unsubscribeToUserDoc) {
          unsubscribeToUserDoc();
        }
    
      
   
      };
    }, [user.id]);


    const updateUserDocWithStreakRepairsBasedOnHowManyChallengeStreakBadgesTheyHave = async () => {
      // create a promise array to store all of the promises for getting the streak badge count for each challengeId

      const uid = user.uid;
      const promises = [];
      const challengeCountHash = {};
    
      const celebrationsCollectionRef = collection(firestore, 'celebrations');
    
      // get all of the challenges for the user
      const challengesQuery = query(collection(firestore, 'playerChallenges'), where('uid', '==', uid), where('active', '==', true));
      const challengesSnaps = await getDocs(challengesQuery);
    
      challengesSnaps.forEach((challengeSnap) => {
        const promise = (async () => {
          const challenge = challengeSnap.data();
          const challengeId = challenge.challengeId;
    
          const streakBadgesQuery = query(celebrationsCollectionRef,
            where('uid', '==', uid),
            where('type', '==', 'challengeStreak'),
            where('challengeId', '==', challenge.challengeId))
    
          // get size of query
          const streakBadgesSnaps = await getDocs(streakBadgesQuery);
          const streakBadgeCount = streakBadgesSnaps.size;
    
          challengeCountHash[challengeId] = streakBadgeCount;
        })();
    
        promises.push(promise);
      });
    
      // Wait for all promises to resolve
      await Promise.all(promises);
    
      // Log the challenge count hash
      console.log(challengeCountHash);

      // set user doc with streak repairs count in user.streakRepairs[challengeId] = streakBadgeCount
      const userDocRef = doc(collection(firestore, 'users'), uid);
      setDoc(userDocRef, { streakRepairs: {...challengeCountHash} }, { merge: true });

    }
    
    
    let DATA = [];
    if (isFollowing) {
      DATA = [
        {
          icon: Assets.icons.ic_simple_calories,
          title: 'Recent Activity',
          onPress: () => navigate(Routes.Timeline, { uid: userSnapshot.uid }),
        },
      ];
    } else {
      DATA = [
        {
          icon: Assets.icons.ic_simple_calories,
          title: 'Recent Activity',
          onPress: () => navigate(Routes.Timeline, { uid: userSnapshot.uid }),
        },
      ];
    }
    

   const { uid } = firebaseInstance.auth.currentUser;
   const goToFollowers = () => navigate('Followers', { user: userSnapshot });
   const goToFollowing = () => navigate('FollowingNew', { user: userSnapshot });

   const isFollowingMe = currentUser?.followers?.includes(userSnapshot.uid);

   const goToUserChallenges = () => {
      if (isFollowingMe) {
         navigate(Routes.UserChallenges, { user: userSnapshot });
      } else {
         Alert.alert(
            userSnapshot.name + ' is not following you.',
            'Once player is following you, you can see their challenges.',
            [
               {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
               },
               // { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
         );
      }
   };

   const tryCreateSpace = () => {
      Alert.alert(
         userSnapshot.name + ' is not following you.',
         'Oops! You cannot challenge someone 1 on 1 unless they follow you back.',
         [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
         ],
      );
   };
   const createSpace = async () => {
      Alert.alert(
         `Challenge ${userSnapshot.name}?`,
         'Are you sure you want to challenge ' +
            userSnapshot.name +
         " to a weekly habit stack battle? If you press continue, we'll setup a team area for you both to see who's the real MVP. You can battle against each other or just try to smash your team target. Team Battles coming soon!",
         [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: 'Continue',
               onPress: async () => {
                  setLoading(true);
                  const team = await teamsStore.createAccountabiltySpace(
                     userSnapshot,
                     currentUser,
                  );
                  // {
                  //    name: team.name,
                  //    title: 'Thanks for your vote!',
                  //    subtitle: subtitle,
                  // };
                  smashStore.simpleCelebrate = {
                     name: team.name + '  is all setup!',
                     title: 'Next Step, Choose Your Habit Stacks for the battle!',
                     subtitle: `${userSnapshot?.name} has been sent an invite to this space.`,
                     button: 'Choose Habit Stack',
                     nextFn: () => {
                        teamsStore.setCurrentTeam(team);
                        setTimeout(() => {
                           teamsStore.setShowLibraryActivitiesModal(true);
                        }, 500);
                        // navigate(Routes.SetWeeklyActivities, {
                        //    teamDoc: team,
                        // });
                     },
                  };
                  replace('TeamArena', { team });
                  setHomeTabsIndex(0);
               },
            },
         ],
      );
   };

   return (
      <View flex backgroundColor={Colors.background}>
         <Header back title={'Profile'} noShadow />

         <ScrollView>


            <Box style={{ marginTop: 16 }}>
               <View row>
                  {userSnapshot?.picture?.uri && (
                     <SmartImage
                        uri={userSnapshot?.picture?.uri || Assets.icons.avatar}
                        preview={userSnapshot?.picture?.preview || ''}
                        style={{
                           height: 60,
                           width: 60,
                           borderRadius: 80,
                           marginTop: 16,
                           marginBottom: 18,
                           marginLeft: 16,
                        }}
                     />
                  )}

                  <View paddingV-16 paddingL-16 flex>
                     <Text R16 color6D>
                        Nickname
                        {/* Country: {userSnapshot.country} */}
                     </Text>
                     <Text M18 color28 marginT-8>
                        {userSnapshot?.name}
                     </Text>
                  </View>
                  <View width={1} backgroundColor={Colors.line} />
                  <View paddingV-16 paddingL-16 flex>
                     <Text R16 color6D>
                        City
                     </Text>
                     <View row centerV>
                        <Text M18 color28 marginR-16 marginT-8>
                           {userSnapshot?.city?.substring(0, 9)}
                           <Text R18 color28></Text>
                        </Text>
                     </View>
                  </View>
               </View>
            </Box>

            {/* <PlayerBadgesHorizontalScrollview uid={userSnapshot.uid} /> */}
            <Box>
               <View row>
                  <TouchableOpacity
                     paddingV-16
                     paddingL-16
                     flex
                     onPress={goToUserChallenges}>
                     <Text R16 color6D>
                        Challenges
                     </Text>
                     <Text M36 color28 marginR-16>
                        {numberOfChallenges}
                        <Text R18 color28></Text>
                     </Text>
                  </TouchableOpacity>
                  <View width={1} backgroundColor={Colors.line} />
                  <View paddingV-16 paddingL-16 flex>
                     <TouchableOpacity onPress={goToFollowing}>
                        <Text R16 color6D>
                           Following
                        </Text>
                        <View row centerV>
                           <Text M36 color28 marginR-16>
                              {userSnapshot?.following?.length || 0}
                              <Text R18 color28></Text>
                           </Text>
                        </View>
                     </TouchableOpacity>
                  </View>
                  <View width={1} backgroundColor={Colors.line} />
                  <View paddingV-16 paddingL-16 flex>
                     <TouchableOpacity onPress={goToFollowers}>
                        <Text R16 color6D>
                           Followers
                        </Text>
                        <View row centerV>
                           <Text M36 color28 marginR-16>
                              {userSnapshot?.followers?.length || 0}
                              <Text R18 color28></Text>
                           </Text>
                        </View>
                     </TouchableOpacity>
                  </View>
               </View>
            </Box>
            {
               isFollowingMe && isFollowing && false && (<ButtonLinear
                  title={'Challenge ( ' + currentUser.name + ' VS ' + userSnapshot.name + ' )'}
                  // icon={
                  //    <MaterialCommunityIcons
                  //       name="sword-cross"
                  //       size={14}
                  //       color={'white'}
                  //    />
                  // }
                  marginH-16
                  marginB-16
                  onPress={createSpace}>
                  {/* <Text white>Challenge {isUserPrivate && 'Private'}</Text> */}
               </ButtonLinear>
            )}

                  {/* {currentUser.superUser && <ButtonLinear title="Get Challenge Streak Repairs"  onPress={updateUserDocWithStreakRepairsBasedOnHowManyChallengeStreakBadgesTheyHave}/>} */}
            {/* <StreakBadgesMonth user={userSnapshot} /> */}
            <StreakBadgesHighlight user={userSnapshot} />

            {/* <View style={{ height: 16 }} /> */}
            <FollowButton causeUser={userSnapshot.uid} />

            {(isFollowing || isMe) && isFollowingMe && false && (
               <Box>
                  <Text H14 color28 uppercase marginT-13 marginB-11 marginL-16>
                     {userSnapshot.name}
                  </Text>
                  <View height={1} backgroundColor={Colors.line} />
                  {isFollowingMe &&
                     DATA.map((item, index) => {
                        return (
                           <React.Fragment key={index}>
                              <TouchableOpacity
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 16,
                                 }}
                                 onPress={item.onPress}>
                                 <Image
                                    source={item.icon}
                                    style={{
                                       width: 32,
                                       height: 32,
                                    }}
                                 />
                                 <Text M16 color28 marginL-16>
                                    {item.title}
                                 </Text>
                              </TouchableOpacity>
                              <View height={1} backgroundColor={Colors.line} />
                           </React.Fragment>
                        );
                     })}
               </Box>
            )}

            {(isFollowing && isFollowingMe) || currentUser?.superUser && (
               <View marginT-24>
                  <TimelineToday notMe focusUser={userSnapshot} focusUid={userSnapshot?.uid || false}/>
               </View>
            )}
            {isFollowing && isFollowingMe && false && (
               <Box>
                  <ChallengesBreakdownList focusUser={userSnapshot} simple />
               </Box>
            )}

            {true && <Insights user={userSnapshot} />}

            <Modal
               visible={
                  props.challengesStore.subscribeModal == 'myProfileHome'
                     ? true
                     : false
               }
               onDismiss={() => null}
               animationType="slide"
               overlayBackgroundColor={Colors.Black54}
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
            </Modal>
         </ScrollView>

         {loading && (
            <View
               style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  height,
                  width,
                  position: 'absolute',
                  top: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <ActivityIndicator size={30} color={'#fff'} />
            </View>
         )}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(MyProfileHome));
