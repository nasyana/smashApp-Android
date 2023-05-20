import React from 'react';

import { inject, observer } from 'mobx-react';
import { View, Text } from 'react-native-ui-lib';

const HomeHeaderText = ({smashStore,goToProfile}) => {

    const {settings = {}} = smashStore;

  

    return (
        <View style={{ paddingLeft: 16, marginTop: 0, paddingTop: 0 }}>
        <Text R14 contentW >
        Hi{' '}
        <Text B14 white onPress={goToProfile}>
           {smashStore?.currentUser?.name || 'there'}
        </Text>
        ,</Text>
        <Text R14 contentW style={{marginTop: -4}}>
        {smashStore.firstTime ? "Let's get started" : settings?.aWelcomeMessage ? settings?.aWelcomeMessage : 'Today is your day!✨'}<Text style={{color: 'rgba(255,255,255,0.5)'}}>v20.1</Text>
     </Text>
     </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(HomeHeaderText));