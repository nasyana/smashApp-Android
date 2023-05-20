import React, { useEffect, useState } from 'react';
import {
    Colors,
    ExpandableSection,
    Image,
    Text,
    View,
    TouchableOpacity,
    Assets
} from 'react-native-ui-lib';
import Header from 'components/Header';
import firebaseInstance from 'config/Firebase';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { durationImages } from 'helpers/generalHelpers';
import _, { indexOf } from 'lodash';
import { moment } from 'helpers/generalHelpers';;
import { inject, observer } from 'mobx-react';
import SectionHeader from 'components/SectionHeader';
import { FlashList } from '@shopify/flash-list';
import SmashStore from 'stores/SmashStore';
import { Vibrate } from 'helpers/HapticsHelpers';
import { ActivityIndicator } from 'react-native';
import {width} from '../../config/scaleAccordingToDevice';
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
const BORDER_RADIUS = 6;
const firestore = firebaseInstance.firestore;
const BADGE_WIDTH = width / 8.5;

function StreakBadgesTab({ challengesStore, monthKey = false, user = false, smashStore }) {
    const { challengesHash } = challengesStore;
    

    const [streakBadges, setStreakBadges] = useState([]);
    const [badgeLevels, setBadgeLevels] = useState([]);
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        

      let time =  setTimeout(() => {

            setLoaded(true)
            
        }, 1000);
      return () => {

        if(time){
            clearTimeout(time);
        }
     
       
      }
    }, [])
    
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

        // console.log('{ title: key, data: groupBy[key] };', { title: key, data: groupBy[key] })
        return { title: key, data: groupBy[key] };
    });

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
        let uid = firebaseInstance.auth.currentUser.uid;
        if (user) {
          uid = user?.uid;
        }
      
        const useMonthKey = monthKey || moment().format('MMYYYY');
        const celebrationsCollectionRef = collection(firestore, 'celebrations');
        const streakBadgesQuery = query(celebrationsCollectionRef,
          where('uid', '==', uid),
          where('type', '==', 'challengeStreak')
        );
      
        const unsub = onSnapshot(streakBadgesQuery, (docs) => {
          let streakBadges = [];
          docs.forEach((doc) => {
            if (doc.exists()) {
              streakBadges.push(doc.data());
            }
          });
          const badgeCounts = {};
          durationImages.forEach(level => {
            badgeCounts[level.key] = 0;
          });
          
          streakBadges.forEach(streakBadge => {
            durationImages.forEach(level => {
              if (streakBadge.streak === level.key) {
                badgeCounts[level.key] += 1;
              }
            });
          });
      
          setBadgeLevels(badgeCounts);
        });
      
        return () => {
          if (unsub) {
            unsub();
          }
        };
      }, []);



    const renderItem = ({ item, index }) => {
        const isLast = DATA.length - 1 == index;
        const badge = item;
        // const challengeFull = challengesHash?.[item.challengeId] || {
        //     colorStart: '#333',
        // };
        
const none = badgeLevels?.[badge.key] == 0
  

        return (

            <TouchableOpacity
            // onPress={() => setBadge(b)}
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
                marginH-0
                centerV
                backgroundColor={ loaded ? none ? '#ccc' : 
                    durationImages.find((b) => b.key === badge?.key).color : '#ccc'
                }
                style={{
                    width: BADGE_WIDTH,
                    height: BADGE_WIDTH,
                    borderRadius: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={
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
                {badge?.key} days
            </Text>
            {loaded ? badgeLevels?.[badge.key] > 0 && <View center style={{position:'absolute', top: 0, right: 0, backgroundColor: Colors.smashPink, width: 20, height: 20, borderRadius: 10}}><Text B10 white>
                {badgeLevels?.[badge.key]}
            </Text></View> : <View center style={{position:'absolute', top: 0, right: 0, width: 20, height: 20, borderRadius: 10}}><ActivityIndicator color={'#ccc'} size={10} /></View>}
        </TouchableOpacity>
        )
        // return (
        //     <ListItem
        //         key={index}
        //         item={item}
        //         isLast
        //         count={streakBadges?.length || 0}
        //         challengesStore={challengesStore}
        //         user={user}
        //         smashStore={smashStore}
        //     />
        // );
    };

    if (durationImages?.length == 0) {
        return null
    }

    // console.warn(durationImages);
    
    return (
        <View flex >
            <SectionHeader title="Streak Badges Count" style={{paddingBottom: 0, marginTop: 16}} />
            {/* <Header title={'Monthly Badges'} noShadow back /> */}
            <FlatList
                keyExtractor={(index) => index}
                data={durationImages}
                renderItem={renderItem}
                numColumns={6}
                // ListEmptyComponent={<Text>No Badges yet</Text>}
                style={{ padding: 16}}
                contentContainerStyle={{alignItems: 'center' }}
                ItemSeparatorComponent={Seperator}
            />
        </View>
    );
}

function Seperator() {
    return <View padding-6 />;
}



export default inject(
    'smashStore',
    'challengesStore',
    'teamsStore',
)(observer(StreakBadgesTab));
