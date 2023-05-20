import React, { useEffect, useState } from 'react';
import {
    Colors,
    ExpandableSection,
    Image,
    Text,
    View,
    TouchableOpacity
} from 'react-native-ui-lib';
import Header from 'components/Header';
import Firebase from 'config/Firebase';
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

function StreakBadgesTab({ challengesStore, monthKey = false, user = false, smashStore }) {
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

        // console.log('{ title: key, data: groupBy[key] };', { title: key, data: groupBy[key] })
        return { title: key, data: groupBy[key] };
    });

    let unsub

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
        let uid = Firebase.auth.currentUser.uid

        if (user) {

            uid = user?.uid;
        }


        const timeout = setTimeout(() => {
            const useMonthKey = monthKey || moment().format('MMYYYY');

          unsub =   Firebase.firestore
                .collection('celebrations')
                .where('uid', '==', uid)
                .where('type', '==', 'challengeStreak')
                .where('monthKey', '==', useMonthKey)
                .onSnapshot((docs) => {
                    let streakBadges = [];
                    docs.forEach((doc) => {
                        if (doc.exists) {
                            streakBadges.push(doc.data());
                        }
                    });
                    setStreakBadges(streakBadges);
                });

        }, 1000);



        return ()=>{ if(timeout) { timeout() } if(unsub){unsub()}}
    }, []);

    const renderItem = ({ item, index }) => {
        const isLast = DATA.length - 1 == index;
        return (
            <ListItem
                key={index}
                item={item}
                isLast
                count={streakBadges?.length || 0}
                challengesStore={challengesStore}
                user={user}
                smashStore={smashStore}
            />
        );
    };

    if (DATA?.length == 0) {
        return null
    }

    return (
        <View flex >
            {/* <Header title={'Monthly Badges'} noShadow back /> */}
            <FlatList
                keyExtractor={(index) => index}
                data={DATA}
                renderItem={renderItem}
                // ListEmptyComponent={<Text>No Badges yet</Text>}
                style={{ padding: 16 }}
                ItemSeparatorComponent={Seperator}
            />
        </View>
    );
}

function Seperator() {
    return <View padding-6 />;
}

function ListItem({ item, isLast, challengesStore, count, user, smashStore }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <View>
            <SectionHeader style={{ marginLeft: 8, marginBottom: expanded ? 16 : 0, paddingBottom: 0 }} title={`${user.name || 'Your '} Streak Badges This Month (${count})`} expanded={expanded}
                onPress={() => setExpanded(!expanded)} subtitle={!expanded ? <AntDesign name="down" size={24} /> : <AntDesign name="up" size={24} />} />
            <ExpandableSection expanded={expanded}>
            <View
                backgroundColor={Colors.white}
                padding-16
                paddingT-16
                marginB-0
                style={{
                    borderColor: Colors.colorF2,
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderBottomLeftRadius: BORDER_RADIUS,
                    borderBottomRightRadius: BORDER_RADIUS,
                }}>

                <FlashList estimatedItemSize={200} keyExtractor={(item, index) => { return item?.name }} data={item.data} renderItem={(item, index) => {

                    const challenge = item?.item;
                    return (
                        <ChallengeListItem
                            challengesStore={challengesStore}
                            smashStore={smashStore}
                            challenge={challenge}
                            // challengeOriginal={challengeOriginal}
                            isFirst={index === 0}
                            isLast={index === item.data?.length - 1}
                        />
                    );
                }} />
                {/* {item.data.map()} */}
            </View>
            </ExpandableSection>
        </View>
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
                    .map((b) => {

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
                                            durationImages.find((b) => b.key === badge)
                                                .icon
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

function SectionHeader2({ header, expanded }) {
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
