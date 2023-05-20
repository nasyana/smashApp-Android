import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import Box from 'components/Box';
import AnimatedView from 'components/AnimatedView';
import {
   View,
   Text,
   Colors,
   TouchableOpacity,
   ProgressBar,
} from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated from 'react-native-reanimated';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import { width } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import SectionHeader from 'components/SectionHeader';
import { checkIfIHaveVoted, hasSomeoneVoted } from 'helpers/VotingHelpers';
import TeamScrollView from 'components/TeamScrollView';
import {
   getTeamData,
   getDefaultWeeklyActivity,
   checkInfinity,
   getTeamWeeklyData,
   getDaysLeft,
} from 'helpers/teamDataHelpers';

import { uid, unixToFromNow } from 'helpers/generalHelpers';
import Firebase from 'config/Firebase';
import { parseJSON } from 'date-fns/esm';

const TitleAndScore = () => {
   return (
      <View>
         <Text>TitleAndScore</Text>
      </View>
   );
};

export default TitleAndScore;
