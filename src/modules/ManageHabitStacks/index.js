import AddActivities from 'modules/CreateChallenge/components/AddActivities';
import React, { useEffect, useState } from 'react';
import {
   Colors,
   TouchableOpacity,
   View,
   Text,
   Assets,
   Button,
} from 'react-native-ui-lib';
import { FONTS } from '../../config/FoundationConfig';
import Box from 'components/Box';
import Input from 'components/Input';
import { bottom, height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { ScrollView } from 'react-native-gesture-handler';
import Header from 'components/Header';
import CustomButtonLinear from 'components/CustomButtonLinear';
import { ActivityIndicator, FlatList } from 'react-native';
import Firebase from 'config/Firebase';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import HabitStack from 'components/HabitStack';
function ManageHabitStacks(props) {
   const { navigate } = useNavigation();
   const { actionsStore, smashStore } = props;
   const [name, setName] = useState('');
   const [loading, setLoading] = useState(false);

   const { selectedActions = [] } = actionsStore;

   /// get manage from route params
 const { manage = false } = props?.route?.params;


   const { habitStacksList } = smashStore;
   useEffect(() => {
      return () => {
         actionsStore.clearSelectedActions();
      };
   }, []);

   const handleCreateHabitStack = (item) => {
      navigate(Routes.CreateHabitStack, { habitStack: item });
   };

   const renderHabitStackItem = ({ item, index }) => {
      return <HabitStack manage={manage} stack={item} onPress={handleCreateHabitStack} />;
   };

   return (
      <View flex>
         <Header title={'Manage Habit Stack'} back />
         <FlatList
            numColumns={2}
            renderItem={renderHabitStackItem}
            data={habitStacksList}
            contentContainerStyle={{ padding: 16, alignItems: 'center' }}
            ListFooterComponent={
               <Button
                  iconSource={Assets.icons.ic_add_16}
                  label={'ADD HABIT STACK'}
                  outline={true}
                  outlineColor={Colors.grey20}
                  marginR-16
                  color={Colors.grey20}
                  labelStyle={{
                     fontSize: 14,
                     fontFamily: FONTS.medium,
                  }}
                  style={{ marginTop: 24 }}
                  onPress={() => {
                     navigate(Routes.CreateHabitStack);
                  }}
               />
            }
         />
      </View>
   );
}

export default inject(
   'createChallengeStore',
   'actionsStore',
   'smashStore',
   'teamsStore',
)(observer(ManageHabitStacks));
