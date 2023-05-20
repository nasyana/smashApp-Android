import { useNavigation } from '@react-navigation/core';
import Box from 'components/Box';
import Header from 'components/Header';
import Input from 'components/Input';
import Routes from 'config/Routes';
import { bottom, height, width } from 'config/scaleAccordingToDevice';
import { useCallback, useRef, useState, createContext, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AddActivities from "./components/AddActivities";
import { Picker } from '@react-native-picker/picker';
import _ from 'lodash';
import {
   useSharedValue,
   useAnimatedStyle,
   withTiming,
   Easing,
} from 'react-native-reanimated';
import {
   View,
   Colors,
   Text, Hint, Switch, Assets, Image, ExpandableSection
} from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
// import Firebase from 'config/Firebase';
import CustomButtonLinear from 'components/CustomButtonLinear';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import parse from 'date-fns/parse';
import SegmentControl from 'libs/react-native-segment';
import * as ImagePicker from 'expo-image-picker';
import SmartImage from '../../components/SmartImage/SmartImage';
import { challengeImages } from '../../helpers/generalHelpers';
import CalendarsList from 'components/CalendarsList';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
export const CalendarContext = createContext(null);
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const challengeDurations = [10, 14, 30, 60, 90, 120, 180, 365];
const durationLabels = ['once', 'weekly', 'monthly'];
const targetTypeLabels = ['qty', 'points'];
const endTypes = ['daily', 'deadline'];

const CreateChallenge = (props) => {
   const { navigate } = useNavigation();
   const { createChallengeStore, actionsStore, smashStore, route } =
      props;

   const [openTargets, setOpenTargets] = useState(false);
   const [openDailyTargets, setOpenDailyTargets] = useState(false);

   const toggleOpenTargets = () => {

      setOpenTargets(!openTargets);
   };

   const toggleOpenDailyTargets = () => {
      setOpenDailyTargets(!openDailyTargets);

   };
   const [endDuration, setEndDuration] = useState(false);
   const { challengeDoc = {} } = route?.params || {};
   const { selectedActions = [] } = actionsStore;
   // const [visible, open, close] = useBoolean(false);
   const [id, setId] = useState(null);
   const [challengeDurationType, setChallengeDurationType] = useState('daily');
   const [visible, setVisible] = useState('');
   const [start, setStart] = useState(null);
   const [end, setEnd] = useState(null);
   const [picture, setPicture] = useState('#FF6243');
   const [colorStart, setColorStart] = useState('#FF6243');
   const [colorEnd, setColorEnd] = useState(Colors.smashPink);
   const [badgeDecorationPicture, setBadgeDecorationPicture] = useState(false);
   const [target, setTarget] = useState('');
   const [targetTwo, setTargetTwo] = useState('');
   const [targetThree, setTargetThree] = useState('');
   const [unit, setUnit] = useState('');
   const [name, setName] = useState('');
   const [imageHandle, setImageHandle] = useState('smashappicon');
   const [loading, setLoading] = useState(false);
   const [description, setDescription] = useState(false);
   const [errors, setErrors] = useState({});
   const [durationIndex, setDurationIndex] = useState(2);
   const _targetTypeIndex = targetTypeLabels.findIndex(
      (item) => item === challengeDoc.targetType,
   );
   const [targetTypeIndex, setTargetTypeIndex] = useState(
      _targetTypeIndex > -1 ? _targetTypeIndex : 0,
   );

   const _endTypeIndex = endTypes.findIndex(
      (item) => item === challengeDoc.endType,
   );

   const [endTypeIndex, setEndTypeIndex] = useState(
      _endTypeIndex > -1 ? _endTypeIndex : 0,
   );
   const [popular, setPopular] = useState(true);
   const [fitness, setFitness] = useState(true);
   const [dailyTargets, setDailyTargets] = useState({});
   const [lifestyle, setLifestyle] = useState(true);
   const top = useRef(0);
   const topCurrent = useRef(0);
   const transY = useSharedValue(height);

   const onPressLibrary = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: Platform.OS === 'ios' ? false : false,
         aspect: [4, 3],
         durationLimit: 60,
         mediaTypes:
            Platform.OS === 'ios'
               ? ImagePicker.MediaTypeOptions.All
               : ImagePicker.MediaTypeOptions.Images,
      });

      const picture = await smashStore.uploadImage(result);
      setPicture(picture);
   };


   useEffect(() => {
      if (challengeDoc && challengeDoc.id) {
         const {
            id,
            name,
            target,
            targetTwo,
            targetThree,
            unit,
            popular,
            fitness,
            lifestyle,
            picture,
            badgeDecorationPicture,
            colorStart,
            colorEnd,
            dailyTargets = {},
            imageHandle = 'smashappicon',
            endDuration, 
            // categoryIndex,
            challengeDurationType,
            description,
            durationIndex,
            startDate,
            endDate,
            masterIds,
         } = challengeDoc;

         const { libraryActionsList } = smashStore;
         const selectedActions = libraryActionsList.filter((item) =>
            masterIds.includes(item.id),
         );
         setEndDuration(endDuration || false);
         setChallengeDurationType(challengeDurationType || 'daily');
         setId(id);
         setPicture(picture);
         setBadgeDecorationPicture(badgeDecorationPicture);
         setName(name);
         setTarget(target);
         setTargetTwo(targetTwo || false);
         setTargetThree(targetThree || false);
         setUnit(unit);
         setPopular(popular);
         setFitness(fitness);
         setLifestyle(lifestyle);
         setDescription(description);
         setColorStart(colorStart);
         setColorEnd(colorEnd);
         setDailyTargets(dailyTargets);
         setImageHandle(imageHandle);
         // setCategoryIndex(categoryIndex)
         setDurationIndex(durationIndex);
         setStart(parse(startDate, 'ddMMyyyy', new Date()));
         setEnd(parse(endDate, 'ddMMyyyy', new Date()));
         actionsStore.setSelectedActions(selectedActions);
      }
      return () => {
         actionsStore.clearSelectedActions();
      };
   }, []);

   const style = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateY: withTiming(transY.value, {
                  duration: 350,
                  easing: Easing.linear,
               }),
            },
         ],
      };
   });

   const onPress = useCallback(
      (position: string) => {
         if (durationIndex > 0) return;
         if (visible) {
            transY.value = height;
            setTimeout(() => {
               setVisible('');
            }, 350);
         } else {
            setVisible(position);
            transY.value = 0;
         }
      },
      [visible, durationIndex],
   );

   const onDayPress = useCallback(
      (date) => {
         // console.log("day pressed",JSON.stringify(date))

         if (visible === 'start') {
            onPress('start');
            setStart(Date.parse(date.dateString));
         } else {
            onPress('end');
            setEnd(Date.parse(date.dateString));
         }
      },
      [visible],
   );

   // useEffect(() => {
   //   doValidations()
   // }, [start,end,target,selectedActions])

   const doValidations = () => {
      const errors = {};
      if (!name) errors.name = 'Name cannot be empty';
      if (!description) errors.description = 'Description cannot be empty';

      // if (!target) errors.target = 'Target cannot be empty';

      if (!(selectedActions.length > 0))
         errors.activities = 'Should select atleat 1 activity';
      // if (!start) errors.start = 'Start Date cannot be empty';
      // if (!end) errors.end = 'End Date cannot be empty';

      console.log('errors',errors)
      setErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const handleCreateChallenge = () => {
      console.log(doValidations())
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

      const challenge = {
         name,
         description,
         challengeDurationType,
         picture,
         imageHandle: imageHandle,
         colorStart,
         colorEnd,
         dailyTargets,
         badgeDecorationPicture: badgeDecorationPicture || false,
         new: true,
         targets: {
            [1]: parseInt(target),
            [2]: parseInt(targetTwo),
            [3]: parseInt(targetThree),
         },
         target,
         targetTwo,
         targetThree,
         endType: endTypes[endTypeIndex],
         endDuration,
         unit: targetTypeIndex === 0 ? unit : '',
         fitness,
         lifestyle,
         // targetType: masterIds.length > 1 ? "points" : "qty",
         targetType: targetTypeLabels[targetTypeIndex],
         challengeType: 'user',
         updatedAt: parseInt(Date.now() / 1000),
         masterIds,
         actions,
         // startDate: format(start, "ddMMyyyy"),
         // endDate: format(end, "ddMMyyyy"),
         durationIndex,
         duration: durationLabels[durationIndex],
         popular,
      };

      if (!id) {
         //If creating Challenge
         challenge.author = uid;
         challenge.active = true;
         challenge.timestamp = parseInt(Date.now() / 1000);
      } else {
         challenge.id = id;
      }

      setLoading(true);

      if (!id) {
         createChallengeStore
            .createChallengeDoc(challenge)
            .then((res) => {
               setLoading(false);
               setErrors({});
               navigate(Routes.MainTab);
            })
            .catch((err) => {
               console.log(err);
               setLoading(false);
            });
      } else {
         createChallengeStore
            .updateChallengeDoc(challenge)
            .then((res) => {
               setLoading(false);
               setErrors({});
               navigate(Routes.MainTab);
            })
            .catch((err) => {
               console.log(err);
               setLoading(false);
            });
      }
   };

   const handleDurationChange = (index) => {
      setDurationIndex(index);
      if (index === 0) {
         setStart(null);
         setEnd(null);
      } else if (index === 1) {
         setStart(startOfWeek(new Date()));
         setEnd(endOfWeek(new Date()));
      } else {
         setStart(startOfMonth(new Date()));
         setEnd(endOfMonth(new Date()));
      }
   };

   const targetFrame = { x: 350, y: 590, width: 10, height: 10 };
   // console.log("selectedActions",selectedActions.length)

   const onSubmit = (color: string, textColor: string) => {
      const { customColors } = this.state;
      customColors.push(color);
      this.setState({
         color,
         textColor,
         customColors: _.clone(customColors),
         paletteChange: false,
      });
   };

   const onValueChangeStart = (value: string, options: object) => {
      setColorStart(value);
   };

   const onValueChangeEnd = (value: string, options: object) => {
      setColorEnd(value);
   };

   const { goBack } = useNavigation();
   const removeChallenge = async () => {
      const challengeDocRef = doc(firestore, 'challenges', challengeDoc.id);
      await updateDoc(challengeDocRef, { active: false });
      
      const playerChallengesQuery = query(
        collection(firestore, 'playerChallenges'),
        where('challengeId', '==', challengeDoc.id)
      );
      
      const challengeSnaps = await getDocs(playerChallengesQuery);
      
      challengeSnaps.forEach(async (challenge) => {
        const challengeRef = doc(firestore, 'playerChallenges', challenge.id);
        await updateDoc(challengeRef, { active: false });
      });
      goBack();
   };


   return (
      <View flex>
         <Header title={'Create Challenge'} back />
      
         <ScrollView
            contentContainerStyle={{ paddingBottom: 50 }}
            scrollEventThrottle={10}
            onScroll={(e) => {
               topCurrent.current = top.current - e.nativeEvent.contentOffset.y;
            }}>
            <TouchableOpacity onPress={onPressLibrary}>
               <SmartImage
                  uri={picture?.uri}
                  preview={picture?.preview}
                  style={{
                     margin: 16,
                     height: 150,
                     width: width - 32,
                     backgroundColor: '#ccc',
                     borderRadius: 4,
                  }}
               />
            </TouchableOpacity>
           

            <Box style={{ marginTop: 16 }}>
         
               <Text marginT-13 marginB-11 marginL-16 uppercase H14>
                  new challenge
               </Text>
               <View height={1} backgroundColor={Colors.line} marginB-16 />
         
               <Input
                  value={name}
                  onChangeText={(text) => setName(text)}
                  label={'Name'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.name ? Colors.red30 : Colors.line,
                  }}
               />
               <Input
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  label={'Description'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.name ? Colors.red30 : Colors.line,
                  }}
               />

