import {
   useEffect,

   useState
} from 'react';
import {

   ActivityIndicator, StyleSheet
} from 'react-native';

import {
   View
} from 'react-native-ui-lib';

import HomeHeaderWithSearch from '../../components/HomeHeaderWithSearch';

import { inject, observer } from 'mobx-react';

import MyChallengesList from 'modules/UserChallenges/MyChallengesList';



const StreaksHome = (props) => {


   const [loaded, setLoaded] = useState(false);
   // delay loading of screen for 500 ms
   useEffect(() => {
      setTimeout(() => {
       setLoaded(true)
      }, 500);
   }, []);

   const { smashStore } = props;

   const {
      firstTime
   } = smashStore;



   return (
      <View flex>
         <HomeHeaderWithSearch
         streaks
            placeholder={'Find a Challenge'}
            back={false}  /> 
            <View flex>
 
            {/* <HomeScreensNew firstTime={firstTime} /> */}
            {loaded ? <MyChallengesList /> : <View flex center><ActivityIndicator size={'large'} /></View>}
         </View>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(StreaksHome));

const styles = StyleSheet.create({
   lottieView: {
      position: 'absolute',
      top: 35,
      left: 0,
      right: 0,
   },
});
