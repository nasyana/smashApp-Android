import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Assets, TabController, Colors, View, Text, Button, TabControllerItemProps } from 'react-native-ui-lib';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import _ from 'lodash';
import PlayersImFollowing from "../PlayersImFollowing";
import CommunityList from "../CommunityList";
import Feed from "../Feed";
import { FONTS } from "config/FoundationConfig";
import Body from "../../Graph/Body"
import { inject } from 'mobx-react';
import MeToday from "./MeToday";
import moment from "moment";
import Header from 'components/Header';
import Firebase from 'config/Firebase';
const TABS = ['Following', 'Community'];

interface State {
   asCarousel: boolean;
   centerSelected: boolean;
   fewItems: boolean;
   initialIndex: number;
   selectedIndex: number;
   key: string | number;
   items: TabControllerItemProps[];
}

@inject('smashStore')
class TabControllerScreen extends Component<{}, State> {
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
         activity: {},
         activityList: [],
      };

      this.state.items = this.generateTabItems();
   }

   generateTabItems = (
      fewItems = this.state.fewItems,
   ): TabControllerItemProps[] => {
      const { smashStore } = this.props;
      const { last7Keys, activity, kFormatter, currentUserId } =
         smashStore;

      const act =
         this.props.focusUser?.uid != currentUserId ||
         this.props.uid != currentUserId
            ? this.state.activity
            : activity;

      const items: TabControllerItemProps[] = _.chain(last7Keys)
         .take(fewItems ? 3 : last7Keys.length)
         .map<TabControllerItemProps>((tab, index) => ({
            label: moment(tab, 'DDMMYYYY').format('dd'),
            key: tab,
            icon: undefined,
            badge: activity?.[tab]?.score
               ? { label: kFormatter(activity?.[tab]?.score) }
               : undefined,
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

   getUserActivity() {
      const { uid } = Firebase.auth.currentUser;
      this.unsubUserActivity = Firebase.firestore
         .collection('dailyActivity')
         .where('uid', '==', uid)
         .where('type', '==', 'User')
         .limit(40)
         .orderBy('timestamp', 'desc')
         .onSnapshot(async (snaps) => {
            const activityList = [];
            const activity = {};
            if (!snaps.empty) {
               snaps.forEach((post) => {
                  const id = post?.id;
                  post = post.data();
                  activity[post?.startDay] = post;
                  activityList.push(post);
               });

               this.setState({ activity, activityList });
               // this.activityList = activityList;
            }
         });
   }

   componentDidMount() {
      if (this.props.focusUser?.uid != Firebase.auth.currentUser.uid) {
         this.getUserActivity();
      }
   }

   componentWillUnmount() {
      if (this.unsubUserActivity) {
         this.unsubUserActivity();
      }
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
      this.setState({ selectedIndex });
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

      const { smashStore, focusUser } = this.props;
      const { last7Keys } = smashStore;

      const { uid } = Firebase.auth.currentUser;
      return (
         <Container {...containerProps}>
            {last7Keys.map((date, index) => (
               <TabController.TabPage index={index} key={date} lazy>
                  <MeToday
                     date={date}
                     key={date}
                     focusUser={focusUser}
                     uid={focusUser?.uid || uid}
                  />
               </TabController.TabPage>
            ))}
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
      const { smashStore } = this.props;
      const { last7Keys } = smashStore;
      return (
         <View flex bg-grey70>
            <TabController
               key={key}
               asCarousel={asCarousel}
               // selectedIndex={selectedIndex}
               initialIndex={last7Keys?.length - 1}
               onChangeIndex={this.onChangeIndex}
               items={items}
               lazy={true}
               lazyLoadTime={2000}>
               <TabController.TabBar
                  // items={items}
                  key={key}
                  // uppercase
                  indicatorStyle={{ backgroundColor: Colors.black, height: 2 }}
                  // indicatorInsets={0}
                  spreadItems={!fewItems}
                  backgroundColor={fewItems ? 'transparent' : undefined}
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
            </TabController>
         </View>
      );
   }
}

export default gestureHandlerRootHOC(TabControllerScreen);

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 16,
        fontFamily: FONTS.heavy
    },
    selectedLabelStyle: {
        fontSize: 16
    }
});
