import React, { useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import {Text} from 'react-native-ui-lib'
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import Routes from 'config/Routes';
import Firebase from '../config/Firebase';

const StoryProfileImage = ({ smashStore, goToProfile, teamsStore }) => {
  const { currentUser, tempStory } = smashStore;
  const {friendsUserHash} = teamsStore  
  const playerId = tempStory?.uid;

    const avatar = friendsUserHash?.[playerId]?.picture || currentUser?.picture;
  const profileImageHeight = 40;

  return (
    <TouchableOpacity onPress={goToProfile} playerId={playerId}>
        {/* <Text white>{JSON.stringify(prevPictureRef?.current?.uri)}</Text>
        <Text white>{JSON.stringify(avatar?.uri)}</Text> */}
      <SmartImage
        uri={avatar?.uri}
        preview={avatar?.preview}
        style={{
          borderRadius: profileImageHeight / 2,
          height: profileImageHeight,
          width: profileImageHeight,
        }}
      />
    </TouchableOpacity>
  );
};

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(StoryProfileImage));
