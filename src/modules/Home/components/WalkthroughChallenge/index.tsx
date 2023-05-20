import Tag from "components/Tag";
import React, { useEffect, useState } from "react";
import { inject, observer } from 'mobx-react';
import { useNavigation } from "@react-navigation/native";
import SmartImage from "../../../../components/SmartImage/SmartImage"
import { View, Image, Text, Colors, Assets, ProgressBar, TouchableOpacity, Button } from "react-native-ui-lib";
import SwipeableItem from "components/SwipeableItem/SwipeableItem";
import Routes from "../../../../config/Routes"
import moment, { ISO_8601 } from "moment";
import Firebase from "../../../../config/Firebase";
import EpicDisplayBadge from '../../../../components/EpicDisplayBadge';
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';

const WalkthroughChallenge = inject("smashStore", "challengesStore")(observer((props) => {


    const { navigate } = useNavigation();
    const { playerChallenge, smashStore, qty, challengesStore, challenge } = props;

    const { daysRemaining, kFormatter, toggleMeInChallenge, checkInfinity, ordinal_suffix_of } = smashStore;

    const days = [];


    const targetView = props.smashStore.targetView;


    const { getChallengeData, playersAroundMeInChallenges } = challengesStore;
    const uid = Firebase?.auth?.currentUser?.uid


    const [rank, setRank] = useState(0)





    let { numberOfActivities, daysLeftWithText, numberOfPlayers, daysLeft, target, duration, firstActivityId, firstActivity } = getChallengeData(challenge);


    let score = challenge?.score || 0;

    const targetFormatted = challenge.target > 0 ? kFormatter(challenge.target) : 0;
    const hasReachedTarget = score > target;

    const todayKey = moment().format('DDMMYYYY');

    let dailyTarget = (challenge.target - challenge.score) / daysLeft;
    let dailyTargetFormatted = kFormatter(dailyTarget);
    const todayView = targetView == 1;
    const todayScore = parseInt(playerChallenge?.daily?.[todayKey]?.score || 0);

    if (targetView == 1) {
        score = todayScore;
        target = dailyTarget;
    }

    let progress = hasReachedTarget ? 100 : parseInt(score) / parseInt(target) * 100;
    const color = todayView ? Colors.color40 : Colors.buttonLink;

    const goToArena = () => {
        return
        smashStore.smashEffects()

    }



    return (
       <TouchableOpacity
          onPress={goToArena}
          marginH-16
          marginB-16
          paddingB-16
          style={{
             borderRadius: 6,
             shadowColor: '#ccc',
             shadowOffset: {
                height: 1,
             },
             shadowOpacity: 0.52,
             shadowRadius: 12.22,
             elevation: 3,
          }}
          backgroundColor={Colors.white}>
          <View
             row
             style={{
                marginHorizontal: 0,
                backgroundColor: '#FFF',
                overflow: 'hidden',
                marginBottom: 0,
                paddingLeft: 0,
                borderRadius: 7,
             }}>
             <View marginH-16 marginT-16></View>
             <View paddingL-0 flex paddingT-16>
                <View row spread paddingR-16 centerV marginB-8>
                   <Text H16 color28>
                      {challenge?.name || 'loading'}
                   </Text>
                   {/* <Text R12 secondaryContent >
                            {todayView ? 'Today' : challenge.duration == 'weekly' ? 'This Week' : 'This Month'}
                        </Text> */}
                </View>
                {/* <View row centerV marginT-4>
                        <View row>
                            <AntDesign name={'addusergroup'} size={14} color={Colors.color6D} />
                            <Text color6D marginL-4>
                                {numberOfPlayers || 0} Playing
                            </Text>
                        </View>
                        <View row marginL-8>
                            <AntDesign name={'checksquareo'} size={14} color={Colors.color6D} />
                            <Text color6D marginL-4>
                                {numberOfActivities} Activities
                            </Text>
                        </View>
                    </View>
                    <View height={1} backgroundColor={Colors.line} marginV-10 marginR-20 /> */}
                <View row centerV spread>
                   <View row>
                      <AntDesign name={'star'} size={14} color={color} />

                      <Text color6D marginL-4>
                         {kFormatter(challenge.score) || qty || 0} /{' '}
                         {kFormatter(challenge.target)}{' '}
                      </Text>
                   </View>
                   <View row paddingR-20>
                      <AntDesign
                         name={'calendar'}
                         size={14}
                         color={Colors.buttonLink}
                      />
                      <Text color6D marginL-4>
                         {challenge.daysLeft} days left
                      </Text>
                   </View>
                </View>
                <View paddingR-20 bottom marginT-5>
                   <View row spread paddingB-8>
                      {days?.map((day) => (
                         <View
                            style={{
                               height: 7,
                               width: 7,
                               backgroundColor: '#eee',
                            }}
                         />
                      ))}
                   </View>
                   <ProgressBar
                      progress={checkInfinity(progress)}
                      progressColor={color}
                   />
                   <Text secondaryContent marginT-8>
                      You're coming {ordinal_suffix_of(rank + 1)}!
                   </Text>
                </View>
             </View>
          </View>
       </TouchableOpacity>
    );

})
);

export default WalkthroughChallenge;
