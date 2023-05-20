
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { Assets, Colors, View, Text, Image, SegmentedControl, SegmentedControlItemProps, ProgressBar, TouchableOpacity } from "react-native-ui-lib";
import Routes from 'config/Routes';
import ButtonLinear from 'components/ButtonLinear';
const ChallengeActivities = (props) => {
    const { navigate } = useNavigation();
    const { challenge, smashStore, challengesStore } = props;


    const {
        libraryActivitiesHash,
        setMasterIdsToSmash,
    } = smashStore;



    const challengeDescription = challenge?.description || 'notink';
    const { playerChallengeHashByChallengeId } = challengesStore;
    const playerChallenge =
        playerChallengeHashByChallengeId?.[challenge.id] || false;
    const masterIds = playerChallenge?.masterIds || challenge?.masterIds || [];

    const alreadyPlaying = playerChallenge;
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {


        const timeout = setTimeout(() => {
            setLoaded(true)
        }, 5000)


        return () => { clearTimeout(timeout) }


    }, [challenge.id])
    const goToActivitiesListLast7 = (id = false) => {

        // alert(id)
        // return
      
        navigate(Routes.ActivitiesListLast7, {activitiesToShow: id ? [id] : masterIds});
        //navigate to ActivitiesListLast7
     }

     const goToSingleActivity = (id = false) => { 


        navigate(Routes.ViewActivity, { activity: libraryActivitiesHash?.[id]});
     }


    if (!loaded) { return null }

    return (
        <View>
            {/* <AntDesign name={'checksquareo'} size={18} color={Colors.color6D} /> */}
            <View row marginB-16 marginH-16>
                <SimpleLineIcons name={'check'} size={18} color={Colors.color6D} />

                <View>
                    {/* <Text R14 marginH-16>
                        {challengeDescription}
                    </Text> */}
                    {/* <Text>Habits Included: </Text> */}
                    <View marginH-16 marginB-8><Text R14>Habits Included: </Text></View>
                    <View
                        style={{
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            marginHorizontal: 16,
                            marginTop: 0,
                        }}>

                        {masterIds.map((id) => {
                            const a = libraryActivitiesHash?.[id];
                            return (
                                <TouchableOpacity
                                    key={id}
                                    onPress={()=>goToSingleActivity(id)
                                        // alreadyPlaying
                                        //     ? () => setMasterIdsToSmash([a?.id])
                                        //     : () => null
                                    }
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 16,
                                        padding: 4,
                                        paddingHorizontal: 8,
                                        margin: 3,
                                        marginLeft: 0,
                                        marginVertical: 3,
                                    }}>
                                    <Text R12>{a?.text || 'nada'}</Text>
                                </TouchableOpacity>
                            );
                        })}
                 
                    </View>
                    {/* <TouchableOpacity onPress={goToActivitiesListLast7} style={{padding: 16, borderWidth: 1}}><Text R14>See All</Text></TouchableOpacity> */}
                </View>
             
            </View>
            {/* {alreadyPlaying && <ButtonLinear bordered onPress={()=>goToActivitiesListLast7(false)} title="See All Stats" color={'#333'} style={{marginBottom: 16}} icon={<Ionicons size={16} name="stats-chart" />} />} */}
        </View>
    )
}

export default ChallengeActivities