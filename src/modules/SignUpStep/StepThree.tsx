import {useNavigation} from '@react-navigation/native';
import FooterLinear from 'components/FooterLinear';
import Input from 'components/Input';
import Routes from 'config/Routes';
import SegmentControl from 'libs/react-native-segment';
import { scaleH, width } from 'config/scaleAccordingToDevice';
import React, { useCallback, useState } from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Keyboard, StyleSheet, Image} from 'react-native';
import { View, Text, Colors, TouchableOpacity, Assets } from 'react-native-ui-lib';
import WalkthroughChallenge from "../../modules/Home/components/WalkthroughChallenge";
import { inject, observer } from 'mobx-react';
import { AntDesign } from '@expo/vector-icons';
import firebaseInstance from '../../config/Firebase'
import { Vibrate } from 'helpers/HapticsHelpers';
import ButtonLinear from 'components/ButtonLinear';
const StepThree = (props) => {


  const { smashStore,route } = props;
  const { settings } = smashStore;
  const team = route?.params?.team || false;
//   console.warn(settings);

  const { navigate } = useNavigation();
  const onNext = useCallback(() => {
     navigate(Routes.MainTab, { firstTime: true });

     if(team){

      smashStore.setFirstTime(team);
     }
  
     // props.smashStore.createCohersionNotice('Your First Task! Join a Challenge!', uid, 'Press Find A Challenge Above. Swipe to dismiss!');
  }, []);
  const { control } = useForm({
     defaultValues: {
        age: '',
     },
  });

   const [shared, setShared] = useState(false);
  const challenge = {
     name: 'Push-Up Challenge',
     score: 770,
     target: 1000,
     daysLeft: 4,
  };
  const challengeTwo = {
     name: 'Distance Challenge (km)',
     score: 30,
     target: 100,
     daysLeft: 23,
  };

  const skip = () => {

   Vibrate();

   // Alert.alert('No problem!', `You can easily share your profile link when you're ready from your profile screen.`);
   setShared(true)

  }

   const shareNotice = () => {

      Vibrate();

      setTimeout(() => {
         setShared(true)
      }, 1000);
     
      smashStore.shareProfile()
      // setTimeout(() => {
      //    smashStore.simpleCelebrate = {
      //       name: `Share Your Profile Link!`,
      //       title: `Connect Up!`,
      //       subtitle: `Share your profile link with your friends or family so you can connect up and follow eachother 🔥`,
      //       button: "Share Link",
      //       nextFn: shareProfile
      //    };
      //    // smashStore.checkCameraPermissions(true);
      // }, 500);



   }
  return (
     <View
        flex
        backgroundColor={Colors.contentW}
        onTouchStart={() => {
           Keyboard.dismiss();
        }}>
          <Text H36 marginL-24>
           Step 5/5
        </Text>
        <View row marginH-24>
       
        <Text H36 style={{fontSize: 22}} >
              {
                 'Share Your Profile Link'}{' '}
              {/* <AntDesign name={'infocirlceo'} size={20} color={Colors.grey50} /> */}
           </Text>
        </View>
        {/* <Text R18 marginH-24>
        You have two choices of Challenges in SmashApp. 
      </Text> */}

        {/* <Text R18 marginH-24 marginT-16>
           {settings?.messages?.explainerFitnessH2 ||
              'This step is important.'}
        </Text> */}
        <Text R16 marginH-24 marginT-16 color6D>
           {settings?.messages?.explainerFitnessDescription ||
              'Share your SmashApp Link with your close friends and family so you can connect and motivate each other. It really helps to keep everyone motivated. '}
        </Text>
        {/* <Text R16 marginH-24 marginT-16 color6D>
           {settings?.messages?.explainerFitnessDescription ||
              'That person or people who you know will keep you on track.'}
        </Text> */}
        <View flex paddingT-40>

           <ButtonLinear title="Share Your SmashApp Link" onPress={shareNotice} colors={shared ? ['#ccc', '#aaa'] : [Colors.buttonLink, Colors.smashPink]} />
<View center>
           <Image
               source={Assets.icons.or}
               marginV-16
               style={{ marginVertical: scaleH(24) }}
            />
</View>
           <TouchableOpacity onPress={skip} style={{ borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
              <Text M16 secondaryContent>Skip for now</Text></TouchableOpacity>
           {/* <WalkthroughChallenge challenge={challenge} />
           <WalkthroughChallenge challenge={challengeTwo} /> */}
           {/* <Controller
          control={control}
          name="age"
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              onChangeText={onChange}
              label={'Your Age'}
              keyboardType={'number-pad'}
            />
          )}
        />
        <SegmentControl
          values={['KILOGRAMS', 'POUNDS', 'STONES']}
          onChange={(currentIndex) => {}}
          disable={false}
          selectedIndex={1}
          style={{marginTop: 24}}
        /> */}
        </View>
        {shared && <FooterLinear title={'ALL DONE LETS GO!'} onPress={onNext} />}
     </View>
  );
};

export default inject("smashStore")(observer(StepThree));

const styles = StyleSheet.create({});
