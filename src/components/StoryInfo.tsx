import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import React, { useCallback } from 'react';
import SmartImage from 'components/SmartImage/SmartImage';
import { Feather } from '@expo/vector-icons';
import { unixToFromNow } from 'helpers/generalHelpers';
import { inject, observer } from 'mobx-react';
import Routes from 'config/Routes';
import StoryProfileImage from 'components/StoryUserProfile';
// import { useNavigation } from '@react-navigation/core';
const StoryInfo = (props) => {
   // const { navigate } = useNavigation();
   const { story, smashStore } = props;
   const { currentStory, userStoriesHash,kFormatter,currentUserId } = smashStore;
   const {tempStory} = smashStore;
   const storyToRender = userStoriesHash?.[currentStory.id] || false;

   const playerId = storyToRender?.uid;



   const goToProfile = useCallback(() => {
      if (playerId == currentUserId) {
         smashStore.navigation.navigate(Routes.MyProfile);
      } else {
         smashStore.navigation.navigate(Routes.MyProfileHome, {
            user: { uid: playerId },
         });
      }
   
      smashStore.stories = [];
      smashStore.storyIndex = 0;
   }, [playerId]);

   return (
      <TouchableOpacity
         onPress={goToProfile}
         style={{
            width: '100%',
            // height: 10,
            flex: 1,
            flexDirection: 'row',
            zIndex: 999999,
            elevation: 999999,
            //    justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
         }}>
   <StoryProfileImage smashStore={smashStore} avatar={storyToRender?.user?.picture || false} story={storyToRender} playerId={playerId} goToProfile={goToProfile} />
         <View>
            <View row>
               <Text B14 white marginH-8>
                 <StoryProfileUserName playerId={playerId} />
                  {tempStory.value
                     ? tempStory?.multiplier * tempStory.value + ' pts '
                     : '+' + kFormatter(tempStory.points) + ' pts'}
               </Text>
               <Text>
                  {currentStory?.video && (
                     <Feather name="video" size={20} color="white" />
                  )}
               </Text>
            </View>
            <Text M14 white marginL-8>
               {story?.multiplier && story?.multiplier + ' x'}{' '}
               {currentStory?.activityName}{' '}
               <Text R12 style={{ color: '#eee' }}>
                  {unixToFromNow(currentStory?.timestamp)}
               </Text>
            </Text>
         </View>
      </TouchableOpacity>
   );
};;

export default inject('smashStore', 'challengeArenaStore')(observer(StoryInfo));





// export const StoryProfileImage = inject('smashStore')(
//   ({ smashStore, goToProfile, picture, playerId }) => {

//    const {currentStoryUser} = smashStore;

//    // alert(currentStoryUser.name)
//     const profileImageHeight = 40;

//     return (
//       <TouchableOpacity onPress={goToProfile} playerId={playerId}>
//         <SmartImage
//           uri={currentStoryUser?.picture?.uri}
//           preview={currentStoryUser?.picture?.preview}
//           style={{
//             borderRadius: profileImageHeight / 2,
//             height: profileImageHeight,
//             width: profileImageHeight,
//           }}
//         />
//       </TouchableOpacity>
//     );
//   },
// );

export const StoryProfileUserName = inject('teamsStore', 'smashStore')(({ teamsStore, smashStore }) => {

   const {tempStory} = smashStore;
   const playerId = tempStory?.uid;
   const {friendsUserHash} = teamsStore

   const name = friendsUserHash?.[playerId]?.name || false;
  return <Text white R14>{name} </Text>;
});

