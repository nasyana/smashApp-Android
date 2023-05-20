// @flow
import autobind from 'autobind-decorator';
import * as React from 'react';
import {
   StyleSheet,
   View,
   Dimensions,
   TouchableOpacity,
   Modal,
   Platform,
   Text,
   Image,
} from 'react-native';
import {Camera} from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {Feather as Icon} from '@expo/vector-icons';
import {inject, observer} from 'mobx-react';

import * as Haptics from 'expo-haptics';
import { AnimatedView } from '../../components/AnimatedView';

import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LottieAnimation from 'components/LottieAnimation';
type ShareState = {
   hasCameraPermission: boolean | null;
   type: number;
   flashMode: number;
   loading: boolean;
   ratio: string | void;
};
@inject('smashStore')
@observer
export default class RecordVideoAndPhoto extends React.Component {
   // $FlowFixMe
   camera = React.createRef();

   state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
      loading: false,
      ratio: undefined,
      video: null,
      picture: null,
      recording: false,
      isVideo: false,
      cameraReady: false,
      cameraAnimation: true,
      asset: false,
      videoUrl: 'nada',
      recordingProgress: 0,
      hasAudioPermission: null,
      cameraStatus: false,
   };

   //   this._getLocationAsync = this._getLocationAsync.bind(this);

   @autobind
   async getAudioPermission() {
      const { status } = await Permissions.askAsync(
         Permissions.AUDIO_RECORDING,
      );

      // try {
      //     console.log('Requesting permissions..');
      //     await Audio.requestPermissionsAsync();
      //     await Audio.setAudioModeAsync({
      //       allowsRecordingIOS: true,
      //       playsInSilentModeIOS: true,
      //     });
      //     console.log('Starting recording..');
      //     const recording = new Audio.Recording();
      //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      //     await recording.startAsync();
      //     setRecording(recording);
      //     console.log('Recording started');
      //   } catch (err) {
      //     console.error('Failed to start recording', err);
      //   }

      // this.setState({
      //     hasAudioPermission: status === "granted"
      // });
   }

   @autobind
   async getCameraPermissions() {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === 'granted') {
         //   setHasPermission(true);
      }
      this.setState({ cameraStatus: status });
      console.log('camera status', status);
   }

   async componentDidMount(): Promise<void> {
      // this.getCameraPermissions()
      this.props.smashStore.setHideBottomNav(true);
      const { status } = await Permissions.askAsync(
         Permissions.CAMERA,
         Permissions.MEDIA_LIBRARY_WRITE_ONLY,
         Permissions.MEDIA_LIBRARY,
      );

      await Camera.requestPermissionsAsync();

      if (Platform.OS === 'android') {
         this.getAudioPermission();
      }
      this.setState({
         hasCameraPermission: status === 'granted',
      });
      // this._getLocationAsync();

      setTimeout(() => {
         this.setState({ cameraAnimation: false });
      }, 1000);
   }

   componentWillUnmount() {
      this.props.smashStore.setHideBottomNav(false);
   }

   _getLocationAsync = async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
         this.setState({
            locationResult: 'Permission to access location was denied',
         });
      } else {
         this.setState({ hasLocationPermissions: true });
      }

      const location = await Location.getCurrentPositionAsync({});
      this.setState({ locationResult: JSON.stringify(location) });
      // Center the map on the location we just fetched.
      this.setState({
         mapRegion: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
         },
         location,
      });
   };

   onCameraReady = async () => {
      this.setState({ cameraReady: true });
      if (Platform.OS === 'android') {
         const DESIRED_RATIO = '1:1';
         const ratios = await this.camera.getSupportedRatiosAsync();
         const ratio =
            ratios.find((r) => r === DESIRED_RATIO) ||
            ratios[ratios.length - 1];
         this.setState({ ratio });
      }
   };

   @autobind
   toggle() {
      this.setState({ loading: false });
   }

   @autobind
   toggleFlash() {
      const { flashMode } = this.state;
      const { on, off } = Camera.Constants.FlashMode;
      this.setState({ flashMode: flashMode === on ? off : on });
   }

   @autobind
   toggleCamera() {
      const { type } = this.state;
      const { front, back } = Camera.Constants.Type;
      this.setState({ type: type === back ? front : back });
   }

   @autobind
   async onPressLibrary() {
      const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: Platform.OS === 'ios' ? false : false,
         aspect: [4, 3],
         durationLimit: 60,
         mediaTypes:
            Platform.OS === 'ios'
               ? ImagePicker.MediaTypeOptions.All
               : ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.cancelled) {
         if (result.type == 'video') {
            const { status } = await Permissions.askAsync(
               Permissions.MEDIA_LIBRARY,
            );
            const asset = await MediaLibrary.createAssetAsync(result.uri);
            this.props.smashStore.setCameraVideo({
               asset: asset,
               video: result,
            });
            this.props.smashStore.setCameraModal(false);
            this.props.smashStore.setSmashModal(true);
         } else {
            this.props.smashStore.setCameraPicture({ ...result, place: true });
            this.props.smashStore.setCameraModal(false);
            this.props.smashStore.setSmashModal(true);
         }
      }
   }

   @autobind
   async onPressLibraryVideos() {
      // alert('Choose Media')
      const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         // aspect: [4, 3],
         durationLimit: 60,
         mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.cancelled) {
         if (result.type == 'video') {
            const { status } = await Permissions.askAsync(
               Permissions.MEDIA_LIBRARY,
            );
            const asset = await MediaLibrary.createAssetAsync(result.uri);
            this.props.smashStore.setCameraVideo({
               asset: asset,
               video: result,
            });
            this.props.smashStore.setCameraModal(false);
            this.props.smashStore.setSmashModal(true);
         } else {
            this.props.smashStore.setCameraPicture({ ...result, place: true });
            this.props.smashStore.setCameraModal(false);
            this.props.smashStore.setSmashModal(true);
         }
      }
   }

   @autobind
   async snap(): Promise<void> {
      // this.setState({ recording: false });

      const { smashStore } = this.props;

      try {
         const picture = await this.camera.takePictureAsync({
            base64: false,
            skipProcessing: Platform.OS === 'android' ? false : true,
         });
         this.setState({ loading: true, picture });

         setTimeout(() => {
            this.setState({ loading: false });
            this.props.smashStore.setCameraModal(false);
            this.props.smashStore.setSmashModal(true);
            this.props.smashStore.setCameraPicture({ ...picture });
         }, 500);

         //

         // this.props.smashStore.setCameraVideo(video);
      } catch (e) {
         this.setState({ loading: false });
         // eslint-disable-next-line no-alert
         // alert(serializeException(e));
      }
   }

   // //////////////Video Stuff
   @autobind
   async _StartRecord() {
      const { status } = await Permissions.askAsync(
         Permissions.CAMERA,
         Permissions.MEDIA_LIBRARY_WRITE_ONLY,
         Permissions.MEDIA_LIBRARY,
      );

      this.getCameraPermissions();
      let self = this;
      const { recording } = this.state;
      this.timerId = setInterval(() => {
         this.setState({ recordingProgress: this.state.recordingProgress + 5 });
      }, 100);

      // alert('0')
      if (this.camera) {
         // alert('1')
         this.setState({ recording: true }, async () => {
            // alert('2')
            this.camera.recordAsync({ mute: true }).then((video) => {
               // alert('yes we try to setState with video')

               self.setState({ video });
            });
         });
      }
   }

   @autobind
   async _StopRecord() {
      //    alert("stop record");

      console.log('state from stoprecord', this.state);
      setTimeout(() => {
         clearInterval(this.timerId);
         console.log('clear interval');
      }, 3000);

      this.setState({ recordingProgress: 0 });
      const { recording, video } = this.state;

      if (this.camera) {
         this.setState({ recording: false }, async () => {
            // alert("Stopping we get here")
            this.camera.stopRecording();

            // alert("Stopping we get here 2")
            setTimeout(() => {
               // alert("Stopping we get here3")
               this._saveVideo();
            }, 500);

            //     const asset = await MediaLibrary.createAssetAsync(video.uri);
            // this.props.smashStore.setCameraVideo(asset);
            // this.setState({asset});
            // alert("Stopped");

            // this.props.smashStore.setCameraModal(false);
            // this.props.smashStore.setSmashModal(true);
         });
      }
   }

   @autobind
   async _saveVideo() {
      // alert("Saving Video")
      // alert("save video");
      const { video } = this.state;

      // alert("video.uri", this.state.video.uri);

      if (video) {
         const { status } = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY,
         );
         //   alert(video?.uri)

         const asset = await MediaLibrary.createAssetAsync(video?.uri);
         // console.warn('asset',asset);
         this.setState({ asset });
         console.log('Saving Video Done');

         this.props.smashStore.setCameraVideo({ asset: asset, video: video });

         this.props.smashStore.setCameraModal(false);

         this.props.smashStore.setSmashModal(true);

         this.setState({ uploadingVideo: true });
         // const videoUrl = await  ImageUpload.upload(video)
         this.setState({ videoUrl, uploadingVideo: false });
      }
   }

   toggleVideoPicture() {
      this.setState({ isVideo: !this.state.isVideo });
   }

   render(): React.Node {
      const { onCameraReady } = this;
      const { navigation } = this.props;
      const {
         hasCameraPermission,
         type,
         flashMode,
         loading,
         ratio,
         recording,
         video,
      } = this.state;
      if (this.props.smashStore.smashModal) {
         return null;
      }
      // if (this.props.smashStore.smashModal && !this.props.smashStore.cameraModal) { return null }
      // console.warn('navigation',navigation.state.params.postType)
      const screenHeight = Dimensions.get('window').height;
      const { height, width } = Dimensions.get('window');
      const { smashStore } = this.props;
      const { picture } = smashStore;
      const imageStyle = {
         height: height,
         width: width,
         position: 'absolute',
         backgroundColor: '#333',
         top: 0,
         left: 0,
         zIndex: -7,
      };

      // // console.log("picture", picture);
      let cameraHeight = height;
      if (ratio && Platform.OS === 'ios') {
         const [w, h] = ratio.split(':').map((n) => parseInt(n, 10));
         cameraHeight *= h / w;
      }
      // if (hasCameraPermission === null) {
      //     return (
      //         <View style={styles.refreshContainer}>
      //             <RefreshIndicator refreshing />
      //         </View>
      //     );
      // } else if (hasCameraPermission === false) {
      //     return <EnableCameraPermission />;
      // }

      if (
         !this.props.smashStore.smashModal &&
         this.props.smashStore.cameraModal
      ) {
         return (
            <View
               style={{
                  position: 'absolute',
                  backgroundColor: '#fff',
                  width: width,
                  zIndex: 99990000000,
                  top: 0,
               }}>
               <View
                  style={{
                     zIndex: 99,
                     backgroundColor: 'transparent',
                     height: screenHeight + 50,
                  }}>
                  {this.state.picture?.uri && (
                     <Image
                        style={{ ...imageStyle }}
                        source={{ uri: this.state?.picture?.uri }}
                     />
                  )}

                  {!this.state.picture?.uri && (
                     <Camera
                        useCamera2Api
                        ref={(camera) => {
                           this.camera = camera;
                        }}
                        style={{ width, height: cameraHeight }}
                        {...{ type, flashMode, ratio }}
                        onCameraReady={this.onCameraReady}>
                        <TouchableOpacity
                           onPress={() => {
                              Haptics.impactAsync(
                                 Haptics.ImpactFeedbackStyle.Light,
                              );
                              this.props.smashStore.setCameraModal(false);
                              this.props.smashStore.setCameraVideo(false);
                           }}
                           style={{
                              position: 'absolute',
                              right: 30,
                              top: 40,
                              zIndex: 9999,
                           }}>
                           <Text style={{ color: '#ccc' }}>Cancel</Text>
                        </TouchableOpacity>

                        <View style={styles.cameraBtns}>
                           <View
                              style={{ marginTop: 80, flexDirection: 'row' }}>
                              <TouchableOpacity
                                 onPress={this.onPressLibrary}
                                 style={{ marginRight: 10 }}>
                                 <View>
                                    <Icon
                                       name="image"
                                       family="Feather"
                                       style={{ color: '#fff', fontSize: 25 }}
                                    />
                                 </View>
                              </TouchableOpacity>
                              {Platform.OS === 'android' && (
                                 <TouchableOpacity
                                    onPress={this.onPressLibraryVideos}>
                                    <View>
                                       <Icon
                                          name="video"
                                          family="Feather"
                                          style={{
                                             color: '#fff',
                                             fontSize: 25,
                                          }}
                                       />
                                    </View>
                                 </TouchableOpacity>
                              )}
                           </View>
                           {this.state.recording && (
                              <AnimatedView
                                 straight
                                 style={{
                                    position: 'absolute',
                                    top: 18,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                 }}
                                 delay={0}
                                 duration={300}>
                                 <AnimatedCircularProgress
                                    size={115}
                                    width={20}
                                    arcSweepAngle={360}
                                    rotation={80}
                                    lineCap="round"
                                    prefill={0}
                                    duration={700}
                                    fill={this.state.recordingProgress || 0}
                                    tintColor={'red'}
                                    backgroundColor={'#ccc'}
                                 />
                              </AnimatedView>
                           )}
                           <TouchableOpacity
                              onPress={() => this.snap()}
                              onPressOut={() => this._StopRecord()}
                              onLongPress={() => this._StartRecord()}>
                              <View style={styles.btn} />
                           </TouchableOpacity>
                           <TouchableOpacity
                              onPress={this.toggleCamera}
                              style={{ marginTop: 80 }}>
                              <View>
                                 <Icon
                                    name="rotate-ccw"
                                    style={styles.rotate}
                                    size={25}
                                 />
                              </View>
                           </TouchableOpacity>
                        </View>
                     </Camera>
                  )}

                  {this.state.cameraAnimation && (
                     <AnimatedView
                        straight
                        style={{
                           backgroundColor: '#fff',
                           width: '100%',
                           height: screenHeight + 70,
                           width: width,
                           position: 'absolute',
                           alignItems: 'center',
                           justifyContent: 'center',
                           top: -70,
                           left: 0,
                           zIndex: 9999999999,
                        }}>
                        <LottieAnimation
                           ref={(animation) => {
                              this.animation = animation;
                           }}
                           autoPlay
                           loop
                           style={{
                              width: 150,
                              height: 150,
                              zIndex: 99999,
                              backgroundColor: 'transparent',
                           }}
                           source={require('../../lotties/rocket.json')}
                        />
                        <Text style={{ color: '#333' }}>
                           Nice! Take Photo/Video Proof
                        </Text>
                     </AnimatedView>
                  )}
                  <Modal
                     transparent
                     visible={loading}
                     onRequestClose={this.toggle}>
                     <View style={styles.modal}>
                        <LottieAnimation
                           ref={(animation) => {
                              this.animation = animation;
                           }}
                           autoPlay
                           loop
                           style={{
                              width: 150,
                              height: 150,
                              zIndex: 99999,
                              backgroundColor: 'transparent',
                           }}
                           source={require('../../components/lottie/new/loader.json')}
                        />
                        {/* <SpinningIndicator /> */}
                     </View>
                  </Modal>
               </View>
            </View>
         );
      } else {
         return null;
      }
   }
}

const {width, height} = Dimensions.get('window');
const ratio = width / height;
const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   refreshContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   cameraBtns: {
      position: 'absolute',
      bottom: 10,
      width,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 40,
      zIndex: 9999999,
      borderWidth: 0,
      borderColor: '#fff',
   },
   rotate: {
      backgroundColor: 'transparent',
      color: 'white',
   },
   footer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   btn: {
      height: ratio < 0.75 ? 100 : 60,
      width: ratio < 0.75 ? 100 : 60,
      borderRadius: ratio < 0.75 ? 50 : 30,
      borderWidth: ratio < 0.75 ? 20 : 10,
      borderColor: 'rgba(255,255,255,0.7)',
      marginTop: 20,
   },
   modal: {
      flex: 1,
      // backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: 'center',
      alignItems: 'center',
   },
});
