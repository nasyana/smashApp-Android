import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import React, { useState } from 'react';
import Box from './Box';
import firebaseInstance from 'config/Firebase';
import {collection, setDoc, doc} from 'firebase/firestore';
import { width, height } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import AnimatedView from 'components/AnimatedView';
import { isSmall } from 'config/scaleAccordingToDevice';
import {deviceType} from 'helpers/DimensionHelpers';
import { todayDateKey} from 'helpers/dateHelpers';
const feelings = [
   { emoji: '😴', description: 'Bored' },
   { emoji: '🙂', description: 'All Good' },
   { emoji: '😁', description: 'Happy' },
   { emoji: '🤗', description: 'Grateful' },
   { emoji: '🔥', description: 'Fiyah!' },
   { emoji: '🚀', description: 'Rockets!' },

   { emoji: '😤', description: 'Smash through' },
   { emoji: '😔', description: 'Tough' },
   
   { emoji: '🤕', description: 'Resting' },

   { emoji: '😈', description: 'Off Track' },
];

const firestore = firebaseInstance.firestore;
// const currentUserId = firebaseInstance?.auth?.currentUser?.uid;
const HowAreYouFeeling = (props) => {
   const { smashStore, challengesStore } = props;
   const { currentUser, showHowAreYouFeelingModal, currentUserId } = smashStore;
   const [selected, setSelected] = useState(false);


   const todayKey = todayDateKey();

   const dismiss = () => { 
      smashStore.setChangeMood(false);
   }
   const choose = (f) => {

      if(!todayKey || !currentUserId){
         alert(`Oop!, ${currentUserId || 'no CurrentUser'} ${todayKey || 'no daykey'}`)
return
      }
    
      setSelected(f);
    
      setDoc(doc(collection(firestore, 'users'), currentUserId), {
         feelings: { [todayKey]: f },
       updatedAt: parseInt(Date.now() / 1000) }, { merge: true });
       smashStore.setChangeMood(false);

    };
   
   return (
      <View marginB-0>
         <Box style={{ width: width - 32, padding: 24, paddingHorizontal: 16 }}>
            <Text
               center
               B18
               style={{ paddingLeft: 16, paddingBottom: 8, paddingTop: 0 }}>
               Mood for today {showHowAreYouFeelingModal && 'show'}
            </Text>
            {!selected ? (
               <View
                  row
                  style={{
                     flexWrap: 'wrap',
                     flexDirection: 'row',
                     alignItems: 'center',
                  }}
                  spread
                  center>
                  {feelings.map((f) => (
                     <TouchableOpacity
                     key={f.description}
                        margin-8
                        centerH
                        onPress={() => {
                           choose(f);
                        }}>
                        <Text
                           center
                           style={{ fontSize: deviceType == 'medium' ? 50 : deviceType == 'small' ? 40 : 60, textAlign: 'center' }}>
                           {f.emoji}
                        </Text>
                        <Text center>{f.description}</Text>
                     </TouchableOpacity>
                  ))}
               </View>
            ) : (
               <AnimatedView>
                  <Text center style={{ fontSize: 60, textAlign: 'center' }}>
                     {selected.emoji}
                  </Text>
                  <Text center>{selected.description}</Text>
               </AnimatedView>
            )}
            {<View marginT-24>
            {currentUser?.feelings?.[todayKey] && <TouchableOpacity center onPress={dismiss}><Text R14>Dismiss</Text></TouchableOpacity>}
            </View>}
         </Box>
         
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(HowAreYouFeeling));