<SegmentControl
                  key={'challengeDurationType'}
                  values={endTypes}
                  disable={false}
                  style={styles.segment}
                  selectedIndex={targetTypeIndex}
                  onChange={setEndTypeIndex}
               />
<ExpandableSection onPress={toggleOpenDailyTargets} expanded={endTypeIndex == 0}  sectionHeader={<View paddingH-16 paddingB-24><Text grey10 text60>Daily Targets</Text></View>}>
               <Input
                  value={dailyTargets[0]}
                  onChangeText={(text) =>
                     setDailyTargets({ ...dailyTargets, [0]: text })
                  }
                  keyboardType="number-pad"
                  label={'Daily Target Level 1'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.target ? Colors.red30 : Colors.line,
                  }}
               />

               <Input
                  value={dailyTargets[1]}
                  onChangeText={(text) =>
                     setDailyTargets({ ...dailyTargets, [1]: text })
                  }
                  keyboardType="number-pad"
                  label={'Daily Target Level 2'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.target ? Colors.red30 : Colors.line,
                  }}
               />

               <Input
                  value={dailyTargets[2]}
                  onChangeText={(text) =>
                     setDailyTargets({ ...dailyTargets, [2]: text })
                  }
                  keyboardType="number-pad"
                  label={'Daily Target Level 3'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.target ? Colors.red30 : Colors.line,
                  }}
               />
