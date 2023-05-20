import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Colors } from 'react-native-ui-lib';
import { Audio, Video } from 'expo-av';
import { inject, observer } from 'mobx-react';
import {
   Modal,
   TextInput,
   TouchableOpacity,
   FlatList,
   ScrollView,
   Image,
   ActivityIndicator,
} from 'react-native';
import { moderateScale } from 'helpers/scale';
import { AntDesign } from '@expo/vector-icons';

import _ from 'lodash';
import AnimatedView from 'components/AnimatedView';
import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';

const DoneDialogDismissButton = ({smashStore}) => {

    const [showButton, setShowButton] = useState(false);


    const dismiss = () => {

        smashStore.setCompletionsTeamsAndChallenges(false);
        smashStore.setSmashing(false);
      
  
        // smashStore.smashEffects();
        smashStore.setSelectMultiplier(false)
        smashStore.setCompletion(false);
        smashStore.setMasterIdsToSmash(false);
        
        smashStore.multiplier = 1;
   
        setTimeout(() => {
           smashStore.checkForNewEntriesInFeed();
           smashStore.setLoadingFeed(false);
        }, 3000);
       
  
        smashStore.completionTeams = [];
     };

     
    useEffect(() => {

        setTimeout(() => {
            setShowButton(true);
        }, 1000);

    }, []);


    if(showButton){
        
        return (
        <TouchableOpacity
           onPress={dismiss}
           style={{
              alignItems: 'center',
           }}>
           <View
              style={{
                 height: 45,
                 width: 45,
                 backgroundColor: '#fff',
                 borderRadius: 45 / 2,
                 alignItems: 'center',
                 paddingVertical: 15,
                 zIndex: 9999,
                 marginTop: -30,
              }}>
              <AntDesign name="close" size={15} color={Colors.gray} />
           </View>
        </TouchableOpacity>
     )}
     
     else{

        return (
            <TouchableOpacity // 
            onPress={dismiss}
               style={{
                  alignItems: 'center',
               }}>
               <View
                  style={{
                     height: 45,
                     width: 45,
                     backgroundColor: '#fff',
                     borderRadius: 45 / 2,
                     alignItems: 'center',
                     paddingVertical: 15,
                     zIndex: 9999,
                     marginTop: -30,
                  }}>
                  <ActivityIndicator
                     name="close"
                     size={15}
                     color={Colors.gray}
                  />
               </View>
            </TouchableOpacity>
         )
     }
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(DoneDialogDismissButton));