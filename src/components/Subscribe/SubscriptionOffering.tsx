import React, { useEffect, useState } from 'react';

import {
    Assets,
    TabController,
    Colors,
    View,
    Text,
    Button,
    TabControllerItemProps,
} from 'react-native-ui-lib';
import * as Sentry from 'sentry-expo';

import { ActivityIndicator, Alert, FlatList, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';

import { height, width } from 'config/scaleAccordingToDevice';
const Options = [
    'Join Unlimited Challenges',
    'Create Teams',
    'Advanced Insights',
    'Get Notified If Friends Overtake you',
    'Daily Motivation',
    'Set & Track Weekly Goals',
    'Follow 30 Players',
 
 ];
const APIKeys = {
    apple: "appl_PskkcvuGKwqjUPRrQbTYwNIVhrw",
    google: "goog_mZxJOGFWmKxarTbaYVhkjTiHXmE",
};
import Purchases from 'react-native-purchases';
import ButtonLinear from 'components/ButtonLinear';
import { AntDesign } from '@expo/vector-icons';

const Containt = {
    access: 'Premium Access!',
    premium: 'Advanced Insights + Features',
    price: '$1 monthly!',
    version: 'Or continue with a limited version',
    description:
       'Subscription with a free trial period will automatically renew to a paid subscription unless auto-renewal is turned off. Payment will be changed to iTunes Account at confirmation of purchase. Subscription automatically nenews unless auto.',
 };
const exampleProds = [{
    currencyCode: "DKKx",
    description: "sub one description",
    discounts: [],
    identifier: "coolsub1",
    introPrice: null,
    price: 5,
    priceString: "5,00 kr.",
    productCategory: "SUBSCRIPTION",
    productType: "NON_CONSUMABLE",
    title: "sub one test",
}];

const isAndroid = Platform.OS === 'android';

const androidProductId = 'premium';
const iosProductId = 'premium';

const selectedProductId = isAndroid ? androidProductId : iosProductId;
const textColor = '#fff';

export default function App(props) {

    const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
   const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [cInfo, setCustomerInfo] = useState(false)

    const [loading, setLoading] = useState(true);

    const {smashStore} = props;

    const {settings = {}, isPremiumMember = false, currentUser, customerInfo} = smashStore;

    const {subscriptionBullets = []} = settings;

    const hasAlreadyGotSubscription = isPremiumMember || currentUser.premium || cInfo?.allPurchasedProductIdentifiers?.includes(selectedProductId)
    // const fetchData = async () => {
    //     const offerings = await Purchases.getOfferings();
    //     setCurrentOffering(offerings.current);
    // };

    // const awaitPurchases = async () => {

    //     if (Platform.OS == "android") {
    //         await Purchases.configure({ apiKey: (APIKeys.google) });
    //     } else {
    //         await Purchases.configure({ apiKey: APIKeys.apple });
    //     }

    //     fetchData()

    // }
const   renderItem = ({ item, index }) => {
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


 const showError = (e) => {
   console.warn(e);
   
      Alert.alert('Oops there was a problem with your purchase.',e)
 }

 const dismiss = () => {
    props.challengesStore.subscribeModal = false;
 };

    const purchaseSmashAppMonthlyAdvanced = async () => {


      
      setPurchaseLoading(true);


        try {
        const successCustomerObject = await Purchases?.purchaseProduct(selectedProductId) || {};
        const cData = await smashStore.getCustomerData();

        const bool = successCustomerObject?.allPurchasedProductIdentifiers?.includes(selectedProductId)
        setCustomerInfo({...successCustomerObject, premium: bool}); 

     
      //   if(successCustomerObject?.firstSeen){
      //       setCustomerInfo({...successCustomerObject, premium: bool});

      //    }else{


      //       Alert.alert('Oops!', 'Cannot purchase product. Please try again later..')
      //    }
        
            /// add uid to revenuecat subscriber.
            setPurchaseLoading(false);
            props.challengesStore.subscribeModal = false;
            // dismiss();
            // access latest customerInfo
        } catch (e) {
         // alert(JSON.stringify(e))
         Alert.alert('Oops!', 'Cannot purchase product at the moment. Please try again later..')
         // Sentry?.Native?.captureException(e);
         if(e?.code == 'PRODUCT_ALREADY_PURCHASED'){
            
            
            showError('You have already purchased this product.')
         }

         if(e?.code == 'NETWORK_ERROR'){
            
            showError('There was an network error. Please check your internet connection and try again once fixed.')
         
         }

         
         // if (!e?.userCancelled) {
         //    showError(e?.code);
         //  }

         setPurchaseLoading(false);
      
            // Error fetching customer info
            // setCustomerInfo({error: true})
        }


    }



  
    useEffect(() => {

  
    
        const main = async () => {
    
         setLoading(true)
            // getCustomerInfo();
            try{


          
          
               
            // Purchases.setDebugLogsEnabled(true);

            if (Platform.OS == "android") {
                await Purchases.configure({ apiKey: (APIKeys.google) });
            } else {
                await Purchases.configure({ apiKey: APIKeys.apple });
            }
 
            const customerInfo = await Purchases.getCustomerInfo();
            
            setCustomerInfo({...customerInfo});
            // setCustomerInfo(false)


            const prods = await Purchases.getProducts(isAndroid ? [androidProductId] : [iosProductId]);
            
            setCurrentOffering(prods);
            // alert('1')
            // const offerings = await Purchases.getOfferings();

         
            // setCurrentOffering(prods)

            setLoading(false)
                // const offerings = await Purchases.getOfferings();
           
                // if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                  // Display packages for sale  

                    // setCurrentOffering({tiko: true});
                // }
        
            // setCurrentOffering(prods);
            // alert(JSON.stringify(prods))

        }catch(e){

         setLoading(false)
         setCustomerInfo(false)
         setCurrentOffering(false);
         Sentry.Native.captureException(e);
            console.log(e);
        }
    }

        main();
    }, []);


    const finalBullets = subscriptionBullets?.sort((b,a)=> a.sort - b.sort).map((b) => b?.text) || Options;

    // return <View style={{padding: 24,  }} center><ScrollView>
    //      {hasAlreadyGotSubscription && <Text white>Congrats! You have</Text>} 
    //      <View padding-44><Text style={{maxWidth: 350}}>debug: {JSON.stringify(cInfo, null, 7)}</Text></View><Text>pricing: {JSON.stringify(currentOffering, null, 7)}</Text>
    // <ButtonLinear color={'#fff'} tile={'buy'} onPress={purchaseSmashAppMonthlyAdvanced} /></ScrollView></View>
// const hasAdvancedAccess = typeof cInfo?.entitlements?.active?.advanced !== "undefined";
if(purchaseLoading){

   return <View flex style={{padding: 24, height: height, }} center >


         <Text M14 white>Processing...</Text>
      <ActivityIndicator color={'white'} size="large"  />

                              </View>
}
if(loading || cInfo === false || currentOffering === null){

   return <View flex center flex style={{height: height,padding: 24}}>
      <ActivityIndicator color={'white'} size="large"  />
   {/* {true && <View padding-24 >
      <ButtonLinear

                                 title="Go Back"
                                 onPress={dismiss}
                                 bordered
                              
                           
                                 color={'#fff'}
                              /></View>} */}
                              </View>
}


    return <View><View style={{ marginTop: height / 8 }}>
    <View style={styles.headerViewStyle}>
       <Text style={styles.unlimitedAccessStyle}>
        {hasAlreadyGotSubscription && <Text white>Congrats! You have</Text>} {Containt.access}
       </Text>
       {/* <Text>{cInfo.entitlements.active.advanced} {hasAdvancedAccess && 'hasAdvancedAccess'}</Text> */}
       <Text style={styles.startPremiumTextStyle} color6D>
          {Containt.premium}
       </Text>
    <Text style={[styles.premiumPriceTextStyle, {}]}>
          {currentOffering?.[0]?.priceString || '$0.99'} monthly {' '}
          <Text
             style={{ textDecorationLine: 'line-through' }}>
             $3.99 monthly
          </Text>
       </Text>
    
       <View style={styles.seprateLineStyle} />
    </View>
    {/* <ButtonLinear color={'#fff'} tile={'buy'} onPress={purchaseSmashAppMonthlyAdvanced} /> */}
 </View>
 <View style={styles.listViewStyle}>
                        <View style={styles.flatlistViewStyle}>
                           <FlatList
                              data={finalBullets || Options}
                              scrollEnabled={false}
                              renderItem={(items) => renderItem(items)}
                              keyExtractor={(item, index) => 'key' + index}
                              contentContainerStyle={{ paddingHorizontal: 32 }}
                           />
                             {!hasAlreadyGotSubscription &&<Pressable
                              style={styles.vesionViewStyle}
                              onPress={dismiss}>
                            <Text style={styles.versionTextStyle}>
                                 {Containt.version}
                              </Text>
                           </Pressable>}
                         
                           <View style={{ paddingVertical: 20, marginTop: 20 }}>
                              <View
                                 style={{
                                    backgroundColor: '#fff',
                                    width: width,
                                    left: -5,
                                    height: 200,
                                    position: 'absolute',
                                    transform: [{ rotate: '0deg' }],
                                    borderRadius: 45,
                                 }}
                              />
                                {!hasAlreadyGotSubscription && <ButtonLinear
                                 title="Yes! Let's Go"
                                 onPress={purchaseSmashAppMonthlyAdvanced}
                              />}


{hasAlreadyGotSubscription && <ButtonLinear
                                 title="Already A Premium User!"
                                 onPress={dismiss}
                               
                              />}

{!hasAlreadyGotSubscription && <ButtonLinear
                                 title="No Thanks!"
                                 onPress={dismiss}
                                 style={{marginTop: 8}}
                                 bordered
                              />}

                              
                           
                             <Text center R12 marginT-8>Terms & Conditions Below</Text>
                             {/* {customerInfo && <View padding-16 style={{backgroundColor: '#fff'}}><Text>{JSON.stringify(customerInfo)}</Text></View>} */}
   {/* <View flex style={{backgroundColor: '#fff', paddingHorizontal: 24}}>
                             <Text center marginT-16>{JSON.stringify(cInfo)}</Text>
                             </View> */}
                           </View>
                        
                        </View>
                        
                     </View>
                     </View>

}


const styles = StyleSheet.create({
    container: {
       flex: 1,
       height,
       width,
    },
    mainContainer: {
       flex: 1,
       //   backgroundColor: 'white',
       height: height,
       width: width,
       alignItems: 'center',
       justifyContent: 'flex-start',
    },
    lottieViewStyle: {
       width: width,
       position: 'absolute',
       top: 20,
       justifyContent: 'center',
       alignItems: 'center',
       //   marginLeft: width * 0.75,
    },
    lottieStyle: {
       width: width,
       height: 250,
       //   backgroundColor: '#eee',
    },
    curveViewStyle: {
       marginTop: height / 6,
       //   backgroundColor: 'rgba(255, 255, 255, 1)',
       borderTopLeftRadius: height * 2,
       borderTopRightRadius: height * 2,
       height: height - height / 6,
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
       maxWidth: width - 32
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
       marginTop: 10,
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
       paddingVertical: 15,
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
 