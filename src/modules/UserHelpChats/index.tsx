import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyPlan from './MyPlan';
import PlansStock from './PlansStock';
import Routes from 'config/Routes';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import Faq from './Faq';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import SmartImage from 'components/SmartImage/SmartImage';
const Tab = createMaterialTopTabNavigator();

const UserHelpChats = (props) => {
   const { smashStore } = props;
   const { settings, currentUser } = smashStore;

   const [chats, setChats] = useState([]);
   useEffect(() => {
      const q = query(
         collection(firestore, 'chats'),
         where('smashappchat', '==', true),
         where('isUser', '==', true),
         orderBy('createdAt', 'desc')
      );

      const unsub = onSnapshot(q, (querySnapshot) => {
         const chatDocs = [];
         querySnapshot.forEach((doc) => {
            const chatDoc = doc.data();
            chatDocs.push(chatDoc);
         });

         setChats(chatDocs);
      });

      return () => {
         if (unsub) unsub();
      };
   }, []);

   const { navigate } = useNavigation();

   const goToChat = (streamId, markRead, idToMarkAsRead) => {
      navigate(Routes.Chat, {
         stream: {
            streamId: `${streamId}`,
            streamName: 'Chat with us',
            smashappchat: true,
         },
         markRead,
         idToMarkAsRead,
      });
      // navigate(Routes.MyProfile, { user })
   };

   const renderItem = ({ item, index }) => {
      const read = item?.read || false;
      const markRead = read ? false : true;
      return (
         <TouchableOpacity
            onPress={() => goToChat(item.streamId, markRead, item.id)}
            padding-24
            spread
            row
            flex
            style={{
               backgroundColor: read ? '#fff' : Colors.red60,
               marginTop: 3,
            }}>
            <View row center>
               <SmartImage
                  uri={item.user?.avatar}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
               />
               <Text marginL-8>{item.user.name}</Text>
            </View>
            <View center>
               <Text marginL-8>{item.text}</Text>
               <Text marginL-8>{item.createdAt.toDate().toDateString()}</Text>
            </View>
         </TouchableOpacity>
      );
   };

   return (
      <View flex>
         <Header title={'User Help Chats'} noShadow back />
         <FlatList data={chats || []} renderItem={renderItem} />
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(UserHelpChats));

const styles = StyleSheet.create({});
