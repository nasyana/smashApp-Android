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
import { Modal, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { bottom, height, width, isSmall } from 'config/scaleAccordingToDevice';
import { Text, View } from 'react-native-ui-lib';

import PlayAgainInfo from './PlayAgainInfo';

const PlayAgainModal = (props) => {
   const { challengesStore, smashStore } = props;
   const { currentUser, todayDateKey } = smashStore;
   const { myChallenges, myFinishedChallenges, setChallengesArray } =
      challengesStore;

   const hasFinishedChallenge = myFinishedChallenges?.length > 0;

   const hasFinishedChallenges = myFinishedChallenges?.length > 1;
   const hasFeelingsToday = currentUser?.feelings?.[todayDateKey] || false;

   const [disabled, setDisabled] = useState(false);

   const disableForASecond = () => {
      setDisabled(true);
      setTimeout(() => {
         setDisabled(false);
      }, 1000);
   };
   return (
      <Modal
         visible={
            !hasFeelingsToday
               ? false
               : hasFinishedChallenge && !disabled
               ? true
               : false
         }
         onDismiss={() => null}
         presentationStyle="pageSheet"
         animationType="slide"
         width="90%">
         <ScrollView
            style={{ minHeight: height - height / 3, paddingTop: 0 }}
            contentContainerStyle={{ paddingBottom: 70 }}>
            <PlayAgainInfo
               myFinishedChallenges={myFinishedChallenges}
               hasFinishedChallenges={hasFinishedChallenges}
               disableForASecond={disableForASecond}
            />
         </ScrollView>
      </Modal>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(PlayAgainModal));
