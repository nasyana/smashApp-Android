import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';
import React, { useState } from 'react';
import SmartImage from 'components/SmartImage/SmartImage';
import { width, height } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
const HabitStack = (props) => {
   const { onPress, stack, teamsStore, manage } = props;

   const onPressPress = (stack) => {

      if(manage){


      }else{

         setIsSelected(!isSelected);
      }
      
      onPress(stack);
   };

   const { currentTeam } = teamsStore;
   const [isSelected, setIsSelected] = useState(
      currentTeam.habitStackIds?.includes(stack.id),
   );

   const iconSize = width / 6;


   return (
      <TouchableOpacity
         style={{
            width: width / 2 - 32,
            borderWidth: 1,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 24,
            paddingHorizontal: 8,
            marginHorizontal: '1%',
            height: 180,
            marginVertical: '1%',
            backgroundColor: isSelected ? Colors.buttonLink : '#fff',
            borderColor: isSelected ? Colors.buttonLink : Colors.buttonLink,
         }}
         key={stack.id}
         onPress={() => onPressPress(stack)}
         spread>
         {isSelected && stack?.pictureTwo?.uri && (
            <SmartImage
               uri={stack?.pictureTwo?.uri}
               preview={stack?.pictureTwo?.preview}
               style={{
                  width: iconSize,
                  height: iconSize,
                  marginBottom: 8,
                  //    backgroundColor: '#fafafa',
               }}
            />
         )}

         {!isSelected && (
            <SmartImage
               uri={stack?.picture?.uri}
               preview={stack?.picture?.preview}
               style={{
                  width: iconSize,
                  height: iconSize,
                  marginBottom: 8,
                  //    backgroundColor: '#fafafa',
               }}
            />
         )}
         <Text B14 center buttonLink white={isSelected}>
            {stack?.name?.toUpperCase()}
         </Text>
         <Text B12 center secondaryContent fmedium white={isSelected}>
            {stack?.masterIds?.length} ACTIVITIES
         </Text>
      </TouchableOpacity>
   );
};

export default inject(
   'createChallengeStore',
   'actionsStore',
   'smashStore',
   'teamsStore',
)(observer(HabitStack));

