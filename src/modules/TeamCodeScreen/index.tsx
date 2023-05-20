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
import Firebase from 'config/Firebase';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import { AntDesign } from '@expo/vector-icons';
import FindTeamIndicator from '../SignUpStep/FindTeamIndicator';
import { collection, query, where, getDocs,limit } from "firebase/firestore";
import firebaseInstance from '../../config/Firebase';


const Team = ({ team, goToTeam }) => {

   const [selected, setSelected] = useState(false);
   return (
      <TouchableOpacity
         onPress={()=>{setSelected(true); goToTeam()}}
         row
         centerV
         paddingR-16
         style={{
            borderRadius: 6,
            marginHorizontal: 16,
            backgroundColor: '#FFF',
            paddingBottom: 12,
            overflow: 'hidden',
            marginBottom: 8,
         }}
         // onPress={() => goToProfile(user)}
      >
         <TouchableOpacity paddingT-16 paddingL-16 onPress={goToTeam} >
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

         <View paddingL-16 flex row spread >
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
         {selected  ? <View paddingR-16><ActivityIndicator /></View> : <AntDesign name="check" color={selected ? Colors.green40 : '#eee'} size={40} />}
         
      </TouchableOpacity>
   );
};

const TeamCodeScreen = ({teamsStore}) => {
   const [value, setValue] = useState('');
   const [teams, setTeams] = useState([]);
   const [isFocused, setFocused] = useState(false);
   const { navigate } = useNavigation();
   const {uid} = Firebase.auth.currentUser;
   const onChange = async (value) => {
      if (value && value.length === 4) {
        Keyboard.dismiss();
        const teamDocs = await getDocs(query(collection(firebaseInstance.firestore, 'teams'), where('code', '==', value),where('active', '==', true), limit(5)));
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

    
      teamsStore.joinTeamInstantly(team.id, uid,team);
      
      setTimeout(() => {
         navigate(Routes.TeamArena, { team });
      }, 1000);
    
   };



   return (
      <View flex>
         <Header title="Enter Team Code" back />
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
               
               placeholder="Enter team code..."
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
            ListHeaderComponent={teams?.length > 0 ? <View paddingH-24><Text B14>Is this your team?</Text></View> : null}
          ListEmptyComponent={<FindTeamIndicator />}
            renderItem={({ item }) => {
               return (
                  <Team
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
