import Box from 'components/Box';
import CustomButtonLinear from 'components/CustomButtonLinear';
import Header from 'components/Header';
import Input from 'components/Input';
import SmartImage from 'components/SmartImage/SmartImage';
import React, { useEffect, useState } from 'react';
import {
   ActivityIndicator,
   Platform,
   ScrollView,
   StyleSheet,
} from 'react-native';
import {
   View,
   Text,
   TouchableOpacity,
   Colors,
   Assets,
   Image,
   Dialog,
} from 'react-native-ui-lib';
import { bottom, height, width } from 'config/scaleAccordingToDevice';
import Firebase from 'config/Firebase';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { inject, observer } from 'mobx-react';
import { TEAM_ACTIONS } from 'stores/teamsStore';
import AddActivities from 'modules/CreateChallenge/components/AddActivities';
import ManageMembers from './ManageMembers';
import FollowingList from '../TeamArena/components/FollowingList';
import WeeklyTargetsJourney from '../../modules/TeamArena/WeeklyTargetsJourney';
import LottieAnimation from 'components/LottieAnimation';
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
}

interface ICreateTeamErrors {
   name: string;
   motto: string;
}

function SetWeeklyActivities(props: any) {
   const navigate = useNavigation();
   const { smashStore, teamsStore, actionsStore, route } = props;
   const { teamDoc = {} } = route?.params || {};
   const { selectedActions = [] } = actionsStore;
   const { libraryActionsList = [] } = smashStore;
   const { showFollowingDialog, setShowFollowingDialog } = teamsStore;
   const [loading, setLoading] = useState(false);
   const [id, setId] = useState('');
   const [name, setName] = useState('');
   const [motto, setMotto] = useState('');
   const [picture, setPicture] = useState(false);
   const [errors, setErrors] = useState<ICreateTeamErrors>({
      name: '',
      motto: '',
   });
   const [imageLoading, setImageLoading] = useState(false);

   useEffect(() => {
      if (!teamDoc.id) return;
      const { id, name, motto, picture, masterIds = [] } = teamDoc as ITeamDoc;
      const selectedActions = libraryActionsList.filter((item: any) =>
         masterIds.includes(item?.id),
      );
      setId(id as string);
      setName(name);
      setMotto(motto);
      setPicture(picture);
      actionsStore.setSelectedActions(selectedActions);
   }, [teamDoc]);

   useEffect(() => {
      return () => {
         actionsStore.clearSelectedActions();
      };
   }, []);

   const onPressLibrary = async () => {
      if (imageLoading) return;

      const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: Platform.OS === 'ios' ? false : false,
         aspect: [4, 3],
         durationLimit: 60,
         mediaTypes:
            Platform.OS === 'ios'
               ? ImagePicker.MediaTypeOptions.All
               : ImagePicker.MediaTypeOptions.Images,
      });
      setImageLoading(true);
      const picture = await smashStore.uploadImage(result);
      setPicture(picture);
      setTimeout(() => {
         setImageLoading(false);
      }, 2000);
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
                  backgroundColor: Colors.background,
               }}>
               <View
                  style={[
                     StyleSheet.absoluteFill,
                     { flexDirection: 'row', justifyContent: 'center' },
                  ]}>
                  <LottieAnimation
                     autoPlay
                     loop={true}
                     style={{
                        width: 200,
                        height: 200,
                        zIndex: 5,
                        marginTop: -10,
                     }}
                     source={require('../../lotties/loadingCamera.json')}
                  />
               </View>
            </View>
         );
      } else {
         return null;
      }
   };

   const doValidations = () => {
      const errors: ICreateTeamErrors = { name: '', motto: '' };
      if (!name.trim()) errors.name = 'Name cannot be empty';
      if (!motto.trim()) errors.motto = 'Motto cannot be empty';
      setErrors(errors);

      return Object.values(errors).every((item) => !item);
   };

   const handleCreateTeam = async () => {
      if (!doValidations()) return;
      const uid = Firebase.auth.currentUser.uid;
      const masterIds = selectedActions.map((item) => item.id);
      const actions = selectedActions.reduce((acc, item) => {
         acc[item.id] = { text: item.text };
         return acc;
      }, {}); // makes item = { [12341234]: { text: '1k Walk' }, [1234123423]: 'Pushups' }

      const team: ITeamDoc = {
         name,
         motto,
         picture,
         updatedAt: Date.now() / 1000,
         actions,
         masterIds,
      };

      //If creating team
      if (!id) {
         team.createdBy = uid;
         team.active = true;
         team.joined = [uid];
         team.admins = [uid];
         team.timestamp = Date.now() / 1000;
      }

      setLoading(true);

      //Update or create team based on id.
      if (id) {
         try {
            await teamsStore.updateTeam({ ...team, id });
            // navigate.goBack();
            navigate.goBack();

            setLoading(false);
         } catch (err) {
            console.log(err);
            setLoading(false);
         }

         smashStore.simpleCelebrate = {
            name: 'Nice! Interesting Stack!',
            title: 'Press the magic smash button at the bottom of this screen to play.',
            subtitle: 'Smash smash smash!',
         };
      } else {
         try {
            // Creating Team
            const newTeamRef = Firebase.firestore.collection('teams').doc();
            team.id = newTeamRef.id;
            await teamsStore.createTeam(team);
            navigate.goBack();
            // navigate.goBack();
            setLoading(false);
            teamsStore.addRemoveTeamInUserDoc(TEAM_ACTIONS.ADD, team.id);
         } catch (err) {
            console.log(err);
            setLoading(false);
         }
      }
   };
   const hasActivities = selectedActions?.length > 0;
   return (
      <View flex style={{ backgroundColor: Colors.background }}>
         <Header title={'Choose Weekly Activities'} back={hasActivities} />
         <ScrollView scrollEventThrottle={10}>
            {/* <SmartImage
               uri={picture?.uri}
               preview={picture?.preview}
               isShowLottie={imageLoading}
               lottieViewComponent={fnReturnLottieView}
               style={styles.smartImage}
            /> */}

            {/* <Box style={{ marginTop: 16 }}>
               <Text marginT-13 marginB-11 marginL-16 uppercase H14>
                  New Team
               </Text>

               <View height={1} backgroundColor={Colors.line} marginB-16 />

               <Input
                  value={name}
                  onChangeText={setName}
                  label={'Name'}
                  parentStyle={{
                     ...styles.inputField,
                     borderColor: errors.name ? Colors.red30 : Colors.line,
                  }}
               />

               <Input
                  value={motto}
                  onChangeText={setMotto}
                  label={'Motto'}
                  parentStyle={{
                     ...styles.inputField,
                     borderColor: errors.motto ? Colors.red30 : Colors.line,
                  }}
               />
            </Box> */}
            <View style={{ padding: 16, marginTop: 32 }}>
               <AddActivities
                  title={'Activities'}
                  data={selectedActions.length > 0 ? selectedActions : []}
               />
            </View>
         </ScrollView>

         {hasActivities && (
            <CustomButtonLinear
               title={'Done'}
               onPress={!loading ? handleCreateTeam : () => {}}
               style={{
                  marginBottom: bottom,
               }}
               loader={
                  loading ? (
                     <ActivityIndicator size="small" color="#ffffff" />
                  ) : null
               }
            />
         )}

         {/* <Dialog
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
         </Dialog> */}
      </View>
   );
}

export default inject(
   'smashStore',
   'actionsStore',
   'teamsStore',
)(observer(SetWeeklyActivities));

const styles = StyleSheet.create({
   smartImage: {
      margin: 16,
      height: 150,
      width: width - 32,
      backgroundColor: '#ccc',
      borderRadius: 4,
      top: 10,
      position: 'absolute',
   },
   inputField: { marginHorizontal: 16, width: width - 64 },
});
