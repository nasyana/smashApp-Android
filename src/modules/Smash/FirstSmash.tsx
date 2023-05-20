import { View, Text,TouchableOpacity, Colors } from 'react-native-ui-lib'
import React, {useEffect} from 'react'
import {width, height} from '../../config/scaleAccordingToDevice';
import AnimatedView from '../../components/AnimatedView';
import LottieAnimation from 'components/LottieAnimation';
import { Platform } from 'react-native';
import { inject, observer } from 'mobx-react';
const FirstSmash = ({smashStore}) => {


const {currentUserHasPointsEver = true} = smashStore;
    const [read, setRead] = React.useState(currentUserHasPointsEver);

    // useEffect(() => {
    
    //     setTimeout(() => {
    //         setLoading(false)
    //     }, 5000);
    
    //   return () => {
        
    //   }
    // }, [])
      const seen = () => {
        setRead(true)
      }

    // if(currentUser.allPointsEver > 0 || !loading){return null}

    if(read){return null}
    const isAndroid = Platform.OS === 'android';
    const reduceBy = 64
  return (
    // <AnimatedView>
    <View  centerH  style={{ paddingTop: height / 8, position: 'absolute', height: isAndroid ? height + 40 : height, width: width, left:0, top: 0, backgroundColor: 'rgba(0,0,0,0.7)'}}>
       <LottieAnimation
            autoPlay
            loop={false}
            style={{
               height: 120,
               zIndex: 0,
               top: 0,
               left: 0,
            }}
            source={require('lotties/info.json')}
         />
         <AnimatedView padding-32 paddingB-48 style={{backgroundColor: '#fff',borderRadius: 16,}}>
         <Text R16 marginB-16 secondaryContent>Each habit you smash gets you points...</Text>
        <Text R18 marginB-8>1. Select the "Habit/Activity"</Text>
        <Text R18 marginB-8>2. Take a Picture</Text>
        <Text R18 marginB-8>3. Press "Add points!"</Text>
        </AnimatedView>
        <TouchableOpacity
                  onPress={seen}
                  style={{
                     alignItems: 'center',
                  }}>
                  <View
                     style={{
                  
                        backgroundColor: Colors.smashPink,
                        borderRadius: 45,
                        alignItems: 'center',
                        paddingVertical: 15,
                        zIndex: 9999,
                        marginTop: -30,
                        paddingHorizontal: 24
                     }}>
                     <View row>
                     <Text B14 white>Got It, Let's Go!</Text></View>
                  </View>
               </TouchableOpacity>
    </View>
    // </AnimatedView>
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(FirstSmash));