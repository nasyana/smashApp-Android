import { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { Entypo } from '@expo/vector-icons';

import { hexToRgbA } from 'helpers/generalHelpers';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/native';

const Activities = ({
  masterIds = [],
  smashStore,
  notPressable = true,
  todayTargetSmashed = false,
  invertColor = false,
  goToActivity = false,
  dark = false
}) => {
  const {
    libraryActivitiesHash,
    todayActivityActivityQuantities,
  } = smashStore;

  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const numberToShow = 5;
  const showMoreButton = numberToShow < masterIds.length;

  let allIds = [...masterIds].sort((a, b) => {
    return (
      (parseInt(todayActivityActivityQuantities?.[b]) || 0) -
      (parseInt(todayActivityActivityQuantities?.[a]) || 0)
    );
  });

  let shorterIds = todayTargetSmashed
    ? allIds.filter((a) => todayActivityActivityQuantities?.[a])
    : allIds.slice(0, numberToShow);

  const displayedIds = showAll ? allIds : shorterIds;

  if (masterIds.length === 0) {
    return null;
  }

  return (
    <View>
      {displayedIds.map((masterId) => {
        const activity = libraryActivitiesHash[masterId] || {};
        return (
          <SingleActivity
            key={masterId}
            activity={activity}
            smashStore={smashStore}
            notPressable={notPressable}
            invertColor={invertColor}
            goToActivity={goToActivity}
            dark={dark}
          />
        );
      })}
      {showMoreButton && (
        <View center marginT-16 marginB-0 >
          <TouchableOpacity onPress={toggleShowAll}>
            <Text R14 white={invertColor} secondaryContent={dark}>
              {showAll
                ? 'Show Less'
                : `Show More (${masterIds.length - displayedIds.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
};

export default inject('smashStore', 'challengesStore', 'teamsStore')(
  observer(Activities)
);



export const SingleActivity = ({ dark = false, goToActivity = false, activity, smashStore, notPressable, invertColor = false, day = false, showAllPointsEarned = false, points = false }) => {
   
  const { navigate } = smashStore.navigation ? smashStore.navigation : useNavigation();
  const { returnActionPointsValue, setMasterIdsToSmash, todayActivityActivityQuantities, todayActivityActivityPoints, getLevelColor, todayActivity } = smashStore;

    const smashSingleActivity = () => {
        setMasterIdsToSmash([activity.id]);

    };

    const navToActivity = () => {

        navigate(Routes.ViewActivity, { activity: activity, })

    }
    const bg = hexToRgbA(Colors.green20, 0.2)
    const pointsEarned = day ? day?.activityPoints?.[activity.id] || false : todayActivityActivityPoints?.[activity.id] || false;
    const qtyEarned = day ? day?.activityQuantities?.[activity.id] || false : todayActivityActivityQuantities?.[activity.id] || false;

    return (<TouchableOpacity row spread marginB-4 onPress={goToActivity ? navToActivity : notPressable ? () => { } : smashSingleActivity}>
        <View centerV row><Entypo size={18} name={pointsEarned ? 'check' : 'plus'} color={pointsEarned ? getLevelColor(pointsEarned) || Colors.smashPink : invertColor ? '#333' : '#ccc'} style={{ marginRight: 8, height: 18, width: 18, borderRadius: 20 }} />
            <Text R12 white={dark}>{activity?.text?.toUpperCase()} {qtyEarned && <Text R12 smashPink>{`(${qtyEarned})`}</Text>}</Text></View>
        <View row>{!showAllPointsEarned && <View style={{ backgroundColor: dark ? Colors.smashPink : Colors.green80, borderRadius: 10 }} center padding-4 paddingH-8><Text secondaryContent white={dark} R14>{returnActionPointsValue(activity)} pts</Text></View>}{showAllPointsEarned && <View style={{ backgroundColor: Colors.white, borderRadius: 10, borderWidth: 0, borderColor: Colors.grey40 }} center padding-4 paddingH-8><Text R14 secondaryContent>+{points ? points : pointsEarned}</Text></View>}</View></TouchableOpacity>)
}