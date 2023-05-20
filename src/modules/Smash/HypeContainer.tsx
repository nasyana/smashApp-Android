import { View, Text } from 'react-native'
import React from 'react'
import TakeVideoHype from './TakeVideoHype'
import { inject, observer } from 'mobx-react';
const HypeContainer = ({smashStore}) => {

    if(smashStore.masterIdsToSmash == 0){

        return null
    }
  return (
    <TakeVideoHype smashStore={smashStore} />
  )
}

export default inject('smashStore', 'challengesStore')(observer(HypeContainer));