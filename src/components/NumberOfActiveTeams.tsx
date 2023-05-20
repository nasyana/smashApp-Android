import { View, Text } from 'react-native-ui-lib'
import React, { useEffect, useState } from 'react'
import Firebase from '../config/Firebase'
import Box from './Box';

const NumberOfActiveTeams = () => {


    const [numberOfActiveTeams, setNumberOfActiveTeams] = useState(44);
    //useEffect to load teams count where team.active is true from firebase firestore

    useEffect(() => {
        const unsubscribe = Firebase.firestore.collection('teams').where('active', '==', true).onSnapshot((snapshot) => {
            setNumberOfActiveTeams(snapshot.size)
            /// Orani
        })
        return () => unsubscribe()
    }, [])


const labelForNumberOfTeams = numberOfActiveTeams == 1 ? 'Team' : 'Teams';   

  return (
    <View paddingT-24>
        <Box>
            <View padding-16 center>
      <Text B14>{numberOfActiveTeams} {labelForNumberOfTeams} Smashing Goals! 🚀🚀</Text>
      </View>
      </Box>
    </View>
  )
}

export default NumberOfActiveTeams