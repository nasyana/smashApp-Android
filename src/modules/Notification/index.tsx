import Header from 'components/Header';
import React, { useEffect } from 'react';
import { View, Text, Colors, Assets, Image, Badge } from 'react-native-ui-lib';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Invites from './Invites';
import Activity from './Activity';
import All from './All';
import Follows from './Follows';
import { shadow, width } from 'config/scaleAccordingToDevice';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { NotificationType } from 'constants/Type';

const Notification = (props) => {
   const { notificatonStore, smashStore } = props;
   const { activityNotificationCount = 0, inviteNotificationCount = 0 } =
      notificatonStore;

   const [index, setIndex] = React.useState(0);
   const [routes, setRoutes] = React.useState([
      { key: 'Activity', title: 'Activity' },
      { key: 'Invites', title: 'Requests' },
   ]);

   const renderScene = SceneMap({
      Invites: Invites,
      Activity: Activity,
   });

   const renderBadge = ({ route, color }) => {
      if (route.key === 'Activity' && activityNotificationCount)
         return (
            <View paddingR-24 paddingT-12>
               <Badge
                  label={activityNotificationCount}
                  backgroundColor={Colors.buttonLink}
               />
            </View>
         );
      else if (route.key === 'Invites' && inviteNotificationCount)
         return (
            <View paddingR-24 paddingT-12>
               <Badge
                  label={inviteNotificationCount}
                  backgroundColor={Colors.buttonLink}
               />
            </View>
         );
      else return null;
   };

   const handleIndexChange = (index) => {
      setIndex(index);
      if (index === 0) {
         notificatonStore.resetNotificationCount(NotificationType.Activity);
      }
      if (index === 1) {
         notificatonStore.resetNotificationCount(NotificationType.Invite);
      }
   };

   //  useEffect(() => {
   //     notificatonStore.resetNotificationCount(NotificationType.Activity);
   //  }, []);

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
         renderBadge={renderBadge}
      />
   );
   return (
      <View flex backgroundColor={Colors.background}>
         <Header title="Notifications" back noShadow />

         <All />
         {/* <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: width }}
        renderTabBar={renderTabBar}
      /> */}
      </View>
   );
};

export default inject('notificatonStore', 'smashStore')(observer(Notification));
