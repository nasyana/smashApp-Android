import { View, Text } from 'react-native';
import React from 'react';
import { width, height } from 'config/scaleAccordingToDevice';
const StoryComment = (props) => {
   const { storyToRender } = props;
   return (
      <View>
         {storyToRender?.text?.length > 0 && (
            <View
               style={{
                  position: 'absolute',
                  width,
                  height,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <Text
                  white
                  B22
                  style={{
                     backgroundColor: 'rgba(0,0,0,0.7)',
                     padding: 8,
                     transform: [{ rotate: '-5deg' }],
                  }}>
                  {storyToRender?.text}
               </Text>
            </View>
         )}
      </View>
   );
};

export default StoryComment;
