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
import MyPlan from './MyPlan';
import PlansStock from './PlansStock';
import Routes from 'config/Routes';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import Faq from './Faq';
import { Ionicons } from '@expo/vector-icons';
const Tab = createMaterialTopTabNavigator();

const Faqs = (props) => {
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

   return (
      <View flex>
         <Header
            title={"FAQ's"}
            back
            noShadow
            // btnRight={
            //    <Button
            //       iconSource={Assets.icons.ic_add_plan}
            //       link
            //       color={Colors.color28}
            //       onPress={() => {
            //          navigate(Routes.AddNewFaq);
            //       }}
            //    />
            // }
         />

         <ScrollView marginT-24 contentContainerStyle={{ paddingTop: 24 }}>
            {newFaqa.map((item, index) => (
               <Faq item={item} smashStore={smashStore} index={index} />
            ))}
            <TouchableOpacity
               onPress={goToChat}
               row
               spread
               centerV
               style={{
                  width: '100%',
                  //    backgroundColor: open ? '#fff' : 'transparent',
               }}
               paddingH-24
               paddingB-16
               paddingT-8
               // paddingB-8
               marginT-8>
               <View>
                  <Text M18 smashPink>
                     Having Issues? Please tell us here.
                  </Text>
                  <Text R14>New habit recommendations? Issues? Need Help?</Text>
               </View>
               <Ionicons
                  size={20}
                  color={Colors.smashPink || '#333'}
                  name={'chatbox-ellipses-outline'}
               />
            </TouchableOpacity>
         </ScrollView>
         {/* <Tab.Navigator
            tabBarOptions={{
               labelStyle: {
                  fontFamily: FONTS.heavy,
                  fontSize: 14,
               },
               activeTintColor: Colors.buttonLink,
               inactiveTintColor: Colors.color6D,
               indicatorStyle: {
                  backgroundColor: Colors.buttonLink,
               },
            }}>
            <Tab.Screen
               name={Routes.PlansStock}
               component={PlansStock}
               options={{
                  title: 'Plans Stock',
               }}
            />
            <Tab.Screen
               name={Routes.MyPlan}
               component={MyPlan}
               options={{
                  title: 'My Plans',
               }}
            />
         </Tab.Navigator> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(Faqs));

const styles = StyleSheet.create({});
