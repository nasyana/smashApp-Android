import React, { useEffect, useLayoutEffect } from 'react';

/* native */
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {useNavigation} from '@react-navigation/native';
import { ImageBackground, Platform, StyleSheet } from 'react-native';
import {View, Text, Assets, Image, Button, Colors} from 'react-native-ui-lib';
import { getAuth, onIdTokenChanged,onAuthStateChanged } from 'firebase/auth';
/* styles config */
import {LinearGradient} from 'expo-linear-gradient';
import {height, width} from 'config/scaleAccordingToDevice';
import firebaseInstance from 'config/Firebase';
/* component */
import Routes from 'config/Routes';
import Carousel from 'react-native-snap-carousel';
import PaginationBottom from './components/PaginationBottom';
import LottieAnimation from 'components/LottieAnimation';
import AnimatedView from 'components/AnimatedView';
import PushNotification from 'components/PushNotification'
const SLIDER_WIDTH = width;
const ITEM_WIDTH = SLIDER_WIDTH;
const ITEM_HEIGHT = height;

const smallScreen = height < 700;

const isAndroid = Platform.OS === 'android';
const loader = require('../../lotties/logo.json');
const smashchallenges = require('../../lotties/smashchallenges.json');
const findteam2 = require('../../lotties/findteam2.json');
const earnbadges3 = require('../../lotties/earnbadges3.json');
const trackprogress = require('../../lotties/trackprogress.json');

const DATA = [
   // {
   //    bg: require('images/BG_1.png'),
   //    title: 'Good Energy!',
   //    subtitle:
   //       'If you’re joining smashApp, you understand good energy. You understand motivating people is about being your best. You’re one of these rockstars in this world that love to see others around you win. We all go up. Lessgooo….',
   //    marginTop: 40,
   //    lottie: loader,
   //    lottieWidth: 150,
   //    lottieTop: 90,
   //    gradient: ['#FF5E3A', '#FF2A68'],
   //    nextText: 'agree',
   //    hideOverlay: true,
   //    index: 1,

   // },
   // {
   //    bg: require('images/BG_1.png'),
   //    title: 'Find & Join Challenges',
   //    subtitle:
   //       '"Smash" Challenges with millions of other players around the world. Motivate eachother by reaching daily targets consistently.',
   //    marginTop: 40,
   //    lottie: smashchallenges,
   //    gradient: ['#FF5E3A', '#FF2A68'],
   //    index: 2,
   // },
   {
      // bg: require('images/BG_2.png'),
      title: `JOIN "Habit Building" CHALLENGES`,
      subtitle: `SmashApp Challenges has Habit Stacks & Challenges that make it fun for You to Stay Motivated & Stay Consistent. `,
      lottie: loader,
      lottieWidth: 150,
      lottieTop: height / 10,
      // start:{ x: 0.1, y: 0.2 } ,
      // end: { x: 0.1, y: 0.2 } ,
      // lottie: require('../../lotties/loader.json'),
      marginTop: 20,
      gradient: ['#FF5E3A', '#FF2A68'],
      // gradient: ['#5D56D8', '#9B6FFF'],
      // reduceBy: 26,
      index: 0,
   },

   {
      // bg: require('images/BG_2.png'),
      title: `CREATE OR JOIN SMASH TEAMS`,
      subtitle: `Perfect for Family or a small group to keep each other accountable, competitive and on track. `,
      // subtitle: `Create a Group Space for your Friends, Family or Team to Stay Motivated, Stay Consistent & Stay Accountable. `,
      lottie: loader,
      lottieWidth: 150,
      lottieTop: height / 10,
      marginTop: 20,
      gradient: [Colors.smashPink, Colors.teamToday],
      index: 2,
   },
   {
      // bg: require('images/BG_2.png'),
      // title: `CONNECT WITH PEOPLE THAT MOTIVATE YOU`,
      title: `CONNECT WITH CLOSE FRIENDS & FAMILY`,
      subtitle: `Connect with your Close Friends of Family. Motivate each other by reaching your own daily goals. `,
      // subtitle: `Create a Group Space for your Friends, Family or Team to Stay Motivated, Stay Consistent & Stay Accountable. `,
      lottie: loader,
      lottieWidth: 150,
      lottieTop: height / 10,
      // lottie: require('../../lotties/loader.json'),
      marginTop: 20,
      gradient: ['#000',  Colors.smashPink],
      index: 1,
   },
   // {
   //    bg: require('images/BG_3.png'),
   //    title: `Top The Leaderboard`,
   //    subtitle: `Think you’re the best at fitness? Or maybe you’re an ace at being productive? Well, we've got plenty of ways for you to show us what you're made of. And if you don't have a challenge yet that really gets your blood pumping, why not start up one that suits your needs?
   //       `,
   //    lottie: earnbadges3,

   //    marginTop: 20,
   //    gradient: ['#4CBAE5', '#0177FF'],

   //    index: 4,
   // },
   // {
   //    bg: require('images/BG_4.png'),
   //    title: 'Track Team Progress for Loads of Activities',
   //    subtitle:
   //       'Productivity, Fitness, Clarity and more. All the activities that push you forward.',
   //    lottie: trackprogress,
   //    // lottie: require('../../lotties/loader.json'),
   //    marginTop: 10,
   //    gradient: ['#8F1874', '#D685A7'],
   //    index: 5,
   // },
   // {
   //   bg: require("images/BG_5.png"),
   //   title: "",
   // },
];


