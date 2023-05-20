import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

const Faq = (props) => {
   const [open, setOpen] = useState(false);
   const { item, smashStore } = props;
   const pressFaq = () => setOpen(!open);
   return (
      <View
         style={{
            // borderBottomWidth: 2,
            borderColor: open ? '#fff' : 'transparent',
         }}>
         <TouchableOpacity
            onPress={pressFaq}
            row
            spread
            centerV
            style={{
               width: '100%',
               //    backgroundColor: open ? '#fff' : 'transparent',
            }}
            paddingH-24
            paddingB-16
            paddingT-8
            // paddingB-8
            marginT-8>
            <Text M18>{item.title}</Text>
            <AntDesign
               size={20}
               color={open ? Colors.buttonLink : '#333'}
               name={open ? 'infocirlceo' : 'infocirlceo'}
            />
         </TouchableOpacity>
         {open && (
            <View
               padding-24
               style={
                  {
                     //   backgroundColor: open ? Colors.buttonLink : 'transparent',
                  }
               }>
               <Text M14 buttonLink>
                  {item.answer}
               </Text>
               {item.answer2?.length > 0 && (
                  <Text marginT-8 M14 buttonLink>
                     {item.answer2}
                  </Text>
               )}
               {item.showVideo && item.video && (
                  <TouchableOpacity
                     onPress={() =>
                        (smashStore.tutorialVideo = {
                           title: item.title,
                           video: item.video,
                           showVid: true,
                        })
                     }>
                     <Text B14 marginT-16 buttonLink>
                        Watch Video
                     </Text>
                  </TouchableOpacity>
               )}
            </View>
         )}
      </View>
   );
};

export default Faq;
