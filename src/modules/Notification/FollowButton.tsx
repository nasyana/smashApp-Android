import React, { useState, useRef, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import ButtonLinear from 'components/ButtonLinear';
import { doc, onSnapshot } from "firebase/firestore";
import { ActivityIndicator } from 'react-native';
const FollowButton = ({ smashStore, causeUser, challengesStore, style,teamsStore }) => {

    const { currentUser,currentUserId, toggleFollowUnfollow, requestFollow, willExceedQuota, isPremiumMember, showUpgradeModal } = smashStore;
    const { navigate } = useNavigation();

    const refreshFriends = () => {
        teamsStore.getFriends();
      };

    const currentUserFollowing = currentUser.following || [];
    const currentUserFollowers = currentUser.followers || [];

    const tooManyPeople = false;
    const [loading, setLoading] = useState(true);
    const [isRequested, setIsRequested] = useState();
    const [isPrivate, setIsPrivate] = useState(false);
    const [userDoc, setUserDoc] = useState({})
    const showModal = false;
    const isFollowing = (currentUser.following || [])?.includes(causeUser);

    useEffect(() => {
        let userDoc = {}
        const unsub = onSnapshot(doc(firestore, 'users', causeUser), (userSnapshot) => {
            userDoc = userSnapshot?.data() || { name: 'User Removed' };
            setUserDoc(userDoc);
          });
        const isRequested = userDoc?.followRequests?.includes(currentUserId) || false;
        const isPrivate = userDoc?.isPrivate || false;
        setIsPrivate(isPrivate);
        setIsRequested(isRequested)
        setLoading(false);
        return () => {
            if (unsub) { unsub() }
        }
    }, [])

    if(loading){
        return <ActivityIndicator />
    }



    return (

        <ButtonLinear
            outline={isFollowing}
            marginH-16
            // marginB-16
            // marginT-16
            style={{ marginTop: 16, ...style, marginBottom: 16 }}

            outlined
            bordered={isFollowing}
            disabled={isRequested}
            colors={[Colors.meToday, Colors.teamToday]}
            title={
                isRequested
                    ? 'Requested'
                    : isFollowing
                        ? 'Following'
                        : 'Follow'
            }
            onPress={() => {
                //  alert(isFollowing);
                if (isRequested) return;
                // if (!currentUser?.following) {
                //     smashStore.createCohersionNotice(
                //         'Congrats on Finding Your Motivators!',
                //         uid,
                //         'Press the Smash Button at the bottom to start playing!',
                //     );
                // }
                if (tooManyPeople) {
                    alert("Oops you've reached the limit");
                } else if (showModal) {
                    challengesStore.subscribeModal = 'myProfileHome';
                } else if (
                    isPrivate &&
                    !userDoc?.followers?.includes(currentUserId)
                ) {

                    // console.warn(isFollowing, isPremiumMember, willExceedQuota(currentUser?.following?.length,'followingQuota'));
                    

                    if(!isFollowing && !isPremiumMember && willExceedQuota(currentUserFollowing?.length,'followingQuota') && false){
                        showUpgradeModal(true)
               
                        return 
                     }
                    requestFollow(userDoc?.uid);
                } else {
                    
                    if(!isFollowing && !isPremiumMember && willExceedQuota(currentUserFollowing?.length,'followingQuota') && false){
                        showUpgradeModal(true)
               
                        return 
                     }
                    toggleFollowUnfollow(userDoc?.uid,refreshFriends);
                    
                }
            }}>
            <Text white={!isFollowing}>
                {isRequested
                    ? 'Requested'
                    : isFollowing
                        ? 'Following'
                        : 'Follow'}
            </Text>
        </ButtonLinear>

    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(FollowButton));