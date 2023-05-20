import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../../components/SmartImage/SmartImage';
import Box from '../../../../components/Box';
import AnimatedView from '../../../../components/AnimatedView';
import { View, Text, Colors, TouchableOpacity, ProgressBar } from 'react-native-ui-lib';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { LinearGradient } from 'expo-linear-gradient';

import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import Shimmer from 'components/Shimmer';
import RecentChallengeSmashes from 'components/RecentChallengeSmashes';
import SectionHeader from 'components/SectionHeader';
import EpicBadge from 'components/EpicBadge';
import Firebase from 'config/Firebase';
import { dayNumberOfChallenge, daysInChallenge } from 'helpers/dateHelpers';

import { challengeDaysSmashed, hexToRgbA } from 'helpers/generalHelpers';


const Rank = (props) => {

    const { challengesStore, playerChallenge } = props;
    const { myChallengeRankByChallengeId } = challengesStore
    const myRank =
        myChallengeRankByChallengeId[playerChallenge?.challengeId] || 1;


    return (
        <Text secondaryContent marginT-16>
            You're coming {ordinal_suffix_of(myRank)}
            {myRank == 1
                ? '! 🥇'
                : myRank == 2
                    ? '! 🥈'
                    : myRank == 3
                        ? '! 🥉'
                        : ''}
        </Text>
    )
}

export default inject(
    'smashStore',
    'challengesStore',
    'teamsStore',
)(observer(Rank));