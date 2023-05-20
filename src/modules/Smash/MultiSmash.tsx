import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {bottom} from 'config/scaleAccordingToDevice';
import {StyleSheet} from 'react-native';
import {View, Colors} from 'react-native-ui-lib';

import Routes from 'config/Routes';
import ScrollPicker from './components/ScrollPicker';
import ButtonLinear from 'components/ButtonLinear';

const SelectPoint = () => {
   const {navigate} = useNavigation();
   return (
      <View flex backgroundColor={Colors.white} row>
         {/* <ScrollPicker unit={"kg"} /> */}

         <View width={8} backgroundColor={Colors.line} />
         <ScrollPicker unit={'rep'} />
         <ButtonLinear
            title={'Done'}
            onPress={() => {
               navigate(Routes.CreateNewRecords);
            }}
            style={{
               position: 'absolute',
               bottom: bottom,
            }}
         />
      </View>
   );
};

export default SelectPoint;

const styles = StyleSheet.create({});
