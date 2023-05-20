import SwipeableItem from "./SwipeableItem";
import Tag from "components/Tag";
import React from "react";
import { StyleSheet } from "react-native";
import { Assets, Colors, View, Text, Image } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';

const LibraryActivityRemovable = ({addOnPress, item, index, actionsStore, smashStore}) => {
   const handleUnselectAction = () => {
      actionsStore.removeAction(index);
   };

   const {returnActionPointsValue, getLevelColor} = smashStore

   const activityValue = returnActionPointsValue(item);
   const levelColor = getLevelColor(activityValue);

   return (
      <SwipeableItem handleUnselectAction={handleUnselectAction}>
         <View padding-24 row centerV style={{borderBottomWidth: 0.5, borderColor:'#ccc'}}>
            <View >
               {/* <Tag size={32} color={levelColor} label={item.text[0]} /> */}
               {/* <Image source={Assets.icons.ic_food_checked} marginT-8 /> */}
            </View>
            <View row spread flex centerV>
               <View flex>
               <Text M18 color28 >
                  {item.text}
               </Text>
               {item.description && <Text R12 color6D>
                {item.description}
              </Text>}
               </View>
               <View marginL-4>
               <Text B16 style={{color: levelColor}}>+{activityValue}</Text>
               </View>
            </View>
         </View>
      </SwipeableItem>
   );
};

export default inject('actionsStore', 'smashStore')(observer(LibraryActivityRemovable));

const styles = StyleSheet.create({});
