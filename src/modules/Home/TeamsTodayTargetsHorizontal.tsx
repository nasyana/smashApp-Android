import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../components/SmartImage/SmartImage';
import Box from '../../components/Box';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated from 'react-native-reanimated';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import TodayTeamTarget from './components/TodayTeamTarget';
import TargetTypesScreens from './TargetTypesScreens';
const SPACING = 28;
const AnimatedView = Animated.createAnimatedComponent(View);

const TeamsTodayTargets = (props) => {
   const { navigate } = useNavigation();
   const { teamsStore, day, justToday } = props;
   const { myTeams } = teamsStore;
   const { smashStore, type } = props;
   const [expandCard, setExpandCard] = useState(true);

   const goToTeamArena = (team, initialIndex) => {
      navigate(Routes.TeamArena, { team, initialIndex: 1 || 0 });
   };

   return (
      <ScrollView
         contentContainerStyle={{ backgroundColor: 'transparent' || '#333' }}
         horizontal
         showsHorizontalScrollIndicator={false}>
         <View flex row>
            {(!myTeams || myTeams?.length == 0) && (
               <Text margin-24 secondaryContent>
                  You're not in any teams yet...
               </Text>
            )}
            {myTeams &&
               myTeams?.map((team, index) => {
                  return (
                     <TodayTeamTarget
                        key={team.id}
                        justToday
                        {...{
                           day,
                           team,
                           setExpandCard,
                           SPACING,
                           expandCard,
                           goToTeamArena,
                           smashStore,
                           teamsStore,
                        }}
                     />
                  );
               })}
         </View>
      </ScrollView>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamsTodayTargets));
