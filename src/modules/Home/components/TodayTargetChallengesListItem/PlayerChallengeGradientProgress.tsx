
import React, { useEffect } from 'react'
import firebaseInstance from '../../../../config/Firebase'
const firestore = firebaseInstance.firestore;
import { todayDateKey } from '../../../../helpers/dateHelpers'
import { hexToRgbA } from 'helpers/generalHelpers';
import { GradientCircularProgress } from 'react-native-circular-gradient-progress';
import { View, Text, Colors, TouchableOpacity, ProgressBar, Image, Assets } from 'react-native-ui-lib';
import { kFormatter, stringLimit } from 'helpers/generalHelpers';
import AnimatedView from 'components/AnimatedView';
import { AntDesign } from '@expo/vector-icons';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { collection, doc, onSnapshot } from "firebase/firestore";
const PlayerChallengeGradientProgress = ({ playerChallenge, goToThisChallenge, incomplete }) => {


    const endFaded = hexToRgbA(playerChallenge.colorEnd, 0.5);
    const circleSize = 85;


    const [pChallenge, setPlayerChallenge] = React.useState(playerChallenge);


   

    useEffect(() => {
        const unsub = onSnapshot(doc(collection(firestore, "playerChallenges"), playerChallenge.id), (doc) => {
          if (doc.exists()) {
            const playerChallengeData = getPlayerChallengeData(doc.data()) || playerChallenge;
            setPlayerChallenge(playerChallengeData);
          }
        });
      
        return () => {
          if (unsub) {
            unsub();
          }
        };
      }, []);

    const imageSize = 70;
    const todayProgress = pChallenge?.todayProgress;
 const todayTargetSmashed = pChallenge?.selectedTodayScore >= pChallenge?.selectedTodayTarget;
 const {selectedTodayScore, selectedTodayTarget, targetType, unit} = pChallenge;
// console.log('todayTargetSmashed',todayTargetSmashed)
    // if (todayProgress >= 100) { return null }
    return (
        <TouchableOpacity onPress={goToThisChallenge} center style={{
            paddingHorizontal: 8,
            marginRight: 8,
            borderRadius: 8,
            zIndex: 99999,
            elevation: 999999,
            height: imageSize - 10,
            width: imageSize - 0,
        }}>
            {/* <Text>{selectedTodayScore} {selectedTodayTarget}</Text> */}
            {todayTargetSmashed && <AnimatedView loop={true}>
                <Text B20 style={{ color: playerChallenge.colorEnd }}>{todayTargetSmashed ? <AntDesign name="checkcircle" size={40} color={incomplete ? playerChallenge.colorStart  : 'rgba(255,255,255,0.5)' || playerChallenge.colorStart || Colors.green30} /> : todayProgress + '%'}</Text>
            </AnimatedView>}
            {todayProgress < 100 && <View style={{ position: 'absolute' }}>
                <GradientCircularProgress
                    progress={todayProgress}
                    emptyColor={Colors.grey70}
                    size={circleSize}
                    withSnail
                    strokeWidth={3}
                    startColor={playerChallenge.colorEnd}
                    middleColor={endFaded}
                    endColor={endFaded}
                />
            </View>}
            {!todayTargetSmashed && <View center style={{ position: 'absolute', height: circleSize, width: circleSize }}>
                <Text B18 style={{ fontSize: 16 }}>{kFormatter(selectedTodayScore)}/{kFormatter(selectedTodayTarget)}</Text>
                <Text R10 secondaryContent>{targetType == 'qty' ? stringLimit(unit, 7)?.toUpperCase() : 'POINTS'}</Text></View>}
        </TouchableOpacity >
    )
}

export default PlayerChallengeGradientProgress