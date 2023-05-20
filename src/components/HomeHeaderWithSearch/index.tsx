import { ReactNode, useEffect, useState } from 'react';

import { inject, observer } from 'mobx-react';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import User from './User';
import {
   Platform,
   StyleSheet
} from 'react-native';

import {
   View, Text,
   Image,
   Assets,
   Colors,
   TouchableOpacity
} from 'react-native-ui-lib';

import Routes from 'config/Routes';
import AnimatedView from 'components/AnimatedView';
import NotificationIconBadge from 'modules/Home/NotificationIconBadge';
import HomeHeaderText from 'components/HomeHeaderText';
import PremiumBadge from 'components/PremiumBadge';
const isAndroid = Platform.OS === 'android';
interface Props {
   btnLeft?: ReactNode;
   btnRight?: ReactNode;
   title?: string;
   onPress?: () => void;
   value?: string;
   onChangeText?: (value: string) => void;
   onClearText?: () => void;
   back?: boolean;
   placeholder?: string;
   smashStore?: any;
   firstTime?: boolean;
   findChallenge?: any;
   toggleFindChallenge?: any;
}

const HomeHeaderWithSearch = inject('smashStore','challengesStore')(
   observer((props: Props) => {

      const { navigate } = useNavigation();

      const {
         smashStore,
         team = false,
         activity = false,
         goals = false,
         streaks = false,
         challengesStore
      } = props;

      const [loaded, setLoaded] = useState(!isAndroid)
const {setGoalModal} = challengesStore

      useEffect(() => {

         if (isAndroid) {

            setTimeout(() => {
               setLoaded(true)
            }, 1000);
         } else {

            setLoaded(true)
         }



         return () => {

         }
      }, [])

      const goToProfile = () => navigate('MyProfile');


      const goToChallengesScreen = () => {
         navigate(Routes.JoinChallenges);
      };

      const goToCreateTeam = () => {
         navigate(Routes.CreateTeam);
      };



      const insets = useSafeAreaInsets();

      console.log('check rerenders HomeHeaderWithSearch', activity, team);


      const goToExplore = () => {
         navigate(Routes.Explore);
      }
      //  if(!loaded)return
const showGoalModal = () => {

   navigate(Routes.CreateGoal)
   // setGoalModal(true)
}

      return (
         <LinearGradient
            style={[styles.container, { paddingTop: insets.top - 16 }]}
            colors={streaks ? ['#FF7F00','#FF7F00','#FFBA00' ] : goals ? ['#FF5E3A', '#FF2A68'] : activity ? [Colors.smashPink, Colors.teamToday] : team ? ['#333', '#000'] : ['#FF5E3A', '#FF2A68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>

            <View row centerV spread paddingR-12>
               <View paddingH-16 row center>
                  <Text H36 white>{goals ? 'Goals' : activity ? 'Activity' : team ? 'Teams' : 'Streaks'}</Text>
                  <PremiumBadge />

               </View>
               {(team || !activity) && !goals && <TouchableOpacity onPress={goals ? showGoalModal : team ? goToCreateTeam : goToChallengesScreen}>{!activity && <AntDesign name="plus" size={30} color={'#fff'} />}</TouchableOpacity>}
            {goals && <TouchableOpacity onPress={showGoalModal}><AntDesign name="plus" size={30} color={'#fff'} /></TouchableOpacity> }
           
            </View>


            {activity && <Image
               source={Assets.icons.img_star}
               style={{
                  position: 'absolute',
                  right: 24,
                  bottom: 0,
               }}
            />}

            {true && <View row paddingH-16 spread centerV>

               <View row>
                  <User goToProfile={goToProfile} smashStore={smashStore} />

                  {loaded && <AnimatedView>
                     <HomeHeaderText goToProfile={goToProfile} />
                  </AnimatedView>}

               </View>

               {loaded && <AnimatedView height={24}><NotificationIconBadge /></AnimatedView>}
            </View>}



            <View style={{ height: 8 }} />
            {activity && <View style={{ position: 'absolute', top: 54, right: 16 }} centerV><TouchableOpacity onPress={goToExplore} centerV><View row style={{ backgroundColor: 'rgba(0,0,0,0)', borderRadius: 30, paddingHorizontal: 8 }} centerV ><AntDesign name="search1" size={16} color={'#fff'} /><Text white B14 marginL-4 marginT-0>Find Players</Text></View></TouchableOpacity></View>}
         </LinearGradient>
      );
   }),
);

export default HomeHeaderWithSearch;

const styles = StyleSheet.create({
   container: {
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 2,
      paddingBottom: 0,
      backgroundColor: Colors.buttonLink,
      zIndex: 100,
   },
});
