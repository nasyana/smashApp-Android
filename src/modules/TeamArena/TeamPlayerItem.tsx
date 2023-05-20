import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {
   View,
   Text,
   TouchableOpacity,
   Button,
   ButtonSize,
} from 'react-native-ui-lib';
import {useNavigation} from '@react-navigation/core';
import SmartImage from 'components/SmartImage/SmartImage';
import Routes from 'config/Routes';

const TeamPlayerItem = (props) => {
   const {navigate} = useNavigation();
   const {item, index, currentUser, community, button1, button2} = props;
   const user = item;

   const selectedGradient = ['#eee', '#333'];

   const onPressUser = () => {
      navigate(Routes.MyProfileHome, {user});
   };

   return (
      <View
         row
         style={{
            borderRadius: 6,
            marginHorizontal: 16,
            backgroundColor: '#FFF',
            paddingBottom: 16,
            overflow: 'hidden',
            marginBottom: 2,
         }}>
         <View centerV paddingL-16 paddingT-16>
            <Text>{index + 1}</Text>
         </View>

         <TouchableOpacity paddingT-16 paddingL-16 onPress={onPressUser}>
            <LinearGradient
               start={{x: 0.6, y: 0.1}}
               colors={selectedGradient}
               style={{
                  width: 55,
                  height: 55,
                  borderRadius: 27.5,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <SmartImage
                  uri={user?.picture?.uri}
                  preview={user?.picture?.preview}
                  style={{
                     height: 50,
                     width: 50,
                     borderRadius: 60,
                     borderWidth: 2,
                     borderColor: '#fff',
                  }}
               />
            </LinearGradient>
         </TouchableOpacity>

         <View paddingL-16 centerV flex row spread>
            <Text H14 color28 marginT-16 marginB-8 onPress={onPressUser}>
               {user.name || 'User'}
            </Text>
         </View>

         {button1 && (
            <View centerV paddingR-16 paddingT-16>
               {button1}
            </View>
         )}
         {button2 && (
            <View centerV paddingR-16 paddingT-16>
               {button2}
            </View>
         )}
      </View>
   );
};
export default TeamPlayerItem;
