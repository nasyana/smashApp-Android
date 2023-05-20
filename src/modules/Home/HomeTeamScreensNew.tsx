import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { FONTS } from 'config/FoundationConfig';
import * as React from 'react';
import { useWindowDimensions, StyleSheet, TouchableWithoutFeedback, Animated, Platform } from 'react-native';
import { View } from 'react-native-ui-lib';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Colors, Text } from 'react-native-ui-lib';
import ChallengesBadge from './components/ChallengesBadge';
import TeamsBadge from './components/TeamsBadge';
import HomeActivity from './HomeActivity';
import HomeChallenges from './HomeChallenges';
import MyChallengesList from 'modules/UserChallenges/MyChallengesList';
import HomeTeams from './HomeTeams';
import ChallengesBadgeLast from './components/ChallengesBadgeLast';
import TeamsTodayTargetsList from './TeamsTodayTargetsList';
import TeamsWeeklyTargetsList from './TeamsWeeklyTargetsList';
import TeamActionSheet from 'components/TeamActionSheet'
import TeamsBadgeThisWeek from './components/TeamsBadgeThisWeek';
// import HomeTeams from './HomeTeams';

const renderScene = SceneMap({
   // activity: Platform.OS == 'ios' ? HomeActivity : HomeActivity,
   teamstoday: Platform.OS == 'ios' ? TeamsTodayTargetsList : TeamsTodayTargetsList,
   thisweek: Platform.OS == 'ios' ? TeamsWeeklyTargetsList : TeamsWeeklyTargetsList,

   // teams: Platform.OS == 'ios' ? HomeTeams : HomeTeams,
});

export default function HomeTeamScreensNew() {
   const layout = useWindowDimensions();

   const [index, setIndex] = React.useState(1);
   const [routes] = React.useState([
      // { key: 'activity', title: 'Activity', icon: 'md-chatbubbles' },
      { key: 'teamstoday', title: 'Today' },
      { key: 'thisweek', title: 'This Week' },
   ]);


   const item = {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 0,
      fontFamily: FONTS.medium,
      // fontSize: 18,
   }
   // const active = {
   //       color: '#0084ff',
   //    },

   const renderMenuBadge = (route) => {

      // if (route.key === 'activity') { return <Feather name='activity' size={18} /> }
      if (route.key == 'teamstoday') { return <TeamsBadge /> }
      if (route.key == 'thisweek') { return <TeamsBadgeThisWeek /> }
      return

   }

   const renderItem =
      ({
         navigationState,
         position,
      }: {
         navigationState: State;
         position: Animated.AnimatedInterpolation<number>;
      }) =>
         ({ route, index }: { route: Route; index: number }) => {
            const inputRange = navigationState.routes.map((_, i) => i);

            const activeOpacity = position.interpolate({
               inputRange,
               outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
            });
            const inactiveOpacity = position.interpolate({
               inputRange,
               outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
            });


            // if (route.key === 'activity') { return <View style={{ height: 22 }} /> }
            // if (route.key == 'challenges') { return <ChallengesBadge /> }
            // if (route.key == 'teams') { return <TeamsBadge /> }

            return (
               <View style={{ flexDirection: 'row', padding: 8, marginBottom: 0, paddingHorizontal: 16, margin: 0, backgroundColor: Colors.grey, }}>

                  <Animated.View
                     style={[item, styles.inactiveItem, { opacity: inactiveOpacity }]}
                  >
                     <View row>
                        <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
                        {renderMenuBadge(route)}
                     </View>
                  </Animated.View>


                  <Animated.View
                     style={[item, styles.activeItem, { opacity: activeOpacity }]}
                  >
                     <View row>
                        <Text style={[styles.label, styles.active]}>{route.title}</Text>
                        {renderMenuBadge(route)}
                     </View>
                  </Animated.View>
               </View>
            );
         };




   const renderTabBar = (
      props: SceneRendererProps & { navigationState: State }
   ) => (
      <View style={styles.tabbar}>
         {props.navigationState.routes.map((route: Route, index: number) => {
            return (
               <TouchableWithoutFeedback
                  key={route.key}

                  onPress={() => props.jumpTo(route.key)}
               >
                  {renderItem(props)({ route, index })}

               </TouchableWithoutFeedback>
            );
         })}
      </View>
   );

   // const renderTabBar = (
   //    props: SceneRendererProps & { navigationState: State }
   // ) => (
   //    <TabBar
   //       {...props}
   //       scrollEnabled
   //       indicatorStyle={{ backgroundColor: Colors.smashPink }}
   //       style={{ backgroundColor: Colors.white, flexDirection: "row" }}
   //       labelStyle={{ fontFamily: FONTS.medium, color: '#333' }}
   //    />
   // );

   return (
      <View>
      {/* <TabView
         scrollEnabled
         lazy
         navigationState={{ index, routes }}
         renderScene={renderScene}
         onIndexChange={setIndex}
         renderTabBar={renderTabBar}
         initialLayout={{ width: layout.width }}
      /> */}
          {/* <TeamActionSheet /> */}
      </View>
   );
}

const styles = StyleSheet.create({
   tabbar: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      backgroundColor: '#fafafa',
      width: 'auto'
   },
   tab: {
      flex: 1,
      alignItems: 'center',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: 'rgba(0, 0, 0, .2)',
   },
   // item: {
   //    alignItems: 'center',
   //    justifyContent: 'center',
   //    paddingTop: 4.5,
   // },
   activeItem: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderBottomWidth: 4,
      borderColor: Colors.black,
      borderRadius: 0
   },
   inactiveItem: {

      backgroundColor: Colors.grey,
      borderRadius: 4,
      borderBottomWidth: 4,
      borderColor: 'rgba(0, 0, 0, 0)',
   },
   active: {
      // color: Colors.white,
      fontFamily: FONTS.heavy,
   },
   inactive: {
      color: '#939393',
      // backgroundColor: '#eee',
   },
   icon: {
      height: 26,
      width: 26,
   },
   label: {
      fontSize: 14,
      color: '#333',
      marginTop: 3,
      marginBottom: 1.5,
      backgroundColor: 'transparent',
      fontFamily: FONTS.heavy,
      marginRight: 8
   },
});