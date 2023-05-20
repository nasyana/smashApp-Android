import Box from 'components/Box';
import Header from 'components/Header';
import Input from 'components/Input';
import SmartImage from 'components/SmartImage/SmartImage';
import React, { useEffect, useState } from 'react';
import {
   ActivityIndicator,
   Alert,
   Platform,
   ScrollView,
   StyleSheet,
   Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
   View,
   Text,
   TouchableOpacity,
   Colors, Dialog,
   Button
} from 'react-native-ui-lib';
import TeamPhoto from './TeamPhoto';
import { useRef } from 'react';
import ButtonLinear from 'components/ButtonLinear';
import { AntDesign } from '@expo/vector-icons';
import { bottom, height, width } from 'config/scaleAccordingToDevice';
import { collection, doc, setDoc, arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { inject, observer } from 'mobx-react';
import { TEAM_ACTIONS } from 'stores/teamsStore';
import ManageMembers from './ManageMembers';
import FollowingList from '../TeamArena/components/FollowingList';
import { FONTS } from 'config/FoundationConfig';
import { Vibrate } from 'helpers/HapticsHelpers';
import ImageUpload from 'helpers/ImageUpload';
import SectionHeader from 'components/SectionHeader';
export interface ITeamDoc {
   id?: string;
   name: string;
   motto: string;
   picture: any;
   createdBy?: string;
   active?: boolean;
   timestamp?: number;
   updatedAt: number;
   requested?: string[];
   invited?: string[];
   joined?: string[];
   admins?: string[];
   masterIds?: string[];
   actions?: any;
   mostRecentTarget: number;
   targets: any;
   teamIsPublic: boolean;
}

interface ICreateTeamErrors {
   name: string;
   motto: string;
   activities: string;
}

const firestore = firebaseInstance.firestore;
function CreateTeam(props: any) {

   const mottoInputRef = useRef(null);
   const navigate = useNavigation();
   const { smashStore, teamsStore, actionsStore, route } = props;
   const {
      teamDoc: _teamDoc = {},
      type = false,
      teamId = false,
   } = route?.params || {};
   const { selectedActions = [] } = actionsStore;

   const { myTeamsHash } = teamsStore;

   const teamDoc = teamId ? myTeamsHash?.[teamId] : _teamDoc;
   const {
      libraryActionsList = [],
      endWeekKey,
      currentUser,
      kFormatter,
      currentUserId,
   } = smashStore;
   const { showFollowingDialog, setShowFollowingDialog } = teamsStore;
   const [loading, setLoading] = useState(false);
   const [id, setId] = useState('');
   const [name, setName] = useState('');
   const [motto, setMotto] = useState('');
   const [picture, setPicture] = useState(false);
   const [mostRecentTarget, setMostRecentTarget] = useState(10000);
   const { goBack } = useNavigation();
   const [teamIsPublic, setTeamIsPublic] = useState(false);
   const [initialTarget, setInitialTarget] = useState(10000);

   const [targets, setTargets] = useState({ [endWeekKey]: initialTarget });
   const [errors, setErrors] = useState<ICreateTeamErrors>({
      name: '',
      motto: '',
   });
   const [imageLoading, setImageLoading] = useState(false);
   const targetValues = [
      10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
      110000, 120000, 130000,
   ];
   useEffect(() => {
      if (!teamDoc.id) {
         
         
            teamsStore.setCurrentTeam(false)
         return};
      const {
         id,
         name,
         motto,
         picture,
         masterIds = [],
         mostRecentTarget = 10000,
         targets = {},
         teamIsPublic = false,
      } = teamDoc as ITeamDoc;
      const selectedActions = libraryActionsList.filter((item: any) =>
         masterIds.includes(item?.id),
      );
      setId(id as string);
      setTeamIsPublic(teamIsPublic);
      setName(name);
      setMotto(motto);
      setPicture(picture);
      setTargets(targets);
      setMostRecentTarget(mostRecentTarget);
      actionsStore.setSelectedActions(selectedActions);
   }, [teamDoc]);

   useEffect(() => {
      return () => {
         actionsStore.clearSelectedActions();
      };
   }, []);


   const [result, setResult] = useState(false)

   const onPressLibrary = async () => {
      if (imageLoading) return;
      setImageLoading(true);
      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: Platform.OS === 'ios' ? false : false,
            aspect: [4, 4],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
         });

         if (!result.canceled) {
            setResult(result);

            setImageLoading(false);
         }else{
            setImageLoading(false);


         }
      } catch (e) {
         console.log(e);
         setImageLoading(false);
      }
   };

   const fnReturnLottieView = () => {
      if (imageLoading) {
         return (
            <View
               style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                  overflow: 'hidden',
               }}>
               <View
                  style={[
                     StyleSheet.absoluteFill,
                     { flexDirection: 'row', justifyContent: 'center' },
                  ]}>
                  <ActivityIndicator size="small" color="#ffffff" />
               </View>
            </View>
         );
      } else {
         return null;
      }
   };

   const doValidations = () => {
      const errors: ICreateTeamErrors = { name: '', motto: '', activities: '' };
      if (!name.trim()) errors.name = 'Name cannot be empty';
      if (!motto.trim()) errors.motto = 'Motto cannot be empty';
      
      setErrors(errors);

      return Object.values(errors).every((item) => !item);
   };

   const generateTeamCode = async (id) => {
      const docSnap = await getDoc(doc(firestore, 'teams', 'codes'));
    
      let existingTeamCodes = [];
      if (docSnap.exists()) {
        existingTeamCodes = docSnap.data().codes || [];
      }
    
      const generateNewCode = () => {
        let generatedCode = ImageUpload.teamCode();
    
        while (existingTeamCodes.includes(generatedCode)) {
          generatedCode = ImageUpload.teamCode();
        }
    
        return generatedCode;
      };
    
      const newCode = generateNewCode();
    
      await setDoc(doc(firestore, 'teams', id), { code: newCode }, { merge: true });
      await setDoc(
        doc(firestore, 'teams', 'codes'),
        {
          codes: arrayUnion(newCode),
        },
        { merge: true },
      );
    };
    



    const handleCreateTeam = async () => {

  
      if (!doValidations()) return;

      smashStore.setUniversalLoading(true);
      const uid = firebaseInstance.auth.currentUser.uid;
      const masterIds = selectedActions.map((item) => item.id);
      const actions = selectedActions.reduce((acc, item) => {
        acc[item.id] = { text: item.text, id: item.id, level: item.level };
        return acc;
      }, {}); 
    
      const team: ITeamDoc = {
        name,
        motto,
        picture,
        updatedAt: parseInt(Date.now() / 1000),
        actions,
        masterIds,
        targets,
        mostRecentTarget,
        teamIsPublic,
      };
    
      //If creating team
      if (!id) {
        team.uid = uid;
        team.active = true;
        team.joined = [uid];
        team.admins = [uid];
        team.timestamp = parseInt(Date.now() / 1000);
        team;
      }
      team.uid = uid;
      setLoading(true);
    
      //Update or create team based on id.
      if (id) {
        try {
          await teamsStore.updateTeam({ ...team, id });
          navigate.goBack();
          // navigate('TeamArena', { team });
    
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
    
        if (result) {
          const picture = await smashStore.uploadImage(result);
    
          await setDoc(doc(collection(firestore, "teams"), id), { picture }, { merge: true });
        }
        smashStore.setUniversalLoading(true);
      } else {
        try {
        // Creating Team
  const newTeamRef = doc(collection(firestore, "teams"));
  team.id = newTeamRef.id;
  await teamsStore.createTeam(team, currentUser);
  await teamsStore.createTeamWeeklyActivity(team, currentUser);
  generateTeamCode(team.id);
  teamsStore.getWeeklyActivityOnce(team);

  teamsStore.setShowLibraryActivitiesModal("habitStacks");

  setTimeout(() => {
   smashStore.setUniversalLoading(false);
    navigate.replace("TeamArena", { team, justCreatedTeam: true });
  }, 1000);

  smashStore.setUniversalLoading(false);
  setLoading(false);
  teamsStore.addRemoveTeamInUserDoc(TEAM_ACTIONS.ADD, team.id);

  if (result) {
    const picture = await smashStore.uploadImage(result);
    await setDoc(doc(collection(firestore, "teams"), team.id), { picture }, { merge: true });
  }

        } catch (err) {
          console.log(err);
          setLoading(false);

   smashStore.setUniversalLoading(false);
        }
      }
    };
    

   useEffect(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTargets((state) => ({ ...state, [endWeekKey]: mostRecentTarget }));
   }, [mostRecentTarget]);

   const removeTeam = async () => {
      Alert.alert('Are you sure you want to delete this team', '', [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {

   smashStore.setUniversalLoading(true);
            await updateDoc(doc(collection(firestore, 'teams'), id), { active: false, updatedAt: Date.now() });
            navigate.pop(2);
            teamsStore?.removeTeamFromMyTeamsArray(id);

   smashStore.setUniversalLoading(false);
          },
        },
      ]);
    };
    
   const iconSize = 10;
   const requestToJoin = type == 'requestToJoin' || false;
   const updatingTeam = teamDoc.id?.length > 5;

   const isAdmin = teamDoc?.uid == currentUserId;

   const showCreateTeamButton = !requestToJoin && result?.uri && !updatingTeam && name.trim() && motto.trim();

   return (
      <View flex>
         <Header
            title={
               requestToJoin
                  ? 'Approve Players'
                  : teamDoc.id
                     ? 'Update Team'
                     : 'Create Team'
            }
            back
            customRight={teamDoc.id ? 
               requestToJoin ? (
                  <AntDesign
                     name={'checkcircle'}
                     size={25}
                     color={Colors.white}
                  />
               ) : loading ? (
                  <ActivityIndicator size="small" color="black" />
               ) : (
                  <AntDesign
                     name={'checkcircle'}
                     size={25}
                     color={Colors.buttonLink}
                     onPress={!loading ? handleCreateTeam : () => { }}
                  />
               )
            : null}
         />
         <ScrollView
            scrollEventThrottle={10}
            contentContainerStyle={{
               paddingBottom: 70,
               paddingTop: updatingTeam ? 10 : 10,
            }}>
           <Box style={{width: width - 48, marginLeft: 24, marginTop: 16}}>

           <TeamPhoto
            onPressLibrary={onPressLibrary}
            picture={picture}
            imageLoading={imageLoading}
            result={result}
          />
           </Box>

            {!requestToJoin && (
               <Box style={{ marginTop: 0, marginHorizontal: 24 }}>
                  {!updatingTeam && (
                     <SectionHeader
                        title={'Team Name & Motto'}
                        top={16}
                        bottom={8}
                     />
                  )}

                  {updatingTeam && (
                     <SectionHeader
                        title={'Team Name & Motto'}
                        top={16}
                        bottom={8}
                     />
                  )}
                  <View marginH-16 marginB-8>
                     {/* <View height={1} backgroundColor={Colors.line} /> */}
                  </View>
                  <Input
                     value={name}
                     onChangeText={setName}
                     label={'Name'}
                     returnKeyType='next'
                     autoFocus={true}
                     autofocus
                     autoCapitalize
                     onSubmitEditing={() => mottoInputRef.current.focus()}
                     parentStyle={{
                        ...styles.inputField,
                        borderColor: errors.name ? Colors.red30 : Colors.line,
                     }}
                  />

                  <Input
                     value={motto}
                     onChangeText={setMotto}
                     ref={mottoInputRef}
                     returnKeyType='done'
                     placeholder={'Optional'}
                     description="asd"
                     autoCapitalize
                     onSubmitEditing={handleCreateTeam}
                     label={'Team Motto'}
                     parentStyle={{
                        ...styles.inputField,
                        borderColor: errors.motto ? Colors.red30 : Colors.line,
                     }}
                  />

                
               </Box>
            )}
            <Box style={{ marginTop: requestToJoin ? 24 : 0, width: width - 48, marginLeft: 24 }}>
               {teamDoc?.joined && (
                  <ManageMembers
                     teamDoc={teamDoc}
                     requestToJoin={requestToJoin}
                  />
               )}
            </Box>
          

            {showCreateTeamButton && <ButtonLinear onPress={handleCreateTeam}  title={'Create Team'}/>}
           
            {id && isAdmin && !requestToJoin ? (
               <Button
                  label="DELETE TEAM"
                  color={Colors.buttonLink}
                  onPress={removeTeam}
                  link
                  labelStyle={{
                     fontSize: 12,
                     fontFamily: FONTS.medium,
                     marginLeft: 'auto',
                     marginRight: 32,
                  }}
               />
            ) : null}
         </ScrollView>

         <Dialog
            visible={showFollowingDialog}
            onDismiss={() => setShowFollowingDialog(false)}
            overlayBackgroundColor={Colors.Black54}
            containerStyle={{
               justifyContent: 'flex-end',
               backgroundColor: Colors.white,
               width: '100%',
               paddingBottom: bottom,
            }}
            width="100%"
            bottom>
            <View style={{ height: height / 1.7 }}>
               <FollowingList
                  team={teamDoc}
                  height={height}
                  close={() => setShowFollowingDialog(false)}
               />
            </View>
         </Dialog>
      </View>
   );
}

export default inject(
   'smashStore',
   'actionsStore',
   'teamsStore',
)(observer(CreateTeam));

const styles = StyleSheet.create({
   smartImage: {
      margin: 16,
      height: 120,
      width: width - 80,
      backgroundColor: '#fafafa',
      borderRadius: 4,
      marginHorizontal: 16
   },
   inputField: { marginHorizontal: 16, width: width - 96 },
});
