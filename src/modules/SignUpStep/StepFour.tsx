import { useNavigation } from '@react-navigation/native';
import FooterLinear from 'components/FooterLinear';
import Input from 'components/Input';
import Routes from 'config/Routes';
import SegmentControl from 'libs/react-native-segment';
import React, { useCallback, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, ScrollView } from 'react-native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import WalkthroughChallenge from "../../modules/Home/components/WalkthroughChallenge";
import WalkthroughSmashItem from "../../modules/ChallengeArena/components/ActivitiesSmashList/WalkthroughSmashItem"
import { AntDesign } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import firebaseInstance from '../../config/Firebase';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
const firestore = firebaseInstance.firestore;
import SignupChallenge from '../../components/SignupChallenge/components/Challenge';
import { Audio } from 'expo-av';
import Header from 'components/Header';
const StepFour = (props) => {
  const { navigate } = useNavigation();
 
  const { control } = useForm({
    defaultValues: {
      age: '',
    },
  });
  const [settings, setSettings] = useState({})
  const { smashStore, challengesStore, route } = props;

  const team = route?.params?.team || false;

  const selectedGoal = route?.params?.selectedGoal || false;

  const { currentUser } = smashStore;
  const {toggleMeInChallenge} = challengesStore

  const [challengesArray, setChallengesArray] = useState([])
  const [challengesHash, setChallengesHash] = useState({})
  const [selected, setSelected] = useState([]);



  const numberToSelect = settings?.aNumberChallengesToSelect || 3;
  const numberSelectedSoFar = selected?.length || 0;
  const numberRemainingToSelect = numberToSelect - numberSelectedSoFar;

  const onNext = useCallback(async () => {

    const userDoc = await getDoc(doc(firestore, 'users', firebaseInstance.auth.currentUser.uid));

const user = userDoc.data();

    selected.forEach(cId => {

      const challengeToJoin = challengesHash[cId]
      toggleMeInChallenge(challengeToJoin, user, false, false, false);

    })

    navigate(Routes.StepThree, { firstTime: true, team});
  }, [selected]);

  const playSound = async ()=> {
    const { sound } = await Audio.Sound.createAsync(
       require('../../../assets/sounds/select.mp3')
    );
    // setSound(sound);
 
    await sound.playAsync();
 }

  const handlePress = (id, challenge) => {

    playSound()
   
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {


      setSelected([...selected, id]);


    //   smashStore.simpleCelebrate = {
    //     name: `Nice!`,
    //     title: `You joined ${challenge.name} Habit Challenge!`,
    //     subtitle: `You need to aim for minimum ${challenge?.dailyTargets?.[0]} ${challenge.unit || 'pts'} each day to reach your daily goal. Try to get your first 3 day streak! 🔥🔥🔥`,
    //     button: "Got it! Let's Go!",
    //     nextFn: false,
    //  };
    }
  }


  useEffect(() => {
    const unsubscribeToSettings = onSnapshot(doc(collection(firestore, 'generalSettings'), 'smashAppSettings'), (snap) => {
      setSettings(snap.data());
    });

    return () => {
      if (unsubscribeToSettings) {
        unsubscribeToSettings();
      }
    };
  }, []);
  

  useEffect(() => {
    const hideChallenges = [];
    const challengesQuery = query(
      collection(firestore, 'challenges'),
      where('active', '==', true),
      where('new', '==', true),
      where('challengeType', '==', 'user')
    );
  
    const unsubscribeToChallenges = onSnapshot(challengesQuery, (snaps) => {
      const challengesHash = {};
      if (!snaps.empty) {
        const challengesArray = [];
  
        snaps.forEach((snap) => {
          const challenge = snap.data();
          challengesArray.push(challenge);
          challengesHash[challenge.id] = challenge;
        });
        setChallengesHash(challengesHash);
        setChallengesArray(challengesArray);
      }
    });
  
    return () => {
      if (unsubscribeToChallenges) {
        unsubscribeToChallenges();
      }
    };
  }, []);
  

const skip = () =>{

  navigate(Routes.StepThree, { firstTime: true });
}

 const CustomRight = () => {


  let selectLabel = selectedGoal ? 'Select Consistency Challenges' : `Select ${numberRemainingToSelect} More`;

  if(numberSelectedSoFar == 0 ){selectLabel = `Select ${numberToSelect} Challenges`;}

  return (<View row><TouchableOpacity onPress={(numberRemainingToSelect > 0 && !selectedGoal) ? ()=> null : onNext} centerV>

    {(numberRemainingToSelect > 0 && !selectedGoal)? <Text R14 marginR-24>{selectLabel}</Text> : <View row centerV><View row centerV marginR-24><Text R14 >{numberSelectedSoFar} Selected </Text> 
    <AntDesign
            name={'check'}
            size={18}
            color={Colors.green40}
         /></View>
    
    <Text smashPink  B16 marginR-4>{(selectedGoal && numberSelectedSoFar == 0) ? 'Skip' : 'Next'}</Text><AntDesign
            name={'right'}
            size={18}
            color={Colors.smashPink}
         />
     </View>}
     
  </TouchableOpacity>
 {/* {team && <TouchableOpacity onPress={skip}><Text R14>Skip</Text></TouchableOpacity>} */}
  </View>
  )

}
// console.warn(settings.aHideChallenges);

  // const challenge = { name: 'Productivity Challenge', score: 22470, target: 40000, daysLeft: 4, id: 'rlMDiEK0ZmTEku3lj1hY' }
  // const challengeTwo = { name: 'Focus Challenge', score: 1770, target: 30000, daysLeft: 28 }
  // const activities = [{ label: 'Morning Coffee', pointsValue: 350, level: 'Easy' }, { label: 'Create Plan for the Day', pointsValue: 300, level: 'Medium' }, { label: '1Litre Water', pointsValue: 200, level: 'Medium' }]
  return (
    <View
      flex
     
      backgroundColor={Colors.contentW}
      onTouchStart={() => {
        Keyboard.dismiss();
      }}>
        <Header noShadow back customRight={<CustomRight />} />

      <ScrollView>
      <Text H36 marginL-24>
           Step 4/5 
        </Text>
        <View row marginH-24><Text H36 style={{fontSize: 22}} >
          {settings?.messages?.explainerLifestyleH1 || "Join Challenges"}
           {/* <AntDesign name={'infocirlceo'} size={20} color={Colors.grey50} /> */}
        </Text></View>
        {/* <Text R18 marginH-24>
        You have two choices of Challenges in SmashApp. 
      </Text> */}
        {/* <Text R18 marginH-24 marginT-16>{"Select 3 Challenges to get you started."} </Text> */}
        {/* <Text R16 marginH-24 marginT-16>{settings?.messages?.explainerLifestyleH2 || "Think of challenges like little games that have valueable habit stacks. "} </Text>
        <Text R16 marginH-24 marginT-16 color6D>{settings?.messages?.explainerLifestyleDescription || "Select the challenges that have the habits that you want in your life that you would like to be consistent with. Then reach the daily target set in each challenge. You get points for doing the habits that move you forward."}</Text> */}
  <Text R18 marginH-24 marginT-10>{settings?.messages?.explainerLifestyleH2 || "Select " + numberToSelect + " Challenges to get you started."} </Text>
        <Text R14 marginH-24 marginT-16 color6D>{settings?.messages?.explainerLifestyleDescription || "Try them for a week and see how you go. You can easily leave and join other challenges at any time."}</Text>

        {/* <Text R16 marginH-24 marginT-16 smashPink>Choose your first Challenges below</Text> */}
        <View flex paddingT-16>

         
      </View>
      <View margin-16>
      {challengesArray?.map((challenge)=>{

        if(settings?.aHideChallenges?.includes(challenge.id))return null
        const selectedChallenge = selected.includes(challenge.id)
        return <SignupChallenge key={challenge.id} selected={selectedChallenge} handlePress={()=>handlePress(challenge.id, challenge)}  challenge={challenge}/>
      //   return <TouchableOpacity 
      //   key={challenge.id}
      //   onPress={() => handlePress(challenge.id)}
      //   style={[
      //     styles.challenge,
      //     selected.includes(challenge.id) && styles.selected
      //   ]}
      // >
      //   <Text style={styles.challengeName}>{challenge.name}</Text>
      //   <Text style={styles.challengeDescription}>{challenge.description}</Text>
      // </TouchableOpacity>
      })}
      </View>
      </ScrollView>
      {/* <FooterLinear title={numberRemainingToSelect > 0 ? `SELECT ${numberRemainingToSelect} MORE` : 'NICE! ALL SET!'} onPress={numberRemainingToSelect > 0 ? ()=>null : onNext} /> */}
    </View>
  );
};

export default inject("smashStore", "challengesStore")(observer(StepFour));

const styles = StyleSheet.create({
  challenge: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  selected: {
    backgroundColor: 'blue',
  },
  challengeName: {
    fontWeight: 'bold',
  },
  challengeDescription: {
    marginTop: 5,
  },
});
