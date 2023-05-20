import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

const DelayLoading = ({ children, delay = 500 }) => {

    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoaded(true)
        }, delay);

        return () => {
            if (timeout) { clearTimeout(timeout) }
        }
    }, [])


    if (!loaded) { return null }

    return children || null
}

export default DelayLoading