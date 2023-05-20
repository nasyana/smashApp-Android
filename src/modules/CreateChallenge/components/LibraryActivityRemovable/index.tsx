import SwipeableItem from "./SwipeableItem";
import Tag from "components/Tag";
import React from "react";
import { StyleSheet } from "react-native";
import { Assets, Colors, View, Text, Image } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';

const LibraryActivityRemovable = ({item, index, actionsStore}) => {
   const handleUnselectAction = () => {
      actionsStore.removeAction(index);
   };

   return (
      <SwipeableItem handleUnselectAction={handleUnselectAction}>
         <View padding-16 row>
            <View style={{alignItems: 'center'}}>
               <Tag size={24} color={Colors.color58} label={item.text[0]} />
               <Image source={Assets.icons.ic_food_checked} marginT-8 />
            </View>
            <View marginL-16>
               <Text M18 color28>
                  {item.text}
               </Text>
               <View row marginT-8>
                  <View row>
                     <Image source={Assets.icons.ic_calories_burn} />
                     <Text R14 color6D marginL-4>
                        {item.level} Level
                     </Text>
                  </View>
                  {/* <View row marginL-24>
              <Image source={Assets.icons.ic_serving} />
              <Text R14 color6D marginL-4>
                1 whole sandwich
              </Text>
            </View> */}
               </View>
            </View>
         </View>
      </SwipeableItem>
   );
};

export default inject('actionsStore')(observer(LibraryActivityRemovable));

const styles = StyleSheet.create({});
