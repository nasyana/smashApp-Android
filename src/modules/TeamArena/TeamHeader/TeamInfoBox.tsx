import { AntDesign } from '@expo/vector-icons';
import React, { useState,useEffect } from 'react';
import { Colors, View, Text } from 'react-native-ui-lib';
import Box from 'components/Box';
import TeamBadge from 'modules/MyTeams/TeamBadge';
import WavyTeamBadge from 'modules/MyTeams/WavyTeamBadge';

type TeamInfoBoxProps = {
   name: string;
   motto: string;
   activitiesCount: number;
   teamCount: number;
   remainingDays: number;
   thisWeekTarget: number;
};

const TeamInfoBox = ({
   team = false,
   name = '',
   motto = '',
   activitiesCount = 0,
   showInfoBox = false,
   teamCount = 0,
   remainingDays = 0,
   thisWeekTarget = 0,
   teamProgress,
   teamsStore,
   showWeeklyTarget,
   weeklyTargets,
   smashStore = {}
   
}: TeamInfoBoxProps) => {

   const {currentUser = false} = smashStore; 

   const [loaded, setLoaded] = useState(false);


   useEffect(() => {
     
   const clear = setTimeout(() => {
         setLoaded(true)
   }, 1000);
   
     return () => {

      clearTimeout(clear);
       
     }
   }, [])
   

   
   const weeksCompleted = team.targets ? Object.keys(team.targets)?.length : 1;
   if(!currentUser || !team || !loaded) {return null}
   if(!showInfoBox){return null}
   return (
      <Box
         style={{
            borderRadius: 6,
            shadowColor: '#ccc',
            shadowOffset: {
               height: 1,
            },
            shadowOpacity: 0.52,
            shadowRadius: 12.22,
            elevation: 3,
            marginTop: -60
         }}>
         <View padding-16 paddingT-24 paddingB-24>
            {showWeeklyTarget && false && (
               <View
                  style={{
                     alignItems: 'center',
                     marginTop: -78,
                     marginBottom: 8,
                  }}>
                  <WavyTeamBadge
                     text={name?.toUpperCase().slice(0, 2)}
                     thisWeekTarget={thisWeekTarget}
                     teamsStore={teamsStore}
                     gradientColors={['#D81159', Colors.buttonLink]}
                  />
               </View>
            )}
            <View centerH>
               <Text B18 color28>
                  {name}
               </Text>
               <Text marginT-4 H14 color6D>
                  {motto}
               </Text>
               <View
                  row
                  marginT-10
                  bg-line
                  paddingH-15
                  paddingV-10
                  br50
                  center
                  style={{ backgroundColor: '#fafafa' }}>
                  {/* <View row style={{ alignItems: 'baseline' }}>
                     <AntDesign
                        name={'checksquareo'}
                        size={14}
                        color={Colors.buttonLink}
                     />
                     <Text M12 color6D marginL-4>
                        {activitiesCount} ACTIVITIES
                     </Text>
                  </View> */}

                  <View row marginR-16 style={{ alignItems: 'baseline' }}>
                     <AntDesign
                        name={'addusergroup'}
                        size={14}
                        color={Colors.buttonLink}
                     />
                     <Text M12 color6D marginL-4>
                        {teamCount} PLAYING
                     </Text>
                  </View>

                  <View row marginL-16 style={{ alignItems: 'baseline' }}>
                     <AntDesign
                        name={'calendar'}
                        size={14}
                        color={Colors.buttonLink}
                     />
                     <Text M12 color6D marginL-4>
                        WEEK{' '}
                        {weeksCompleted > 1
                           ? weeksCompleted + 1
                           : weeksCompleted}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
         {/* {teamProgress()} */}
      </Box>
   );
};

export default TeamInfoBox;
