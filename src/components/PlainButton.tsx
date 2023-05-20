
import React from 'react'
import { TouchableOpacity,View, Text  } from 'react-native-ui-lib'

const PlainButton = ({title = 'no title', onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} marginH-16 marginB-8 padding-8 style={{backgroundColor: '#ccc', borderRadius: 8}}>
      <Text M16 center>{title}</Text>
    </TouchableOpacity>
  )
}

export default PlainButton