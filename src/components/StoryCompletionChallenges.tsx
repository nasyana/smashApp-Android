import React from 'react';
import { inject, observer } from 'mobx-react';
import { TouchableOpacity, View, Text } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Routes from 'config/Routes';
// import { useNavigation } from '@react-navigation/core';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Vibrate } from 'helpers/HapticsHelpers';
const StoryCompletionChallenges = (props) => {
   const { smashStore, navigation } = props;
   // const { navigate } = useNavigation();
   const { currentStory } = smashStore;

   const goToChallenge = (challenge) => {
      Vibrate();
      smashStore.navigation.navigate(Routes.ChallengeArena, {
         challenge: {
            id: challenge.challengeId,
            name: challenge.challengeName,
         },
      });

      smashStore.stories = false;
      smashStore.storyIndex = 0;
   };

   const storyToRender = currentStory;
   return (
      <View style={{flexWrap: 'wrap', }} row>
         {storyToRender.challenges &&
            storyToRender.challenges.map((challenge) => {

       
               return (
                  <TouchableOpacity
                     onPress={() => goToChallenge(challenge)}
                     key={challenge.id}
                     row
                     centerV
                     marginV-4
                     marginR-4>
                     <LinearGradient
                        start={{
                           x: 0,
                           y: 1,
                        }}
                        end={{
                           x: 1,
                           y: 1,
                        }}
                        style={{
                           padding: 4,
                           paddingHorizontal: 8,
                           borderRadius: 16,
                           // width: 6,
                           // height: 6,
                           borderRadius: 16,
                           marginRight: 4,
                        }}
                        colors={[challenge.colorStart, challenge.colorStart]}>
                        <Text R12 style={{ color: '#fff' }}>
                           <AntDesign />
                           {challenge.challengeName}
                        </Text>
                     </LinearGradient>
                  </TouchableOpacity>
               );
            })}
      </View>
   );
};;;;
export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(StoryCompletionChallenges));
