import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Assets, Image, Colors, View } from 'react-native-ui-lib';
import Routes from 'config/Routes';
import Walkthoughs from 'modules/Walkthoughs';
import { NavigationContainer } from '@react-navigation/native';
import UserDayView from 'modules/ViewDay/UserDayView';
import { FONTS } from 'config/FoundationConfig';
import StepOne from 'modules/SignUpStep/StepOne';
import StepTwo from 'modules/SignUpStep/StepTwo';
import StepThree from 'modules/SignUpStep/StepThree';
import StepFour from 'modules/SignUpStep/StepFour';
import StepFive from 'modules/SignUpStep/StepFive';
import Login from 'modules/Login';
import MainTab from './MainTab';
import ChallengeReview from 'modules/ChallengeReview';
import CreateChallenge from 'modules/CreateChallenge';
import CreateChallengeDetails from 'modules/CreateChallengeDetails';
import MyProfile from 'modules/MyProfile';
import MyProfileHome from 'modules/MyProfileHome';
import Notification from 'modules/Notification';
import Explore from 'modules/Following';
import { inject, observer } from 'mobx-react';
import SinglePost from 'modules/SinglePost';
import CreateGoal from 'modules/CreateGoal';
import WeeklyHistory from 'modules/TeamWeekHistory/WeeklyHistory';
import SingleWeek from 'modules/TeamWeekHistory/SingleWeek';
import { Platform } from 'react-native';
import DailyDetail from 'modules/DailyDetail';
import ChooseActivities from 'modules/ChooseActivities';
import MyTeamsList from 'modules/MyTeamsList/MyTeamsList';
import ChallengeArena from 'modules/ChallengeArena';
import GoalArena from 'modules/ChallengeArena/GoalArena';
import SingleChallengeDay from 'modules/SingleChallengeDay/SingleChallengeDay';
import SingleTeamDay from 'modules/SingleTeamDay/SingleTeamDay';
import Goals from 'modules/Goals';
import Insights from 'modules/ChallengeArena/Insights';
import MyChallengesToday from 'modules/MyChallengesToday'
import MyTeamsToday from 'modules/MyTeamsToday'
import PrivacyPolicy from 'modules/PrivacyPolicy/PrivacyPolicy';
import Feed from 'modules/Feed';
import Followers from 'modules/Followers';
import Following from 'modules/Following';
import FollowingNew from 'modules/Followers/FollowingNew';
import JoinChallenges from 'modules/JoinChallenges';
import ListActivityCategories from 'modules/CreateChallenge/ListActivityCategories';
import AddActivityList from 'modules/CreateChallenge/AddActivityList';
import ViewActivity from 'modules/ViewActivity';
import EditProfile from 'modules/EditProfile';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import CreateTeam from 'modules/CreateTeam';
import SetWeeklyActivities from 'modules/SetWeeklyActivities';
import TeamArena from 'modules/TeamArena';
import Faqs from 'modules/Faqs';
import TeamCodeScreen from 'modules/TeamCodeScreen';
import GoalCodeScreen from 'modules/GoalCodeScreen';
import UserChallenges from 'modules/UserChallenges';
import CreateHabitStack from 'modules/CreateHabitStack';
import ManageHabitStacks from 'modules/ManageHabitStacks';
import TeamsLeaderboard from 'modules/TeamsLeaderboard/TeamsLeaderboard';
import UserHelpChats from 'modules/UserHelpChats';
import AllUsers from 'modules/AllUsersList';
import AllMyActivitiesList from 'modules/AllMyActivitiesList';
import Achievements from 'modules/Achievements';
import TeamMainScreen from 'modules/TeamMainScreen';
import Chat from 'modules/Chat';
import AdminScreen from 'modules/AdminScreen';
import ActivitiesListLast7 from 'modules/ActivitiesListLast7';
import UniversalLoader from 'components/UniversalLoader';

const { Navigator, Screen } = createStackNavigator();

const RootStack = ({ connection, teamsStore }) => {
   const [loggedIn, setLoggedIn] = useState(0);

   const auth = getAuth()


   useEffect(() => {


      const unsubscribe = onAuthStateChanged(auth, (user) => {

         if (user) {
            setLoggedIn(2);
         } else {
            setLoggedIn(1);
         }
      });



      return () => {
         if (unsubscribe) {
            unsubscribe();
         }
      };
   }, []);


   if (loggedIn === 0) return null;

   return (
      <NavigationContainer>
         <Navigator
            initialRouteName={loggedIn > 1 ? Routes.Login : Routes.Welcome}
            screenOptions={{
               headerBackImage: () => (
                  <Image
                     source={Assets.icons.ic_back}
                     style={{
                        width: 24,
                        height: 24,
                        marginLeft: Platform.OS === 'android' ? 8 : 24,
                     }}
                  />
               ),
               headerBackTitleVisible: false,
               headerTitleStyle: {
                  fontFamily: FONTS.heavy,
                  fontSize: 16,
                  color: Colors.color28,
                  fontWeight: '800',
               },
               headerTitleAlign: 'center',
            }}>
            <Screen
               name={Routes.Walkthoughs}
               component={Walkthoughs}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.Login}
               component={Login}
               options={{
                  headerShown: false,

               }}
            />


            <Screen
               name={Routes.StepTwo}
               component={StepTwo}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}
            />
            <Screen
               name={Routes.StepThree}
               component={StepThree}
               options={{
                  title: '',
                  headerStyle: {
                     shadowColor: 'transparent',
                     elevation: 0,
                  },
               }}
            />
            <Screen
               name={Routes.StepFour}
               component={StepFour}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}
            />
            <Screen
               name={Routes.StepFive}
               component={StepFive}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}

            />

            <Screen
               name={Routes.StepOne}
               component={StepOne}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}

            />



            <Screen
               name={Routes.MainTab}
               component={MainTab}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}
            />

            <Screen
               name={Routes.SinglePost}
               component={SinglePost}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}
            />


            <Screen
               name={Routes.ChallengeArena}
               component={ChallengeArena}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}
            />
            <Screen
               name={Routes.GoalArena}
               component={GoalArena}
               options={{
                  headerShown: false,
                  gestureEnabled: false,
               }}
            />



            <Screen
               name={Routes.SingleChallengeDay}
               component={SingleChallengeDay}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.SingleTeamDay}
               component={SingleTeamDay}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.Insights}
               component={Insights}
               options={{
                  headerShown: false,
               }}
            />

