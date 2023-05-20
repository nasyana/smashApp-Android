
import { inject, observer } from 'mobx-react';
import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, Colors, Assets, Button } from "react-native-ui-lib";
import { AntDesign } from '@expo/vector-icons';
import Routes from '../../../config/Routes';
import Box from '../../Box';
import { Dimensions, TouchableWithoutFeedback } from 'react-native';
import Activities from "../Activities";
const Challenge = inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(
   observer((props) => {
      const { navigate } = useNavigation();


      const { item, smashStore, challengesStore, teamsStore, index } = props;

      const challenge = item;
      const { masterIds } = item;
      const { currentUser, isPremiumMember, willExceedQuota, showUpgradeModal } = smashStore;
      const {

         playerChallengeHashByChallengeId,
         toggleMeInChallenge,
         myChallenges,
         playSound
      } = challengesStore;


      // find challenge in myChallenges array by challenge id
      const myPlayerChallenge = myChallenges.find(
         (playerChallenge) => playerChallenge.challengeId === challenge.id
      ) || false;

      const alreadyPlaying = myPlayerChallenge || false

      const joinChallenge = () => {
         if (alreadyPlaying) {

            goToChallenge(challenge)



         }
         else {

            if (!isPremiumMember && willExceedQuota(myChallenges?.length, 'challengesQuota' && false)) {
               showUpgradeModal(true)

               return
            }



            playSound()


            toggleMeInChallenge(challenge, currentUser, alreadyPlaying, false, false);

            const target = parseInt(challenge?.dailyTargets?.[0])

            if (challenge.endType == 'deadline') {

               smashStore.simpleCelebrate = {
                  name: `Nice!`,
                  title: `You joined ${challenge.name} Habit Challenge!`,
                  subtitle: `See how much you can get in ${challenge.endDuration} days 🔥🔥🔥`,
                  button: "Got it! Let's Go!",
                  nextFn: false,
               };


            } else {

               smashStore.simpleCelebrate = {
                  name: `Nice!`,
                  title: `You joined ${challenge.name} Habit Challenge!`,
                  subtitle: `You need to aim for minimum ${target} (${challenge.unit || 'pts'}) each day to reach your daily goal. Try to get your first 3 day streak! 🔥🔥🔥`,
                  button: "Got it! Let's Go!",
                  nextFn: false,
               };
            }




         }
      }

      const goToChallenge = (challenge) => {
         navigate(Routes.ChallengeArena, {
            challenge,
            comeFromChallengeList: true,

         });
      };

      const size = 50;

      const challengeTarget = challenge?.dailyTargets?.[0] || 0;
      const challengeUnit = challenge.targetType == 'qty' ? challenge.unit : 'pts';

      const icon = Assets.icons?.[challenge?.imageHandle || 'smashappicon']

      return (
         <View>
            <Box>

               <TouchableWithoutFeedback
                  onLongPress={() =>
                     navigate(Routes.CreateChallenge, {
                        challengeDoc: challenge,
                     })
                  }
                  onPress={() => goToChallenge(item)}>


                  <View paddingV-20 marginR-32 paddingL-24>
                     <View row>
                        
                        <View center style={{ backgroundColor: challenge.colorStart, borderRadius: (size + 5) / 2, width: size + 5, height: size + 5, marginLeft: 0, marginRight: 12 }}><Image
                        source={icon}
                        style={{
                           height: size,
                           width: size,
                           borderRadius: size / 2,

                        }}
                     />
                     </View>
                        <View>
                           <View centerV flex paddingR-54>


                              <View row centerV spread marginT-0>

                                 <Text H18 color28>
                                    {challenge.name}
                                 </Text>


                              </View>



                              <Text R14 color28 marginB-4 marginT-0>
                                 {challenge.description} 
                              </Text>
                              <Text secondaryContent R14 marginB-8 marginT-0>
                              Starting at {challenge?.dailyTargets[0]} {challengeUnit} per day.
                              </Text>
                              <View row marginB-8>
                                 {true && <AntDesign
                                    name={'user'}
                                    size={12}
                                    color={Colors.color6D}
                                 />}

                                 {true && <Text R12 color6D marginR-10>
                                    {item?.playing || 0} Participating
                                 </Text>}
                              </View>



                           </View>

                        </View>
                     </View>
                  
                     <View paddingT-8 paddingB-16 marginT-8 style={{ borderTopWidth: 1, borderTopColor: '#eee' }}>
                              <Text B22 style={{ color: challenge.colorStart }}>Reach total {challengeTarget} {challengeUnit?.length > 0 ? challengeUnit : 'points'} per day</Text>
                           </View>

                           <Activities masterIds={masterIds} notPressable={true} />
                           <View  marginT-16 flex>
                              <Button
                                 style={{
                                    backgroundColor: !alreadyPlaying
                                       ? Colors.buttonLink
                                       : '#fff',
                                    borderColor: alreadyPlaying ? challenge?.colorStart : Colors.buttonLink,
                                    // borderRadius: 10,
                                 }}
                                 // white={!alreadyPlaying}
                                 labelStyle={{ color: alreadyPlaying ? challenge?.colorStart : '#fff' }}
                                 color={alreadyPlaying ? challenge?.colorStart : '#fff'}
                                 outline
                                 label={
                                    alreadyPlaying ? 'Joined' : 'Join Challenge'
                                 }
                                 size="medium"
                                 fullWidth={false}
                                 onPress={joinChallenge}
                              />
                           </View>
                  </View>
                  
               </TouchableWithoutFeedback>

               
            </Box>
         </View>
      );
   }),
);

export default Challenge;
