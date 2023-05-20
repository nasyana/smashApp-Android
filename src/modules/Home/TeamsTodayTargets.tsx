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
   const { teamsStore, day, justToday, horizontal } = props;
   const { myTeams } = teamsStore;
   const { smashStore, type } = props;
   const [expandCard, setExpandCard] = useState(true);

   const goToTeamArena = (team) => {
      navigate(Routes.TeamArena, { team });
   };

   return (
      // <ScrollView
      //    contentContainerStyle={{ backgroundColor: 'transparent' || '#333' }}>
      <View flex row={horizontal}>
         {(!myTeams || myTeams?.length == 0) && (
            <Text margin-24 secondaryContent>
               {/* You're not in any teams yet... */}
            </Text>
         )}
       {myTeams && myTeams.length > 0 && (
  <>
    {myTeams.map((team) => (
      <MemoizedTodayTeamTarget
        key={team.id}
        justToday
        team={team}
        goToTeamArena={goToTeamArena}
      />
    ))}
  </>
)}


      </View>
      // </ScrollView>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamsTodayTargets));
const MemoizedTodayTeamTarget = React.memo(TodayTeamTarget);