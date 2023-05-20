import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import { View, Text, Colors, Assets, Image } from 'react-native-ui-lib';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FlatList, SectionList, ScrollView } from 'react-native';
import { shadow, width } from 'config/scaleAccordingToDevice';
import { FONTS } from 'config/FoundationConfig';

import Header from "components/Header";
import BadgeItem from './components/BadgeItem';
import Firebase from '../../config/Firebase';
import Box from '../../components/Box';
import { moment } from 'helpers/generalHelpers';;

import { useNavigation } from '@react-navigation/native';
import { getPlayerChallengeData } from '../../helpers/playersDataHelpers';

const _ = require('lodash');

const Badge = (props) => {
   const { smashStore, challengesStore } = props;
   const { kFormatter, whatLevelDidUserWin } = smashStore;

   const challenge = props?.route?.params?.challenge || false;
   const [badge, setBadge] = useState(challenge);
   const { targets } = badge;


   const playerChallengeData = getPlayerChallengeData(challenge) || false;
   const wonLevel = playerChallengeData?.wonLevel;
   const allGradients = playerChallengeData?.allGradients || ['#333', '#ccc'];
   const badgeLevels = ['beginner', 'expert', 'guru'];

   // const levelsArray = Object.keys(levels).map((level)=>{})
   return (
      <View flex backgroundColor={Colors.background}>
         <Header title="Badge" noShadow back />

         <ScrollView>
            {/* <Text>{JSON.stringify(levels)}</Text> */}
            {targets
               ? Object.keys(challenge.targets || {}).map((level, index) => {
                    const gotBadge = level <= wonLevel;

                    return (
                       <Box style={{ marginTop: 16 }}>
                          <View row spread>
                             <Text
                                marginT-13
                                marginB-11
                                marginL-16
                                uppercase
                                H14>
                                {gotBadge && 'You own the'} {badgeLevels[index]}{' '}
                                Badge{level == 1 && ' ⭐'}
                                {level == 2 && ' ⭐⭐'}
                                {level == 3 && ' ⭐⭐⭐'}
                                {/* {badge.challengeName} Badge! */}
                             </Text>
                             {gotBadge && (
                                <Text
                                   marginT-13
                                   marginB-11
                                   marginR-16
                                   uppercase
                                   H14>
                                   {kFormatter(
                                      playerChallengeData.selectedScore,
                                   )}{' '}
                                   {challenge.unit || 'PTS'}
                                </Text>
                             )}
                          </View>
                          <View
                             height={1}
                             backgroundColor={Colors.line}
                             marginB-0
                          />
                          <BadgeItem
                             allGradients={allGradients}
                             gotBadge={gotBadge}
                             index={index}
                             item={badge}
                             targets={targets}
                             level={level}
                             kFormatter={kFormatter}
                             large
                             playerChallenge={challenge}
                             whatLevelDidUserWin={whatLevelDidUserWin}
                             playerChallengeData={playerChallengeData}
                          />
                       </Box>
                    );
                 })
               : null}
         </ScrollView>
      </View>
   );
};

export default inject('smashStore', 'challengesStore')(observer(Badge));
