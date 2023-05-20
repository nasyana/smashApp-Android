import React, { useCallback, useEffect, useState } from 'react';
import { width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';

import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import {
   View,
   Text,
   Colors,
   Switch,
   TouchableOpacity,
   ExpandableSection
} from 'react-native-ui-lib';
import { METRICS } from 'config/SecondaryMetrics';

import Input from 'components/Input';
import Firebase from 'config/Firebase';
import ImageUpload from 'helpers/ImageUpload';
import ButtonLinear from 'components/ButtonLinear';
import PickerComponent from 'components/PickerComponent';
import { isArray } from 'lodash';
import SectionHeader from 'components/SectionHeader';
import { AntDesign } from '@expo/vector-icons';

const AddActivity = (props: any) => {
   const { smashStore } = props;
   const {
      editingActivity,
      settings,
      levelColors,
      currentUser,
      returnActionPointsValue,
      libraryActionsList
   } = smashStore;
   const { actionLevelLabels, actionLevelDescriptions, activityCategoryLabels } = settings;
   const { actionCategory } = props;
   const [level, setLevel] = useState(editingActivity?.level);
   const [activityCategory, setActivityCategory] = useState(editingActivity?.actionCategory || [actionCategory]);
   const [actionCategories, setActionCategories] = useState(editingActivity?.actionCategories || []);
   const [showBaseMetric, setShowBaseMetric] = useState(false);
   const [showBenefits, setShowBenefits] = useState(false);
   const [visible, setVisible] = useState(false);
   const [benefits, setBenefits] = useState(editingActivity?.benefits || []);
   //    const [level, setLevel] = useState(editingActivity.level);
  

   const clear = () => {
      smashStore.editingActivity = false;
   };

   const [hideMulti, setHideMulti] = useState(
      editingActivity?.hideMulti || false,
   );

   const [hideFromTeams, setHideFromTeams] = useState(   editingActivity?.hideFromTeams || false,)

   const remove = () => {
      Alert.alert('Are you sure?', 'Remove this activity?', [
         {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
         },
         {
            text: 'OK',
            onPress: () =>
               Firebase.firestore
                  .collection('feed')
                  .doc(editingActivity.id)
                  .update({ active: false })
                  .then(() => {
                     smashStore.editingActivity = false;
                  }),
         },
      ]);
   };

   const setActivity = useCallback(
      ({
         text,
         description,
         activityValue,
         bonus,
         benefitOne,
         benefitTwo,
         benefitThree,
         secondaryMultiplier,
         secondaryMetric,
         baseActivity,
         baseMultiplier,
      }) => {
         const cat = isArray(activityCategory)
            ? activityCategory
            : [activityCategory] || editingActivity.actionCategory || [];
         const benefits = [benefitOne, benefitTwo, benefitThree];
         const id = editingActivity?.id || ImageUpload.uid();
      
         const finalActivity = {
            id,
            text,
            hideMulti,
            secondaryMultiplier: parseInt(secondaryMultiplier) || 1,
            secondaryMetric,
            baseActivity: baseActivity || false,
            baseActivityId: baseActivity?.value || false, 
            baseActivityLabel: baseActivity?.label || false,
            baseMultiplier: parseInt(baseMultiplier) || 1,
            benefits,
            description,
            activityValue: parseInt(activityValue),
            hideFromTeams,
            level: parseInt(level),
            bonus: parseInt(bonus),
            type: 'Action',
            isLibraryAction: true,
            active: true, //
            actionCategory: [...cat],
            actionCategories: [...cat],
            updatedAt: parseInt(Date.now() / 1000),
            timestamp: parseInt(Date.now() / 1000),
         };

         Firebase.firestore
            .collection('feed')
            .doc(finalActivity.id)
            .set(finalActivity, { merge: true })
            .then(() => {
               smashStore.editingActivity = false;
            });
      },
      [level, hideMulti,activityCategory, hideFromTeams],
   );

   const { control, handleSubmit, register, reset } = useForm({
      defaultValues: {
         text: editingActivity?.text || '',
         baseActivity: editingActivity?.baseActivity || false,
         secondaryMultiplier: editingActivity?.secondaryMultiplier || 1,
         secondaryMetric: editingActivity?.secondaryMetric || '',
         baseMetric: editingActivity?.baseMetric || '',
         baseMultiplier: String(editingActivity?.baseMultiplier || 1),
         benefitOne: editingActivity?.benefits?.[0] || '',
         benefitTwo: editingActivity?.benefits?.[1] || '',
         benefitThree: editingActivity?.benefits?.[2] || '',
         description: editingActivity?.description || '',
         activityValue: editingActivity?.activityValue
            ? String(editingActivity?.activityValue)
            : returnActionPointsValue(editingActivity) &&
              returnActionPointsValue(editingActivity).toString(),
         bonus: editingActivity?.bonus ? String(editingActivity?.bonus) : '0',
      },
   });

   useEffect(() => {
      return () => {
         smashStore.editingActivity = false;
      };
   }, []);

   const baseActivities = libraryActionsList?.filter((a)=> a?.actionCategories?.includes(actionCategory))?.map((a)=>{return {id: a.id, value: a.id, option: a.text}}) || [];
   // const dropdownIcon = <Entypo size={24} color="black" name="chevron-down" />;

   const handlePressActionCatergory = (cat) => { 

         if(actionCategories.includes(cat)) {

            setActivityCategory([...activityCategory]?.filter((c) => c != cat));
            setActionCategories([...actionCategories]?.filter((c) => c != cat))

            
         }else{

            setActivityCategory([...actionCategories,cat]);
            setActionCategories([...actionCategories,cat])
            /// add cat to actionCategories

            /// set actionCategory to cat. 
         }
         
         
   }

   return (
      <View flex>
         <View
            paddingT-0
            backgroundColor={Colors.white}
            margin-16
            style={{
               borderRadius: 6,
               shadowColor: '#000',
               shadowOffset: {
                  width: 0,
                  height: 1,
               },
               shadowOpacity: 0.22,
               shadowRadius: 2.22,
               elevation: 3,
            }}>
            <View row spread centerV paddingH-16>
               <Text marginV-12 H14 color28 uppercase>
                  Activity
               </Text>

               <TouchableOpacity onPress={clear}>
                  <Text buttonLink>Cancel</Text>
               </TouchableOpacity>
            </View>
            <View height={1} backgroundColor={Colors.line} marginB-16 />
            <Controller
               control={control}
               name="text"
               render={({ field: { value, onChange } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     disabled={!currentUser.superUser}
                     label={'Activity Name'}
                     parentStyle={{ marginHorizontal: 16, width: width - 64 }}
                  />
               )}
            />
            <Controller
               control={control}
               name="description"
               render={({ field: { value, onChange, ref } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Description'}
                     inputRef={ref}
                     // multiline={true}
                     parentStyle={{ marginHorizontal: 16, width: width - 64 }}
                  />
               )}
            />

<View row style={{flexWrap: 'wrap', padding: 16 }}>
               {activityCategoryLabels?.map((label, index) => { 
                  
                  const selected = activityCategory?.includes(index);
                  return <TouchableOpacity onPress={()=>handlePressActionCatergory(index)} padding-8 margin-2 style={{borderWidth: 1, borderRadius: 4, borderColor: selected ? '#333' : '#ccc'}}><Text R14 style={{color: selected ? '#333' : '#aaa'}}>{label}</Text></TouchableOpacity> })}
            </View>

            {currentUser.superUser && (
               <Controller
                  control={control}
                  name="activityValue"
                  render={({ field: { value, onChange, ref } }) => {

            
                     return (
                        <Input
                           value={value}
                           onChangeText={onChange}
                           label={'Activity Value'}
                           inputRef={ref}
                           parentStyle={{
                              marginHorizontal: 16,
                              width: width - 64,
                           }}
                        />
                     )
                  }}
               />
            )}

           
            {(currentUser.superUser || currentUser.activityManager) && false && (
               <ScrollView
                  horizontal={true}
                  contentContainerStyle={{ paddingLeft: 16, marginBottom: 16 }}
                  horizontalScrollIndicator={false}>
                  {actionLevelLabels?.map((label, index) => {
                     const isSelected = level === index;
                     return (
                        <TouchableOpacity
                           onPress={() => {
                              setLevel(index);
                           }}
                           style={{
                              borderWidth: isSelected ? 1 : 1,
                              padding: 16,
                              paddingVertical: 8,
                              borderColor: isSelected
                                 ? levelColors[level]
                                 : '#eee',
                              borderRadius: 4,
                              marginBottom: 4,
                              backgroundColor: isSelected
                                 ? levelColors[level]
                                 : '#fff',
                              marginRight: 8,
                           }}>
                           <Text
                              B14
                              style={{
                                 color: isSelected
                                    ? '#fff'
                                    : Colors.secondaryContent,
                              }}>
                              {label}{' '}
                           </Text>
                           <Text
                              R10
                              style={{
                                 color: isSelected
                                    ? '#fff'
                                    : Colors.secondaryContent,
                              }}>
                              {actionLevelDescriptions[index]}
                           </Text>
                        </TouchableOpacity>
                     );
                  })}
               </ScrollView>
            )}

            {currentUser.superUser && false && (
               <Controller
                  control={control}
                  name="bonus"
                  render={({ field: { value, onChange, ref } }) => (
                     <Input
                        value={value}
                        onChangeText={onChange}
                        label={'Bonus'}
                        inputRef={ref}
                        parentStyle={{
                           marginHorizontal: 16,
                           width: width - 64,
                        }}
                     />
                  )}
               />
            )}
<View padding-16><SectionHeader style={{ marginLeft: 8, marginBottom: showBaseMetric ? 0 : 0, paddingBottom: 0 }} title={`Base Metric`} 
                onPress={() => setShowBaseMetric(!showBaseMetric)} subtitle={!showBaseMetric ? <AntDesign name="down" size={16} /> : <AntDesign name="up" size={16} />} /></View>
<ExpandableSection expanded={showBaseMetric}>
            <Controller
               control={control}
               name="baseActivity"
               render={({ field: { value, onChange, ref } }) => (
                  <PickerComponent
                     ref={ref}
                     value={value}
                     onChange={onChange}
                     data={baseActivities}
                     control={control}
                     visible={visible}
                     setVisible={setVisible}
                     title="Base Activity"
                  />
               )}
            />
            {(currentUser.activityManager || currentUser.superUser) && (
               <Controller
                  control={control}
                  name="baseMultiplier"
                  render={({ field: { value, onChange, ref } }) => (
                     <Input
                        value={value}
                        inputRef={ref}
                        onChangeText={onChange}
                        label={'Base Metric Multiplier'}
                        parentStyle={{
                           marginHorizontal: 16,
                           width: width - 64,
                        }}
                     />
                  )}
               />
            )}
  </ExpandableSection>


            {/* <Controller
               control={control}
               name="secondaryMetric"
               render={({ field: { value, onChange, ref } }) => (
                  <PickerComponent
                     ref={ref}
                     value={value}
                     onChange={onChange}
                     data={METRICS}
                     control={control}
                     visible={visible}
                     setVisible={setVisible}
                     title="Secondary Metric"
                  />
               )}
            />

            {(currentUser.activityManager || currentUser.superUser) && (
               <Controller
                  control={control}
                  name="secondaryMultiplier"
                  render={({ field: { value, onChange, ref } }) => (
                     <Input
                        value={value}
                        inputRef={ref}
                        onChangeText={onChange}
                        label={'Secondary Metric Multiplier'}
                        parentStyle={{
                           marginHorizontal: 16,
                           width: width - 64,
                        }}
                     />
                  )}
               />
            )} */}

            {/* <PickerComponent
               data={METRICS}
               control={control}
               visible={visible}
               setVisible={setVisible}
               title="Pri Metric"
            /> */}
            <View padding-16><SectionHeader style={{ marginLeft: 8, marginBottom: showBenefits ? 0 : 0, paddingBottom: 0 }} title={`Activity Benefits`} 
                onPress={() => setShowBenefits(!showBenefits)} subtitle={!showBenefits ? <AntDesign name="down" size={16} /> : <AntDesign name="up" size={16} />} /></View>
<ExpandableSection expanded={showBenefits}>
            <Controller
               control={control}
               name="benefitOne"
               render={({ field: { value, onChange, ref } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Benefit One'}
                     inputRef={ref}
                     parentStyle={{ marginHorizontal: 16, width: width - 64 }}
                  />
               )}
            />

            <Controller
               control={control}
               name="benefitTwo"
               render={({ field: { value, onChange, ref } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Benefit Two'}
                     inputRef={ref}
                     parentStyle={{ marginHorizontal: 16, width: width - 64 }}
                  />
               )}
            />

            <Controller
               control={control}
               name="benefitThree"
               render={({ field: { value, onChange, ref } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Benefit Three'}
                     inputRef={ref}
                     parentStyle={{ marginHorizontal: 16, width: width - 64 }}
                  />
               )}
            />

</ExpandableSection>
            {(currentUser.superUser || currentUser.activityManager) && (
               <View flex row spread marginH-16 marginB-16 paddingH-16>
                  <View flex marginT-8>
                     <Text M16 color6D>
                        Hide Multiple Smash?
                     </Text>
                  </View>
                  <Switch
                     height={35}
                     width={53}
                     onColor={Colors.color44}
                     offColor={Colors.color6D}
                     value={hideMulti}
                     onValueChange={(val) => setHideMulti(val)}
                     thumbSize={30}
                  />
               </View>
            )}

{(currentUser.superUser || currentUser.activityManager) && (
               <View flex row spread marginH-16 marginB-16 paddingH-16>
                  <View flex marginT-8>
                     <Text M16 color6D>
                        Hide from Teams?
                     </Text>
                  </View>
                  <Switch
                     height={35}
                     width={53}
                     onColor={Colors.color44}
                     offColor={Colors.color6D}
                     value={hideFromTeams}
                     onValueChange={(val) => setHideFromTeams(val)}
                     thumbSize={30}
                  />
               </View>
            )}

            {/* <Input
               value={2}
               onChangeText={setLevel}
               label={'Level'}
               parentStyle={{ marginHorizontal: 16, width: width - 64 }}
            /> */}
            {currentUser.superUser && (
               <TouchableOpacity onPress={remove} paddingL-16 paddingB-16>
                  <Text red20>Delete</Text>
               </TouchableOpacity>
            )}
         </View>
         <ButtonLinear
            title={'Done'}
            onPress={handleSubmit(setActivity)}
            style={{ marginTop: 10 }}
         />
      </View>
   );
};

export default inject(
   'createChallengeStore',
   'actionsStore',
   'smashStore',
   'teamsStore',
)(observer(AddActivity));

const styles = StyleSheet.create({});
