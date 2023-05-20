import React, { useEffect, useState } from 'react';
import { Image, FlatList, Modal } from 'react-native';
import {
   ProgressBar,
   Colors,
   View,
   Text,
   TouchableOpacity,
} from 'react-native-ui-lib';
import styles from './style';
import ProgressOption from './ProgressOption';
import { inject, observer } from 'mobx-react';
import { formatDistanceToNow } from 'date-fns';
import WeeklyTargetsJourney from 'modules/TeamArena/WeeklyTargetsJourney';
import Firebase from 'config/Firebase';
import { AntDesign } from '@expo/vector-icons';
import { height, width } from 'config/scaleAccordingToDevice';
import AnimatedView from 'components/AnimatedView';
const logMapper = {
   add10k: 'Add 10k',
   add20k: 'Add 20k',
   remove10k: 'Remove 10k',
   keepTheSameTarget: 'Keep The Same Target',
};

const votingOptions = [
   {
      key: 'add10k',
      text: 'Add 10k',
      value: [],
   },
   {
      key: 'add20k',
      text: 'Add 20k',
      value: [],
   },
   {
      key: 'remove10k',
      text: 'Remove 10k',
      value: [],
   },
   {
      key: 'keepTheSameTarget',
      text: 'Keep The Same Target',
      value: [],
   },
];

