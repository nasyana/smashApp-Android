import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native-ui-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AsyncStorageDataDisplay = () => {
  const [data, setData] = useState({});


  const getAsyncStorageData = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();

      console.log('allKeys',allKeys)
      const allData = await AsyncStorage.multiGet(allKeys);

      // console.log('allData',typeof allData)
      const formattedData = {};
      allData.forEach((item) => {

          // console.log('item[0]',item[1])
        formattedData[item[0]] = JSON.parse(item[1]);
      });
      setData(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  const clearAllAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully!');
    } catch (error) {
      console.log('Error clearing AsyncStorage:', error);
    }
  };
  

  useEffect(() => {
   
    getAsyncStorageData();
  }, [AsyncStorage]);


  // return a view that maps out all of the keys in asyncStorage
  return (
    <View padding-24>
      {Object.keys(data).map((key) => {
        return (
          <View key={key}>
            <Text>{key}</Text>
            {/* <Text>{JSON.stringify(data[key])}</Text> */}
          </View>
        );
      })}
    </View>
  );
};

export default AsyncStorageDataDisplay;
