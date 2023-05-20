import { View, Text, Platform, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import { width, height } from 'config/scaleAccordingToDevice';
import SmartVideo from 'components/SmartImage/SmartVideo';
import AnimatedView from './AnimatedView';
const StoryImage = (props) => {
   const { smashStore,showImage } = props;
   const { userStoriesHash, storyToRender, storyIndex, currentStory } = smashStore;

   const isAndroid = Platform.OS === 'android';
   // const storyToRender = userStoriesHash?.[currentStory.id] || false;
   const ratio =
      isAndroid && storyToRender?.media?.width
         ? storyToRender?.media?.width / storyToRender?.media?.height
         : false;

   const rationHeight = ratio ? width + ratio * width : height;

   const androidTop = ratio ? (height - rationHeight) / 2 : 0;

   const newRatio = storyToRender?.media?.width
      ? calculateAspectRatioFit(
           storyToRender?.media?.width,
           storyToRender?.media?.height,
           width,
           height,
        )
      : { width, height };

   const iosTop = storyToRender?.media?.width
      ? (height - newRatio.height) / 2
      : 0;

   const hasVideo = storyToRender.video?.length > 10;
   const hasPicture = storyToRender?.picture?.uri?.length > 10;

   const noVidOrPic = !hasVideo && !hasPicture;




   if (noVidOrPic) { return null }
   if (storyToRender.video?.length > 10) {
      return (
         <SmartVideo
            // source={showImage ? {
            //    uri: storyToRender?.video || '',
            // } : false}
            uri={showImage ? storyToRender.video : false}
            key={storyToRender.video}
            isBackground
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay={true}
            isLooping
            useNativeControls={false}
            style={{
               position: 'absolute',
               width,
               height: ratio ? width + ratio * width : height,
               top: 0,
               background: '#fff',
               left: 0,
            }}
         />
      );
   }



   return (
      // <AnimatedView bounce={false} style={{ borderWidth: 0 }}>
      <SmartImage
         uri={showImage ? storyToRender?.picture?.uri || '' : false}
         preview={storyToRender.picture?.preview || ''}
         style={{
            borderWidth: 0,
            width: newRatio.width || width,
            height: newRatio.height || height,
            position: 'absolute',
            top: isAndroid ? parseInt(androidTop) : parseInt(iosTop),
         }}
         />
         // </AnimatedView>
   );
};;

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
   var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

   return { width: srcWidth * ratio, height: srcHeight * ratio };
}

export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(StoryImage));