const Walkthoughs = () => {
   const [index, setIndex] = React.useState(0);
   const refCarousel = React.useRef<any>('');
   const { navigate } = useNavigation();
   const onSkip = React.useCallback(() => {
      navigate(Routes.Login);
      // onNext()
      // refCarousel?.current?.snapToItem(4, false);
   }, []);

   const onNext = React.useCallback(() => {
      if (index === DATA.length - 1) {
         navigate(Routes.Login);
      } else {
         setIndex((prev) => prev + 1);
         refCarousel?.current?.snapToNext();
      }
   }, [index]);


   const _renderItem = React.useCallback(({ item, index }) => {
      // if (index === DATA.length - 1) {
      //   return (
      //     <ImageBackground source={item.bg} style={styles.container}>
      //       <View flex centerH centerV>
      //         <Image source={Assets.icons.logoIntro} />
      //         <Text B24 contentW marginV-24>
      //           FITNESS LOVE
      //         </Text>
      //         <Text center contentW R18 marginH-24>
      //           Fitness Love - This app will allow you to achieve great results,
      //           within a short period of time.{" "}
      //         </Text>
      //       </View>
      //       <Button
      //         label="SIGN UP WITH FACEBOOK"
      //         iconSource={Assets.icons.ic_facebook}
      //         backgroundColor={Colors.facebook}
      //         style={{ width: width - 48 }}
      //       />
      //       <Button
      //         label="Sign up with Email"
      //         iconSource={Assets.icons.ic_email_16}
      //         backgroundColor={Colors.contentW}
      //         style={{ width: width - 48, shadowColor: "rgba(0,0,0,0.15)" }}
      //         color={Colors.content28}
      //         marginV-24
      //         enableShadow
      //         onPress={() => {
      //           navigate(Routes.SignUp);
      //         }}
      //       />
      //     </ImageBackground>
      //   );
      // }
      const lottieWidth = height / 3;
      return (
         <LinearGradient
            style={styles.container}
            colors={[...item.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View
               style={{
                  position: 'absolute',
                  width: width * 1.5,
                  height: width * 1.5,
                  backgroundColor: item.hideOverlay
                     ? 'transparent'
                     : 'rgba(255,255,255,0.1)',
                  borderRadius: width / 1,
                  top: -(height / 7),
               }}
            />

            <LottieAnimation
               key={index}
               loop={false}
               // start={item?.start || false}
               // end={item?.end || false}
               style={{
                  width: item?.lottieWidth || lottieWidth,
                  marginTop: item?.lottieTop || 30,
                  zIndex: 99999,
               }}
               source={item.lottie}
            />

            <View marginH-24>
               <Text
                  H2B
                  contentW
                  uppercase
                  style={{
                     fontSize: smallScreen ? 35 : 40,
                     lineHeight: smallScreen ? 45 : 55,
                     minWidth: width - 68,
                  }}>
                  {item.title}
               </Text>

               {item?.subtitle && (
                  <Text white R14>
                     {item.subtitle}
                  </Text>
               )}
            </View>
         </LinearGradient>
      );
   }, []);

   return (
      <View flex backgroundColor={'black'} style={{ position: 'absolute' }}>
       
         <Carousel
            data={DATA}
            renderItem={_renderItem}
            sliderWidth={SLIDER_WIDTH}
            sliderHeight={ITEM_HEIGHT}
            itemWidth={ITEM_WIDTH}
            // inactiveSlideShift={0}
            onSnapToItem={setIndex}
            inactiveSlideScale={1}
            bounces={false}
            ref={refCarousel}
            enableSnap={true}
            enableMomentum={true}
         />
           <View style={{position: 'absolute'}}>
      
         </View>

         <PaginationBottom
            style={{ bottom: isAndroid ? 30 : 16 }}
            index={index}
            onSkip={onSkip}
            onNext={onNext}
            dotsLength={DATA.length}
         />
         {Platform.OS == 'android' && <View style={{ height: -40 }} />}
         
      </View>
   );
};

export default Walkthoughs;

const styles = StyleSheet.create({
   container: {
      width: width,
      height: isAndroid ? height + 40 : height,
      top: isAndroid ? -20 : 0,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 90 + getBottomSpace(),
   },
});
