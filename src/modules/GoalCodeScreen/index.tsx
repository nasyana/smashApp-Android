import BarChart from 'components/BarChart';
import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
import Header from 'components/Header';
import ItemFoodDetail from 'components/ItemFoodDetail';
import { FONTS } from 'config/FoundationConfig';
import React, { useState } from 'react';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import { inject, observer } from 'mobx-react';
import {Keyboard} from 'react-native';
import {
   Assets,
   Text,
   View,
   Image,
   Button,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { StyleSheet,ActivityIndicator } from 'react-native';
import { width } from 'config/scaleAccordingToDevice';
import SmartImage from 'components/SmartImage/SmartImage';
import firebaseInstance from 'config/Firebase';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import { AntDesign } from '@expo/vector-icons';
import FindTeamIndicator from '../SignUpStep/FindTeamIndicator';
import { collection, query, where, getDocs,limit } from "firebase/firestore";
import { kFormatter, stringLimit } from 'helpers/generalHelpers';



export const GoalCodeItem = ({ team, goToTeam = false, goal = false,signup = false  }) => {

   const [selected, setSelected] = useState(false);
   
   const targetType = team.targetType || 'points';

   const qtyUnit = targetType == 'qty' ? stringLimit((Object.values(team?.actions)[0]?.text || 'units'), 10) :  'points';

   const size = 50;

   // const challengeTarget = team?.dailyTargets?.[0] || 0;
   const challengeUnit = team.targetType == 'qty' ? team?.unit || 'qty' : 'pts';

   const icon = Assets.icons?.[team?.imageHandle || 'smashappicon']


   return (
      <TouchableOpacity
         onPress={()=>{setSelected(true); goToTeam()}}
         row
         centerV
         paddingR-16
         paddingL-8
         marginT-16
         paddingT-8
         style={{
            borderRadius: 6,
            marginHorizontal: 16,
            backgroundColor: '#FFF',
            paddingBottom: 12,
            overflow: 'hidden',
            marginBottom: 16,
         }}
         // onPress={() => goToProfile(user)}
      >
       <View center style={{ backgroundColor: team.colorStart, borderRadius: (size + 5) / 2, width: size + 5, height: size + 5, marginLeft: 0, marginRight: 12 }}><Image
                        source={icon}
                        style={{
                           height: size,
                           width: size,
                           borderRadius: size / 2,

                        }}
                     />
                     </View>

         <View paddingL-8 flex row spread >
            <View paddingT-0>
               <View spread marginB-4>
                  <Text H14 color28 marginT-0>
                  Reach {kFormatter(team?.target)} {targetType == 'qty' ? qtyUnit : 'pts'} in {team?.endDuration} days
                    
                  </Text>
                  <Text R12>{team?.name || 'anon'}</Text>
                  <Text secondaryContent marginR-16 H12>
                     {team.motto || team.description}
                  </Text>
               </View>
            </View>
         </View>
         {selected  ? <View paddingR-16>{signup ? <AntDesign name="check" color={Colors.green30} size={40}/> : <ActivityIndicator />}</View> : <AntDesign name="right" color={selected ? Colors.green40 : '#eee'} size={40} />}
         
      </TouchableOpacity>
   );
};

const TeamCodeScreen = ({teamsStore}) => {
   const [value, setValue] = useState('');
   const [teams, setTeams] = useState([]);
   const [isFocused, setFocused] = useState(false);
   const { navigate } = useNavigation();
   const {uid} = firebaseInstance.auth.currentUser;
   const onChange = async (value) => {
      if (value && value.length === 4) {
        Keyboard.dismiss();
        const teamDocs = await getDocs(query(collection(firebaseInstance.firestore, 'goals'), where('code', '==', value),where('active', '==', true), limit(5)));
        let teams = [];
        teamDocs.forEach((doc) => {
          if (doc.exists()) {
            teams.push(doc.data());
          }
        });
        setTeams(teams);
      } else {
        setTeams('');
      }
    };

   const goToTeam = (team) => {

    
      // teamsStore.joinTeamInstantly(team.id, uid,team);
      
      setTimeout(() => {
         navigate(Routes.GoalArena, { goalDoc: team });
      }, 1000);
    
   };



   return (
      <View flex>
         <Header title="Enter Goal Code" back />
         <ScrollView keyboardShouldPersistTabs='always'>
         <View
            style={{ marginTop: 30, marginBottom: 30, paddingHorizontal: 20 }}
            row
            spread>
            <TextInput
               // ref={inputRef}
               placeholderTextColor={'#aaa'}
               style={[
                  styles.searchBar,
                  { paddingLeft: 24, fontSize: 16, fontFamily: FONTS.heavy, width: isFocused ? width - 38 : width - 38, borderWidth: 0, padding: 16, borderColor: Colors.smashPink },
               ]}
               
               placeholder="Enter goal code..."
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
            data={teams}
            ListHeaderComponent={teams?.length > 0 ? <View paddingH-24><Text B14>Is this the goal?</Text></View> : null}
          ListEmptyComponent={<FindTeamIndicator goal />}
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
         />}
         </ScrollView>
      </View>
   );
};

const styles = StyleSheet.create({
   searchBar: {
      backgroundColor: Colors.white,
      color: Colors.color28,
      paddingLeft: 10,
      borderRadius: 8,
      // height: 40,
      marginTop: -5,
      width: width - 64,
   },
});

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TeamCodeScreen));
