import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { inject, observer } from 'mobx-react';
import { FONTS } from 'config/FoundationConfig';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { width, height } from 'config/scaleAccordingToDevice';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
   Platform,
   StyleSheet,

   TouchableWithoutFeedback,
   // TextInput,
} from 'react-native';

import {
   View,
   Icon,
   Text,
   Image,
   Assets,
   Colors,
   TouchableOpacity,
   // Button,
   // Avatar,
} from 'react-native-ui-lib';

import SmartImage from '../../components/SmartImage/SmartImage';


import Feelings from './Feelings';

const User = ({smashStore,goToProfile}) => {

   console.log('render user in headerwithSearch')
if(!smashStore?.currentUser?.picture?.uri){return null}
  return (
<TouchableOpacity onPress={goToProfile}>
                     <View >
                        <SmartImage
                           uri={smashStore?.currentUser?.picture?.uri || ''}
                           preview={
                              smashStore?.currentUser?.picture?.preview
                           }
                           style={{
                              height: 40,
                              width: 40,
                              borderRadius: 80,
                              backgroundColor: '#aaa',
                           }}
                        />
                     </View>
                 <Feelings goToProfile={goToProfile} smashStore={smashStore}/>
                  </TouchableOpacity>

  )
}

export default User