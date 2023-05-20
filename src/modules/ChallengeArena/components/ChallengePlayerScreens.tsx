import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { FONTS } from 'config/FoundationConfig';
import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Colors, Text } from 'react-native-ui-lib';
import CommunityList from '../CommunityList';
import PlayersImFollowing from 'modules/ChallengeArena/PlayersImFollowing';






const renderScene = SceneMap({
    community: CommunityList,
    following: PlayersImFollowing,

});

export default function ChallengePlayerScreens() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'community', title: 'Global' },
        { key: 'following', title: "Following" },
    ]);

    // const renderIcon = ({ route, color }: { route: Route; color: string }) => {

    //     if (route.key === 'activity') { return <Feather name='activity' size={18} /> }
    //     if (route.key == 'challenges') { return <ChallengesBadge /> }
    //     if (route.key == 'teams') { return <TeamsBadge /> }
    // }





    const renderTabBar = (
        props: SceneRendererProps & { navigationState: State }
    ) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: Colors.smashPink }}
            style={{ backgroundColor: Colors.white, flexDirection: "row" }}
            // tabStyle={styles.tab}
            // renderIcon={renderIcon}
            labelStyle={{ fontFamily: FONTS.medium, color: '#333' }}
        />
    );

    return (
        <View flex bg-grey70 style={{ minHeight: 500 }}>
            <TabView
                scrollEnabled
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
                initialLayout={{ width: layout.width, height: layout.height }}
            />
        </View>
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