import { View} from 'react-native';
import DoneDialog from '../nav/DoneDialog';
import { inject, observer } from 'mobx-react';
import CelebrateModal from './CelebrateModal';
import SimpleCelebrate from './SimpleCelebrate';
import TeamVoting from 'components/TeamVoting';
import ShowRocket from 'components/ShowRocket';
import HowAreYouModal from './HowAreYouModal';
import UsersWhoReacted from './UsersWhoReacted';
import Subscribe from 'components/Subscribe';
import LibraryActivitiesContainer from './LibraryActivitiesContainer';
import HypeContainer from 'modules/Smash/HypeContainer';
import TeamQuickViewModal from 'components/CommentsModal/TeamQuickViewModal';
import SelectWeeklyTargetModal from 'components/SelectWeeklyTargetModal';
import ShareSekiInviteModal from 'components/ShareSekiInviteModal';
import ChallengeQuestions from 'components/ChallengeQuestions';
// import ActionMenu from 'modules/Timeline/ActionMenu'
const AllModals = (props) => {

   

   console.log('render allmodals')

   return (
      <View style={{ position: 'absolute', top: 0, left: 0 }}>
       
         <CelebrateModal />
         <LibraryActivitiesContainer />
         {/* <PlayAgainModal /> */}
         {/* <JoinChallengeQuestionsModal /> */}
         <HowAreYouModal />
         <SimpleCelebrate />
         {/* <TutorialVideo /> */}
         <TeamVoting />
         {/* <ChallengeQuestions /> */}
       
         {/* <ShowRocket  /> */}
        
         {/* <UsersWhoReacted /> */}
         <ShareSekiInviteModal />
        <DoneDialog />
          {/* <ChatReactions /> */}
         <SelectWeeklyTargetModal />
         {/* <ActionMenu /> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(AllModals));
