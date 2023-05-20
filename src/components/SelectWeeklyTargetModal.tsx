import { useState, useRef, useEffect } from 'react';

import {
  Alert
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { View, Text, Modal, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';

import firebaseInstance from 'config/Firebase';
import { doc, onSnapshot, collection, writeBatch } from "firebase/firestore";
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';
import AnimatedView from './AnimatedView';
import Box from './Box';
import { kFormatter } from 'helpers/generalHelpers';
const firestore = firebaseInstance.firestore;


const SelectWeeklyTargetModal = ({ teamsStore, smashStore}) => {

    const ref = useRef();

    // useEFfect to get the team and set in state

   

    // const team = theTeam ? myTeamsHash?.[theTeam.id] || false : false
    const [team, setTeam] = useState({});

    useEffect(() => {

      const theTeam = teamsStore.showSetWeeklyTargetModal ? teamsStore.showSetWeeklyTargetModal : false;

      if(!theTeam){return}
        const teamDocRef = doc(firestore, "teams", theTeam?.id);

        const unsub = onSnapshot(teamDocRef, (doc) => {
          setTeam(doc.data());
        });
      
        return () => {
          if (unsub) {
            unsub();
          }
        };
      }, [teamsStore.showSetWeeklyTargetModal]);
    

    const dismissModal = () => {

        teamsStore.setShowSetWeeklyTargetModal(false);
    }

    const updateTeamTarget = async (teamId, amount) => {

      const {serverTimestamp} = smashStore;
        if (parseInt(team.mostRecentTarget) + amount <= 0) {
          Alert.alert('Oops!', 'You cannot set a target below 0');
          return;
        }
      
        const endWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');
        const newTarget = parseInt(team.mostRecentTarget) + amount;
      
        const teamRef = doc(collection(firestore, 'teams'), teamId);
        const weeklyActivityRef = doc(firestore, 'weeklyActivity', `${teamId}_${endWeekKey}`);
      
        const batch = writeBatch(firestore);
      
        batch.set(
          teamRef,
          {
            targets: { [endWeekKey]: newTarget },
            mostRecentTarget: newTarget,
            updatedAt: serverTimestamp,
          },
          { merge: true }
        );
      
        batch.set(
          weeklyActivityRef,
          { 
            target: newTarget,
            updatedAt: serverTimestamp,
          },
          { merge: true }
        );
      
        await batch.commit();
      }
      

    const buttonStyle = { padding: 8, paddingHorizontal: 16, borderWidth: 1, borderRadius: 24, borderColor: '#aaa' }
    return (


        <Modal
            visible={teamsStore.showSetWeeklyTargetModal?.name ? true : false}
            transparent={true}
            animationType="fade"
            style={{
                alignItems: 'center',
                justifyContent: 'center'
            }}>


            <View
                style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    position: 'absolute',
                    height,
                    width,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <AnimatedView>
                    <View ref={ref}>
                        <Box

                            style={{
                                // height: height / 1.7,
                                width: width - 32,
                                paddingTop: 32,
                                paddingBottom: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 24,
                                backgroundColor: '#fff'
                            }}>
                            <Text R14 secondaryContent>{team?.name} </Text>
                            <Text B22>Change Weekly Target</Text>

                            <View row centerV spread style={{ width: width - (width / 5), }} marginV-24 >
                                <TouchableOpacity
                                    row
                                    centerV
                                    style={buttonStyle}
                                    onPress={() => updateTeamTarget(team.id, -10000)}
                                >

                                    <AntDesign name="minus" size={22} color="black" />
                                    <Text R14>Remove 10k</Text>
                                </TouchableOpacity>
                                <Text B24>{team?.mostRecentTarget && `${kFormatter(team?.mostRecentTarget)}`}</Text>
                                <TouchableOpacity
                                    row
                                    centerV
                                    style={buttonStyle}
                                    onPress={() => updateTeamTarget(team.id, 10000)}
                                >

                                    <AntDesign name="plus" size={22} color="black" />
                                    <Text R14>Add 10k</Text>
                                </TouchableOpacity>
                            </View>

                            <ButtonLinear title="Done" full onPress={dismissModal} />

                        </Box>
                    </View>
                </AnimatedView>
            </View>
        </Modal>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(SelectWeeklyTargetModal));