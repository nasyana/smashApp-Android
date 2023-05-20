import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks';
import { View, Colors, TouchableOpacity} from 'react-native-ui-lib';
import { FONTS } from 'config/FoundationConfig';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { width } from 'config/scaleAccordingToDevice';
type SearchBoxProps = UseSearchBoxProps & {
   onChange: (newValue: string) => void;
   onFocus: (value: boolean) => void;
};

export function SearchBox({ onChange, onFocus, ...props }: SearchBoxProps) {

   const navigation = useNavigation();
   const { query, refine } = useSearchBox(props);
   const [value, setValue] = useState(query);
   const inputRef = useRef<TextInput>(null);
   // Track when the value coming from the React state changes to synchronize
   // it with InstantSearch.

   const [isFocused, setFocused] = useState(false);
   useEffect(() => {
      if (query !== value) {
         try {
            refine(value);
         } catch (err) {
            console.log(err);
         }
      }
   }, [value, refine]);


   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {

         setFocused(true);
         onFocus(true);
        console.log('Screen is focused');
      });
   
     return () => {
       if(unsubscribe){unsubscribe()}
     }
   }, [])


   // Track when the InstantSearch query changes to synchronize it with
   // the React state.
   useEffect(() => {
      // We bypass the state update if the input is focused to avoid concurrent
      // updates when typing.
      if (!inputRef.current?.isFocused() && query !== value) {
         setValue(query);
      }
   }, [query]);

   return (
      <View style={{ marginTop: 30, paddingHorizontal: 20 }} row spread>
         <TextInput
            ref={inputRef}
            autoFocus={true}
            placeholderTextColor={'grey'}
            style={[
               styles.searchBar,
               { paddingLeft: 24, fontSize: 16, fontFamily: FONTS.heavy, width: isFocused ? width - 38 : width - 38, borderWidth: 0, padding: 16, borderColor: Colors.smashPink },
            ]}
            placeholder="Find Players to Follow"
            value={value}
            onChangeText={(newValue) => {
               
               // if newValue is greater than 2 then return
               if (newValue.length > 1) {
                 setFocused(true);
               onFocus(true);
               }else if (newValue.length <= 2){
                  setFocused(false);
                  onFocus(false);
               }
               setValue(newValue);
               onChange(newValue);
            }}
            onFocus={() => {
               // setFocused(true);
               // onFocus(true);
            }}
            onBlur={() => {
               setFocused(false);
               onFocus(false);
            }}
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            autoCompleteType="off"
            returnKeyType="search"
         />
         {/* {isFocused && (
            <TouchableOpacity
               onPress={() => {
                  setFocused(false);
                  onFocus(false);
                  inputRef.current?.blur();
               }}
               style={{ width: 40, position: 'absolute', right: 16 }}>
               <Ionicons
                  name="ios-close"
                  size={30}
                  color={Colors.secondaryContent}
               />
            </TouchableOpacity>
         )} */}
      </View>
   );
}

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
