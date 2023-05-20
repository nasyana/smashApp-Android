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
import { Vibrate } from 'helpers/HapticsHelpers';

import Routes from 'config/Routes';
import Input from 'components/Input';
import ActionSheetScreen from './ActionSheet';
import UploadProgress from './UploadProgress';
import AnimatedView from 'components/AnimatedView';
import SmartImage from '../../components/SmartImage/SmartImage';
import NotificationIconBadge from 'modules/Home/NotificationIconBadge';
import HomeHeaderText from 'components/HomeHeaderText';
import PremiumBadge from 'components/PremiumBadge';

const Feelings = ({smashStore,goToProfile}) => {
const {hasUserGotFeelingsToday} = smashStore;

if(!hasUserGotFeelingsToday){return null}
// alert(JSON.stringify(hasUserGotFeelingsToday))
  return (

        <TouchableOpacity onPress={goToProfile}
           // onPress={changeMood}
           style={{
              position: 'absolute',
              right: -7,
              backgroundColor: '#fff',
              borderRadius: 20,
              height: 20,
              width: 20,
           }}>
           <Text>
              {hasUserGotFeelingsToday?.emoji || ''}
           </Text>
        </TouchableOpacity >

  )
}

export default Feelings