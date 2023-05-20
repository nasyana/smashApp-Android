import Header from 'components/Header';
import { FONTS } from 'config/FoundationConfig';
import { shadow, width } from 'config/scaleAccordingToDevice';
import React from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { View, Assets, Colors } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import Stats from './Stats';
import DailyBarChart from '../../components/DailyBarChart';
import Breakdown from './Breakdown';
import Recent from './Recent';
import Insights from './Insights';
import Leaderboard from './Leaderboard';
import Timeline from '../Timeline';
import Today from './Today';
import DailyDetail from 'modules/DailyDetail';
import TeamToday from '../TeamArena/TeamToday';
import TeamWeek from '../TeamArena/TeamWeek';
import { useRoute } from '@react-navigation/core';
import TeamScreens from '../TeamArena/TeamScreens';
const TeamInsights = (props) => {
   const { params } = useRoute();

   const [index, setIndex] = React.useState(0);
   const [routes] = React.useState([
      { key: 'Leaderboard', title: 'Leaderboard' },
      { key: 'Today', title: 'Today' },
      { key: 'Insights', title: 'Weekly Stats' },
      { key: 'Recent', title: 'Recent' },
   ]);

   const initialIndex = props?.routes?.params?.index || 0;
   const showHeader = props?.routes?.params?.showHeader;
   const team = params?.team || false;

   const renderScene = SceneMap({
      Breakdown: Breakdown,
      Recent: Recent,
      Stats: Stats,
      Insights: Insights,
      Today: Today,
      Leaderboard: Leaderboard,
   });
   const renderTabBar = (props) => (
      <TabBar
         {...props}
         indicatorStyle={{ backgroundColor: Colors.buttonLink }}
         style={{ backgroundColor: Colors.white, ...shadow }}
         activeColor={Colors.buttonLink}
         inactiveColor={Colors.color6D}
         labelStyle={{
            fontFamily: FONTS.heavy,
            fontSize: 14,
         }}
         pressColor={'transparent'}
      />
   );
   return (
      <View flex>
         <Header title="Team Insights" back noShadow />
         {/* <ScrollView>
            <Insights />
            <DailyDetail />
         </ScrollView> */}
         <TeamScreens team={team} />
         {/* <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: width }}
            renderTabBar={renderTabBar}
            spreadItems={true}
         /> */}
      </View>
   );
};

export default TeamInsights;
