import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import {
   Assets,
   TabController,
   Colors,
   Typography,
   View,
   Text,
   Button,
   TabControllerItemProps,
} from 'react-native-ui-lib';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import TeamsTodayTargets from './TeamsTodayTargets';
import _ from 'lodash';
import CommunityFeed from 'modules/CommunityFeed';
import DailyDetail from 'modules/DailyDetail';
import Overview from 'modules/Overview';
import Recent from 'modules/Overview/Recent';
import TargetToday from 'modules/TargetToday';
import MyTeams from 'modules/MyTeams';
import TodaysTargets from 'modules/Home/TodaysTargets';
import ChallengeTargetsBadge from './components/ChallengeTargetsBadge';
import TeamChallengeTargetsBadge from './components/TeamChallengeTargetsBadge';
import TeamTargetsBadge from './components/TeamTargetsBadge';
import Header from 'components/Header';

const TABS = ['Challenge Targets', 'My Team Targets'];

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
class TargetTypesScreens extends Component<{ homeComponent?: any }, State> {
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
      const { myChallengesFull } = this.props.challengesStore;

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
            // leadingAccessory:
            //    index === 1 ? (
            //       <Text marginR-4>{Assets.emojis.movie_camera}</Text>
            //    ) : undefined,
            trailingAccessory:
               index === 0 ? (
                  <ChallengeTargetsBadge />
               ) : index === 1 ? (
                  <TeamTargetsBadge />
               ) : index === 2 ? (
                  <TeamChallengeTargetsBadge />
               ) : undefined,
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
      // this.props.smashStore.setHomeTabsIndex(null);
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
      return (
         <Container {...containerProps}>
            <TabController.TabPage
               index={0}
               lazy
               lazyLoadTime={2300}
               renderLoading={this.renderLoadingPage}>
               {/* <TargetToday /> */}
               <TodaysTargets />
            </TabController.TabPage>

            <TabController.TabPage
               index={1}
               lazy
               lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               {/* {this.props.homeComponent} */}
               <TeamsTodayTargets />
               {/* <MyTeams /> */}
            </TabController.TabPage>

            {/* <TabController.TabPage
               index={2}
               // lazy
               // lazyLoadTime={0}
               renderLoading={this.renderLoadingPage}>
               <TodaysTargets type="team" />
            </TabController.TabPage> */}
         </Container>
      );
   }

   render() {
      const {
         key,
         initialIndex,
         /* selectedIndex, */
         asCarousel,
         centerSelected,
         fewItems,
         items,
      } = this.state;
      return (
         <View flex bg-grey70>
            <Header back title="Today's Targets" />
            <TabController
               key={key}
               asCarousel={asCarousel}
               // initialIndex={this.props.smashStore.homeTabsIndex}
               onChangeIndex={this.onChangeIndex}
               items={items}>
               <TabController.TabBar
                  // items={items}
                  key={key}
                  // uppercase
                  indicatorStyle={{
                     backgroundColor: Colors.buttonLink,
                     height: 2,
                  }}
                  // indicatorInsets={0}

                  spreadItems={!fewItems}
                  backgroundColor={'#fafafa' || '#333'}
                  labelColor={'#aaa'}
                  selectedLabelColor={Colors.black}
                  labelStyle={styles.labelStyle}
                  selectedLabelStyle={styles.selectedLabelStyle}
                  // iconColor={'green'}
                  // selectedIconColor={'blue'}
                  enableShadow
                  // activeBackgroundColor={Colors.white}
                  centerSelected={true}>
                  {/* {this.renderTabItems()} */}
               </TabController.TabBar>
               {this.renderTabPages()}
            </TabController>
         </View>
      );
   }
}

export default gestureHandlerRootHOC(TargetTypesScreens);

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
