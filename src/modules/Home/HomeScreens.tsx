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
import HomeActivity from './HomeActivity';
import HomeChallenges from './HomeChallenges';
import HomeTeams from './HomeTeams';
const TABS = [
   'Activity',

   // 'My Teams',
   'Challenges',
   'Teams',



   // 'Recent Activity',
   // 'Daily',
   // 'Insights',
   // 'Community',
   // 'Insights',
   // 'Leaderboard',
];

interface State {
   asCarousel: boolean;
   centerSelected: boolean;
   fewItems: boolean;
   initialIndex: number;
   selectedIndex: number;
   key: string | number;
   items: TabControllerItemProps[];
}

@inject('challengesStore', 'smashStore')
@observer
class HomeScreens extends Component<{ homeComponent?: any }, State> {
   constructor(props: {}) {
      super(props);
      this.state = {
         asCarousel: true,
         centerSelected: false,
         fewItems: false,
         initialIndex: 0,
         selectedIndex: 0,
         key: Date.now(),
         items: [],
         loadMenu: false,
      };

      this.state.items = this.generateTabItems();
   }

   tabController = React.createRef<TabControllerImperativeMethods>();
   generateTabItems = (
      fewItems = this.state.fewItems,
   ): TabControllerItemProps[] => {
      const items: TabControllerItemProps[] = _.chain(TABS)
         .take(fewItems ? 3 : TABS.length)
         .map<TabControllerItemProps>((tab, index) => ({
            label: tab,
            key: tab,
            // uppercase: true,
            icon: undefined,
            // badge:
            //    index === 1
            //       ? { label: `${numTargetsCompletedToday}/${numTargetsToday}` }
            //       : undefined,
            trailingAccessory:
               index === 2 ? (
                  // <View style={{ width: 40 }}>
                  <TeamsBadge toggleItemsCount={this.toggleItemsCount} />

               ) : // </View>
                  index === 1 ? (
                  // <View style={{ width: 40 }}>
                     <ChallengesBadge toggleItemsCount={this.toggleItemsCount} />

               ) : // </View>
                     index === 100 ? (
                  // <View style={{ width: 40 }}>
                        <ActivityTodayBadge
                     toggleItemsCount={this.toggleItemsCount}
                  />
               ) : undefined,
            // leadingAccessory:
         }))
         .value();

      const addItem: TabControllerItemProps = {
         icon: Assets.icons.ic_add_16,
         key: 'add',
         ignore: true,
         width: 80,
         onPress: this.onAddItem,
      };

      return fewItems ? items : [...items];
   };

   async componentDidMount() {
      // this.slow();
      // const myChallenges = await AsyncStorage.getItem('myChallenges');
      // const myStoredChallenges = myChallenges != null ? JSON.parse(myChallenges) : null;

      // if (myStoredChallenges.length > 1) {

      //    this.props.challengesStore.myChallenges = myStoredChallenges;
      // }

      this.props.smashStore.homeScreenTab = this.tabController;

      setTimeout(() => {
         this.toggleItemsCount();
      }, 700);

      setTimeout(() => {
         this.setState({ loadMenu: true });
      }, 1000);
      // this.state.items = this.generateTabItems();
   }

   slow() {
      setTimeout(() => {
         _.times(5000, () => {
            console.log('slow log');
         });

         this.slow();
      }, 10);
   }

   onAddItem = () => {
      const { items } = this.state;
      let newItems = items.slice(0, -1) as TabControllerItemProps[];
      newItems = [
         ...newItems,
         { label: `New Item # ${newItems.length + 1}` },
         items[items.length - 1],
      ];
      this.setState({ items: newItems });
   };

   toggleItemsCount = () => {
      const { fewItems } = this.state;
      const items = this.generateTabItems(fewItems);
      this.setState({ fewItems: !fewItems, items, key: Date.now() });
   };

   toggleCarouselMode = () => {
      this.setState({
         asCarousel: !this.state.asCarousel,
         key: this.state.asCarousel ? 'asCarousel' : 'staticPages',
      });
   };

   toggleCenterSelected = () => {
      const { fewItems, centerSelected } = this.state;
      this.setState({
         items: this.generateTabItems(fewItems),
         centerSelected: !centerSelected,
         key: Date.now(),
      });
   };

   onChangeIndex = (selectedIndex: number) => {
      this.props.smashStore.homeScreenTab = this.tabController;
      console.log(
         ' this.props.smashStore.homeScreenTab',
         JSON.stringify(this.tabController),
      );
      // this.setState({selectedIndex});
      // this.props.smashStore.setHomeTabsIndex(null);
      // this.props.smashStore.homeTabsIndex = selectedIndex;
   };

