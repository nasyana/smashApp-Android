import React from 'react';
import {
   Text,
   View,
   Image,
   Assets,
   Button,
   Colors,
   Avatar,
   Dialog,
   PanningProvider,
} from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import { inject, observer } from 'mobx-react';
import Animated, { FadeOutDown, FadeInUp, Layout, Easing, FadeIn, FadeInRight } from 'react-native-reanimated'

const CoolNotice = (props) => {
   const { smashStore, newPlayer = false } = props;
   const { todayName, settings = {}, noTeamsOrChallenges } = smashStore;

   const { messages = {} } = settings;
   const { coolMessages } = messages;

   var message = coolMessages
      ? coolMessages?.[Math.floor(Math.random() * coolMessages?.length)]
      : "You're just a champion in my book.";

   if (!noTeamsOrChallenges && newPlayer) { return null }

   if (noTeamsOrChallenges) { return <View style={{ height: 8 }} /> }
   return (
      // <Animated.View

      //    layout={Layout.duration(1500).delay(200)}
      //    entering={FadeInRight}
      //    exiting={FadeOutDown}
      // >
      <View>
      <LinearGradient
         colors={['#C644FC', '#5856D6']}
         start={{
            x: 0,
            y: 0,
         }}
         end={{ x: 1, y: 0 }}
         style={{
            marginHorizontal: 16,
            marginVertical: 16,
            marginBottom: noTeamsOrChallenges ? 16 : 8, 
            borderRadius: 6,
         }}>
         <Text marginL-16 marginT-8 H36 white>
            {todayName}!
         </Text>
         <Text marginL-16 marginB-16 M14 white>
            {message?.length > 2
               ? message
               : "You're just a champion in my book."}
         </Text>
         {message?.length < 40 && (
            <Image
               source={Assets.icons.img_star}
               style={{
                  position: 'absolute',
                  right: 8,
                  bottom: 0,
               }}
            />
         )}
      </LinearGradient>
         {/* </Animated.View> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(CoolNotice));
