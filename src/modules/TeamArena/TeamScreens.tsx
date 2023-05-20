import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import {
   Assets,
   TabController,
   Colors,
   View,
   Text,
   Button,
   TabControllerItemProps,
} from 'react-native-ui-lib';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import LottieAnimation from 'components/LottieAnimation';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import TeamArenaScreens from './TeamArenaScreens';
import _ from 'lodash';
import TeamToday from './TeamToday';
import TeamWeek from './TeamWeek';
import MeTodayInTeam from 'modules/DailyDetail/MeTodayInTeam';
import LeaderBoard from '../../components/Leaderboard/LeaderBoard';
import PieChart from 'components/PieChart';
import Recent from 'modules/Overview/Recent';
import SectionHeader from 'components/SectionHeader';
import PlayersSummary from './PlayersSummary';
import TeamVotes from './TeamHeader/TeamVotes';
import MainTeamArenaScreen from './MainTeamArenaScreen';
import DelayLoading from 'components/DelayLoading';
const TABS = [
   // 'Recent',
   'Team Info',
   'Weekly Stats',

   'Leaderboard',
   'Votes'
   // 'Player Stats Today',
   // 'Me Today',
   // 'Team Today',

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

@inject('challengesStore', 'smashStore', 'teamsStore')
@observer
class TeamScreens extends Component<{ homeComponent?: any }, State> {
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
      };

      this.state.items = this.generateTabItems();
   }

   generateTabItems = (
      fewItems = this.state.fewItems,
   ): TabControllerItemProps[] => {
      const items: TabControllerItemProps[] = _.chain(TABS)
         .take(fewItems ? 3 : TABS.length)
         .map<TabControllerItemProps>((tab, index) => ({
            label: tab,
            key: tab,
            icon: undefined,
            // uppercase: true,
            // badge: index === 2 ? { label: '2' } : undefined,
            // leadingAccessory: index === 3 ? <Text marginR-4>{Assets.emojis.movie_camera}</Text> : undefined,
            // trailingAccessory: index === 4 ? <Text marginL-4>{Assets.emojis.camera}</Text> : undefined
         }))
         .value();

      const addItem: TabControllerItemProps = {
         icon: Assets.icons.ic_add_16,
         key: 'add',
         ignore: true,
         width: 60,
         onPress: this.onAddItem,
      };

      return fewItems ? items : [...items];
   };

   componentDidMount() {
      // this.slow();
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
      const items = this.generateTabItems(!fewItems);
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
      // this.setState({selectedIndex});
      // setTimeout(() => {
      //    this.props.smashStore.setHomeTabsIndex(selectedIndex);
      // }, 1000);
   };

   renderLoadingPage() {
      return (
         <View flex center>
            {/* <ActivityIndicator size="large" /> */}
            {/* <LottieAnimation
               autoPlay
               loop={true}
               style={{
                  height: 70,
                  zIndex: 0,
                  top: 0,
                  left: 0,
               }}
               source={require('lotties/new/light-loader.json')}
            /> */}
            <View marginB-132>
               <ActivityIndicator size="large" />
            </View>
            {/* <Text text60L marginB-10>
               Loading
            </Text> */}
         </View>
      );
   }

   renderTabPages() {
      const { asCarousel, fewItems } = this.state;
      const Container = asCarousel ? TabController.PageCarousel : View;
      const containerProps = asCarousel ? {} : { flex: true };
      const { smashStore, teamsStore, team, mainTeamArenaScreen } = this.props;

      const { voteDocsHash, teamUsersByTeamId } = teamsStore;

      const players = teamUsersByTeamId?.[team.id] || [];
      const voteDoc = voteDocsHash?.[team.id];
      return (
         <Container {...containerProps}>
            {/* <TabController.TabPage
               index={0}
               lazy
               renderLoading={this.renderLoadingPage}>
               
            </TabController.TabPage> */}
            <TabController.TabPage
               key={'teamweek'}
               index={0}
               // lazy
               // lazyLoadTime={50}
               renderLoading={this.renderLoadingPage}>
               {/* <DelayLoading delay={300}> */}
               {/* <DelayLoading delay={1300}> */}
               <MainTeamArenaScreen team={team} />
               {/* </DelayLoading> */}
               {/* </DelayLoading> */}
            </TabController.TabPage>
            <TabController.TabPage
               key={'mainteam'}
               index={1}
               // lazy
               // lazyLoadTime={300}
               renderLoading={this.renderLoadingPage}>
               {/* <PlayersSummary team={team} /> */}
               <TeamWeek team={team} />

               {/* {mainTeamArenaScreen()} */}
            </TabController.TabPage>



            {false && <TabController.TabPage
               index={2}
               // lazy
               // lazyLoadTime={100}
               renderLoading={this.renderLoadingPage}>
               {/* <MeTodayInTeam team={team} /> */}



               {/* {true && <PlayersSummary team={team} />} */}
            </TabController.TabPage>}




            <TabController.TabPage
               key={'leaderboard'}
               index={3}
               // lazy
               // lazyLoadTime={100}
               renderLoading={this.renderLoadingPage}>
               <DelayLoading delay={2000}><LeaderBoard team={team} isLegacy={team.type === 'Game'} /></DelayLoading>
            </TabController.TabPage>
            <TabController.TabPage
               key={'teamvotes'}
               index={4}
               lazy
               lazyLoadTime={100}
               renderLoading={this.renderLoadingPage}>
               <View style={{ height: 24 }} />
               <DelayLoading delay={1000}><TeamVotes team={team} voteDoc={voteDoc} players={players} /></DelayLoading>
               {/* <TeamToday team={team} /> */}
            </TabController.TabPage>
         </Container>
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

      const { team } = this.props;
      return (
         <View flex>

            {/* <TeamWeek team={team} /> */}
            {true && <TabController
               key={key}

               asCarousel={asCarousel}
               // initialIndex={this.props.smashStore.homeTabsIndex}
               onChangeIndex={this.onChangeIndex}
               items={items}
            >
               <TabController.TabBar
                  key={key}
                  indicatorStyle={{ backgroundColor: Colors.black, height: 2 }}
                  indicatorInsets={0}
                  spreadItems={!fewItems}
                  backgroundColor={fewItems ? '#fafafa' : '#fafafa'}
                  labelColor={'#aaa'}
                  selectedLabelColor={Colors.black}
                  labelStyle={styles.labelStyle}
                  selectedLabelStyle={styles.selectedLabelStyle}
                  // iconColor={'green'}
                  // selectedIconColor={'blue'}
                  enableShadow
                  activeBackgroundColor={Colors.white}
                  centerSelected={centerSelected}>
                  {/* {this.renderTabItems()} */}
               </TabController.TabBar>
               {this.renderTabPages()}
            </TabController>}
         </View>
      );
   }
}

export default gestureHandlerRootHOC(TeamScreens);

const styles = StyleSheet.create({
   labelStyle: {
      fontSize: 16,
      fontFamily: FONTS.heavy,
   },
   selectedLabelStyle: {
      fontSize: 16,
   },
});
