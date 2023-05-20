import { View, Text, ProgressBar, Colors } from 'react-native-ui-lib';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { width } from 'config/scaleAccordingToDevice';
const UploadProgress = (props) => {
   const { smashStore, center = false } = props;
   const { uploadProgress = 0 } = smashStore;
   //    const uploadProgress = 20;
   if (uploadProgress == 0) {
      return null;
   }

   if (center) {
      return (
         <View
            centerV
            marginH-24
            centerH
            style={{ marginTop: 0, top: 22, position: 'absolute' }}>
            <Text
               center
               B14
               white
               marginB-4
               style={{ zIndex: 999, elevation: 999 }}>
               {uploadProgress > 0 && parseInt(uploadProgress)}
               {uploadProgress > 0 && '%'}
            </Text>
            {uploadProgress > 0 && (
               <ProgressBar
                  style={{
                     height: 2,
                     width: 60,
                     zIndex: 9999,
                     elevation: 9999,
                     left: 0,
                     top: -4,
                  }}
                  progressColor={Colors.smashPink}
                  progress={uploadProgress}
               />
            )}
         </View>
      );
   }

   return (
      <View
         centerV
         marginH-0
         style={{
            marginBottom: 0,
            // marginTop: 4,
            position: 'absolute',
            bottom: 0,
         }}>
         {uploadProgress > 0 && (
            <ProgressBar
               style={{
                  height: 5,
                  width: width,
                  position: 'absolute',
                  left: 0,
               }}
               progressColor={Colors.white}
               progress={uploadProgress}
            />
         )}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(UploadProgress));
