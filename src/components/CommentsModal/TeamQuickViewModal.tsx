import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import {
   Keyboard,
   KeyboardAvoidingView,
   StyleSheet,
   Image,
   TextInput,
   TouchableOpacity,
   FlatList,
   Platform,
} from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
import { View, Text } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { commentListener, send } from './commentService';
import CommentItem from './CommentItem';
import { inject, observer } from 'mobx-react';
import Firebase from 'config/Firebase';
import ImageUpload from 'helpers/ImageUpload';
import firebase from 'firebase';
import * as Haptics from 'expo-haptics';
import { sendNotification } from 'services/NotificationsService';
import { NotificationType } from 'constants/Type';
import SmartImage from 'components/SmartImage/SmartImage';
// import CustomBackdrop from './CustomBackdrop';
import BottomSheet, {
   BottomSheetTextInput,
   BottomSheetFlatList,
   BottomSheetBackdrop,
   BottomSheetView,
   BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import AnimatedView from 'components/AnimatedView';
import CoolInput from './CoolInput';
import TeamToday from 'modules/TeamArena/TeamToday';
import TeamWeek from 'modules/TeamArena/TeamWeek';
import MeTodayInTeam from 'modules/DailyDetail/MeTodayInTeam';
import TeamPieChart from 'components/TeamPieChart';
import Recent from 'modules/Overview/Recent';
import SelectChallengesInCreateGoal from 'components/SelectChallengesInCreateGoal'
// import TodaysTargetsList from 'modules/Home/TodaysTargetsList';
export const addComment = (postId, createdBy, text) => {
   //body
   const comment = {
      text,
      postId,
      createdBy,
      timestamp: Date.now(),
   };
   // alert('comment created');
   //firebase stuff
};

const data = [
   {
      text: 'awesome!',
      id: 'asdsa',
      url: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
   },
   {
      text: 'awesome!',
      id: 'asdssa',
      url: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
   },
];

const TeamQuickViewModal = ({ smashStore, notificatonStore }) => {
   const bottomSheetRef = useRef<BottomSheet>(null);
   const { quickViewTeam, currentUser, commentPost } = smashStore;

   useEffect(() => {
      smashStore.commentsModalRef = bottomSheetRef;

      return () => {};
   }, []);

   // ref
   // const bottomSheetRef = useRef<BottomSheet>(null);

   // variables
   // const snapPoints = useMemo(() => ['50%'], []);
   // const snapPoints = useMemo(() => ['45%'], []);
   const snapPoints = useMemo(() => ['70%', '95%'], []);
   // callbacks
   const handleSheetChanges = useCallback((index) => {
     
   }, []);

   //from here
   // const [comment, setComment] = useState('');
   // const renderBackdrop = useCallback(
   //    (props) => (
   //       <BottomSheetBackdrop
   //          {...props}
   //          pressBehavior="close"
   //          disappearsOnIndex={3}
   //          appearsOnIndex={-1}
   //          enableTouchThrough={false}
   //       />
   //    ),
   //    [],
   // );

   // const renderItem = ({ item }) => <CommentItem item={item} />;

   const visible = quickViewTeam || false;


   const isAndroid = Platform.OS === 'android';

   const onClose = () => {

      smashStore.quickViewTeam = false;
      bottomSheetRef.current?.close();
   }
   return (
      <BottomSheet
         enablePanDownToClose
         ref={bottomSheetRef}
         onClose={() => {
            // smashStore.setCommentPost(false);
            smashStore.setQuickViewTeam(false);
         }}
         index={visible ? 0 : -1}
         snapPoints={snapPoints}
         onChange={handleSheetChanges}
         handleHeight={40}
         keyboardBehavior="interactive"
         keyboardBlurBehavior="restore">
         <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {isAndroid ? <View row spread paddingH-32><View /><TouchableOpacity onPress={onClose}><Text R14>Close</Text></TouchableOpacity></View> : () => null}
            {smashStore.quickViewTeam?.teamToday && (
               <TeamToday
                  inModal
                  team={smashStore.quickViewTeam}
                  navigation={smashStore.navigation}
               />
            )}
            {smashStore.quickViewTeam?.teamWeek && (
               <TeamWeek
                  team={smashStore.quickViewTeam}
                  navigation={smashStore.navigation}
                  inModal={true}
               />
            )}

{/* {smashStore.quickViewTeam?.todayChallenges && (<TodaysTargetsList navigation={smashStore.navigation} />)} */}

            {smashStore.quickViewTeam?.teamContribution && (
               <TeamPieChart teamId={smashStore.quickViewTeam?.id} />
            )}

            {smashStore.quickViewTeam?.meToday && (
               <MeTodayInTeam
                  team={smashStore.quickViewTeam}
                  navigation={smashStore.navigation}
               />
            )}

            {smashStore.quickViewTeam?.recent && (
               <Recent
                  inModal={true}
                  team={smashStore.quickViewTeam}
                  navigation={smashStore.navigation}
               />
            )}

{smashStore.quickViewTeam?.selectActivities && (
               <SelectChallengesInCreateGoal
                  inModal={true}
                  dismiss={onClose}
                  goal={smashStore.quickViewTeam}
                  navigation={smashStore.navigation}
               />
            )}


         </BottomSheetScrollView>
      </BottomSheet>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
   },
   contentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   containerInput: {
      padding: 10,
      flexDirection: 'row',
      width: width,
      justifyContent: 'space-between',
      alignItems: 'center',
      // borderWidth: 2,
   },
   image: {
      height: 32,
      width: 32,
      borderRadius: 32,
      marginRight: 8,
   },
   // input: {
   //    backgroundColor: 'lightgrey',
   //    flex: 1,
   //    borderRadius: 4,
   //    marginHorizontal: 10,
   //    paddingHorizontal: 10,
   // },
   input: {
      marginTop: 8,
      marginBottom: 10,
      borderRadius: 20,
      fontSize: 14,
      height: 40,
      // lineHeight: 20,
      padding: 8,
      backgroundColor: 'rgba(151, 151, 151, 0.15)',
      flex: 1,
   },
});

export default inject(
   'smashStore',
   'notificatonStore',
)(observer(TeamQuickViewModal));
