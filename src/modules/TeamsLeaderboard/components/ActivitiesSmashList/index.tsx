import Header from "components/Header";
import SmashItem from "./SmashItem";
import { bottom, shadow } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { View, Colors, Button, Assets, Text } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import { useNavigation } from "@react-navigation/core";
import Routes from "config/Routes";

const ActivitiesSmashList = (props) => {

    const { challengesStore } = props;
    const { myChallenges } = challengesStore;
    const [loaded, setLoaded] = useState(true)



    useEffect(() => {

        setTimeout(() => {


            setLoaded(true);
        }, 700);
        return () => {

        }
    }, [])
    const { navigate } = useNavigation();
    const { smashStore, close, challenge } = props
    const { libraryActionsList = [], libraryActivitiesHash = {}, } = smashStore

    const handleSmash = (action) => {

        close();

        smashStore.setActivtyWeAreSmashing(action);

        if (true) {

            navigate(Routes.TakeVideo)

        } else {

            navigate(Routes.MultiSmash)

        }
    }

    const allMasterIdsInArray = myChallenges?.map((challenge) => {

        return [...(challenge.masterIds || [])];
    })

    const allMasterIds = [...new Set(allMasterIdsInArray.flat(1))] || [];
    const allActivities = challenge ? challenge.masterIds?.map((id) => libraryActivitiesHash[id]) : allMasterIds?.map((id) => libraryActivitiesHash[id]);


    return (

        <>
            <View
                row
                paddingH-16
                paddingT-13
                paddingB-11
                style={{
                    justifyContent: "space-between",
                }}
            >
                <Text H14 color28 uppercase>
                    Smash an Activity!
                </Text>
                <Button
                    iconSource={Assets.icons.ic_delete_day}
                    link
                    color={Colors.buttonLink}
                    onPress={close}
                />
            </View>
            <View backgroundColor={Colors.background} style={{ height: props.height - props.height / 2 }}>
                <FlatList
                    data={allActivities}
                    renderItem={({ item }) => (

                        <SmashItem
                            item={item} onPress={() => handleSmash(item)} smashStore={smashStore} />
                    )}
                    keyExtractor={(item, index) => item.id}
                    contentContainerStyle={{
                        paddingTop: 16,
                        paddingBottom: bottom,
                    }}
                />
            </View>
        </>
    );
}

export default inject("smashStore", "createChallengeStore", "challengesStore")(observer(ActivitiesSmashList));
