import {useNavigation} from '@react-navigation/core';
import Header from 'components/Header';
import Input from 'components/Input';
import InputCalendar from 'components/InputCalendar';
import Routes from 'config/Routes';
import {width} from 'config/scaleAccordingToDevice';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, ScrollView} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {View, Colors} from 'react-native-ui-lib';
import ItemRecord from './components/ItemRecord';
const CreateNewRecords = () => {
  const {navigate} = useNavigation();
  const DATA = [
    {title: 'Set #1', kg: '20', rep: '12'},
    {title: 'Set #2', kg: '26', rep: '12'},
    {title: 'Set #3', kg: '30', rep: '12'},
    {title: 'Set #4', kg: '38', rep: '12'},
  ];

  const {control} = useForm({
    defaultValues: {
      name: 'Incline Dumbbell Press',
    },
  });

  return (
    <View flex>
      <Header title="Create New Records" back />
      <ScrollView
        style={{backgroundColor: Colors.background}}
        contentContainerStyle={{
          paddingBottom: getBottomSpace() ? getBottomSpace() + 8 : 16,
        }}>
        <View flex backgroundColor={Colors.background}>
          <View
            padding-16
            paddingB-0
            margin-16
            style={{
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 5,
              backgroundColor: Colors.white,
              borderRadius: 6,
            }}>
            <Controller
              control={control}
              name="name"
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  label="Exercise Name"
                  parentStyle={{marginHorizontal: 0, width: width - 64}}
                />
              )}
            />
            <InputCalendar
              label="Workout Day"
              parentStyle={{marginHorizontal: 0, width: width - 64}}
              calendar={() => {}}
              value={'Jan 20, 2018'}
            />
          </View>
          {DATA.map((item, index) => (
            <ItemRecord
              item={item}
              key={index}
              onPressEdit={() => {
                navigate(Routes.SelectPoint);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateNewRecords;

const styles = StyleSheet.create({});
