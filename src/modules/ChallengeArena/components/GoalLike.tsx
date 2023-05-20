import React, { useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import {  Colors, Text, TouchableOpacity } from "react-native-ui-lib";

import { inject, observer } from 'mobx-react';

const GoalLike = (props) => {

    const {smashStore,item}= props
    const handleLike = () => {

console.log('item',item.goalId, item.id)
        smashStore.playerGoalLike(item)
    }   


    return (
        <TouchableOpacity onPress={handleLike}>
            <Text center color28 >
                {item.like || 0}
            </Text>
            <AntDesign name={'rocket1'} size={30} color={item?.like > 0 ? Colors.red20 : Colors.grey50} />
        </TouchableOpacity>
    )
}

export default inject("smashStore")(observer(GoalLike))