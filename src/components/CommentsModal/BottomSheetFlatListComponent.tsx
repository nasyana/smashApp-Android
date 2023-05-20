import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import React, { useEffect, useRef, useState } from 'react'
import CommentItem from './CommentItem';
import JournalEntry from './JournalEntry';
import BottomSheet, {
    BottomSheetTextInput,
    BottomSheetFlatList,
    BottomSheetBackdrop,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import LottieAnimation from 'components/LottieAnimation';
import AnimatedView from 'components/AnimatedView';
import { inject, observer } from 'mobx-react';
import { ActivityIndicator, Platform } from 'react-native';
import { commentListener,journalListener } from './commentService';
const isAndroid = Platform.OS === 'android';

const BottomSheetFlatListComponent = ({ isJournal = false, onClose, smashStore, postId }) => {

    const { commentPost } = smashStore;

    const [commentList, setCommentList] = useState([]);
    const cancelComment = () => {
        smashStore.setReplyComment(false);
    };
    useEffect(() => {
        const unsub = postId ? commentPost?.journal ? journalListener(postId, setCommentList, (commentPost?.dayKey || false)) : commentListener(postId, setCommentList)
            : () => null;

        return unsub;
    }, [postId]);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            setTimeout(() => {
                setLoaded(true);
            }, 500);
        }
    }, [loaded]);

    const flatlistRef = useRef();
    useEffect(() => {

        if(!commentPost){
            return
        }
        setTimeout(() => scrollFlatlist(), 300);

        return () => { };
    }, [commentList.length])

    const renderItem = ({ item }) => commentPost?.journal ? <JournalEntry item={item} /> : <CommentItem item={item} />;

  
    const scrollFlatlist = () => {

        if(!commentPost || commentList?.length < 1){return}
        flatlistRef?.current?.scrollToEnd({ animating: true });
    };

    if (!loaded || !commentPost) {

        return <View flex center><ActivityIndicator color={Colors.$primary} /></View>
    }
    return (

        <BottomSheetFlatList
            // ListFooterComponent={isJournal ? <Text style={{opacity: 0.3, elevation: 0.3}} absolute center H2B secondaryContent>{commentPost?.activityName}</Text> : () => null}
            // bounces={commentList.length > 0 ? true : false}
            data={commentList || []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={smashStore.replyComment && (
                <View
                    row
                    spread
                    style={{
                        borderTopWidth: 0.5,
                        borderColor: '#eee',
                        paddingTop: 10,
                        marginBottom: -10,
                    }}
                    paddingH-60>
                    <Text R12>
                        Replying to {smashStore.replyComment.commentOwnerName}"
                        {smashStore.replyComment.text}"
                    </Text>

                    <TouchableOpacity onPress={cancelComment}>
                        <Text R12 secondaryContent>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            ref={flatlistRef}
            renderItem={renderItem}
            ListHeaderComponent={isJournal ? <View>
                {isAndroid && <View row spread paddingH-16><View /><TouchableOpacity onPress={onClose}><Text R14><AntDesign name="close" size={24} /></Text></TouchableOpacity></View>}
                <Text center marginT-16 R12 secondaryContent>{postDisplayDate}</Text><Text style={{ opacity: 0.3, elevation: 0.3 }} absolute center H2B secondaryContent paddingB-0 marginB-0>{journalLabel}</Text></View> : isAndroid ? <View row spread paddingH-16><View /><TouchableOpacity onPress={onClose}><Text R14><AntDesign name="close" size={24} /></Text></TouchableOpacity></View> : () => null}
            // onContentSizeChange={() =>
            //    flatlistRef.current.scrollToEnd({ animated: true })
            // }
            // onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
            ListEmptyComponent={
                commentPost?.journal ? <View paddingV-32 center>
                    <LottieAnimation
                        autoPlay
                        loop={true}
                        style={{
                            height: 100,
                            zIndex: 0,
                            top: 0,
                            left: 0,
                        }}
                        source={require('lottie/no-comments.json')}
                    />
                    <Text secondaryContent h3>
                        No Entries
                    </Text>
                    <Text secondaryContent>Add a journal entry...</Text>
                </View>
                    : <View paddingV-32 center>
                        <LottieAnimation
                            autoPlay
                            loop={true}
                            style={{
                                height: 100,
                                zIndex: 0,
                                top: 0,
                                left: 0,
                            }}
                            source={require('lottie/no-comments.json')}
                        />
                        <Text secondaryContent h3>
                            No Comments
                        </Text>
                        <Text secondaryContent>Be the first to comment</Text>
                    </View>}
        />


    )
}
export default inject('smashStore', 'notificatonStore')(observer(BottomSheetFlatListComponent));
