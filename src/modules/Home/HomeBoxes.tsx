import { useNavigation } from '@react-navigation/core';
import ItemWorkOutPlan from 'components/ItemWorkOutPlan';
import SegmentedRoundDisplay from 'components/SegmentedRoundDisplay';
import { FONTS } from 'config/FoundationConfig';
import Routes from 'config/Routes';
import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import {
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   FlatList,
   RefreshControl,
   Keyboard,
   Modal,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import {
   bottom,
   height,
   width,
   isSmall,
} from '../../config/scaleAccordingToDevice';
import {
   Text,
   View,
   Image,
   Assets,
   Button,
   Colors,
   Avatar,
   Dialog,
   PanningProvider,
} from 'react-native-ui-lib';
import SegmentControl from 'libs/react-native-segment';
import HomeHeaderWithSearch from '../../components/HomeHeaderWithSearch';
import CohersionSwiper from './components/CohersionSwiper';
import TodayPoints from './components/TodayPoints';
import BarChart from '../../components/BarChart';
import AnimatedAppearance from '../../components/AnimatedAppearance';
import MyChallenge from './components/MyChallenge';
import { inject, observer } from 'mobx-react';
import NotificationIconBadge from './NotificationIconBadge';
import CohersionSwipeContainer from './components/CohersionSwipeContainer';
import { useFocusEffect } from '@react-navigation/native';
import Firebase from 'config/Firebase';
import LottieAnimation from 'components/LottieAnimation';
import JoinChallenges from 'modules/JoinChallenges';
import Box from 'components/Box';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';
import TodaySmashes from './components/TodaySmashes';
import ButtonLinear from 'components/ButtonLinear';
import { AntDesign, Feather } from '@expo/vector-icons';
import FriendsScrollview from '../../components/FriendsScrollview';
import { AnimatedView } from '../../components/Animations';
import FeedPreview from 'components/FeedPreview';
import StarterTask from './components/StarterTask';
import HomeScreens from './HomeScreens';
import { LinearGradient } from 'expo-linear-gradient';
import MyTeamsHome from 'modules/MyTeamsHome';
import CoolNotice from './components/CoolNotice';
import PlayAgainModal from './PlayAgainModal';
import TodaysTargetsHorizontal from 'modules/Home/TodaysTargetsHorizontal';
import Shimmer from 'components/Shimmer';
import TeamsTodayTargetsList from './TeamsTodayTargetsList';
// import {AnimatedView} from "../../components/Animations";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SectionHeader from 'components/SectionHeader';
import TodaysTargets from './TodaysTargets';
import TeamsTodayTargetsHorizontal from './TeamsTodayTargetsHorizontal';
import Insights from 'modules/Overview/Insights';
import { kFormatter } from 'helpers/generalHelpers';
const HomeBoxes = (props) => {
   const { challengesStore, smashStore, teamsStore } = props;
   const {
      numChallenges,
   } = challengesStore;
   const { numberOfTeams = 0 } = teamsStore;
   const { selectedDay,currentUserFollowing } = smashStore;
   const selectedDayScore = selectedDay.score || 0;
   const [loaded, setLoaded] = useState(false);

   const {  smashEffects } = smashStore;

   const { myTeams } = teamsStore;

 

   const { navigate } = useNavigation();
   // const goToCamera = () => { navigate(Routes.TakeVideo) }



   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 700);

      return () => {};
   }, []);

   const goToFollowing = () => {

      const {currentUser} = smashStore;
      navigate('FollowingNew', { user: currentUser });
   };

   const goToDailyDetail = () => {
      smashEffects();
      navigate(Routes.DailyDetail, { showHeader: true });
   };

   const goToChallenges = () => {
      navigate(Routes.MyTeamsList);
   };

   return (
      <View style={{ height: 110 }}>
         {!loaded && numChallenges > 0 && (
            <View flex row spread marginT-8>
               <Box
                  style={{
                     flex: 1,
                     padding: 16,
                     marginRight: 0,
                     marginLeft: 16,
                  }}>
                  <TouchableOpacity onPress={goToDailyDetail}>
                     <Text B10={isSmall}>You Today</Text>
                     <Text B28 meToday marginT-8>
                        ...
                        {/* {kFormatter(selectedDayScore || 0)} */}
                     </Text>
                  </TouchableOpacity>
               </Box>
               <Box
                  style={{
                     flex: 1,
                     margin: 0,
                     padding: 16,
                     marginRight: 0,
                     marginLeft: 8,
                  }}>
                  <TouchableOpacity onPress={goToFollowing}>
                     <Text B10={isSmall}>Following</Text>
                     <Text B28 buttonLink marginT-8>
                        ...
                      
                     </Text>
                  </TouchableOpacity>
                  {/* <Text>Teams</Text>
               <Text B24 buttonLink marginT-8>
                  {numUserChallengeTargetsCompletedToday} /{' '}
                  {numUserChallengeTargetsToday}
               </Text> */}
               </Box>
               <Box
                  style={{
                     flex: 1,
                     padding: 16,
                     marginRight: 16,
                     marginLeft: 8,
                  }}>
                  <TouchableOpacity onPress={goToChallenges}>
                     <Text B10={isSmall}>My Teams</Text>
                     <Text B28 buttonLink marginT-8>
                        ...
                        {/* {numCompletedChallenges} /  */}
                        {/* {numCompletedChallenges}/{numChallenges} */}
                     </Text>
                  </TouchableOpacity>
               </Box>
            </View>
         )}

         {numChallenges > 0 && loaded && (
            <View flex row spread marginT-8>
               <Box
                  style={{
                     flex: 1,
                     padding: 16,
                     marginRight: 0,
                     marginLeft: 16,
                  }}>
                  <TouchableOpacity onPress={goToDailyDetail}>
                     <Text B10={isSmall}>You Today</Text>
                     <AnimatedView>
                        <Text B28 meToday marginT-8>
                           {kFormatter(selectedDayScore || 0)}
                        </Text>
                     </AnimatedView>
                  </TouchableOpacity>
               </Box>

               <Box
                  style={{
                     flex: 1,
                     margin: 0,
                     padding: 16,
                     marginRight: 0,
                     marginLeft: 8,
                  }}>
                  <TouchableOpacity onPress={goToFollowing}>
                     <Text B10={isSmall}>Following</Text>
                     <AnimatedView>
                        <Text B28 buttonLink marginT-8>
                           {currentUserFollowing?.length || 0}
                           {/* {allActivities.length || 0} */}
                        </Text>
                     </AnimatedView>
                  </TouchableOpacity>
              
               </Box>
               <Box
                  style={{
                     flex: 1,
                     padding: 16,
                     marginRight: 16,
                     marginLeft: 8,
                  }}>
                  <TouchableOpacity onPress={goToChallenges}>
                     <Text B10={isSmall}>My Teams</Text>
                     <AnimatedView>
                        <Text B28 buttonLink marginT-8>
                           {/* {numCompletedChallenges} /  */}
                           {numberOfTeams}
                           {/* {numCompletedChallenges}/{numChallenges} */}
                        </Text>
                     </AnimatedView>
                  </TouchableOpacity>
               </Box>
            </View>
         )}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(HomeBoxes));
