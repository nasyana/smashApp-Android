import { useNavigation } from "@react-navigation/core";
import ItemFood from "components/ItemFood";
import LibraryActivity from "modules/CreateChallenge/components/LibraryActivity";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React from "react";
import { FlatList, StyleSheet, TouchableHighlight } from "react-native";
import { View, Text, Button, Assets, Colors, Image } from "react-native-ui-lib";
import LibraryActivityRemovable from "./LibraryActivityRemovable";
import AnimatedView from 'components/AnimatedView';
const AddActivities = ({ title, onPress, data, error, hasSelectedActions }) => {
   const { navigate } = useNavigation();

   const showError = error && !hasSelectedActions;
   return (
      <>
         {showError && (
            <AnimatedView
               style={{
                  backgroundColor: 'transparent',
                  paddingHorizontal: 32,
                  marginBottom: 8,
               }}>
               <Text>{error}</Text>
            </AnimatedView>
         )}
         <TouchableHighlight
            underlayColor={'rgb(0,0,0)'}
            style={{
               borderRadius: 6,
               shadowColor: '#000',
               shadowOffset: {
                  width: 0,
                  height: 1,
               },
               shadowOpacity: 0.22,
               shadowRadius: 2.22,
               elevation: 3,
               marginHorizontal: 16,
               marginBottom: 16,
               backgroundColor: Colors.white,
               overflow: 'hidden',
               borderWidth: showError ? 1 : 0,
               borderColor: 'red',
            }}>
            <View backgroundColor={Colors.white}>
               <View
                  row
                  paddingH-16
                  paddingV-12
                  style={{
                     justifyContent: 'space-between',
                     alignItems: 'center',
                  }}>
                  <Text H14 color28 uppercase>
                     {title}
                  </Text>
                  <Button
                     iconSource={Assets.icons.ic_add_16}
                     label={'ADD ACTIVITY'}
                     link
                     color={Colors.buttonLink}
                     onPress={() => {
                        navigate(Routes.ListActivityCategories);
                     }}
                     labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                  />
               </View>
               <View height={1} backgroundColor={Colors.line} />
               {data.map((item, index) => (
                  <>
                     <LibraryActivityRemovable
                        key={item.id}
                        item={item}
                        index={index}
                     />
                  </>
               ))}
            </View>
         </TouchableHighlight>
      </>
   );
};

export default AddActivities;

const styles = StyleSheet.create({});
