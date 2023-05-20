import { useNavigation } from '@react-navigation/core';
import Box from 'components/Box';
import Input from 'components/Input';
import Routes from 'config/Routes';
import { width } from 'config/scaleAccordingToDevice';
import { useState, createContext, useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
   View,
   Colors, TouchableOpacity, Text, Switch, Assets, Image
} from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import CustomButtonLinear from 'components/CustomButtonLinear';
import SegmentControl from 'libs/react-native-segment';
import firebaseInstance from 'config/Firebase';
import { doc, updateDoc, collection, query, where, getDocs, writeBatch, serverTimestamp, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import SectionHeader from 'components/SectionHeader';
import Header from 'components/Header';
import ImageUpload from 'helpers/ImageUpload';
import SectionDescription from 'components/SectionDescription';
import ButtonLinear from 'components/ButtonLinear';
import Activities from 'components/Challenge/Activities';
import { kFormatter, numberWithCommas } from 'helpers/generalHelpers';

const firestore = firebaseInstance.firestore;
export const CalendarContext = createContext(null);

const challengeDurations = [10, 14, 30, 60, 90, 120, 180, 365];
const targetTypeLabels = ['qty', 'points'];
const targetTypeHeaders = ['Quantity Goal', 'Points Goal'];

const endTypes = ['daily', 'deadline'];
const segmentOptions = ['Cruisy', 'Expert', 'Guru', 'Custom'];




const CreateGoal = (props) => {

   const { navigate } = useNavigation();
   const { createChallengeStore, actionsStore, smashStore, route, challengesStore } =
      props;



   const { toggleMeInGoal, setGoalToShare, challengesHash } = challengesStore;
   const { currentUser, stringLimit } = smashStore
   const { goalDoc = {} } = route?.params || {};

   const [selectedLevel, setSelectedLevel] = useState(goalDoc?.selectedLevel || 0);

   useEffect(() => {



      setTimeout(() => {

         setLoading(false)

      }, 1500);

      return () => { }

   }, [])

   const [allowOthersToHelp, setAllowOthersToHelp] = useState(goalDoc.allowOthersToHelp || false);
   const [allowPublicToJoin, setAllowPublicToJoin] = useState(goalDoc.allowPublicToJoin || false);
   const [allowOthersToChallenge, setAllowOthersToChallenge] = useState(goalDoc.allowOthersToChallenge || false);
   const [endDuration, setEndDuration] = useState(goalDoc.endDuration || 30);

   const { selectedActions = [] } = actionsStore;
   const [id, setId] = useState(false);

   const [picture, setPicture] = useState('#FF6243');
   const [colorStart, setColorStart] = useState('#FF6243');
   const [colorEnd, setColorEnd] = useState(Colors.smashPink);
   const [badgeDecorationPicture, setBadgeDecorationPicture] = useState(false);
   const [target, setTarget] = useState(10000);

   const [name, setName] = useState('My Epic Team');
   const [imageHandle, setImageHandle] = useState('smashappicon');
   const [loading, setLoading] = useState(goalDoc.targetType ? true : false);
   const [loadingImage, setLoadingImage] = useState('');
   const [description, setDescription] = useState(goalDoc?.description || 'Smashing is what we do…');
   const [errors, setErrors] = useState({});

   const _targetTypeIndex = targetTypeLabels.findIndex(
      (item) => item === goalDoc.targetType,
   );
   const targetValues = [500, 1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000];

   const formatTargetValue = (value) => {
      if (value >= 1000000) {
         return `${(value / 1000000).toLocaleString()}m`;
      } else if (value >= 1000) {
         return `${(value / 1000).toLocaleString()}k`;
      }
      return value.toLocaleString();
   };

   const [targetTypeIndex, setTargetTypeIndex] = useState(

      _targetTypeIndex > -1 ? _targetTypeIndex : 0,
   );


   useEffect(() => {

      const { goalDoc = {} } = route?.params || {};
      console.log('load useEffect');

      if (goalDoc && goalDoc.id) {
         const {
            id,
            name,
            target,
            unit,
            picture,
            badgeDecorationPicture,
            colorStart,
            colorEnd,
            imageHandle = 'smashappicon',
            description,
            challengeId,
            masterIds,
         } = goalDoc;

         const challengeToLoad = challengesHash?.[challengeId] || { masterIds, name, description, id: challengeId }

         challengesStore.setChallengeGoalIsBasedOn(challengeToLoad || false)

         const { libraryActionsList } = smashStore;
         const selectedActions = libraryActionsList.filter((item) =>
            masterIds.includes(item.id),
         );

         setId(id);
         setPicture(picture);
         setBadgeDecorationPicture(badgeDecorationPicture);
         setName(name);
         setTarget(target);
         setColorStart(colorStart);
         setColorEnd(colorEnd);
         setImageHandle(imageHandle);
         // setDurationIndex(durationIndex);
         // setStart(start);
         actionsStore.setSelectedActions(selectedActions);
      } else {

         actionsStore.setSelectedActions([]);
      }
      return () => {
         actionsStore.setSelectedActions([]);
         challengesStore.setChallengeGoalIsBasedOn(false)
      };
   }, []);


   const generateGoalCode = async (id) => {

      return new Promise(async (resolve, reject) => {
         const docSnap = await getDoc(doc(firestore, 'goals', 'codes'));

         let existingGoalCodes = [];
         if (docSnap.exists()) {
            existingGoalCodes = docSnap.data().codes || [];
         }

         const generateNewCode = () => {
            let generatedCode = ImageUpload.teamCode();

            while (existingGoalCodes.includes(generatedCode)) {
               generatedCode = ImageUpload.teamCode();
            }

            return generatedCode;
         };

         const newCode = generateNewCode();

         await setDoc(doc(firestore, 'goals', id), { code: newCode }, { merge: true });
         await setDoc(
            doc(firestore, 'goals', 'codes'),
            {
               codes: arrayUnion(newCode),
            },
            { merge: true },
         );

         resolve(newCode);
      });
   };

   const challengeGoalIsBasedOn = challengesStore?.challengeGoalIsBasedOn || false;



   const dailyTarget = challengesStore?.challengeGoalIsBasedOn?.dailyTargets?.[selectedLevel]

   console.log('selectedLevel', selectedLevel)
   const finalTarget = id ? target : selectedLevel != 3 ? endDuration * dailyTarget : target;

   const doValidations = () => {
      const errors = {};
      // if (!name) errors.name = 'Name cannot be empty';
      // if (!description) errors.description = 'Description cannot be empty';

      if (!name && allowOthersToHelp) errors.name = 'Name cannot be empty';
      if (!target) errors.target = 'Target cannot be empty';

      if (!(selectedActions.length > 0))
         errors.activities = 'Should select atleat 1 activity';

      setErrors(errors);
      return Object.keys(errors).length === 0;
   };



   const handleCreateGoal = () => {
      // console.log(doValidations())
      if (!doValidations()) {
         console.warn('Validagtion issues');
         return;
      }
      const uid = firebaseInstance.auth.currentUser.uid;
      const masterIds = selectedActions.map((item) => item.id);
      const actions = selectedActions.reduce((acc, item) => {
         acc[item.id] = { text: item.text };
         return acc;
      }, {}); // makes item = { [12341234]: { text: '1k Walk' }, [1234123423]: 'Pushups' }


      const dailyTarget = challengesStore?.challengeGoalIsBasedOn?.dailyTargets?.[selectedLevel]

      // const finalTarget = endDuration * dailyTarget;
      const finalTarget = id ? target : selectedLevel != 3 ? endDuration * dailyTarget : target;

      const goal = {
         id,
         name,
         description,
         start: serverTimestamp(),
         picture,
         challengeId: challengeGoalIsBasedOn?.id,
         imageHandle: imageHandle,
         colorStart,
         colorEnd,
         badgeDecorationPicture: badgeDecorationPicture || false,
         target: finalTarget,
         endDuration,
         targetType: targetTypeLabels[targetTypeIndex],
         challengeType: 'user',
         updatedAt: parseInt(Date.now() / 1000),
         masterIds,
         actions,
         uid,
         unit: challengeGoalIsBasedOn?.unit || false,
         allowOthersToChallenge,
         allowPublicToJoin,
         allowOthersToHelp,
         selectedLevel
      };

      if (!id) {
         goal.author = uid;
         goal.active = true;
         goal.timestamp = parseInt(Date.now() / 1000);
      } else {
         goal.id = id;
      }

      setLoading(true);

      if (!id) {
         createChallengeStore
            .createGoalDoc(goal, currentUser)
            .then(async (goal) => {

               setErrors({});
               // toggleMeInChallengeIfNotAlreadyPlaying()
               toggleMeInGoal(goal, currentUser, false); // Creates playerGoal doc
               const code = await generateGoalCode(goal.id) // Adds code to goal doc

               setLoading(false);
               navigate(Routes.MainTab);
               setTimeout(() => {
                  setGoalToShare({ ...goal, code })
                  challengesStore.setChallengeGoalIsBasedOn(false);
               }, 800);
            })
            .catch((err) => {


               console.log(err);
               setLoading(false);
            });
      } else {
         createChallengeStore
            .updateGoalDoc(goal)
            .then((res) => {
               setLoading(false);
               setErrors({});
               navigate(Routes.MainTab);

               setTimeout(() => {

                  challengesStore.mergeGoalWithStore(goal)
                  challengesStore.setChallengeGoalIsBasedOn(false);

               }, 800);
            })
            .catch((err) => {
               console.log(err);
               setLoading(false);
            });
      }


   };




   const removeGoal = async () => {

      // alert are you sure you want to remove? 
      // if yes then remove goal and all playerGoals associated with it
      // if no then do nothing
      Alert.alert('Are you sure you want to remove this goal?', 'You will not be able to recover the goal history and any players you have invited to this goal will lose their goal', [
         {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
         },
         {
            text: 'Yes', onPress: async () => {


               // setUniversalLoading(true);
               try {
                  // alert(id)
                  const goalDocRef = doc(firestore, "goals", id);

                  await updateDoc(goalDocRef, { active: false });

                  const playerChallengesQuery = query(
                     collection(firestore, "playerGoals"),
                     where("goalId", "==", id)
                  );

                  const playerGoalSnaps = await getDocs(playerChallengesQuery);

                  const batch = writeBatch(firestore);

                  playerGoalSnaps.forEach((challenge) => {
                     //   const challengeRef = doc(firestore, 'playerGoals', challenge.id);
                     batch.update(challenge.ref, { hostRemoved: true, active: false });
                  });

                  await batch.commit();
                  navigate(Routes.MainTab);
                  setTimeout(async () => {
                     challengesStore.removeGoalFromStore(id);
                  }, 500);

                  //   setUniversalLoading(false);
               } catch (error) {
                  console.error(`Error updating goal with id: ${id}`, error);
                  //   setUniversalLoading(false);


               }

            }
         }])
   };



   useEffect(() => {

      setName(challengesStore.challengeGoalIsBasedOn.name)
      setDescription(challengesStore.challengeGoalIsBasedOn.description)

      return () => {

      }
   }, [challengesStore.challengeGoalIsBasedOn])





   const clearSelectedActions = () => {
      actionsStore.setSelectedActions([]);

   };


   const imageDimensions = {
      height: 150,
      marginBottom: 16
   }

   // const challenge = challengesStore?.challengesHash?.[goal.challengeId] || {}
   const size = 40;
   const icon = Assets?.icons?.[challengeGoalIsBasedOn?.imageHandle || 'smashappicon']

   return (
      <View flex paddingT-0>
         <Header back title="Goal Settings" />
         <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
            <SectionHeader title="Choose Your Goal Type" />
            <View center>
               <SegmentControl
                  key={"targetType"}
                  values={targetTypeHeaders}
                  disable={id}
                  style={styles.segment}
                  selectedIndex={targetTypeIndex}
                  onChange={(newIndex) => {
                     if (targetTypeIndex === 1 && newIndex === 0 && selectedActions.length > 1) {


                        actionsStore.setSelectedActions([])
                        challengesStore.setChallengeGoalIsBasedOn(false)
                        setTargetTypeIndex(newIndex);
                     } else {
                        challengesStore.setChallengeGoalIsBasedOn(false)
                        actionsStore.setSelectedActions([])
                        setTargetTypeIndex(newIndex);
                     }
                  }}
               />
            </View>

            <SectionDescription text={`Select whether you want to set a goal based on the quantity of activities completed (Qty Goal) or the total points earned from those activities (Points Goal).`} />

            <SectionHeader title={!id ? targetTypeIndex == 0 ? "Choose a Quantity Challenge" : "Choose a Points Challenge" : "Activities"} />
            {challengesStore?.challengeGoalIsBasedOn && <Box style={{ marginBottom: 24 }}>
               <View

                  style={{
                     marginHorizontal: 0,
                     backgroundColor: '#FFF',
                     marginBottom: 0,
                     paddingLeft: 0,
                     borderRadius: 7,
                  }}>
                  <TouchableOpacity onPress={id ? () => null : () => smashStore.quickViewTeam = { selectActivities: true, ...goalDoc, targetTypeIndex }} row centerV paddingV-16>
                     <View center marginT-0 style={{ backgroundColor: challengeGoalIsBasedOn.colorStart || '#333', borderRadius: 25, width: size + 5, height: size + 5, marginLeft: 24, marginRight: 0 }}>
                        <Image
                        source={icon}
                        style={{
                           height: size,
                           width: size,
                           borderRadius: 40,

                        }}
                     /></View>
                     <View centerV marginL-16 flex paddingR-24>
                        <Text H18 color28 style={{ fontSize: 18, marginLeft: 0 }}>
                           {stringLimit(name, 25) || 'loading'}{' '}Goal
                           {/* {targetTypeLabels[targetTypeIndex]}  */}
                        </Text>
                        <Text R12 secondaryContent style={{ marginLeft: 0 }}>
                           {description || 'loading'}
                        </Text>
                     </View>

                  </TouchableOpacity>
                  {challengeGoalIsBasedOn && <View paddingH-16 marginB-16><Activities notPressable={true} masterIds={challengesStore?.challengeGoalIsBasedOn?.masterIds} /></View>}



               </View>
            </Box>}


            {!id && !challengesStore?.challengeGoalIsBasedOn && <ButtonLinear bordered style={{ marginBottom: 16 }} onPress={() => smashStore.quickViewTeam = { selectActivities: true, ...goalDoc, targetTypeIndex }} title={challengesStore?.challengeGoalIsBasedOn ? challengesStore?.challengeGoalIsBasedOn?.name && challengesStore?.challengeGoalIsBasedOn?.name + ' (selected)' : 'Choose Challenge'} />}
            {!challengeGoalIsBasedOn && <SectionDescription text={"Select the challenge that you want to participate in. Challenges are tailored to your chosen goal type, focusing on different activities and goals, such as productivity, health, or exercise."} />}


            {challengeGoalIsBasedOn && <SectionHeader title="Choose a Level" subtitle={<View paddingR-24><Text R14 secondaryContent>Reach {numberWithCommas(parseInt(finalTarget))} {challengeGoalIsBasedOn?.unit && 'x ' + challengeGoalIsBasedOn?.unit || 'points'}</Text></View>} />}

            {challengeGoalIsBasedOn && <View center>
               <SegmentControl
                  key={"selectedLevel"}
                  values={segmentOptions}
                  disable={id}
                  style={styles.segment}
                  selectedIndex={selectedLevel}
                  onChange={(newIndex) => {
                     // Set the selected level based on the newIndex + 1
                     setSelectedLevel(newIndex);
                  }}
               /></View>}


            {challengeGoalIsBasedOn && selectedLevel == 3 && <View flex><Box>

               <View row spread centerV center paddingT-16 paddingB-8>
                  <Text grey10 B16 center >Custom Goal Target</Text>
                  {/* <Text R14 secondaryContent center marginL-8 >({numberWithCommas(parseInt(target / endDuration))} {challengeGoalIsBasedOn?.unit || 'points'} / day){difficulty}</Text> */}
               </View>

               <View height={1} backgroundColor={Colors.line} marginB-16 />
               <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                  <Picker
                     selectedValue={target}
                     onValueChange={(itemValue) => setTarget(itemValue)}
                     style={{ width: '100%' }}
                  >
                     {targetValues.map((value) => (
                        <Picker.Item key={value} label={formatTargetValue(value)} value={value} />
                     ))}
                  </Picker>
               </View>
            </Box></View>}

            {challengeGoalIsBasedOn && selectedLevel != 3 && <SectionDescription text="Based on the selected challenge, choose a difficulty level that best suits your current abilities and desired intensity. Levels range from beginner (easy) to guru (hard)." />}

            {challengeGoalIsBasedOn && !id && <SectionHeader title="Set Deadline" />}
            {challengeGoalIsBasedOn && !id && <SectionDescription text="Select the number of days you want to complete your goal in. This will help you stay on track and create a sense of urgency to motivate you towards achieving your goal." />}


            {challengeGoalIsBasedOn && !id && <View flex><Box style={{ marginRight: 0 }} >

               <View row spread centerV center paddingT-16 paddingB-8>

                  <Text grey10 B16 center >Deadline</Text>
                  <Text R14 secondaryContent center marginL-8 >
                     {/* ({numberWithCommas(parseInt(finalTarget / endDuration))} {challengeGoalIsBasedOn?.unit || 'points'} / day){difficulty} */}
                     {kFormatter(parseInt(finalTarget))} {challengeGoalIsBasedOn?.unit || 'points'} in {endDuration} days
                  </Text>
               </View>
               <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                  <Picker

                     selectedValue={endDuration}
                     onValueChange={(itemValue) => {


                        setEndDuration(itemValue);
                        console.log('target', target)
                        console.log(itemValue, target)
                     }
                     }

                     style={{ width: '100%' }}
                  >
                     {challengeDurations.map((d) => (
                        <Picker.Item key={d} label={`${d} days`} value={d} />
                     ))}
                  </Picker>
               </View>
            </Box></View>}

            {challengeGoalIsBasedOn && <SectionHeader title="Goal Collaboration" />}



            {challengeGoalIsBasedOn && <View flex row spread marginH-16 marginB-16 paddingH-16>
               <Text M16 color6D>
                  Can other players help?
               </Text>
               <Switch
                  height={35}
                  width={53}
                  onColor={Colors.color44}
                  offColor={Colors.color6D}
                  value={allowOthersToHelp}
                  onValueChange={setAllowOthersToHelp}
                  thumbSize={30}
                  disabled={id}
               />
            </View>}
            {challengeGoalIsBasedOn && <SectionDescription text={"Decide whether you want to allow others to join your goal and contribute their own points towards the target or if disabled, players can join along side you and try to reach the same goal as well."} />}


            <View style={{ height: 8 }} />

            {/* {challengeGoalIsBasedOn && allowOthersToHelp && <SectionHeader title="Can Public Join?" />} */}


            {allowOthersToHelp && <View flex row spread marginH-16 marginB-16 paddingH-16>
               <Text M16 color6D>
                  Allow public to join?
               </Text>
               <Switch
                  height={35}
                  width={53}
                  onColor={Colors.color44}
                  offColor={Colors.color6D}
                  value={allowPublicToJoin}
                  onValueChange={setAllowPublicToJoin}
                  thumbSize={30}
                  disabled={false}
               />
            </View>}
            {challengeGoalIsBasedOn && allowOthersToHelp && <SectionDescription text={"Decide whether you want to allow Public to see your goal and join in to help. This can be anyone, not just the people you have sent the code to."} />}


            {allowOthersToHelp && false && <Box style={{ paddingTop: 16 }}>

               {true && <Input
                  value={name}
                  onChangeText={(text) => setName(text)}
                  label={'Team Name'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.name ? Colors.red30 : Colors.line,
                  }}
               />}
               {true && <Input
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  label={'Team Motto'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.name ? Colors.red30 : Colors.line,
                  }}
               />}

            </Box>}


            {challengeGoalIsBasedOn && <SectionHeader title="Review Your Goal Details" />}
            {challengeGoalIsBasedOn && !id && <SectionDescription text="Please review your goal details before creating it. Make sure everything is correct and fits your preferences." />}
            {challengeGoalIsBasedOn && <View paddingH-24 paddingB-32>

               {/* Show difficulty if is points target */}
               {targetTypeIndex != 0 && <Text R14 marginB-8>Difficulty: <Text secondaryContent>{selectedLevel != 3 ? segmentOptions[selectedLevel] || 'Not selected' : difficulty(parseInt(target / endDuration))}</Text></Text>}

               <Text R14 marginB-8 >Deadline: <Text secondaryContent>{endDuration} days</Text></Text>
               <Text R14 marginB-8 >Goal: <Text secondaryContent>{kFormatter(finalTarget)} {challengeGoalIsBasedOn.unit || 'points'}</Text></Text>

               <Text R14 marginB-8 >Recommended: <Text secondaryContent>Aim for {numberWithCommas(parseInt(finalTarget / endDuration))} {challengeGoalIsBasedOn?.unit || 'points'} / day</Text></Text>

               {/* ({numberWithCommas(parseInt(finalTarget / endDuration))} {challengeGoalIsBasedOn?.unit || 'points'} / day){difficulty} */}
               <Text R14 marginB-8 >Allow others to help? <Text secondaryContent>{allowOthersToHelp ? 'Yes' : 'No'}</Text></Text>
               <Text R14 marginB-8 >Allow public to join? <Text secondaryContent>{allowPublicToJoin ? 'Yes' : 'No'}</Text></Text>
            </View>}

            {id && <View
               flex
               style={{ paddingHorizontal: 16, alignItems: 'flex-end', marginBottom: 24 }}>
               <TouchableOpacity onPress={removeGoal}>
                  <Text>Remove Goal</Text>
               </TouchableOpacity>
            </View>}
         </ScrollView>


         <CustomButtonLinear
            title={!id ? 'Create' : 'Update'}
            onPress={!loading ? handleCreateGoal : () => { }}
            style={{
               marginBottom: 40,
            }}
            loader={
               loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
               ) : null
            }
         />
      </View>
   );
};

