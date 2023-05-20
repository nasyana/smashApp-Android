import React from 'react'
import ButtonIconBadge from "components/ButtonIconBadge";
import { useNavigation } from '@react-navigation/native';
import { Assets, View } from 'react-native-ui-lib';
import Routes from 'config/Routes';
import { inject, observer } from 'mobx-react';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
const NotificationIconBadge = (props) => {
  const { navigate } = useNavigation();
  const { notificatonStore } = props
  const {
     realNotificationsCount = 0
  } = notificatonStore;

  const handleOnPress = () => {
     navigate(Routes.Notification);
     // notificatonStore.resetNotificationCount()
  };;

  const handleOnPressOverview = () => {
     navigate(Routes.Overview);
     // notificatonStore.resetNotificationCount()
  };;

  // if (notificationCount == 0) { return null }
  return (
     // <View row style={{ justifyContent: 'flex-end' }}>
     //   <TouchableOpacity onPress={handleOnPressOverview}>
     //     <AntDesign name={'linechart'} size={20} color={'#fff'} />
     //   </TouchableOpacity>

     <ButtonIconBadge
        source={Assets.icons.ic_notification}
        label={realNotificationsCount}
        style={{
           marginTop: -10,
           marginRight: -10,
         //   marginLeft: 10,
        }}
        hasNotifications={ realNotificationsCount > 0}
        onPress={handleOnPress}
     />
     // </View>
  );
}

export default inject("notificatonStore")(observer(NotificationIconBadge));