<Screen
               name={Routes.MyChallengesToday}
               component={MyChallengesToday}
               options={{
                  headerShown: false,
               }}
            />


<Screen
               name={Routes.MyTeamsToday}
               component={MyTeamsToday}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.ChooseActivities}
               component={ChooseActivities}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.AllMyActivitiesList}
               component={AllMyActivitiesList}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.CreateChallenge}
               component={CreateChallenge}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.CreateChallengeDetails}
               component={CreateChallengeDetails}
               options={{
                  headerShown: false,
               }}
            />


            {/* <Screen
               name={Routes.MyChallenges}
               component={MyChallenges}
               options={{
                  headerShown: false,
               }}
            /> */}
            <Screen
               name={Routes.UserChallenges}
               options={{ headerShown: false }}
            >
               {props => (
                  <React.Suspense fallback={<UniversalLoader load />}>
                     <UserChallenges {...props} />
                  </React.Suspense>
               )}
            </Screen>

            
            <Screen
               name={Routes.CreateGoal}
               component={CreateGoal}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.ListActivityCategories}
               component={ListActivityCategories}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.TeamMainScreen}
               component={TeamMainScreen}
               options={{
                  headerShown: false,
               }}
            />



            <Screen
               name={Routes.AddActivityList}
               component={AddActivityList}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.Feed}
               component={Feed}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.JoinChallenges}
               component={JoinChallenges}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.WeeklyHistory}
               component={WeeklyHistory}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.SingleWeek}
               component={SingleWeek}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.ViewActivity}
               component={ViewActivity}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.Explore}
               component={Explore}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.MyProfile}
               component={MyProfile}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.MyProfileHome}
               component={MyProfileHome}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.ChallengeReview}
               component={ChallengeReview}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.Followers}
               component={Followers}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.Following}
               component={Following}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.FollowingNew}
               component={FollowingNew}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.EditProfile}
               component={EditProfile}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.Notification}
               component={Notification}
               options={{
                  headerShown: false,
               }}
            />



            {/* <Screen
               name={Routes.MultiSmash}
               component={MultiSmash}
               options={{
                  headerShown: false,
               }}
            /> */}

            {/* <Screen
               name={Routes.FinalScreen}
               component={FinalScreen}
               options={{
                  headerShown: false,
               }}
            />
            */}
            <Screen
               name={Routes.DailyDetail}
               component={DailyDetail}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.SetWeeklyActivities}
               component={SetWeeklyActivities}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.TeamCodeScreen}
               component={TeamCodeScreen}
               options={{
                  headerShown: false,
               }}
            />

<Screen
               name={Routes.GoalCodeScreen}
               component={GoalCodeScreen}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.TeamArena}
               component={TeamArena}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.CreateTeam}
               component={CreateTeam}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.Chat}
               component={Chat}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.UserDayView}
               component={UserDayView}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.PrivacyPolicy}
               component={PrivacyPolicy}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.MyTeamsList}
               component={MyTeamsList}
               options={{
                  headerShown: false,
               }}
            />


            <Screen
               name={Routes.TeamsLeaderboard}
               component={TeamsLeaderboard}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.ManageHabitStacks}
               component={ManageHabitStacks}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.CreateHabitStack}
               component={CreateHabitStack}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.Faqs}
               component={Faqs}
               options={{
                  headerShown: false,
               }}
            />



            <Screen
               name={Routes.Achievements}
               component={Achievements}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.UserHelpChats}
               options={{ headerShown: false }}
            >
               {props => (
                  <React.Suspense fallback={<UniversalLoader />}>
                     <UserHelpChats {...props} />
                  </React.Suspense>
               )}
            </Screen>

            <Screen
               name={Routes.AllUsers}
               component={AllUsers}
               options={{
                  headerShown: false,
               }}
            />

<Screen
               name={Routes.Goals}
               component={Goals}
               options={{
                  headerShown: false,
               }}
            />



            <Screen
               name={Routes.MyProfileHomeFollower}
               component={MyProfileHome}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name={Routes.AdminScreen}
               component={AdminScreen}
               options={{
                  headerShown: false,
               }}
            />
            <Screen
               name={Routes.ActivitiesListLast7}
               options={{ headerShown: false }}
            >
               {props => (
                  <React.Suspense fallback={<UniversalLoader />}>
                     <ActivitiesListLast7 {...props} />
                  </React.Suspense>
               )}
            </Screen>


         </Navigator>
      </NavigationContainer>
   );
};
export default inject(
   'smashStore',
   'notificatonStore',
   'teamsStore',
   'challengesStore'
)(observer(RootStack));

