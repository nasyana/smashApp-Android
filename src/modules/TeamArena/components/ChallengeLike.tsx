import React, { useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import {  Colors, Text, TouchableOpacity } from "react-native-ui-lib";
import { sendNotification } from "services/NotificationsService";
import Firebase from "config/Firebase";
import { inject, observer } from 'mobx-react';

const ChallengeLike = (props) => {
    const {smashStore,item}= props
    const handleLike = () => {
        smashStore.like(item)
    }

    return (
        <TouchableOpacity onPress={handleLike}>
            <Text center color28 >
                {item.like || 0}
            </Text>
            <AntDesign name={'heart'} size={20} color={item?.like > 0 ? Colors.red20 : Colors.grey50} />
        </TouchableOpacity>
    )
}

export default inject("smashStore")(observer(ChallengeLike))