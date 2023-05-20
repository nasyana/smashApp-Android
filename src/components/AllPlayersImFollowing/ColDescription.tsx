import React from 'react'
import { View, Colors, Image, Assets, Text, Avatar } from "react-native-ui-lib";
export default function ColDescription() {
    return (
        <View paddingV-16 >
            <View paddingL-24 flex row spread paddingR-24>
                <Text>Rank</Text>
                <View center row spread paddingR-16><Text marginR-30 >Points</Text><Text>Likes</Text></View>
            </View>
        </View>
    )
}
