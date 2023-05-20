import {View, Text, Colors,TouchableOpacity} from 'react-native-ui-lib';
import React,{useEffect} from 'react';
import AnimatedView from 'components/AnimatedView'

const FindTeamIndicator = ({isGoal}) => {

    const [loaded, setLoaded] = React.useState(false);


    useEffect(() => {
     
        setTimeout(() => {

            setLoaded(true)
        }, 1000);
      return () => {
        
      }
    }, [])
    

    if(!loaded){return <View paddingH-32><Text R14 secondaryContent>Searching...</Text></View>}
  return (
   <AnimatedView><View paddingH-32><Text R14 secondaryContent>Hmmm can't find a {isGoal ? 'goal' : 'team'} with that code...</Text></View></AnimatedView>
  )
}

export default FindTeamIndicator