export default inject(
   'createChallengeStore',
   'actionsStore',
   'smashStore',
   'teamsStore',
   'challengesStore'
)(observer(CreateGoal));

const styles = StyleSheet.create({
   segment: { marginHorizontal: 16, marginBottom: 16, width: width - 64 },
   container: {
      flex: 1,
      justifyContent: 'center',
   },
   picker: {
      height: 50,
      width: 200,
      alignSelf: 'center',
   },
});



function difficulty(score) {
   const onePersonEmoji = "🚶";

   if (score < 900) {
      return `easy ${onePersonEmoji}consider increasing the target.`;
   } else if (score >= 900 && score < 1500) {
      return `normal ${onePersonEmoji}`;
   } else if (score >= 1500 && score < 3000) {
      return `pretty hard for one person ${onePersonEmoji}Consider inviting a friend.`;
   } else if (score >= 3000 && score < 4000) {
      return `very hard for one person ${onePersonEmoji}Consider inviting a friend.`;
   } else if (score >= 4000 && score < 7000) {
      return `crazy you'll need help ${onePersonEmoji.repeat(2)}Consider reducing target, increasing days or inviting some friends.`;
   } else {
      let peopleCount = 3;

      if (score >= 7000 && score < 10000) {
         peopleCount += Math.floor((score - 7000) / 3000);
      } else if (score >= 10000) {
         peopleCount += Math.floor((score - 10000) / 3000);
      }

      return `Way too much for one person you'll need to get ${peopleCount}+ people to help! ${onePersonEmoji.repeat(peopleCount)}`;
   }
}

