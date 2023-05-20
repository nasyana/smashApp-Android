import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { spring, timing } from 'react-native-reanimated';
import { interpolate } from 'react-native-reanimated';

const Button = ({ onPress, children }) => {
    const [isPressed, setIsPressed] = useState(false);

    const scale = spring(isPressed ? 0.95 : 1, {
        stiffness: 1000,
        damping: 500,
    });
    const borderRadius = timing(isPressed ? 4 : 20, {
        duration: 200,
    });
    const textColor = interpolate(scale, {
        inputRange: [0.9, 1],
        output: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,1)'],
    });

    return (
        <TouchableOpacity
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={styles.button}
            onPress={onPress}>
            <View style={[styles.buttonContent, { transform: [{ scale }] }]}>
                <Text style={[styles.buttonText, { color: textColor }]}>
                    {children}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        borderRadius: 20,
        backgroundColor: '#4169E1',
    },
    buttonContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Button;
