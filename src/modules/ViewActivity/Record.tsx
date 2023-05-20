import React, { useState, useRef, useEffect } from 'react';

import {
   Platform,
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   ActivityIndicator,
} from 'react-native';
import { Video, Audio } from 'expo-av';
import { inject, observer } from 'mobx-react';
import { moderateScale } from 'helpers/scale';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/core';
import { height, width } from 'config/scaleAccordingToDevice';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

import { moment } from 'helpers/generalHelpers';;
import Box from 'components/Box';
import Routes from 'config/Routes';
import firebaseInstance from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
const firestore = firebaseInstance.firestore;
type PropTypes = {
   id: string;
};



const ComponentTemplate = ({ id }: PropTypes) => {
   const [loading, setLoading] = useState<boolean>(true);
   const [activityRecord, setActivityRecord] = useState<any>(null);

   useEffect(() => {
      const { uid } = firebaseInstance.auth.currentUser;
      
      const unsub = onSnapshot(
        doc(firestore, 'records', uid),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
    
            if (data) {
              setLoading(false);
              setActivityRecord(data?.activities?.[id]);
            }
    
            return setLoading(false);
          }
    
          return setLoading(false);
        },
        (error) => {
          console.error("Error fetching records: ", error);
        }
      );
    
      return () => {
        unsub && unsub();
      };
    }, []);

   return (
      <Box>
         <View style={{ padding: 16 }} row spread>
            <View>
               {loading ? (
                 <View row><Text R14 secondaryContent>
                 Highest Day:{' '}
                 {activityRecord?.highestSingleDayQty || '(N/A)'}
              </Text><ActivityIndicator size={'small'} /></View>
               ) : (
                  <Text R14 secondaryContent>
                     Highest Day:{' '}
                     {activityRecord?.highestSingleDayQty || '(N/A)'}
                  </Text>
               )}
            </View>
            <View>
               {loading ? (
                  <View width={120} />
               ) : null 
               
               // (
               //    <Text R14 secondaryContent>
               //       Highest Week{' '}
               //       {activityRecord?.highestSingleWeekQty || '(N/A)'}
               //    </Text>
               // )
               }
            </View>
         </View>
      </Box>
   );
};

export default inject(
   'smashStore',
   'teamsStore',
   'challengesStore',
)(observer(ComponentTemplate));