   renderLoadingPage() {
      return (
         <View flex center>
            <ActivityIndicator size="large" />
            <Text text60L marginT-10>
               Loading
            </Text>
         </View>
      );
   }

   renderTabPages() {
      const { asCarousel, fewItems } = this.state;
      const Container = asCarousel ? TabController.PageCarousel : View;
      const containerProps = asCarousel ? {} : { flex: true };
      const { smashStore } = this.props;

      const { currentUser } = smashStore;

      // if (noTeamsOrChallenges) {
      //    return null;
      // }
      console.log('check rerenders HomeScreens');
      return (
         <Container {...containerProps}>
            <TabController.TabPage
               index={0}
               // lazy
               // lazyLoadTime={0}

               renderLoading={this.renderLoadingPage}>
               <HomeActivity />
            </TabController.TabPage>





            <TabController.TabPage
               index={1}
               // lazy
               // lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               <HomeChallenges />
            </TabController.TabPage>

            {true && <TabController.TabPage
               index={2}
               // lazy
               // lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               {/* <TargetToday /> */}
               <HomeTeams />
               {/* <TargetTypesScreens /> */}
            </TabController.TabPage>}
            {/* <TabController.TabPage
               index={1}
               // lazy
               // lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               <MyTeams />
            </TabController.TabPage> */}

            {/* <TabController.TabPage
               index={2}
               // lazy
               // lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               <Recent />
            </TabController.TabPage> */}
            {/* 
        <TabController.TabPage
          index={4}
          lazy
          lazyLoadTime={0}
          renderLoading={this.renderLoadingPage}>
          <DailyDetail />
        </TabController.TabPage> */}

            {/* <TabController.TabPage
               index={3}
               lazy
               lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               <Overview />
            </TabController.TabPage>
*/}
            {false && <TabController.TabPage
               index={3}
               lazy
               // lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               <Feed />
               {/* <CommunityFeed /> */}
            </TabController.TabPage>}
            {false && <TabController.TabPage
               index={3}
               lazy
               // lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               <ScrollView>
                  <Insights />
                  <UserActivitiesStats />
               </ScrollView>
               {/* <CommunityFeed /> */}
            </TabController.TabPage>}
         </Container>
      );
   }

   renderTabBar() {
      const { fewItems, centerSelected, key } = this.state;

      if (!this.state.loadMenu) {
         return <Shimmer style={{ width: '100%', height: 48 }} />;
      }
      return (
         <TabController.TabBar
            // items={items}
            key={key}
            // uppercase
            indicatorStyle={{
               backgroundColor: Colors.black,
               height: 2,
            }}
            // indicatorInsets={0}


            labelStyle={{ fontFamily: FONTS.medium, color: '#333', fontSize: 16 }}
            selectedLabelStyle={{ color: '#333', fontFamily: FONTS.medium }}

            spreadItems={!fewItems}
            backgroundColor={fewItems ? '#fff' : undefined}
            labelColor={'#aaa'}
            selectedLabelColor={Colors.black}
            selectedLabelStyle={styles.selectedLabelStyle}
            // iconColor={'green'}
            // selectedIconColor={'blue'}
            enableShadow
            activeBackgroundColor={Colors.white}
            centerSelected={centerSelected}>
            {/* {this.renderTabItems()} */}
         </TabController.TabBar>
      );
   }

   render() {
      const {
         key,
         initialIndex,
         /* selectedIndex, */ asCarousel,
         centerSelected,
         fewItems,
         items,
      } = this.state;

      const { smashStore } = this.props;
      const { noTeamsOrChallenges } = smashStore;

      // if (noTeamsOrChallenges) {
      //    return null;
      // }
      return (
         <View flex bg-grey70>
            <TabController
               key={key}
               asCarousel={asCarousel}
               // initialIndex={this.props.smashStore.homeTabsIndex}
               // selectedIndex={this.props.smashStore.homeTabsIndex}
               onChangeIndex={this.onChangeIndex}
               items={items}
               animationType="slide"
               ref={(ref) => (this.tabController = ref)}>
               {this.renderTabBar()}
               {this.renderTabPages()}
            </TabController>

            {/* <Modal
               visible={this.props.smashStore.commentPost ? true : false}
               transparent={false}
               animationType="slide">
               <View style={{ flex: 1 }}>
             
               </View>
            </Modal> */}
         </View>
      );
   }
}

export default gestureHandlerRootHOC(HomeScreens);

const styles = StyleSheet.create({
   labelStyle: {
      // fontSize: 16,
      // ...Typography.M16,
      fontFamily: FONTS.fheavy,
   },
   selectedLabelStyle: {
      // ...Typography.M16,
      // fontFamily: FONTS.heavy,
   },
});
