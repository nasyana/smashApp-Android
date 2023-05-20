import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {
   Assets,
   TabController,
   Colors,
   View,
   Text,
   TabControllerItemProps,
} from 'react-native-ui-lib';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import _ from 'lodash';
import {FONTS} from 'config/FoundationConfig';
import TeamInvitedList from './TeamInvitedList';
import TeamRequestedList from './TeamRequestedList';
import TeamJoinedList from './TeamJoinedList';
import { width, height } from 'config/scaleAccordingToDevice';
import Box from '../../components/Box';
import SectionHeader from 'components/SectionHeader';
const TABS = ['Joined', 'Invited', 'Requested'];

interface State {
   asCarousel: boolean;
   centerSelected: boolean;
   fewItems: boolean;
   initialIndex: number;
   selectedIndex: number;
   key: string | number;
   items: TabControllerItemProps[];
}

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
            badge:
               index === 1 && this.props.teamDoc?.invited?.length > 0
                  ? { label: this.props.teamDoc?.invited?.length }
                  : index === 2 && this.props.teamDoc?.requested?.length > 0
                  ? { label: this.props.teamDoc?.requested?.length }
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

      return (
         <Container {...containerProps}>
            {/* <TabController.TabPage index={0}>
            
                  <TeamJoinedList />
              
            </TabController.TabPage>
            <TabController.TabPage index={1}>
          
                  <TeamInvitedList />
            
            </TabController.TabPage>
            <TabController.TabPage index={2}>
           
                  <TeamRequestedList />
          
            </TabController.TabPage> */}
         </Container>
      );
   }

   render() {
      const { key, initialIndex, asCarousel, centerSelected, fewItems, items } =
         this.state;

         const { requestToJoin = false, teamDoc = false } = this.props;

      return (
         <View flex>
            {!requestToJoin && (
               <SectionHeader
                  title="Team Members"
                  style={{ paddingBottom: 0, marginTop: 20 }}
               />
            )}
            {!requestToJoin && <TeamJoinedList />}
            {!requestToJoin && false && (
               <SectionHeader
                  title="Invited"
                  style={{ paddingBottom: 0, marginTop: 20 }}
               />
            )}
            {!requestToJoin && false && <TeamInvitedList />}

            {/* <SectionHeader
               title="Requesting to Join"
               style={{ paddingBottom: 0, marginTop: 20 }}
            />
            <TeamRequestedList teamDoc={teamDoc} /> */}
         </View>
      );

      return (
         <View flex bg-grey70>
            <TabController
               key={key}
               asCarousel={asCarousel}
               initialIndex={initialIndex}
               onChangeIndex={this.onChangeIndex}
               items={items}>
               <TabController.TabBar
                  key={key}
                  indicatorStyle={{ backgroundColor: Colors.black, height: 2 }}
                  spreadItems={!fewItems}
                  backgroundColor={fewItems ? 'transparent' : undefined}
                  labelColor={'#aaa'}
                  selectedLabelColor={Colors.black}
                  labelStyle={styles.labelStyle}
                  selectedLabelStyle={styles.selectedLabelStyle}
                  enableShadow
                  activeBackgroundColor={Colors.white}
                  centerSelected={centerSelected}></TabController.TabBar>
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
      fontFamily: FONTS.heavy,
   },
   selectedLabelStyle: {
      fontSize: 16,
   },
});
