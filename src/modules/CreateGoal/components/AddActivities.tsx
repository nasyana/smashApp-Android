import { useNavigation } from "@react-navigation/core";
import ItemFood from "components/ItemFood";
import LibraryActivity from "modules/CreateChallenge/components/LibraryActivity";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import AntDesign from "react-native-vector-icons/AntDesign";
import React from "react";
import { FlatList, StyleSheet, TouchableHighlight } from "react-native";
import { View, Text, Button, Assets, Colors, Image, TouchableOpacity } from "react-native-ui-lib";
import LibraryActivityRemovable from "./LibraryActivityRemovable";
import Box from "components/Box";
import AnimatedView from 'components/AnimatedView';
const AddActivities = ({ addOnPress = ()=> null, goBackOnFirstSelect = false, hideAdd = false, title, onPress, data, error, hasSelectedActions }) => {
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
         <Box margin-24>
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
               marginHorizontal: 0,
               marginBottom: 0,
               backgroundColor: Colors.white,
               overflow: 'hidden',
               borderWidth: showError ? 1 : 0,
               borderColor: 'red',
            }}>
               
            <View backgroundColor={Colors.white}>
               
               {/* <View height={1} backgroundColor={Colors.line}  marginB-8/> */}
               {data.map((item, index) => (
                  <>
                     <LibraryActivityRemovable
                     addOnPress={addOnPress}
                        key={item.id}
                        item={item}
                        index={index}
                     />
                  </>
               ))}
              {!hideAdd && <View
                  row
                  paddingH-16
                  paddingV-12
                  style={{
                     justifyContent: 'space-between',
                     alignItems: 'center',
                  }}>
                  {title && <Text H14 color28 uppercase>
                     {title}
                  </Text>}
                  <TouchableOpacity centerV row onPress={addOnPress ? addOnPress : () => {
                        navigate(Routes.ListActivityCategories, {goBackOnFirstSelect: goBackOnFirstSelect});
                     }}>
                        {/* <Image  color={Colors.grey40} source={Assets.icons.ic_add_16} /> */}
                        <AntDesign name="plus" size={16} color={Colors.grey40}/><Text M14 color={Colors.grey40}>{' ADD ACTIVITY'}</Text>
                     </TouchableOpacity>
                  {/* <Button
                     iconSource={Assets.icons.ic_add_16}
                     label={'ADD ACTIVITY'}
                     link
                     color={Colors.grey40}
                     onPress={() => {
                        navigate(Routes.ListActivityCategories, {goBackOnFirstSelect: goBackOnFirstSelect});
                     }}
                     labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
                  /> */}
               </View>}
              
            </View>
            
         </TouchableHighlight>
         </Box>
      </>
   );
};

export default AddActivities;

const styles = StyleSheet.create({});
