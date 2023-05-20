import Tag from "components/Tag";
import React, { useState, useEffect } from "react";
import { inject, observer } from 'mobx-react';
import { useNavigation } from "@react-navigation/native";
import SmartImage from "../../SmartImage/SmartImage"
import { View, Image, Text, Colors, Assets, ProgressBar, TouchableOpacity, Button,FONTS } from "react-native-ui-lib";
import SwipeableItem from "components/SwipeableItem/SwipeableItem";
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import Routes from '../../../config/Routes';
import Firebase from '../../../config/Firebase';
import Box from '../../Box';
import EpicDisplayBadge from '../../EpicDisplayBadge';
import { Dimensions, TouchableWithoutFeedback } from 'react-native';
import Shimmer from '../../../components/Shimmer';
import AnimatedAppearance from 'components/AnimatedAppearance';
import AnimatedView from 'components/AnimatedView';
import { textShadow } from 'helpers/BadgeHelpers';
import { daysInChallenge } from 'helpers/dateHelpers';
import {
   getEndDateKey,

} from 'helpers/playersDataHelpers';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const Challenge = inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(
   observer((props) => {
      const { navigate } = useNavigation();

      const [loaded, setLoaded] = useState(true);
      const { challenge, smashStore, handlePress, selected, index } = props;

  

      const { kFormatter, currentUser, checkInfinity,  } = smashStore;



      
      const myPlayerChallenge = false;
      const playerChallengeData =  false
      const alreadyPlaying = false
      const size =50;

      const notSelectedColor = Colors.buttonLink ||Colors.green40
      // const size = 50;

      const challengeTarget = challenge?.dailyTargets?.[0] || 0;
      const challengeUnit = challenge.targetType == 'qty' ? challenge.unit : 'pts';

      const icon = Assets.icons?.[challenge?.imageHandle || 'smashappicon']

      return (
         <View >
            <Box style={{borderWidth: 0, backgroundColor: selected ? challenge.colorStart || '#333': '#fff'}}>
               <TouchableWithoutFeedback
                  // onLongPress={() =>
                  //    navigate(Routes.CreateChallenge, {
                  //       challengeDoc: challenge,
                  //    })
                  // }
                  onPress={() => handlePress(challenge.id)}>
                  <View
                     row
                     // spread
                     
                     paddingT-20
                     style={{
                        borderRadius: 6,
                        marginHorizontal: 16,
                        // backgroundColor: '#FFF',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        // overflow: 'hidden',
                        marginBottom: 16,
                     }}>
                  <View center style={{ backgroundColor: challenge.colorStart, borderRadius: (size + 5) / 2, width: size + 5, height: size + 5, marginLeft: 0, marginRight: 4 }}><Image
                        source={icon}
                        style={{
                           height: size,
                           width: size,
                           borderRadius: size / 2,

                        }}
                     />
                     </View>
                     <View paddingH-16 centerV flex>

                       
                        <View row centerV spread  marginT-0>
                         
                           <Text H18 color28  white={selected}>
                              {challenge.name}
                           </Text>
                         
                        </View>
                     

                       
                        <Text R14 color28 marginB-4 marginT-0  white={selected}>
                              {challenge.description}
                           </Text>
                           <Text R12 secondaryContent marginB-8 marginT-0  white={selected}>
                              Starting at {challenge?.dailyTargets?.[0] && challenge.dailyTargets[0]} x {challenge?.unit || 'pts'} / day.
                           </Text>
                           <View row marginB-8>
                           {true && <AntDesign
                                 name={'user'}
                                 size={12}
                                 color={selected ? '#fff' : Colors.color6D}
                                 // white={selected}
                              />}

                              {true && <Text R12 color6D marginR-10 white={selected}>
                                 {challenge?.playing || 0} Participating
                              </Text>}

                              </View>
                        <View paddingR-10 marginR-10 marginT-0 flex>
                           <Button
                              style={{
                                 backgroundColor: selected ? '#fff' : notSelectedColor,
                                 borderColor: selected  ? '#fff' : notSelectedColor,
                                 // borderRadius: 10,
                              }}
                              labelStyle={{ color: selected ? notSelectedColor :  '#fff' }}
                              // color={notSelectedColor}
                              outline
                              label={
                                 selected ? 'Selected' : 'Try Challenge'
                              }
                              size="medium"
                              fullWidth={false}
                              // icon={<AntDesign name="check" size={12} color={challenge?.colorStart}/>}
                              onPress={() => handlePress(challenge.id)}
                           />
                        </View>
                     </View>
                  </View>
               </TouchableWithoutFeedback>
            </Box>
         </View>
      );
   }),
);

export default Challenge;
