import PlayersImages from 'components/PlayersImages';
import Firebase from 'config/Firebase';
import * as React from 'react';
import { Image, FlatList, TouchableOpacity } from 'react-native';
import { ProgressBar, Colors, Text, View } from 'react-native-ui-lib';
import styles from './style';
import { Vibrate } from 'helpers/HapticsHelpers';

const ProgressOption = (props) => {

   Vibrate();
   const { progress, item, onClickTeamTargetVotingOption, team, smashStore } =
      props;
   const { uid } = Firebase.auth.currentUser;
   const isSelected = item.value.includes(uid);
   const progressColor = isSelected ? Colors.buttonLink : '#F2F2F2';
   const textColor = isSelected ? '#000' : 'black';
   const progressHeight = 40;

   const simpleCelebrateSelection = (selection) => {
      let subtitle = 'You voted. Thanks!';

      if (selection == 'add20k') {
         subtitle = 'You voted to add 20k to weekly target.';
      }
      if (selection == 'add10k') {
         subtitle = 'You voted to add 10k to weekly target.';
      }
      if (selection == 'keepTheSameTarget') {
         subtitle = 'You voted to keep the same target for next week.';
      }
      if (selection == 'remove10k') {
         subtitle = 'You voted to remove 10k from the weekly target.';
      }
      setTimeout(() => {
         smashStore.simpleCelebrate = {
            name: team.name,
            title: 'Thanks for your vote!',
            subtitle: subtitle,
         };
      }, 500);
   };
   console.log('item', item?.value[0]);
   return (
      <TouchableOpacity
         onPress={() => {
            simpleCelebrateSelection(item.key);
            onClickTeamTargetVotingOption(item.key, team);
         }}
         style={{
            marginVertical: 6,
            marginHorizontal: 24,
         }}>
         <ProgressBar
            progress={progress}
            style={{
               height: progressHeight,
               backgroundColor: '#FAFAFA',
               shadowColor: '#fff',
            }}
            progressColor={progressColor}
         />
         <Text
            style={{
               position: 'absolute',
               left: 16,
               top: progressHeight / 3.5,
               fontSize: 14,
               color: textColor,
            }}>
            {item.text}
         </Text>
         <View
            centerV
            style={{
               position: 'absolute',
               right: 16,
               top: 6,
            }}>
            <PlayersImages uids={item.value} team={team} />
         </View>
      </TouchableOpacity>
   );
};

export default React.memo(ProgressOption);
