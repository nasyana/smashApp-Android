import React, { Component, createRef } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView, Modal, Platform } from 'react-native';
import {
    Assets,
    TabController,
    Colors,
    Typography,
    View,
    Text,
    Button,
    TabControllerItemProps,
    TouchableOpacity,
    TabControllerImperativeMethods,
} from 'react-native-ui-lib';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import Firebase from 'config/Firebase';
import _ from 'lodash';
import CommunityFeed from 'modules/CommunityFeed';
import DailyDetail from 'modules/DailyDetail';
import Overview from 'modules/Overview';
import Recent from 'modules/Overview/Recent';
import TargetToday from 'modules/TargetToday';
import MyTeams from 'modules/MyTeams';
import TodaysTargets from 'modules/Home/TodaysTargets';
import TeamsBadge from './components/TeamsBadge';
import ChallengesBadge from './components/ChallengesBadge';
import ActivityTodayBadge from './components/ActivityTodayBadge';
import TargetTypesScreens from './TargetTypesScreens';
import MyChallengesList from 'modules/MyChallenges/MyChallengesList';
import Following from 'modules/Following';
import CoolNotice from './components/CoolNotice';
import LinearChartThisWeek from 'components/LinearChartThisWeek';
import Feed from 'modules/Timeline/Feed';
import HomeHeader from './HomeHeader';
import CommentsModal from 'components/CommentsModal';
import Insights from 'modules/Overview/Insights';
import TeamsTodayTargetsList from './TeamsTodayTargetsList';
import Stats from 'modules/ViewActivity/Stats';
import LinearChartActivity from 'components/LinearChartActivity';
import UserActivitiesStats from 'components/UserActivitiesStats';
import SectionHeader from 'components/SectionHeader';
import FollowingTimelineToday from 'modules/PlayerStats/FollowingTimelineToday';
import TeamsWeekTargetsList from 'modules/Home/TeamsWeeklyTargetsList';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import TeamsIHaveRequested from 'components/TeamsIHaveRequested';
import Shimmer from 'components/Shimmer';
import MeToday from 'modules/DailyDetail/MeToday';
import SmashedToday from 'modules/DailyDetail/SmashedToday';
import TodaySmashes from './components/TodaySmashes';
import SectionDiv from 'components/SectionDiv';
import TodaysTargetsList from './TodaysTargetsList';
import HorizontalAchievements from 'modules/Achievements/AchievementsHorizontal';
import { AchievementsList } from 'modules/Achievements/AchievementsTab';
import ChallengesSegemented from './components/ChallengesSegemented';
import TeamsSegemented from './components/TeamsSegemented';
import CreateATeamButton from './CreateATeamButton';
import JoinChallengeButton from './JoinChallengeButton';
import EnterTeamCodeButton from './EnterTeamCodeButton';



const HomeChallenges = ({ smashStore, challengesStore, teamsStore }) => {

    const { currentUser } = smashStore


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* {Platform.OS == 'ios' && <ChallengesSegemented />} */}
            <TodaysTargetsList />
            {/* <MyChallengesList /> */}
            <JoinChallengeButton boxed />
        </ScrollView>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(HomeChallenges));