import { getDayChar, isToday } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { isDateInPast, hexToRgbA } from 'helpers/generalHelpers';
import {
    AntDesign
} from '@expo/vector-icons';
import {
    daysInChallenge,
    dayKeyToDayDate
} from 'helpers/dateHelpers';
import { width } from 'config/scaleAccordingToDevice';
const Last7BadgeTargets = (props) => {
    // const { navigate } = useNavigation();
    const { item, smashStore, color } = props;
    const numDays = daysInChallenge(item);
    const { last7Keys, stringLimit} =
        smashStore;

    const { daily, selectedTarget, dailyTargets, selectedLevel } = item;

    const selectedIndex = selectedLevel - 1 || 0;
    const dailyTarget =
        dailyTargets?.[selectedIndex] || parseInt(selectedTarget / numDays);

    const rgba = hexToRgbA(item.colorStart, 0.1);

    const rgba3 = hexToRgbA(item.colorStart, 0.3);


    return (
        <View row marginT-8 marginB-8 style={{ flexWrap: 'wrap', borderWidth: 0, borderColor: '#fff' }}>
            {last7Keys.map((dayKey, index) => {

                const isLastIndex = index == last7Keys.length - 1;
                // Check if last index becuase it always will be 100% progress. 

                const past = isDateInPast(dayKey);
                const dateNumber = dayKeyToDayDate(dayKey);
                const dayScore =
                    item?.targetType == 'points'
                        ? daily?.[dayKey]?.score
                        : daily?.[dayKey]?.qty;

                const progress =
                    dailyTarget < 0 ? 100 : (dayScore / dailyTarget) * 100 || false;

                const today = isToday(dayKey);
                const gameWon = dayScore >= dailyTarget;

                return (
                    <TouchableOpacity
                        marginR-0
                        marginL-4
                        marginT-4
                        marginB-4
                        key={dayKey}
                        style={{
                            borderRadius: 30,
                        }}>
                       

                        <AnimatedCircularProgress
                            size={width / 10.5}
                            fill={isLastIndex ? 100 : progress ? progress : gameWon ? 100 : 0}
                            rotation={0}
                            width={3}
                            style={{ marginHorizontal: 2 }}
                            fillLineCap="round"
                            tintColor={
                                progress > 0 // Means there is a target today and a score.
                                    ? item.colorStart // If there is a target today and score then show endColor
                                    : gameWon
                                        ? Colors.green30 // Else if game is won and no progress that day, show Green,
                                        : '#ccc'
                            }
                            backgroundColor={past ? rgba : '#eee'}>
                            {(fill) => (
                                <Text
                                    secondaryContent
                                    style={{
                                        fontWeight: 'bold',
                                        textDecorationLine: today ? 'underline' : 'none',
                                        fontSize: 12,
                                        color:
                                            progress > 0 // Was there a target that day or was challenge already won?
                                                ? progress >= 100 //Was Daily Target Completed?
                                                    ? item.colorStart // If it was completed, show Color for Text.
                                                    : '#ccc' // Else show grey for text.
                                                : gameWon
                                                    ? Colors.green30
                                                    : '#ccc', /// Color to display if Challenge is already won and there was no target for today.
                                    }}>
                                    {stringLimit(getDayChar(dayKey), 1, false)}
                                </Text>
                            )}
                        </AnimatedCircularProgress>
                        {progress >= 100 && (
                            <View style={{ position: 'absolute', bottom: 10, borderRadius: 30, right: -2, height: 15, width: 15, backgroundColor: Colors.green40, alignItems: 'center', justifyContent: 'center', }}>
                                <Text><AntDesign name="check" color={'#fff'} size={8} /></Text>
                            </View>
                           
                        )}
                        {progress > 200 && false && (
                            <View style={{ position: 'absolute', top: 0, right: -2 }}>
                                <Text>🔥</Text>
                            </View>
                        )}
                        {today && (
                            <View
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    bottom: -14,
                                }}>
                                <View
                                    style={{
                                        height: 5,
                                        width: 5,
                                        borderRadius: 14,
                                        backgroundColor:
                                            item.colorStart || Colors.green30,
                                        marginTop: 7,
                                    }}
                                />
                            </View>
                        )}
                   
                        {true && <View
                            style={{
                                marginBottom: -8,
                                borderRadius: 16,
                            }}>
                            <Text center secondaryContent R10 marginT-4>
                                {dateNumber}
                            </Text>
                        </View>}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default inject(
    'smashStore',
    'challengesStore',
    'teamsStore',
)(observer(Last7BadgeTargets));
