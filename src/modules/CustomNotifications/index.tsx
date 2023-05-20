import Header from 'components/Header';
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Routes from 'config/Routes';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import { Controller, useForm } from 'react-hook-form';
import Input from 'components/Input';
import ButtonLinear from 'components/ButtonLinear';
import { sendEpicNotification, sendNotificationToUser, sendSuperUserNotification } from 'services/NotificationsService';


let noti1 = {

   title: 'Adam Overtook You Today!!',
   subtitle: '',
   body: "Adam smashed 30 minute training (1200pts) and overtook you!⚔️",
}


let noti2 = {

   title: 'Lana Smashed 2k Walk 🚀🚀',
   subtitle: '',
   body: "Lana smashed 30 minute training (1200pts)",
}


let noti3 = {

   title: 'Lana Smashed Meditation',
   subtitle: '',
   body: "Lana smashed 15 minute meditation in Family Team ⚔️",
}


let noti4 = {

   title: 'Julian smashed Create Plan for the day!!',
   subtitle: '',
   body: "Julian smashed Create Plan for the day and overtook you!⚔️",
}


let noti5 = {

   title: 'Adam Overtook You!!',
   subtitle: '',
   body: "Adam smashed 30 minute training (1200pts) and overtook you!⚔️",
}

const notiList = [noti1, noti2, noti3, noti4, noti5];


let initalNoti = {

   title: 'Adam Overtook You Today!!',
   subtitle: '',
   body: "Adam smashed 30 minute training (1200pts) and overtook you!⚔️",
}

// initalNoti = {

//    title: 'Tia Overtook You Today!!🚀🚀',
//    subtitle: '',
//    body: "Tia smashed Be Grateful for 5 mins (500pts) and overtook you!⚔️",
// }

initalNoti = {

   title: 'Isiah Overtook You Today!!🚀🚀',
   subtitle: '',
   body: "Isiah smashed Create Plan for The Day (500pts) and overtook you!⚔️",
}




// initalNoti = {

//    title: 'Adam Overtook You Today!!🚀🚀',
//    subtitle: '',
//    body: "Adam smashed Take Out Rubbish (330pts) and overtook you!⚔️",
// }
const usersToNotify = ['JrYwOpjdjYOZdkdmXJSTmiQs22J3', 'droPx1suwYMRoQPmYfVtgUmlNY63']
// const usersToNotify = ['JrYwOpjdjYOZdkdmXJSTmiQs22J3']

const CustomNotifications = (props) => {

   const [notiIndex, setNotiIndex] = React.useState(0);
   const [noti, setNoti] = React.useState(initalNoti);
   const { smashStore } = props;
   const { settings, currentUserId } = smashStore;

   const { faqs = [] } = settings;

   let newFaqa = [...faqs].sort((a, b) => a.order - b.order);
   const { navigate } = useNavigation();

   const goToChat = () => {
      navigate(Routes.Chat, {
         stream: {
            streamId: `${currentUserId}_smashappchat`,
            streamName: 'Chat with us',
            smashappchat: true,
         },
      });
      // navigate(Routes.MyProfile, { user })
   };

   const { control, handleSubmit } = useForm({
      defaultValues: {
         title: noti.title,
         subtitle: noti.subtitle || '',
         body: noti.body || '',
      },
   });


   const sendSingle = async ({ title, subtitle, body }) => {

      usersToNotify.forEach((uid) => {
         sendSuperUserNotification(uid, title, subtitle, body)

      })
   }

   const sendNotificationToUser = async ({ title, subtitle, body }) => {


      if (multipleNotifications) {
         usersToNotify.forEach((uid) => {
            const noti = notiList[notiIndex]

            const { title, subtitle, body } = noti;
            sendSuperUserNotification(uid, title, subtitle, body)

            if (notiIndex === notiList.length - 1) {

               setNotiIndex(0)
            } else {

               setNotiIndex(notiIndex + 1)
            }


         })

      } else {

         sendSuperUserNotification(uid, title, subtitle, body)
      }


   }

   const loadCompetitiveNotifications = () => {


      setNoti({ title: 'Adam Overtook You Today!!', subtitle: '(Team Epicness)', body: 'Adam smashed 30 minute training and overtook you' })
   }


   const multipleNotifications = true
   return (
      <View flex>
         <Header
            title={"Custom Notifications"}
            noShadow
            back

         />

         <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
            <Controller
               control={control}
               name="title"
               render={({ field: { value, onChange } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Notification title'}
                  />
               )}
            />
            <Controller
               control={control}
               name="subtitle"
               render={({ field: { value, onChange } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Notification subtitle'}
                  />
               )}
            />
            <Controller
               control={control}
               name="body"
               render={({ field: { value, onChange } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Notification body'}
                  />
               )}
            />

            <ButtonLinear title="Send Multi Notification" onPress={handleSubmit(sendNotificationToUser)} />

            <View style={{ height: 16 }} />
            <ButtonLinear title="Send Single" onPress={handleSubmit(sendSingle)} />



         </ScrollView>
         {/* <TouchableOpacity onPress={loadCompetitiveNotifications}><Text>Load Competitive Notification</Text></TouchableOpacity> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(CustomNotifications));

const styles = StyleSheet.create({});
