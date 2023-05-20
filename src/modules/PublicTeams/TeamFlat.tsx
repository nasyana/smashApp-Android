import { TouchableWithoutFeedback } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import SmartImage from 'components/SmartImage/SmartImage';
import Box from 'components/Box';
import { AntDesign, Fontisto, SimpleLineIcons } from '@expo/vector-icons';
import Routes from 'config/Routes';
import { width } from 'config/scaleAccordingToDevice';
const Team = (props) => {
   const { navigate } = useNavigation();

   const { team, smashStore } = props;
   const { picture, name, actions, active } = team;
   const imageHeight = 50;

   const activities = actions ? Object.values(actions) : [];
   const numberOfActivities = activities.length;
   const goToTeamScreen = () => {
      smashStore.smashEffects();
      navigate(Routes.TeamArena, { team: team });
   };
   return (
      <Box>
         <TouchableWithoutFeedback onPress={goToTeamScreen}>
            <View paddingH-8 paddingB-16>
               <View marginH-16 marginT-16 row>
                  {/* {picture?.uri && ( */}
                  <SmartImage
                     uri={picture?.uri}
                     preview={picture?.preview}
                     isShowLottie={false}
                     lottieViewComponent={<View />}
                     style={{
                        width: imageHeight,
                        height: imageHeight,
                        borderRadius: 3,
                        backgroundColor: '#ccc',
                     }}
                  />
                  {/* )} */}
                  <LinearGradient
                     colors={[
                        'rgba(0,0,0,0)',
                        'rgba(0,0,0,0.2)',
                        'rgba(0,0,0,0.5)',
                        'rgba(0,0,0,0.7)',
                     ]}
                     style={{
                        margin: 0,
                        height: imageHeight,
                        width: imageHeight,
                        borderRadius: 2,
                        position: 'absolute',
                     }}
                  />
                  <View paddingL-16>
                     <View row>
                        <Text B14>{name}</Text>
                        <Text R14>"{team.motto}"</Text>
                     </View>

                     <View
                        row
                        marginT-8
                        style={{
                           borderRadius: 16,
                        }}>
                        <View row center>
                           <AntDesign
                              name={'checksquareo'}
                              size={14}
                              color={Colors.buttonLink}
                           />
                           {/* <Image source={Assets.icons.ic_calories_burn} /> */}
                           <Text R14 marginL-4 darkGrey>
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
                              {team?.joined?.length == 1 ? 'Member' : 'Members'}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>

               {/* {Object.keys(team?.actions)?.length > 0 && (
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
               )} */}
            </View>
         </TouchableWithoutFeedback>
      </Box>
   );
};

export default Team;