</ExpandableSection>

<ExpandableSection onPress={toggleOpenTargets} expanded={endTypeIndex == 1} sectionHeader={<View paddingH-16 paddingB-8><Text grey10 text60>Targets</Text></View>}>
               
               <ScrollView horizontal><View row paddingH-24 paddingB-24>{challengeDurations?.map((d)=>{
               
               const isSelected = d == endDuration;
               return (<TouchableOpacity style={{backgroundColor: isSelected ? Colors.smashPink : 'transparent', padding: 16, borderWidth: 1, borderRadius: 8, margin: 4}} onPress={()=>setEndDuration(d)}><Text R14 style={{color: isSelected ? Colors.white : Colors.grey10,}}>{d} days</Text></TouchableOpacity>)
               
               })}</View></ScrollView>
               <Input
                  value={target}
                  onChangeText={(text) => setTarget(text)}
                  keyboardType="number-pad"
                  label={'Target'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: errors.target ? Colors.red30 : Colors.line,
                  }}
               />
               <Input
                  value={targetTwo}
                  onChangeText={(text) => setTargetTwo(text)}
                  keyboardType="number-pad"
                  label={'TargetTwo'}
                  parentStyle={{ marginHorizontal: 16, width: width - 64 }}
               />
               <Input
                  value={targetThree}
                  onChangeText={(text) => setTargetThree(text)}
                  keyboardType="number-pad"
                  label={'TargetThree'}
                  parentStyle={{ marginHorizontal: 16, width: width - 64 }}
               />
