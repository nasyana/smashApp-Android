import { View, Text } from 'react-native-ui-lib'
import React, { useState, useEffect } from 'react'
import AnimatedView from './AnimatedView';

const BadgeSeparator = ({ index }) => {

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const timeout = setTimeout(() => {

            setLoading(false)
        }, (index + 1) * 50);

        return () => {
            clearTimeout(timeout);
        }
    }, [])


    return (

        <View flex style={{ height: 42, justifyContent: 'center', borderWidth: 0, borderColor: '#fff' }}>
            {!loading && <AnimatedView ><View style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.4)' }} /></AnimatedView>}
        </View>
    )
}

export default BadgeSeparator