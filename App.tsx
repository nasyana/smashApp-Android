import * as Sentry from 'sentry-expo';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator } from 'react-native';
import CreateChallengeStore from "./src/stores/CreateChallengeStore";
import NotificatonStore from "./src/stores/NotificatonStore";
import SmashStore from "./src/stores/SmashStore";
import ChallengesStore from "./src/stores/ChallengesStore";
import ActionsStore from 'stores/ActionsStore';
import TeamsStore from 'stores/teamsStore';
import UniversalLoader from 'components/UniversalLoader';
import ChallengeArenaStore from "./src/stores/ChallengeArenaStore";
import StoryCompletionModal from 'components/StoryCompletionModal';
import CommentsModal from 'components/CommentsModal';
import TeamQuickViewModal from 'components/CommentsModal/TeamQuickViewModal';
import "./src/config/AssetsConfig";
import "./src/config/FoundationConfig";
import NoInternet from "modules/NoInternet";
import { Provider } from 'mobx-react';
import { LogBox } from "react-native";
import TakeVideo from 'modules/Smash/TakeVideo';
import AllModals from 'modals/AllModals';
import useCachedResources from "./src/hooks/useCachedResources";
import RootStack from "./src/nav/RootStack";

const notificatonStore = new NotificatonStore();
const challengesStore = new ChallengesStore(notificatonStore);

const createChallengeStore = new CreateChallengeStore();
const smashStore = new SmashStore(notificatonStore);
const challengeArenaStore = new ChallengeArenaStore();
const teamsStore = new TeamsStore(notificatonStore,smashStore);
const actionsStore = new ActionsStore();


Sentry.init({
  dsn: 'https://3161eea6f6b9425085198aa02363878a@o258042.ingest.sentry.io/1867282',
  enableInExpoDevelopment: false,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});
// disable all yellow box logs
LogBox.ignoreAllLogs();
export default function App() {


 
   const isLoadingComplete = useCachedResources();


  

   if (!isLoadingComplete) {
      return <ActivityIndicator />;
   } else {

      console.log('render App.tsx')
      return (
         <Provider
            {...{
               challengeArenaStore,
               teamsStore,
               smashStore,
               createChallengeStore,
               challengesStore,
               notificatonStore,
               actionsStore,
            }}>
            <SafeAreaProvider>
            <RootStack />
            <AllModals />
            <TakeVideo />
            {/* <ShowRocket /> */}
            {/* <HypeContainer  /> */}
           
           {/* <StatusBar /> */}
            <NoInternet /> 
          
      
            <StoryCompletionModal /> 
         
            <TeamQuickViewModal />
        
            <UniversalLoader /> 
            <CommentsModal feedComments /> 
              {/* <DoneDialog /> */}
            </SafeAreaProvider>
         </Provider>
      );
   }


}