function TeamVoting(props) {
   const { teamsStore, smashStore } = props;
   const {
      onClickTeamTargetVotingOption,
      manualTeamToVoteOn,
      getWeekTargetForTeam,
      voteDocsHash,
      endOfCurrentWeekKey,
   } = teamsStore;

   console.log('render TeamVoting');
const [canOpen, setCanOpen] = useState(false);

useEffect(() => {
   setTimeout(() => {
      setCanOpen(true);
   }, 5000);

   return () => {};
}, []);

   // const teamToVoteOn =
   //    allTeamsThatRequireVotes?.length > 0
   //       ? allTeamsThatRequireVotes?.[0]
   //       : manualTeamToVoteOn || false;

   const teamToVoteOn = manualTeamToVoteOn || false;

   const { kFormatter, hasUserGotFeelingsToday } = smashStore;

   const { completion, itemToCelebrate } = smashStore;
   const theTeamToVoteOn = teamToVoteOn;
   const isManualVote = manualTeamToVoteOn.name || false;
   const thisWeekTarget =
      theTeamToVoteOn.mostRecentTarget || getWeekTargetForTeam(theTeamToVoteOn);

   const { id, joined } = theTeamToVoteOn;
   const teamTargetVoteDoc = voteDocsHash[id] || {};

   const { majorityLog = [] } = teamTargetVoteDoc;
   if (!joined || !id) return null;

   const options = votingOptions.map((option) => {
      return { ...option, value: teamTargetVoteDoc[option.key] || [] };
   });

   const renderItem = (item, index) => {
      return (
         <ProgressOption
            progress={(item.value.length / joined.length) * 100}
            item={item}
            team={theTeamToVoteOn}
            onClickTeamTargetVotingOption={onClickTeamTargetVotingOption}
            smashStore={smashStore}
         />
      );
   };

   const clearManualVote = () => (teamsStore.manualTeamToVoteOn = false);

   if (!canOpen) {
      return null;
   }
   return (
      <Modal
         visible={
            !completion &&
            !itemToCelebrate &&
            hasUserGotFeelingsToday &&
            theTeamToVoteOn?.name
               ? true
               : false
         }
         animationType="fade"
         presentationStyle="overFullScreen"
         transparent={true}
         style={{ backgroundColor: '#000' }}>
         <View
            flex
            style={{
               backgroundColor: 'rgba(0,0,0,0.7)',
               width,
               height,
               position: 'absolute',
               top: 0,
               left: 0,
            }}
         />
         <View
            flex
            paddingH-0
            style={{
               backgroundColor: '#fff',
               height: height / 3,
               marginTop: height / 3,
               borderRadius: 15,
            }}>
            <AnimatedView
               delay={300}
               duration={200}
               style={{
                  position: 'absolute',
                  top: -60,
                  width: width - 20,
                  alignItems: 'center',
                  zIndex: 99999999,
                  elevation: 99999999,
               }}>
               <Image
                  source={require('../../images/love.png') || ''}
                  style={{
                     width: 170,
                     height: 90,
                  }}
               />
            </AnimatedView>
            <View marginT-0>
               {isManualVote && (
                  <TouchableOpacity onPress={clearManualVote} padding-24>
                     <Text style={{ textAlign: 'right' }}>
                        <AntDesign name="close" size={26} />
                     </Text>
                  </TouchableOpacity>
               )}
               {isManualVote && (
                  <View
                     paddingH-32
                     paddingT-0
                     marginB-0
                     style={{ marginTop: -24 }}>
                     <Text B24 center>
                        Cast Your Vote Below!
                     </Text>
                     {/* <Text>({theTeamToVoteOn.name})</Text> */}
                  </View>
               )}
               {!isManualVote && (
                  <View paddingH-32 paddingT-42 marginB-8>
                     <Text B24 center>
                        {theTeamToVoteOn.weekNotWon
                           ? `Add Your Vote! (${theTeamToVoteOn.name})`
                           : `How was your week?`}
                     </Text>
                     {/* <Text B18 center>
                     {theTeamToVoteOn.name}
                  </Text> */}
                  </View>
               )}

               {isManualVote ? (
                  <View center>
                     <Text text70BO marginL-16 marginR-16 marginB-4 marginT-0>
                        {theTeamToVoteOn.name}{' '}
                        <Text green40>
                           {teamToVoteOn?.scores?.[endOfCurrentWeekKey] &&
                              kFormatter(
                                 teamToVoteOn?.scores?.[endOfCurrentWeekKey],
                              )}
                        </Text>{' '}
                        / {kFormatter(thisWeekTarget)}
                     </Text>
                  </View>
               ) : (
                  <View center paddingH-24>
                     <Text
                        text70BO
                        marginL-16
                        marginR-16
                        marginB-4
                        marginT-0
                        center>
                        {theTeamToVoteOn.weekNotWon
                           ? 'Someone Wants To Change The Weekly Target'
                           : `How is the ${theTeamToVoteOn.name} Team Target? `}
                        {kFormatter(thisWeekTarget)} week target!{' '}
                        <Text green40>
                           (
                           {teamToVoteOn?.scores?.[endOfCurrentWeekKey] &&
                              kFormatter(
                                 teamToVoteOn?.scores?.[endOfCurrentWeekKey],
                              )}
                           )
                        </Text>
                     </Text>
                     {!theTeamToVoteOn.weekNotWon && (
                        <Text secondaryContent center>
                           Spend the rest of the week as Champions or vote below
                           to change the weekly target.
                        </Text>
                     )}
                  </View>
               )}
               <View style={styles.seprateStyle} />
               <View center marginT-16 paddingH-24>
                  <Text
                     color28
                     marginL-16
                     marginR-16
                     marginB-16
                     R10
                     secondaryContent
                     center
                     style={{ letterSpacing: 1 }}>
                     {`Majority Vote`.toUpperCase()}
                  </Text>
               </View>
               <FlatList
                  data={options}
                  renderItem={({ item }) => renderItem(item)}
                  contentContainerStyle={{ marginTop: 0 }}
                  keyExtractor={(item, index) => index.toString()}
               />
            </View>

            {true && (
               <View paddingH-32 marginT-16>
                  {[...majorityLog]
                     .sort((a, b) => b.timestamp - a.timestamp)
                     .slice(0, 3)
                     .map((item) => {
                        return (
                           <View marginB-8>
                              <Text R12>
                                 {`${
                                    logMapper[item.selectedOption]
                                 } was voted by ${item.majorityNumber}/${
                                    item.joinedLength
                                 } `}
                                 <Text
                                    secondaryContent
                                    R10>{`- ${formatDistanceToNow(
                                    item.timestamp,
                                 )} ago`}</Text>
                              </Text>
                           </View>
                        );
                     })}
               </View>
            )}
            {/* <WeeklyTargetsJourney /> */}
         </View>
      </Modal>
   );
}
export default inject('teamsStore', 'smashStore')(observer(TeamVoting));
