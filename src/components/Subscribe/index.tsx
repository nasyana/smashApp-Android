import React from 'react';
import {
   FlatList,
   StyleSheet,
   Dimensions,
   Pressable,
   ScrollView,
   Modal,
   Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import {
   Assets,
   TabController,
   Colors,
   View,
   Text,
   Button,
   TabControllerItemProps,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';


import SubscriptionOffering from './SubscriptionOffering'
import { inject, observer } from 'mobx-react';
import LottieView from 'lottie-react-native';
const { width, height } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import LottieAnimation from 'components/LottieAnimation';
import SubscriptionModal from 'modules/MyProfileHome/components/subscriptionModal';
import Routes from 'config/Routes';
const Options = [
   'Join Unlimited Challenges',
   'Create Teams',
   'Advanced Insights',
   'Get Notified If Friends Overtake you',
   'Daily Motivation',
   'Set & Track Weekly Goals',
   'Follow 30 Players',

];


const isAndroid = Platform.OS === 'android';
const Containt = {
   access: 'Premium Access!',
   premium: 'Advanced Insights + Features',
   price: '$1 monthly!',
   description:
      'Subscription with a free trial period will automatically renew to a paid subscription unless auto-renewal is turned off. Payment will be changed to iTunes Account at confirmation of purchase. Subscription automatically nenews unless auto. Any unused portion of a free trial period, if offered, will be forfeited when you purchases a subscription in SmashApp Challenges.',
      manageSubscriptions: isAndroid ? 'Easily manage your subscriptions by going to the Google Play Store app and selecting the "Subscriptions" tab. From there, they can view and manage your subscriptions at any time.' : 'Easily manage your subscriptions by going to the App Store app and selecting your account from the bottom of the screen. From there, tap on the "Manage Subscriptions" button to view and manage your subscriptions.'
};
const textColor = '#fff';

class Subscribe extends React.Component {
   renderItem = ({ item, index }) => {
      return (
         <View style={styles.renderViewStyle} key={index}>
            <AntDesign
               name={'check'}
               size={20}
               color={'#35AC00' || textColor}
               style={{ marginRight: 8 }}
            />
            <Text style={styles.renderTextStyle}>{item}</Text>
         </View>
      );
   };

   dismiss = () => {
      this.props.challengesStore.subscribeModal = false;
   };

    goToPrivacyPolicy = () => {
      this.dismiss()
      this.props.smashStore.navigation.navigate(Routes.PrivacyPolicy, {backFn: ()=> {this.props.smashStore.navigation.goBack(); this.props.challengesStore.showSubscriptionModal(true)} });
   };
   goToTermsOfUse = () => {
      this.dismiss()
      Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/');
   };

   render() {

   console.log('render Subscribe');
      // if (!this.props.challengesStore.subscribeModal) {

      //    return null
      // }
      // return (<SubscriptionOffering />)

      return (
         <Modal visible={this.props.challengesStore.subscribeModal} transparent={false} animationType={'slide'}>
         <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.container}>
               <View style={styles.mainContainer}>
              
                  <View style={styles.curveViewStyle}>
                     <LinearGradient
                        colors={['#FF6243', '#FF0072']}
                        start={{
                           x: 1,
                           y: 0,
                        }}
                        end={{
                           x: 1,
                           y: 1,
                        }}
                        // style={{
                        //    height: '100%',
                        //    width: '100%',
                        //    position: 'absolute',
                        // }}
                     >
         <SubscriptionOffering textColor={textColor} challengesStore={this.props.challengesStore} smashStore={this.props.smashStore} />
                     
                </LinearGradient>     
                  </View>

                  <View style={styles.lottieViewStyle}>
                     <LottieAnimation
                        autoPlay
                        loop
                        style={styles.lottieStyle}
                        source={require('../../lotties/rocket-lunch.json')}
                     />
                  </View>
               </View>
         
            </View>
            <View style={styles.descriptionViewStyle}>
                                 <Text color6D R12>
                                    {Containt.description}
                                 </Text>
                                 <Text color6D R12 marginV-8>
                                    {Containt.manageSubscriptions}
                                 </Text>
                                 
            <View row center><TouchableOpacity onPress={this.goToPrivacyPolicy}><Text M14 marginH-8>Privacy Policy</Text></TouchableOpacity>
            {!isAndroid && <TouchableOpacity onPress={this.goToTermsOfUse}><Text M14 marginH-8>Terms of Use</Text></TouchableOpacity>}</View>
  
                              </View>
         </ScrollView>
         </Modal>
      );
   }
}
export default inject('smashStore', 'challengesStore')(observer(Subscribe));
const styles = StyleSheet.create({
   container: {
      flex: 1,
      // height,
      width,
   },
   mainContainer: {
      flex: 1,
      //   backgroundColor: 'white',
      // height: height,
      width: width,
      alignItems: 'center',
      justifyContent: 'flex-start',
   },
   lottieViewStyle: {
      width: width,
      position: 'absolute',
      top: 10,
      justifyContent: 'center',
      alignItems: 'center',
      //   marginLeft: width * 0.75,
   },
   lottieStyle: {
      width: width,
      height: 200,
      //   backgroundColor: '#eee',
   },
   curveViewStyle: {
      marginTop: 100,
      //   backgroundColor: 'rgba(255, 255, 255, 1)',
      borderTopLeftRadius: height * 2,
      borderTopRightRadius: height * 2,
      // height: height - height / 6,
      width: width * 2.5,
      overflow: 'hidden',
   },
   listViewStyle: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
   },
   flatlistViewStyle: {
      width: width,
      marginLeft: 7.5,
   },
   headerViewStyle: {
      justifyContent: 'center',
      alignItems: 'center',
   },
   unlimitedAccessStyle: {
      fontSize: 32,
      fontWeight: '600',
      paddingVertical: 7.5,
      color: textColor,
   },
   startPremiumTextStyle: {
      fontSize: 18,
      fontWeight: '500',
      paddingVertical: 3.5,
      color: textColor,
   },
   premiumPriceTextStyle: {
      fontSize: 14,
      fontWeight: '400',
      paddingVertical: 7.5,
      color: textColor,
   },
   vesionViewStyle: {
      justifyContent: 'center',
      paddingLeft: width / 10,
      marginTop: 30,
   },
   versionTextStyle: {
      fontSize: 16,
      color: textColor,
      fontWeight: '600',
   },
   pressableStyle: {
      backgroundColor: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      marginTop: 30,
      width: width - 80,
      borderRadius: 30,
   },
   seprateLineStyle: {
      height: 2,
      width: '15%',
      backgroundColor: '#fff',
      marginTop: 20,
      marginBottom: 20,
   },
   buttonTextStyle: {
      fontSize: 14,
      fontWeight: '400',
      color: 'rgb(128, 55, 184)',
   },
   descriptionViewStyle: {
      justifyContent: 'center',
      width: width,
      paddingHorizontal: 15,
      paddingVertical: 0,
   },
   descriptionTextStyle: {
      fontSize: 12,
      color: textColor,
      fontWeight: '400',
   },
   renderViewStyle: {
      height: 35,
      paddingLeft: 12,
      justifyContent: 'flex-start',
      flexDirection: 'row',
   },
   renderTextStyle: {
      color: textColor,
      fontWeight: '600',
      fontSize: 14,
   },
});
