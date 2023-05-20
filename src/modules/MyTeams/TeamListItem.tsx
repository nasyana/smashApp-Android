import SmartImage from 'components/SmartImage/SmartImage';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors, View, Text, TouchableOpacity } from 'react-native-ui-lib';
import TeamBadge from './TeamBadge';
import TeamProgress from './TeamProgress';
import { AntDesign, Fontisto, SimpleLineIcons } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import Box from 'components/Box';
import { LinearGradient } from 'expo-linear-gradient';
import Firebase from 'config/Firebase';
import TeamChallenge from 'modules/Home/components/TeamChallenge';
import {
   getTeamData,
   getTeamWeeklyData,
   endOfCurrentWeekKey,
} from 'helpers/teamDataHelpers';
interface ITeamListItemProps {
   name: string;
   motto: string;
   picture: any;
   goToTeamScreen: any;
}

const TeamListItem = ({
   name,
   motto,
   picture,
   id,
   actions,
   goToTeamScreen,
   team,
   smashStore,
   teamsStore,
   challengesStore,
}: ITeamListItemProps) => {
   const activities = actions ? Object.values(actions) : [];
   const numberOfActivities = activities.length;


   const { todayDateKey, getThisWeekTarget } = teamsStore;
   const { myChallenges } = challengesStore;
   const weeklyTarget = getThisWeekTarget(team);
   const endWeekKey = endOfCurrentWeekKey();
   console.log('test teamlistItem');
   useEffect(() => {
      const unsubTeamDaily = Firebase.firestore
         .collection('dailyActivity')
         .doc(`${id}_${todayDateKey}`)
         .onSnapshot((doc: any) => {
            if (doc.exists) {
               const dailyDoc = doc.data();

               teamsStore.teamTodayActivityByTeamId[id] = dailyDoc;
            }
         });

      const weeklyTeamKey = `${id}_${endWeekKey}`;

      let unsubWeekly = Firebase.firestore
         .collection('weeklyActivity')
         .doc(weeklyTeamKey)
         .onSnapshot((snap) => {
            if (snap.exists) {
               // const weeklyActivityDoc = snap.data();
               // const weeklyActivityData = getTeamWeeklyData(
               //    weeklyActivityDoc,
               //    team,
               // );
               // teamsStore.weeklyActivityHash[weeklyTeamKey] =
               //    weeklyActivityData;
            }
         });

      return () => {
         if (unsubWeekly) {
            unsubWeekly();
         }

         if (unsubTeamDaily) {
            unsubTeamDaily();
         }
      };
   }, []);

   const imageHeight = 120;

   return (
      <View
         style={{
            backgroundColor: '#fafafa',
            marginBottom: 16,
            marginHorizontal: 16,
            borderRadius: 4,
         }}>
         <TouchableWithoutFeedback
            onPress={goToTeamScreen}
            // marginH-16
            // marginB-16
            // paddingB-16
            // style={styles.container}
            // backgroundColor={Colors.white}
         >
            <View>
               <View marginH-16 marginT-16>
                  {picture?.uri && (
                     <SmartImage
                        uri={picture?.uri}
                        preview={picture?.preview}
                        isShowLottie={false}
                        lottieViewComponent={<View />}
                        style={{
                           height: imageHeight,
                           width: '100%',
                           borderRadius: 7,
                           position: 'absolute',
                        }}
                     />
                  )}
                  <LinearGradient
                     // start={{ x: 0.6, y: 0.1 }}
                     colors={[
                        'rgba(0,0,0,0)',
                        'rgba(0,0,0,0.2)',
                        'rgba(0,0,0,0.5)',
                        'rgba(0,0,0,0.7)',
                     ]}
                     style={{
                        margin: 0,
                        height: imageHeight,
                        width: '100%',
                        borderRadius: 7,
                        position: 'absolute',
                     }}
                  />

                  {/* <Text
                     B18
                     center
                     marginT-32
                     style={{ color: 'rgba(255,255,255,0.7)' }}>
                     "{motto}"
                  </Text> */}
               </View>
               <Box
                  style={{
                     marginTop: 30,
                     marginHorizontal: 32,
                     backgroundColor: '#fff',
                  }}>
                  <View row marginH-32 marginV-16 center>
                     <View flex>
                        <View paddingR-16 centerV>
                           <Text H18 center>
                              {name}
                           </Text>
                        </View>

                        <View
                           row
                           marginT-8
                           center
                           style={{
                              backgroundColor: '#fafafa',
                              borderRadius: 16,
                              padding: 8,
                           }}>
                           <View row center>
                              <AntDesign
                                 name={'checksquareo'}
                                 size={14}
                                 color={Colors.buttonLink}
                              />
                              {/* <Image source={Assets.icons.ic_calories_burn} /> */}
                              <Text R14 marginL-4 darkGrey>
                                 {/* {challengeDetails} */}
                                 {numberOfActivities} Activities
                              </Text>
                           </View>

                           <View row marginL-16 center>
                              <AntDesign
                                 name={'addusergroup'}
                                 size={14}
                                 color={Colors.buttonLink}
                              />
                              {/* <Image source={Assets.icons.ic_calories_burn} /> */}
                              <Text R14 darkGrey marginL-4>
                                 {team?.joined?.length || 1}{' '}
                                 {team?.joined?.length == 1
                                    ? 'Member'
                                    : 'Members'}
                              </Text>
                           </View>
                        </View>
                     </View>
                  </View>
                  {Object.keys(team?.actions)?.length > 0 && (
                     <View
                        paddingH-32
                        // marginH-16
                        marginB-16
                        // style={{ borderWidth: 1, borderColor: '#ccc' }}
                        backgroundColor={Colors.white}>
                        <TeamProgress
                           id={id}
                           smashStore={smashStore}
                           team={team}
                           weeklyTarget={weeklyTarget}
                        />
                     </View>
                  )}
               </Box>
            </View>
         </TouchableWithoutFeedback>

         {myChallenges
            ?.filter((c) => c.challengeType == 'team' && c?.teamId == id)
            .map((playerChallenge) => {
               return (
                  <TeamChallenge
                     team={team}
                     playerChallengeId={playerChallenge.id}
                     challengeId={playerChallenge.challengeId}
                     smashStore={smashStore}
                  />
               );
            })}
      </View>
   );
};
// style={{
//    borderRadius: 6,
//    shadowColor: '#ccc',
//    shadowOffset: {
//       height: 1,
//    },
//    shadowOpacity: 0.52,
//    shadowRadius: 12.22,
//    elevation: 3,
// }}
export default inject(
   'teamsStore',
   'smashStore',
   'challengesStore',
)(observer(TeamListItem));

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    shadowColor: '#ccc',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.52,
    shadowRadius: 12.22,
    elevation: 3,
  },
});
