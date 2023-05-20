import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { FONTS } from 'config/FoundationConfig';
import React, {useEffect} from 'react';
import { View, useWindowDimensions, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Colors, Text } from 'react-native-ui-lib';

import MainTeamArenaScreen from './MainTeamArenaScreen';
import TeamWeek from './TeamWeek';
import TeamVotes from './TeamHeader/TeamVotes';
import TeamActionSheet from 'components/TeamActionSheet'
import WeeklyHistory from 'modules/TeamWeekHistory/WeeklyHistory'


// const renderScene = SceneMap({
//     mainteam: MainTeamArenaScreen,
//     weeklyHistory: WeeklyHistory,
//     teamvotes: TeamVotes,
// });

export default function TabViewExample({team}) {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'mainteam', title: 'Leaderboard' },
        { key: 'weeklyHistory', title: 'Previous Weeks' },
        { key: 'teamvotes', title: 'Votes' },
    ]);

    // const renderIcon = ({ route, color }: { route: Route; color: string }) => {

    //     if (route.key === 'activity') { return <Feather name='activity' size={18} /> }
    //     if (route.key == 'challenges') { return <ChallengesBadge /> }
    //     if (route.key == 'teams') { return <TeamsBadge /> }
    // }


    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
          case 'mainteam':
            return <MainTeamArenaScreen jumpTo={jumpTo} />;
          case 'weeklyHistory':
            return <WeeklyHistory team={team} jumpTo={jumpTo} />;
          case 'teamvotes':
            return <TeamVotes team={team} jumpTo={jumpTo} />;
          default:
            return null;
        }
      };


    const renderTabBar = (
        props: SceneRendererProps & { navigationState: State }
    ) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: Colors.smashPink }}
            style={{ backgroundColor: '#fafafa', flexDirection: "row", height: 42, padding: 0 }}
            // tabStyle={styles.tab}
            // renderIcon={renderIcon}
            labelStyle={{ fontFamily: FONTS.heavy, color: Colors.secondaryContent, fontSize: 14, marginTop: 0 }}
        />
    );

    return (
        <><TabView
            scrollEnabled
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            initialLayout={{ width: layout.width }}
            lazy={true}
        />
         <TeamActionSheet />
        </>
    );
}


const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fafafa',
        width: 'auto'
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0, 0, 0, .2)',
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4.5,
        flexDirection: 'row'
    },
    activeItem: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row'
    },
    active: {
        color: '#0084ff',
    },
    inactive: {
        color: '#939393',
    },
    icon: {
        height: 26,
        width: 26,
    },
    label: {
        fontSize: 10,
        marginTop: 3,
        marginBottom: 1.5,
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },
});