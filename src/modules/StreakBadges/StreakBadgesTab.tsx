import React, { useEffect, useState } from 'react';
import {
   Colors,
   ExpandableSection,
   Image,
   Text,
   TouchableOpacity,
   View,
   Assets
} from 'react-native-ui-lib';
import Header from 'components/Header';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { durationImages } from 'helpers/generalHelpers';
import _, { indexOf } from 'lodash';
import { moment } from 'helpers/generalHelpers';;
import { inject, observer } from 'mobx-react';
import { Vibrate } from 'helpers/HapticsHelpers';
import {
   collection,
   query,
   where,
   onSnapshot,
 } from "firebase/firestore";

const BORDER_RADIUS = 6;

const DATA = [
   {
      title: '1667241000',
      data: [
         {
            name: 'Push Ups',
            streakBadges: [3, 7, 10, 14],
         },
         {
            name: 'Pull Ups',
            streakBadges: [3, 7, 10, 14],
         },
      ],
   },
   {
      title: '1667231000',
      data: [
         {
            name: 'Push Ups',
            streakBadges: [3, 7, 10, 14],
         },
         {
            name: 'Pull Ups',
            streakBadges: [3, 7, 10, 14],
         },
      ],
   },
];

function StreakBadgesTab({ challengesStore, smashStore }) {
   const { challengesHash } = challengesStore;

   const [streakBadges, setStreakBadges] = useState([]);
   const badges = streakBadges.map((p) => {
      return {
         ...p,
         dateKey: moment(p.timestamp, 'X').startOf('month').format('X'),
         dateFinished: moment(p.timestamp, 'X').format('Do MMM'),
         targets: p.targets,
      };
   });
   const groupBy = _.groupBy(badges, 'dateKey');

   let finalData = Object.keys(groupBy).map((key) => {
      return { title: key, data: groupBy[key] };
   }).sort((a, b) => parseInt(b.title) - parseInt(a.title));

   // Change this variable to DATA to use live data.
   const DATA = finalData.map(({ title, data }) => {
      // const challengeOriginal = challengesHash?.[challenge.challengeId] || false;
      // console.log('data', data);
      const groupBy = _.groupBy(data, 'name');
      let finalData = Object.keys(groupBy).map((key) => {
         const item = groupBy?.[key][0];

         const challengeFull = challengesHash?.[item.challengeId] || {
            colorStart: '#333',
         };
         return {
            name: key,
            color: challengeFull.colorStart,
            streakBadges: groupBy[key].map((i) => i),
         };
      });
      return { title, data: finalData };
   });

   useEffect(() => {
      const unsubscribe = onSnapshot(
        query(
          collection(firestore, "celebrations"),
          where("uid", "==", firebaseInstance.auth.currentUser.uid),
          where("type", "==", "challengeStreak")
        ),
        (docs) => {
          let streakBadges = [];
          docs.forEach((doc) => {
            if (doc.exists) {
              streakBadges.push(doc.data());
            }
          });
          setStreakBadges(streakBadges);
        }
      );
  
      const timeout = setTimeout(() => {
        unsubscribe();
      }, 1000);
  
      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    }, []);

   const renderItem = ({ item, index }) => {
      const isLast = DATA.length - 1 == index;
      return (
         <ListItem
            key={index}
            item={item}
            isLast
            challengesStore={challengesStore}
            smashStore={smashStore}
         />
      );
   };

   return (
      <View flex >
         {/* <Header title={'Monthly Badges'} noShadow back /> */}
         <FlatList
            keyExtractor={(index) => index}
            data={DATA}
            renderItem={renderItem}
            ListEmptyComponent={<Text>No Badges yet</Text>}
            style={{ padding: 16 }}
            ItemSeparatorComponent={Seperator}
         />
      </View>
   );
}

function Seperator() {
   return <View padding-6 />;
}

function ListItem({ item, isLast, challengesStore, smashStore }) {
   const [expanded, setExpanded] = useState(isLast);

   return (
      <ExpandableSection
         expanded={expanded}
         sectionHeader={
            <SectionHeader
               expanded={expanded}
               header={moment(item.title, 'X').format('MMMM YYYY')}
            />
         }
         onPress={() => setExpanded((e) => !e)}>
         <View
            backgroundColor={Colors.white}
            padding-16
            paddingT-0
            marginB-8
            style={{
               borderColor: Colors.colorF2,
               borderWidth: 1,
               borderTopWidth: 0,
               borderBottomLeftRadius: BORDER_RADIUS,
               borderBottomRightRadius: BORDER_RADIUS,
            }}>
            {item.data.map((challenge, index) => {
               return (
                  <ChallengeListItem
                     challengesStore={challengesStore}
                     challenge={challenge}
                     smashStore={smashStore}
                     key={index + 'N'}
                     // challengeOriginal={challengeOriginal}
                     isFirst={index === 0}
                     isLast={index === item.data?.length - 1}
                  />
               );
            })}
         </View>
      </ExpandableSection>
   );
}

function ChallengeListItem({ challenge, isLast, isFirst, challengesStore, smashStore }) {

   const setBadge = (badge) => {

      Vibrate();
      smashStore.setStreakBadgeCelebration(badge)
   }

   return (
      <View
         paddingV-16
         paddingH-16
         key={challenge.name}
         style={{
            borderBottomColor: Colors.colorF2,
            borderBottomWidth: isLast ? 0 : 1,
            paddingTop: isFirst ? 0 : 16,
         }}>
         <View centerV>
            {/* <View style={{ backgroundColor: challenge.color, height: 7, width: 7, borderRadius: 14, marginRight: 8 }} /> */}
            <Text B18>{challenge.name}</Text>
         </View>

         <View paddingT-8 flex row style={{ flexWrap: 'wrap', marginLeft: -2 }}>
            {challenge.streakBadges
               .sort((b, a) => b.streak - a.streak)
               .map((b,index) => {

                  const badge = b.streak;
                  return (
                     <TouchableOpacity
                        onPress={() => setBadge(b)}
                        padding-4
                        // paddingH-16
                        margin-4
                        centerH
                        centerV
                        style={{
                           // width: 120,
                           borderRadius: 50,
                           color: Colors.color28,
                        }}>
                        <View
                           marginH-4
                           centerV
                           backgroundColor={
                              durationImages.find((b) => b.key === badge).color
                           }
                           style={{
                              width: 50,
                              height: 50,
                              borderRadius: 60,
                              justifyContent: 'center',
                              alignItems: 'center',
                           }}>
                           <Image
                              source={
                                 // durationImages.find((b) => b.key === badge)
                                 //    .icon
                                    Assets.icons[index]
                              }
                              style={{
                                 height: 40,
                                 width: 40,
                                 position: 'absolute',
                              }}
                           />
                        </View>
                        <Text B10 marginT-8>
                           {badge} days
                        </Text>
                     </TouchableOpacity>
                  );
               })}
         </View>
      </View>
   );
}

function SectionHeader({ header, expanded }) {
   return (
      <View
         row
         spread
         paddingV-16
         paddingH-32
         centerV
         backgroundColor={expanded ? Colors.white : Colors.colorF2}
         style={{
            borderColor: Colors.colorF2,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderRadius: BORDER_RADIUS,
            borderBottomLeftRadius: expanded ? 0 : BORDER_RADIUS,
            borderBottomRightRadius: expanded ? 0 : BORDER_RADIUS,
         }}>
         <Text M18>{header}</Text>
         <AntDesign
            name={expanded ? 'caretup' : 'caretdown'}
            size={8}
            color={'#333'}
         />
      </View>
   );
}

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(StreakBadgesTab));