</ExpandableSection>
               <SegmentControl
                  key={'targetType'}
                  values={targetTypeLabels}
                  disable={false}
                  style={styles.segment}
                  selectedIndex={targetTypeIndex}
                  onChange={setTargetTypeIndex}
               />

               {targetTypeIndex === 0 && (
                  <Input
                     value={unit}
                     onChangeText={(text) => setUnit(text)}
                     label={'Unit'}
                     parentStyle={{ marginHorizontal: 16, width: width - 64 }}
                  />
               )}

               <View flex row spread marginH-16 marginB-16 paddingH-16>
                  <Text M16 color6D>
                     Popular
                  </Text>
                  <Switch
                     height={35}
                     width={53}
                     onColor={Colors.color44}
                     offColor={Colors.color6D}
                     value={popular}
                     onValueChange={setPopular}
                     thumbSize={30}
                  />
               </View>

               <View flex row spread marginH-16 marginB-16 paddingH-16>
                  <Text M16 color6D>
                     Fitness
                  </Text>
                  <Switch
                     height={35}
                     width={53}
                     onColor={Colors.color44}
                     offColor={Colors.color6D}
                     value={fitness}
                     onValueChange={setFitness}
                     thumbSize={30}
                  />
               </View>

               <View flex row spread marginH-16 marginB-16 paddingH-16>
                  <Text M16 color6D>
                     Lifestyle
                  </Text>
                  <Switch
                     height={35}
                     width={53}
                     onColor={Colors.color44}
                     offColor={Colors.color6D}
                     value={lifestyle}
                     onValueChange={setLifestyle}
                     thumbSize={30}
                  />
               </View>

               <View >
            <Picker
        selectedValue={imageHandle}
        onValueChange={(itemValue) => setImageHandle(itemValue)}
      //   style={styles.picker}
      >
        {challengeImages.map((image, index) => (
          <Picker.Item key={index} label={image} value={image} />
        ))}
      </Picker>
      </View>

               {/* <SegmentControl
                values={categoryLabels}
                selectedIndex={categoryIndex}
                onChange={(index) => setCategoryIndex(index)}
                disable={false}
                style={styles.segment}
              /> */}

               {/* <SegmentControl
                  key={'duration'}
                  values={durationLabels}
                  disable={false}
                  style={styles.segment}
                  selectedIndex={durationIndex}
                  onChange={handleDurationChange}
               /> */}

               {/* {durationIndex == 0 && (
                  <View
                     marginH-16
                     marginB-16
                     style={{
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor:
                           errors.start || errors.end
                              ? Colors.red30
                              : Colors.line,
                     }}
                     onLayout={(e) => {
                        e.target.measure(
                           (x, y, width, height, pageX, pageY) => {
                              top.current = pageY + height;
                              topCurrent.current = pageY + height;
                           },
                        );
                     }}>
                     <Text M12 color58 marginT-8 marginL-16 marginB-10>
                        Select your date range
                     </Text>
                     <View row marginH-16 centerV marginB-11>
                        <View flex>
                           <TouchableOpacity onPress={() => onPress('start')}>
                              <Text M16 color6D>
                                 {start
                                    ? format(start, 'dd-MM-yyyy')
                                    : 'Start Date'}
                              </Text>
                           </TouchableOpacity>
                        </View>
                        <Image
                           source={Assets.icons.ic_arr_right}
                           tintColor={Colors.color28}
                        />
                        <View flex paddingL-16>
                           <TouchableOpacity onPress={() => onPress('end')}>
                              <Text M16 color6D>
                                 {end ? format(end, 'dd-MM-yyyy') : 'End Date'}
                              </Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </View>
               )} */}
            </Box>
        
            <Hint
               targetFrame={targetFrame}
               visible={errors.activities && selectedActions.length === 0}
               color={Colors.red30}
               message={'Please Add Activity'}
               position={Hint.positions.BOTTOM}
               edgeMargins={30}
               enableShadow={true}
               testID={'Hint'}
            />

            <AddActivities
               title={'Activities'}
               data={selectedActions.length > 0 ? selectedActions : []}
            />
            <View
               flex
               style={{ paddingHorizontal: 16, alignItems: 'flex-end' }}>
               <TouchableOpacity onPress={removeChallenge}>
                  <Text>Remove Challenge</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
         {/* <View >
            <Image
               source={Assets.icons.arr_up}
               style={{ marginLeft: visible === 'start' ? 48 : width / 2 + 16 }}
            />
            <View height={2} backgroundColor={Colors.color58} />
            <CalendarContext.Provider value={onDayPress}>
               <CalendarsList />
            </CalendarContext.Provider>
         </View> */}

         <CustomButtonLinear
            title={!id ? 'Create' : 'Update'}
            onPress={!loading ? handleCreateChallenge : () => {}}
            style={{
               marginBottom: bottom,
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
)(observer(CreateChallenge));

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

