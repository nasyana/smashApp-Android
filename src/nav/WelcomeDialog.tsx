import React from 'react';
import { Card, Dialog, Text, View, Button, Colors } from 'react-native-ui-lib';
import { Audio } from 'expo-av';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import Animated, {
   Easing,
   useAnimatedProps,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';
import { TextInput } from 'react-native';
import LottieAnimation from 'components/LottieAnimation';

const completionAnimation = require('../lotties/rocket.json');
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

function WelcomeDialog(props) {
   const [sound, setSound] = React.useState();
   const { smashStore } = props;
   const { firstTime, completionChallenges, settings } = smashStore;
   const visible = !_.isEmpty(firstTime);

   const animatedText = useSharedValue(0);

   const animatedInputProps = useAnimatedProps(() => {
      return {
         text: `${Number.parseInt(animatedText.value)}`,
      };
   });

   async function playSound() {
      const { sound } = await Audio.Sound.createAsync(
         require('../../assets/completion.wav'),
      );
      setSound(sound);

      await sound.playAsync();
   }

   React.useLayoutEffect(() => {
      visible && playSound();
   }, [visible]);

   React.useEffect(() => {
      return sound
         ? () => {
              sound.unloadAsync();
           }
         : undefined;
   }, [sound]);

   const dismiss = () => {
      smashStore.setFirstTime(false);
   };
   return (
      <Dialog
         visible={firstTime}
         containerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 500,
         }}
         onDialogDismissed={() => {
            smashStore.setFirstTime(false);
         }}>
         <Card
            style={{
               flex: 1,
               justifyContent: 'flex-start',
               alignItems: 'center',
               backgroundColor: '#eee',
               width: '100%',
            }}>
            <View flex>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  // resizeMode='center'
                  style={{
                     // width: 150,
                     height: 170,
                     flex: 1,
                     marginVertical: 16,
                  }}
                  source={completionAnimation}
               />
            </View>

            <Text
               text100BL
               style={{ fontSize: 24, paddingTop: 10, lineHeight: 24 }}>
               {settings?.messages?.welcomeHeader || `You're all set`}
            </Text>
            <View flex left marginT-10>
               <View marginT-5 paddingH-32>
                  <Text R18 center color6D>
                     {settings?.messages?.welcome ||
                        'Welcome to the SmashApp Challenges Community.'}
                  </Text>

                  <Text R18 marginT-16 center color6D>
                     {settings?.messages?.welcomeTwo ||
                        'Next Step, Join challenges that push you to be your best for 2022.'}
                  </Text>

                  <Button
                     onPress={dismiss}
                     label="Let's Go!"
                     backgroundColor={Colors.buttonLink}
                     center
                     marginT-20
                  />
               </View>
            </View>
         </Card>
      </Dialog>
   );
}

export default inject('smashStore')(observer(WelcomeDialog));
