import { useState } from 'react';
import { Text, View, Colors } from 'react-native-ui-lib';
import { Video } from 'expo-av';
import { inject, observer } from 'mobx-react';
import {
   Modal,
   Image,
   ActivityIndicator,
} from 'react-native';
import { moderateScale } from 'helpers/scale';

import AnimatedView from 'components/AnimatedView';
import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import DoneDialogCombinedData from './DoneDialogCombinedData';
import UploadProgress from 'components/HomeHeaderWithSearch/UploadProgress';
import DoneDialogDismissButton from './DoneDialogDismissButton';


function DoneDialogInModal(props) {

const {noVidAndNoPic} = props;
   return (
      <View
         style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
         }}>
             
         <View
            style={{
               width: '90%',
               // overflow: 'hidden',
               marginBottom: 'auto',
               marginTop: 'auto',
               borderRadius: 10,
            }}>
                
            <View
               style={{
                  maxWidth: moderateScale(285),
                  minWidth: moderateScale(285),
                  backgroundColor: Colors.rgba(224, 91, 60, 1),
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderRadius: 10,
                  zIndex: 2,
                  paddingVertical: 8,
                  marginTop: 40,
               }}>

{noVidAndNoPic && (
            <View
               style={{
                  width: width - 116,
                  height: 130,
                  position: 'absolute',
                  top: -200,
                  left: 0,
                  marginTop: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}
               center>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     // width: 200,
                     height: height / 5,
                     zIndex: 99999,
                     top: 25,
                     right: 0,
                  }}
                  source={require('../lotties/rocket-lunch.json')}
               />
            </View>
         )}
               {/* <Text>{JSON.stringify(props.picture)}zz</Text> */}
            
               <View
                  style={{
                     alignItems: 'center',
                     justifyContent: 'center',
                     width: '100%',
                     marginTop: -20,
                  }}>

        
                  {props.picture?.uri ? (
                     <Image
                        source={{
                           uri: props.picture?.uri,
                        }} // preview={picture?.preview}
                        style={{
                           height: 80,
                           width: 80,
                           borderRadius: 5,
                           backgroundColor: '#fff',
                           // position: 'absolute',
                           marginTop: -40,
                           top: 10,
                        }}
                     />
                  ) : (
                     <View
                        style={{
                           height: 70,
                           width: 80,
                           borderRadius: 5,
                           // backgroundColor: '#fff',
                           // position: 'absolute',
                           marginTop: -40,
                           top: 10,
                        }}
                     />
                  )}

                  {props.capturedVideo?.uri?.length > 10 && (
                     <Video
                        source={{
                           uri:
                              (props.capturedVideo &&
                                 props.capturedVideo?.uri) ||
                              '',
                        }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={{
                           height: 80,
                           width: 80,
                           borderRadius: 5,
                           backgroundColor: '#fff',
                           // position: 'absolute',
                           marginTop: -40,
                           top: 10,
                        }}
                     />
                  )}
                  {props.capturedVideo?.uri?.length > 10 || props.picture?.uri?.length > 10 && <UploadProgress center />}
               </View>
               <Text
                  marginT-16
                  B14
                  contentW
                  marginH-24 // uppercase
                  center
                  style={{
                     letterSpacing: 0,
                  }}>
                  Nice! {props.multiplier} x {props.activityName}!{' '}
               </Text>

               <AnimatedView>
                  <Text
                     style={{
                        fontSize: 40,
                        fontWeight: '900',
                        color: '#fff' || Colors.buttonLink,
                        alignSelf: 'center',
                        paddingTop: 0,
                        paddingBottom: 16,
                     }}>
                     +{props.pointsToAdd}
                  </Text>
               </AnimatedView>
            </View>

            {props.completionsTeamsAndChallenges?.length > 0 ? (
               <DoneDialogCombinedData />
            ) : (
               <ActivityIndicator color={'#333'} />
            )}

            <DoneDialogDismissButton />
         </View>

      </View>
   );
}

const DoneDialog = (props: any) => {
   const [showDismiss, setShowDismiss] = useState(true);
   const { smashStore, teamsStore,challengesStore } = props;

   // const [multiplier, setMultiplier] = useState(smashStore.multiplier);
   const {
      completionsTeamsAndChallenges,
      showRocket,
      capturedPicture,
      capturedVideo,
      activtyWeAreSmashing,
      setMasterIdsToSmash,
      setMasterIdsToSmashFromTeam,
      multiplier


   } = smashStore;


   const picture = capturedPicture
   const activityName = activtyWeAreSmashing?.text || false;
   const visible = completionsTeamsAndChallenges?.length > 0 && !showRocket ? true : false;


   const value = activtyWeAreSmashing ? smashStore.returnActionPointsValue(activtyWeAreSmashing) : 0;
   let pointsToAdd = parseInt(value) * parseInt(multiplier);


   const dismiss = () => {

      smashStore.setCompletionsTeamsAndChallenges(false);
      smashStore.setSmashing(false);
      // challengesStore.fetchMyGoals();
      smashStore.setUploadProgress(0)
      // smashStore.smashEffects();
      smashStore.setSelectMultiplier(false)
      smashStore.setCompletion(false);
      setMasterIdsToSmash(false);
      smashStore.multiplier = 1;

      setTimeout(() => {
         smashStore.checkForNewEntriesInFeed();
         smashStore.setLoadingFeed(false);
      }, 3000);


      smashStore.completionTeams = [];
   };

   const hasVid = capturedVideo?.uri?.length > 10;
   const hasPic = picture?.uri?.length > 10;

   const noVidAndNoPic = !hasVid && !hasPic;
   console.log('render donedialog');
   return (
      <Modal
         style={{ borderRadius: 10 }}
         transparent
         animationType="fade"
         visible={visible}
         // onRequestClose={dismiss}
         onDismiss={dismiss}>

         <DoneDialogInModal

noVidAndNoPic={noVidAndNoPic}
            showDismiss={showDismiss}
            completionsTeamsAndChallenges={completionsTeamsAndChallenges}
            multiplier={multiplier}
            pointsToAdd={pointsToAdd}
            picture={picture}
            capturedVideo={capturedVideo}
            activityName={activityName}
            dismiss={dismiss}
         />

      </Modal>
   );
};

export default inject('smashStore', 'teamsStore','challengesStore')(observer(DoneDialog));
