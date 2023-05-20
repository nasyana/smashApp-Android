import { width } from 'config/scaleAccordingToDevice';
import React, { useState, useEffect } from 'react';
import { FlatList, ImageBackground, Modal, ScrollView } from 'react-native';
import { View, Colors, Image, Assets, Text, Button } from 'react-native-ui-lib';

import { inject, observer } from 'mobx-react';
import Header from 'components/Header';
import SingleActivity from 'components/SingleActivity';
import AddActivity from 'modules/CreateChallenge/components/AddActivity';
const AllUsers = (props) => {
   const [followers, setFollowers] = useState([]);

   const { smashStore, challengesStore } = props;

   const { like, kFormatter, currentUser, libraryActionsList, activityCategoryLabels } = smashStore;


   const renderItem = ({ item, index }) => {
      if (!item || !item.id) {
         return null;
      }
      return (
         <SingleActivity
            item={item}
            index={index}
            {...{ currentUser, challengesStore, smashStore, like, kFormatter }}
         />
      );
   };

   const newActivity = () => (smashStore.editingActivity = {});


   const { libraryActivitiesHash, todayActivity } = smashStore;

   const userActivities = currentUser.activityQuantities
      ? Object.keys(currentUser.activityQuantities)
      : [];
   const activityIds = userActivities.sort(
      (a, b) =>
         currentUser?.activityQuantities?.[a] -
         currentUser?.activityQuantities?.[b],
   );
   const userActivitiesList = activityIds.map((id) => libraryActivitiesHash[id])

   return (
      <View flex>
         <Header title={'All Activities'} btnRight={
            currentUser.superUser ? (
               <Button
                  iconSource={Assets.icons.ic_add_16}
                  link
                  color={Colors.color28}
                  onPress={newActivity}
               />
            ) : (
               () => null
            )
         } />

         <ScrollView>
            {activityCategoryLabels.map((label, index) => {


               const activityCategories = libraryActionsList.filter((action) => action?.actionCategory && action?.actionCategory?.includes(index))

               return <FlatList
                  data={activityCategories}
                  scrollEnabled={false}
                  ListHeaderComponent={() => <View padding-16><Text text50 padding-24>{label}</Text></View>}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ paddingTop: 16 }}
               />
            })}
         </ScrollView>
         <Modal
            presentationStyle="overFullScreen"
            animationType="slide"
            keyboardShouldPersistTaps="always"
            transparent={false}
            statusBarTranslucent={false}
            visible={smashStore.editingActivity ? true : false} >
            <ScrollView style={{ backgroundColor: '#333' }} contentContainerStyle={{ paddingTop: 32 }}>
               <AddActivity />

            </ScrollView>

         </Modal>
      </View>
   );
};

export default inject('challengesStore', 'smashStore')(observer(AllUsers));
