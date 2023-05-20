import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import {
    TabController,
    Colors,
    View,
    TabControllerItemProps,
    TabControllerImperativeMethods
} from 'react-native-ui-lib';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import _ from 'lodash';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import TeamWeek from './TeamWeek';
import TeamVotes from './TeamHeader/TeamVotes';
import MainTeamArenaScreen from './MainTeamArenaScreen';
import { height } from 'config/scaleAccordingToDevice';
// const TABS = ['Home', 'Posts', 'Reviews', 'Videos', 'Photos', 'Events', 'About', 'Community', 'Groups', 'Offers'];
const TABS = [
    // 'Recent',
    'Team Info',
    'Weekly Stats',
    'Votes'
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
            items: []
        };

        this.state.items = this.generateTabItems();
    }
    tabController = React.createRef<TabControllerImperativeMethods>();

    generateTabItems = (fewItems = this.state.fewItems): TabControllerItemProps[] => {
        const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, fewItems ? 3 : TABS.length),
            (tabs: TabControllerItemProps[]) =>
                _.map<TabControllerItemProps>(tabs, (tab: TabControllerItemProps, index: number) => ({
                    label: tab,
                    key: tab,
                    // icon: index === 2 ? Assets.icons.demo.dashboard : undefined,
                    // badge: index === 5 ? { label: '2' } : undefined,
                    // leadingAccessory: index === 3 ? <Text marginR-4>{Assets.emojis.movie_camera}</Text> : undefined,
                    // trailingAccessory: index === 4 ? <Text marginL-4>{Assets.emojis.camera}</Text> : undefined
                })))(TABS);

        const addItem: TabControllerItemProps = {
            // icon: Assets.icons.demo.add,
            key: 'add',
            ignore: true,
            width: 60,
            onPress: this.onAddItem
        };

        return fewItems ? items : [...items, addItem];
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

    setTab = () => {
        this.tabController.current?.setTab(2);
    };

    onAddItem = () => {
        const { items } = this.state;
        let newItems = items.slice(0, -1) as TabControllerItemProps[];
        newItems = [...newItems, { label: `New Item # ${newItems.length + 1}` }, items[items.length - 1]];
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
            key: this.state.asCarousel ? 'asCarousel' : 'staticPages'
        });
    };

    toggleCenterSelected = () => {
        const { fewItems, centerSelected } = this.state;
        this.setState({
            items: this.generateTabItems(fewItems),
            centerSelected: !centerSelected,
            key: Date.now()
        });
    };

    onChangeIndex = (selectedIndex: number) => {
        this.setState({ selectedIndex });
    };

    renderLoadingPage() {
        return (
            <View flex center>
                <ActivityIndicator size="large" style={{ marginBottom: height / 4 }} />
                {/* <Text text60L marginT-10>
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
        const voteDoc = voteDocsHash?.[team.id];



        return (
            <Container {...containerProps}>
                <TabController.TabPage index={0} renderLoading={this.renderLoadingPage}>
                    <MainTeamArenaScreen />
                </TabController.TabPage>
                <TabController.TabPage index={1} lazy lazyLoadTime={900} renderLoading={this.renderLoadingPage}>
                    <TeamWeek />
                </TabController.TabPage>
                {/* <TabController.TabPage index={2} lazy lazyLoadTime={900} renderLoading={this.renderLoadingPage}>
                    <LeaderBoard team={team} />
                </TabController.TabPage> */}
                <TabController.TabPage index={2} lazy lazyLoadTime={900} renderLoading={this.renderLoadingPage}>
                    <TeamVotes team={team} />
                </TabController.TabPage>



                {/* {!fewItems &&
                    _.map(_.takeRight(TABS, TABS.length - 3), (title, index) => {
                        return (
                            <TabController.TabPage key={title} index={index + 3}>
                                <View padding-s5>
                                    <Text text40>{title}</Text>
                                </View>
                            </TabController.TabPage>
                        );
                    })} */}
            </Container>
        );
    }

    render() {
        const { key, initialIndex, selectedIndex, asCarousel, centerSelected, fewItems, items } = this.state;
        return (
            <View flex >
                <TabController
                    key={key}
                    ref={this.tabController}
                    asCarousel={asCarousel}
                    selectedIndex={selectedIndex}
                    initialIndex={initialIndex}
                    onChangeIndex={this.onChangeIndex}
                    items={items}
                >
                    <TabController.TabBar
                        // items={items}

                        key={key}
                        // uppercase
                        indicatorStyle={{ backgroundColor: Colors.smashPink, height: 3 }}
                        // indicatorInsets={0}
                        spreadItems={!fewItems}
                        // backgroundColor={fewItems ? 'transparent' : undefined}
                        // labelColor={Colors.smashPink}
                        selectedLabelColor={Colors.smashPink}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: 16 }}
                        selectedLabelStyle={{ color: Colors.smashPink, fontFamily: FONTS.medium }}
                        // iconColor={'green'}
                        // selectedIconColor={'blue'}
                        enableShadow
                        activeBackgroundColor={Colors.$backgroundPrimaryMedium}
                        // centerSelected={centerSelected}
                    />
                    {this.renderTabPages()}
                </TabController>
                {/* <View absB left margin-20 marginB-100 style={{ zIndex: 1 }}>
                <Button
                   bg-green10={!fewItems}
                   bg-green30={fewItems}
                   label={fewItems ? 'Show Many Items' : 'Show Few Items'}
                   marginB-12
                   size={Button.sizes.small}
                   onPress={this.toggleItemsCount}
                />
                <Button
                   bg-grey20={!asCarousel}
                   bg-green30={asCarousel}
                   label={`Carousel : ${asCarousel ? 'ON' : 'OFF'}`}
                   marginB-12
                   size={Button.sizes.small}
                   onPress={this.toggleCarouselMode}
                />
                <Button
                   bg-grey20={!centerSelected}
                   bg-green30={centerSelected}
                   label={`centerSelected : ${centerSelected ? 'ON' : 'OFF'}`}
                   size={Button.sizes.small}
                   marginB-12
                   onPress={this.toggleCenterSelected}
                />
                <Button label="setTab (Imperative)" bg-green10 onPress={this.setTab} size={Button.sizes.small} />
             </View> */}

            </View>
        );
    }
}

export default gestureHandlerRootHOC(TabControllerScreen);

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 16
    },
    selectedLabelStyle: {
        fontSize: 16

    }
});
