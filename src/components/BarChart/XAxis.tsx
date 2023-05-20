import React from 'react'
import { View, Text } from "react-native-ui-lib";

const XAxis = (props) => {

    const { last7DaysShort, chartWidth } = props;
    return (
        <View row spread style={{ position: "absolute", width: '100%', borderWidth: 1, borderColor: '#333' }}>
            {last7DaysShort?.map((d) => <Text>{d}</Text>)}
        </View>
    )
}

export default XAxis
