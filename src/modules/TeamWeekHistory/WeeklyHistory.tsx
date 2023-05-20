import Header from 'components/Header';
import { FONTS } from 'config/FoundationConfig';
import { shadow, width } from 'config/scaleAccordingToDevice';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { inject, observer } from 'mobx-react';
import { dayKeyToHuman, dayKeyToStartOfWeek } from 'helpers/dateHelpers';
import {
   View,
   Assets,
   Colors,
   Text,
   TouchableOpacity,
   ProgressBar,
} from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import Shimmer from 'components/Shimmer';
import Box from 'components/Box';
import WeeklyWinnersPreview from './WeeklyWinnersPreview';
import { useRoute } from '@react-navigation/core';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { checkInfinity } from 'helpers/teamDataHelpers';
import SectionHeader from 'components/SectionHeader';
import {getWeeksAgo} from 'helpers/dateHelpers';
import {AntDesign} from '@expo/vector-icons';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const WeeklyHistory = (props) => {
   const { params } = useRoute();
   const { navigate } = useNavigation();
   const { teamsStore, smashStore } = props;
   const { currentTeam } = teamsStore;
   const { kFormatter } = smashStore;
   // const [legacyWeeks, setLegacyWeeks] = useState([]);
   const [weeks, setWeeks] = useState([]);

   const [isLoading, setIsLoading] = useState(true);

   const allWeeks = [ ...weeks];

   useEffect(() => {
      const q = query(collection(firestore, 'weeklyActivity'), 
        where('teamId', '==', currentTeam.id), 
        orderBy('timestamp', 'desc')
      );
    
      const unsubTeamWeeks = onSnapshot(q, (snaps) => {
        const weekyArray = [];
        snaps.forEach((snap) => {
          const weeklyDoc = snap.data();
          const id = snap?.id || false;
          weekyArray.push({ ...weeklyDoc, id });
        });
        setWeeks(weekyArray);
        setIsLoading(false);
      });
    
      return () => {
        if (unsubTeamWeeks) {
          unsubTeamWeeks();
        }
      };
    }, [currentTeam.id]);

   // useEffect(() => {
   //    if (!currentTeam.legacyTeamId) {
   //       return;
   //    }
   //    let query = Firebase.firestore
   //       .collection('teamWeeks')
   //       .where('teamId', '==', currentTeam.legacyTeamId)
   //       .orderBy('timestamp', 'desc');

   //    /// chekc if there is a legacy team doc? if so, we subscribe to the weeklyDocs in teamWeeks.
   //    const unsubLegacyTeamWeeks = query.get().then((snaps) => {
   //       const legacyWeeksArray = [];
   //       snaps.forEach((snap) => {
   //          const legacyWeekDoc = snap.data();
   //          const id = snap?.id || false;

   //          let players = {};
   //          let userData = legacyWeekDoc?.userData || {};

   //          for (let playerId in userData) {
   //             // console.warn(playerId);

   //             const thisPlayerData = playerId ? userData?.[playerId] : false;

   //             players[playerId] = {
   //                ...thisPlayerData,
   //                activityPoints: thisPlayerData?.actionScores || false,
   //                activityQuantities: thisPlayerData?.actionQuantities || false,
   //                score: thisPlayerData?.weekScore,
   //             };
   //          }

   //          let userWeekScores = {};

   //          Object.keys(players).forEach((playerId) => {
   //             userWeekScores[playerId] = players[playerId]?.score;
   //          });
   //          legacyWeeksArray.push({
   //             ...legacyWeekDoc,
   //             id,
   //             score: legacyWeekDoc?.teamScore,
   //             players,
   //             legacy: true,
   //             userWeekScores,
   //          });
   //       });

   //       setLegacyWeeks(legacyWeeksArray);
   //       setIsLoading(false);
   //    });
   //    return () => {
   //       if (unsubLegacyTeamWeeks) {
   //          unsubLegacyTeamWeeks();
   //       }
   //    };
   // }, [currentTeam?.id]);

   return (
      <View flex>
         {/* <Header title="Weekly" back noShadow /> */}
         <View padding-8>
            <ScrollView >
               {allWeeks &&
                  !isLoading &&
                  allWeeks
                     // .sort((b, a) => a.timestamp - b.timestamp)
                  .map((week, index) => {
                        const goToSingleWeek = () =>
                           navigate('SingleWeek', { weekDoc: week, team: currentTeam });

                        const progress = week?.score > week?.target ? 100 : week?.score / week?.target * 100;
                        
                     return (<View key={week.endWeekKey}>
                        {/* <SectionHeader title={getWeeksAgo(week.endWeekKey)} style={{ marginBottom: 0, paddingBottom: 0, marginTop: 24, paddingRight: 16 }} subtitle={<Text R12 secondaryContent>
                           {dayKeyToStartOfWeek(
                              week.endWeekKey,
                           ) +
                              ' - ' +
                              dayKeyToHuman(week.endWeekKey)}{' '}
                              
                        </Text>} /> */}
                        
                           <TouchableOpacity
                              onPress={goToSingleWeek}
                              style={{
                                 marginTop: 8,
                              }}>
                              <Box
                                 style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 8,
                                    marginTop: 8,
                                    marginBottom: 0,
                                    backgroundColor: week?.legacy
                                       ? '#fff'
                                       : '#fff',
                                    borderWidth: week?.legacy ? 1 : 0,
                                    borderColor: '#ccc',
                                 }}>
                              <View row centerV spread>
                             
                                    <View centerV>
                                       <WeeklyWinnersPreview
                                          weeklyDoc={week}
                                          team={currentTeam}
                                          teamsStore={teamsStore}
                                       />
                                    </View>

                                    <View flex centerV>
                                    <Text B14>{week.endWeekKey ? getWeeksAgo(week.endWeekKey) : 'This Week'}</Text>
                                    <Text R14>
                                       <Text B14 buttonLink>{kFormatter(week?.score)}</Text> <Text secondaryContent>/</Text>{' '}<Text B14 smashPink>{kFormatter(week?.target)}</Text>

                                       </Text>
                                       {/* <ProgressBar progress={checkInfinity(progress)}
                                    progressColor={Colors.buttonLink}
                                 style={{ height: 4, marginTop: 0 }} /> */}
                                    </View>

                                    <View padding-8 center>
                                       <Text><AntDesign name="checkcircle" color={progress >= 100 ? Colors.green30 : '#ccc'} size={30} /></Text>

</View>

                                 </View>
                                 
                              </Box>

                           </TouchableOpacity>
                     </View>
                        );
                     })}

               {isLoading &&
                  [1,2,3,4,5,6].map((a) => (
                     <Shimmer
                        style={{
                           height: 40,
                           width: '100%',
                           marginTop: 16,
                           marginHorizontal: 24,
                           borderRadius: 8
                        }}
                     />
                  ))}
            </ScrollView>
         </View>
      </View>
   );
};

export default inject('smashStore', 'teamsStore')(observer(WeeklyHistory));
