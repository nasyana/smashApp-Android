import React, { useCallback, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import {
  View,
} from 'react-native-ui-lib';


import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import HomeHeader from './HomeHeader';
import Insights from 'modules/Overview/Insights';
import TeamsTodayTargetsList from './TeamsTodayTargetsList';

import TodaySmashes from './components/TodaySmashes';
import SectionDiv from 'components/SectionDiv';
import TodaysTargetsList from './TodaysTargetsList';
import { AchievementsList } from 'modules/Achievements/AchievementsTab';
import MainFeed from 'modules/Timeline/MainFeed';
import AsyncStorageDataDisplay from 'components/AsyncStorageData';
import SectionHeader from 'components/SectionHeader';
import FriendsScrollview from 'components/FriendsScrollview';
import PlainButton from 'components/PlainButton';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import MyGoalsListHomeActivity from 'modules/UserChallenges/MyGoalsListHomeActivity';

const LIMIT = 20;
const HomeActivity = ({ smashStore, teamsStore, challengesStore }) => {

  const { navigate } = useNavigation();

  const { setShowFeed,setQuickViewTeam } = smashStore;
  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const offsetY = event.nativeEvent.contentOffset.y;
    const windowHeight = event.nativeEvent.layoutMeasurement.height;

    // Check if user has scrolled near the end of the scrollview
    if (offsetY + windowHeight >= contentHeight - 150) {
      setShowFeed(true);
    }
  };

  const handleContentSizeChange = () => {
    // setShowFeed(false);
  };

  const onRefresh = useCallback(async () => {

    setRefreshing(true);
    // Call your fetch function here
    challengesStore.fetchMyPlayerChallenges();
    challengesStore.fetchGoals();
    // await teamsStore.fetchMyTeams().then(() => {
    //   teamsStore.subscribeToMyTeamWeeklyDocs();
    // });
    await teamsStore.getFriends();

    setRefreshing(false);
    // fetchMyPlayerChallenges().then(() => setRefreshing(false))
    //   .catch(() => setRefreshing(false));
  }, []);

  const goToTeamsToday = () => {


      navigate(Routes.MyTeamsToday);
   

  }
  const showTodayChallenges = () => {
    navigate(Routes.MyChallengesToday);
    // setQuickViewTeam({todayChallenges: true}) 
  }
  const goToChallengesToday = ()=>{

    navigate(Routes.Insights);
  }
  const [refreshing, setRefreshing] = useState(false);
  console.log('HomeActivity Render')

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      // onContentSizeChange={handleContentSizeChange}
      // onRefresh={handleRefresh}
      refreshing={refreshing}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* <CoolNotice /> */}
      {/* <AsyncStorageDataDisplay /> */}
      {/* <View paddingH-8 marginT-0>
        <AchievementsList isHome limit={2} />
      </View> */}
      <SectionHeader title="Accountability Partners (Following)" top={24} />
      <FriendsScrollview activeToday />
      {/* <PlainButton title="My Challenges Today"  onPress={showTodayChallenges}/>
      <PlainButton  title="My Teams Today (3)"  onPress={goToTeamsToday}/>
      <PlainButton title="Insights"  onPress={goToChallengesToday}/> */}
      {/* <SectionDiv style={{marginTop: 16, marginBottom: 16}}/> */}
   {/* <SectionDiv transparent height={16}/> */}
      <TodaySmashes horizontal />
    
      
      <Insights />
      <MyGoalsListHomeActivity />
      <TodaysTargetsList />
      <TeamsTodayTargetsList activity />
      <MainFeed />
    </ScrollView>
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(HomeActivity)); {/* <ActivityDays all activityId={'id'} showLabel /> */ }
{/* <StreakBadgesMonth /> */ }
{/* <TeamsIHaveRequested /> */ }