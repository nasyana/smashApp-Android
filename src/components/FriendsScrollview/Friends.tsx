import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, FlatList } from 'react-native';
import {
   Avatar,
   AvatarHelper,
   Colors,
   Typography,
   View,
   Text,
   TouchableOpacity
} from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import AvatarContainer from './AvatarContainer';
import firebaseInstance from '../../config/Firebase';



const Friends = ({ teamsStore }) => {

console.log('render friends');
 
const renderItem = ({ item, index }) => {
  const { uid } = firebaseInstance.auth.currentUser;
  if (item.uid === uid) {
    return null;
  }
  return (
    <View style={styles.section}>
      <AvatarContainer playerId={item.uid} player={item} updatedAt={item.updatedAt} index={index} />
    </View>
  );
};



console.log('friends rerenders')

  return (
    <FlatList
      horizontal
      keyExtractor={(item) => item.uid}
      data={teamsStore.activePlayersLocal}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};



export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(Friends));

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
});


