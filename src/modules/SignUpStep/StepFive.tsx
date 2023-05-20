import { useNavigation } from '@react-navigation/native';
import FooterLinear from 'components/FooterLinear';
import Input from 'components/Input';
import Routes from 'config/Routes';
import SegmentControl from 'libs/react-native-segment';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet,Keyboard } from 'react-native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import Header from 'components/Header';
import { AntDesign } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import FindTeamIndicator from './FindTeamIndicator'
import { FONTS } from 'config/FoundationConfig';
import { collection, query, where, limit, getDocs, getDoc, doc } from 'firebase/firestore';

import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';


import { width } from 'config/scaleAccordingToDevice';
import SmartImage from 'components/SmartImage/SmartImage';
import firebaseInstance from 'config/Firebase';
import { GoalCodeItem } from 'modules/GoalCodeScreen';

const firestore = firebaseInstance.firestore;
const StepFive = ({ teamsStore, smashStore, challengesStore }) => {

  const {currentUser} = smashStore;

  const { navigate } = useNavigation();

  const {uid} = firebaseInstance.auth.currentUser;
  const [navTeam, setTeam] = useState(false);

  const [items, setItems] = useState([]);
  const [value, setValue] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(false);
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    challengesStore.fetchChallenges();
  // smashStore.subscribeToCurrentUser({uid})
    return () => {
     
    }
  }, [])


  const onNext = useCallback(async () => {

console.log('selectedGoalxx',selectedGoal)


//get user doc from firestore using uid

const userDoc = await getDoc(doc(firestore, 'users', uid));

const user = userDoc.data();

if(selectedGoal){

  const joinType = selectedGoal?.allowOthersToHelp ? 'contributor' : 'competitor'
  console.log('selectedGoal',selectedGoal,currentUser,joinType);
  challengesStore.toggleMeInGoal(
    selectedGoal,
    user,
    false,
    joinType);

    navigate(Routes.StepFour, { firstTime: true, selectedGoal: selectedGoal || false });
    
} else if (navTeam.id) {

      // navigate(Routes.MainTab, { firstTime: true, team: navTeam });
   
      teamsStore.joinTeamInstantly(navTeam.id, uid,navTeam);
      navigate(Routes.StepFour, { firstTime: true, team: navTeam });

    }else{


      navigate(Routes.StepFour, { firstTime: true });

    }


  }, [navTeam, selectedGoal]);

  const { control } = useForm({
    defaultValues: {
      tall: '',
      weight: '',
    },
  });

 const onChange = async (value) => {
      if (value && value.length === 4) {
        Keyboard.dismiss();
        const teamDocs = await getDocs(query(collection(firebaseInstance.firestore, 'teams'), where('code', '==', value),where('active', '==', true), limit(5)));
        const goalDocs = await getDocs(query(collection(firebaseInstance.firestore, 'goals'), where('code', '==', value),where('active', '==', true), limit(5)));
        
        let items = [];
        // let teams = [];

        teamDocs.forEach((doc) => {
          if (doc.exists()) {
            items.push({...doc.data(), type: 'team'});
          }
        });

        goalDocs.forEach((doc) => {
          if (doc.exists()) {
            items.push({type: 'goal', ...doc.data()});
          }
        });


        setItems(items);
        // setGoals(goals)
      } else {
        setItems('');
        // setGoals('')
      }
    };


   

  





  const Team = ({ team, goToTeam }) => {


    const isSelected = navTeam?.id == team.id

    return (
      <TouchableOpacity
        onPress={navTeam ? () => setTeam(false) : () => setTeam(team)}
        row
        centerV
        style={{
          borderRadius: 6,
          marginHorizontal: 16,
          backgroundColor: '#FFF',
          paddingBottom: 12,
          paddingRight: 16,
          //  overflow: 'hidden',
          marginBottom: 8,
          borderWidth: isSelected ? 1 : 0
        }}
      // onPress={() => goToProfile(user)}
      >
        <TouchableOpacity paddingT-16 paddingL-16>
          {/* <Avatar source={Assets.icons.img_latest} /> */}
          <SmartImage
            uri={team?.picture?.uri}
            preview={team?.picture?.preview}
            style={{
              height: 50,
              width: 50,
              borderRadius: 60,
              backgroundColor: '#eee',
            }}
          />
        </TouchableOpacity>

        <View paddingL-16 flex row spread>
          <View paddingT-4>
            <View spread marginB-4>
              <Text H14 color28 marginT-16>
                {team?.name || 'anon'}
              </Text>
              <Text secondaryContent marginR-16 H14>
                {team.motto}
              </Text>
            </View>
          </View>
        </View>
   <AntDesign name="check" color={navTeam ? Colors.green40 : '#eee'} size={40} />
      </TouchableOpacity>
    );
  };
  console.log('selectedGoal33',selectedGoal)
  const CustomRight = () => {

    return (<TouchableOpacity onPress={onNext} row centerV>
      <Text smashPink B16 marginR-4>{(navTeam || selectedGoal) ? 'Next' : 'Skip'}</Text><AntDesign
        name={'right'}
        size={18}
        color={Colors.smashPink}
      />
    </TouchableOpacity>
    )

  }
  return (
    <View flex backgroundColor={Colors.contentW}>
      <Header noShadow back customRight={<CustomRight />} />
      <Text H36 marginL-24>
        Step 3/5
      </Text>
      <Text R18 marginL-24>
        Did you get an invite code?
      </Text>
      <Text secondaryContent R14 marginL-24 marginR-24 marginT-8>If someone sent you a team or goal code, you can enter it here.</Text>
      <View flex paddingT-8>
        {/* <Controller
          control={control}
          name="tall"
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              onChangeText={onChange}
              label={'Team Code'}
              keyboardType={'number-pad'}
            />
          )}
        />   */}

        <View
          style={{ marginTop: 16, marginBottom: 30, paddingHorizontal: 20 }}
          row
          spread>
          <TextInput
            // ref={inputRef}
            placeholderTextColor={'#aaa'}
            style={[
              styles.searchBar,
              { paddingLeft: 24, fontSize: 16, fontFamily: FONTS?.heavy, width: isFocused ? width - 38 : width - 38, borderWidth: 1, borderRadius: 4, padding: 16, borderColor: Colors.smashPink },
            ]}

            placeholder="Enter invite code..."
            value={value}
            onChangeText={(newValue) => {
              setValue(newValue);
              onChange(newValue);
            }}
            onFocus={() => {
              setFocused(true);
              // onFocus(true);
            }}
            onBlur={() => {
              setFocused(false);
              // onFocus(false);
            }}
            autoFocus
            keyboardType="numeric"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            autoCompleteType="off"
            returnKeyType="done"
          />
        </View>

        {value?.length > 3 && <FlatList
          keyboardShouldPersistTabs='always'
          scrollEnabled={false}
          data={items}
          ListHeaderComponent={items?.length > 0 ? <View paddingH-24><Text B14>Want to join?</Text></View> : null}
          ListEmptyComponent={<FindTeamIndicator />}
          renderItem={({ item }) => {

            if(item.type == 'goal'){

              return (
                <GoalCodeItem
                signup
                goal
                selected={selectedGoal.id == item.id}
                  team={item}
                  goToTeam={() => {

                    if(selectedGoal){

                      // alert('1')
                      setSelectedGoal(false)
                    }else{
                      // alert('3')
                      setSelectedGoal(item)
                    }
                  
                  }}
                />
              );
            }else{
              return (
                <Team
                  team={item}
                  goToTeam={() => {
                    goToTeam(item);
                  }}
                />
              );

            }
           
          }}
        />}

{/* {value?.length > 3 && <FlatList
          keyboardShouldPersistTabs='always'
          scrollEnabled={false}
          data={goals}
          ListHeaderComponent={goals?.length > 0 ? <View paddingH-24><Text B14>Is this the goal?</Text></View> : null}
          ListEmptyComponent={<FindTeamIndicator />}
          renderItem={({ item }) => {
            return (
              <GoalCodeItem
              goal
                team={item}
                goToTeam={() => {
                  goToTeam(item);
                }}
              />
            );
          }}
        />} */}
     
      </View>
      {navTeam && <FooterLinear title={navTeam ? 'NEXT' : 'SKIP'} onPress={onNext} />}
    </View>
  );
};

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(StepFive));

const styles = StyleSheet.create({});
