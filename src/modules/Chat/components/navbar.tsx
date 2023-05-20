import React from 'react'
import { Text, Platform, View } from 'react-native'

export function NavBar() {
  if (Platform.OS === 'web') {
    return null
  }
  return (
    <View
      style={{
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
      }}
    >
      <Text>💬 Gifted Chat{'\n'}</Text>
    </View>
  )
}
