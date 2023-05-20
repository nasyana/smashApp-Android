import Header from "components/Header";
import LibraryActivity from "modules/CreateChallenge/components/LibraryActivity";
import { bottom, shadow } from "config/scaleAccordingToDevice";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, ScrollView } from "react-native";
import { View, Colors, Button, Assets } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import AddActivity from './components/AddActivity';
import Routes from "config/Routes";
const AddActivityList = inject(
   'smashStore',
   'actionsStore',
)(
   observer((props) => {
      const [data, setData] = useState([]);
      const { smashStore, route, actionsStore } = props;
      const { libraryActionsList = [], currentUser } = smashStore;
      const { selectedActions = [] } = actionsStore;
      const _selectedActions = [...selectedActions];
      const { index = null, category, manage = false, goBackOnFirstSelect = false } = route?.params;

      useEffect(() => {
         if (index === null) return;
         setData(
            libraryActionsList.filter((item) =>
               item.actionCategories.includes(index),
            ),
         );
      }, [libraryActionsList, index]);

      const isSelected = useCallback(
         (item) => {
            return _selectedActions.findIndex((_item) => _item.id === item.id) >
               -1
               ? true
               : false;
         },
         [_selectedActions],
      );

      const handleSelectAction = (action) => {
         const index = _selectedActions.findIndex(
            (item) => item.id === action.id,
         );
         if (index > -1) actionsStore.removeAction(index);
         else actionsStore.pushAction(action);

         if (goBackOnFirstSelect) props.navigation.navigate(Routes.CreateGoal);
      };

      const handleSetEditingActivity = (activity) => {
         smashStore.editingActivity = activity;
      };

      const renderItem = ({ item }) => {
         
         if(item.hideFromTeams){

            return null
                  }
                  
                  return (
         
         <LibraryActivity
            selected={isSelected(item)}
            item={item}
            onLongPress={currentUser.superUser ? () => handleSetEditingActivity(item) : ()=>null}
            onPress={() => manage ? handleSetEditingActivity(item) : handleSelectAction(item)}
         />
      )}

      const newActivity = () => (smashStore.editingActivity = {});

      return (
         <View flex backgroundColor={Colors.background}>
            <Header
               title={category + ' Activities'}
               back
               btnRight={
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
               }
            />
            <FlatList

               data={libraryActionsList.filter((item) =>
                  item.actionCategories.includes(index),
               )}
               renderItem={renderItem}
               keyExtractor={(item, index) => item.id}
               contentContainerStyle={{
                  paddingTop: 16,
                  paddingBottom: bottom,
               }}
            />

            <Modal
               presentationStyle="overFullScreen"
               animationType="slide"
               keyboardShouldPersistTaps="always"
               transparent={false}
               statusBarTranslucent={false}
               visible={smashStore.editingActivity ? true : false} >
               <ScrollView style={{ backgroundColor: '#333' }} contentContainerStyle={{ paddingTop: 32 }}>
                  <AddActivity actionCategory={index} />

               </ScrollView>

            </Modal>
         </View>
      );
   }),
);

export default AddActivityList;
