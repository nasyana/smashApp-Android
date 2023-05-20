import { View, Text } from 'react-native';
import React from 'react';

const StoryBarsTop = (props) => {
   const { smashStore } = props;
   const { stories, storyIndex } = smashStore;

   if (!stories) {
      return null;
   }
   return (
      <View
         style={{
            width: '100%',
            height: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
         }}>
         {stories.map((story, index) => {
            const active = storyIndex == index;

            return (
               <View

               key={story.id}
                  style={{
                     flex: 1,
                     backgroundColor: active ? '#fff' : 'rgba(255,255,255,0.5)',
                     marginLeft: 0,
                     height: 5,
                     marginHorizontal: 4,
                     borderRadius: 2,
                  }}
               />
            );
         })}
      </View>
   );
};

export default StoryBarsTop;
