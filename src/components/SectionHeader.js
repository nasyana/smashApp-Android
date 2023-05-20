import { Colors, View, Text, TouchableOpacity } from 'react-native-ui-lib';
import React from 'react';
import { width } from 'config/scaleAccordingToDevice';
const SectionHeader = (props) => {

   const { onPress = false, afterTitle = false, line = false } = props;

   if (onPress) {
      return (
         <TouchableOpacity
            row
            spread
            onPress={onPress}
            centerV
            marginL-26
            paddingB-16
            style={{
               paddingBottom: props.bottom || 16,
               marginTop: props.top || 0,
               ...(props.style || {}),
               borderBottomWidth: line ? 0.5 : 0,
               maxWidth: width - 44,
               borderColor: Colors.secondaryContent
            }}>
            <View
               height={props.larger ? 2 : 1}
               backgroundColor={props.larger ? '#333' : Colors.color6D}
               width={props.larger ? 10 : 20}
            />
            <View row spread flex paddingR-0 centerV>
               <View row centerV>
                  <Text
                     B12
                     B14={props.larger}
                     marginL-6
                     marginR-8
                     white={props.white || false}>
                     {props.title?.toUpperCase() || 'empty'}
                  </Text>
                  {afterTitle && afterTitle}
               </View>
               {props.subtitle && props.subtitle}
            </View>
         </TouchableOpacity>
      );
   }

   return (
      <View
         row
         spread
         onPress={onPress}
         centerV
         marginL-26
         paddingB-16
         style={{ maxWidth: width - 44, paddingBottom: props.bottom || 16, marginTop: props.top || 0, ...(props.style || {}) }}>
         <View height={props.larger ? 2 : 1} backgroundColor={props.larger ? '#333' : Colors.color6D} width={props.larger ? 10 : 20} />
         <View row spread flex paddingR-0 centerV>
            <Text B12 B14={props.larger} marginL-6 white={props.white || false}>
               {props.title?.toUpperCase() || 'empty'}
            </Text>
            {props?.bottomText && <Text B12 meToday>{props?.bottomText?.toUpperCase()}</Text>}
            {props.subtitle && props.subtitle}
         </View>
      </View>
   );
};

export default SectionHeader;
