import React, { useEffect, useState } from "react";
import { inject, observer } from 'mobx-react';
import { useNavigation } from "@react-navigation/core";
import Header from "components/Header";
import ItemFoodCategory from "components/ItemFoodCategory";
import Routes from "config/Routes";
import { bottom } from "config/scaleAccordingToDevice";
import { FlatList, TouchableOpacity } from "react-native";
import Ripple from "react-native-material-ripple";
import { View, Text, Colors, Button, Assets } from "react-native-ui-lib";
import ItemActivityCategory from "components/ItemActivityCategory";
import AddActivity from './components/AddActivity';
const ListActivityCategories = inject(
   'smashStore',
   'actionsStore',
)(
   observer((props) => {
      const { navigate } = useNavigation();
      const { smashStore, actionsStore } = props;
      const manage = props?.route?.params?.manage || false;
      const goBackOnFirstSelect = props?.route?.params?.goBackOnFirstSelect || false;
      const { selectedActions } = actionsStore;
      const { activityCategoryLabels, libraryActionsList } = smashStore;

      // useEffect(() => {
      //    smashStore.getSettings();
      // }, []);

  
     
      return (
         <View flex backgroundColor={Colors.background}>
            <Header
               title="Categories"
               back
               btnRight={
                  <Button
                     iconSource={Assets.icons.ic_search}
                     link
                     color={Colors.color28}
                  />
               }
            />
            <FlatList
               data={activityCategoryLabels}
               // ListHeaderComponent={<AddActivity />}
               renderItem={({ item, index }) => {
                  const totalActions = libraryActionsList.filter(
                     (item) =>
                        item?.actionCategory &&
                        item.actionCategory.includes(index),
                  ).length || 0;
                  const selectedActionsSize = selectedActions.filter(
                     (item) =>
                        item?.actionCategory &&
                        item.actionCategory.includes(index),
                  ).length || 0;
                  return (
                     <View
                        key={index}
                        style={{
                           marginHorizontal: 16,
                        }}>
                        <ItemActivityCategory
                           item={item}
                           onPress={() => {
                              navigate(Routes.AddActivityList, {
                                 category: item,
                                 index,
                                 manage: manage,
                                 goBackOnFirstSelect: goBackOnFirstSelect,
                              });
                           }}
                           selectedActionsSize={selectedActionsSize}
                           totalActions={totalActions}
                        />
                     </View>
                  );
               }}
               keyExtractor={(item, index) => index.toString()}
               contentContainerStyle={{
                  paddingTop: 16,
                  paddingBottom: bottom,
               }}
            />
         </View>
      );
   }),
);

export default ListActivityCategories;
