import React, { useState, useEffect } from 'react';
import {  Text, View ,TouchableOpacity,StyleSheet} from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { width } from "config/scaleAccordingToDevice";

const CELL_COUNT = 6;
const RESEND_OTP_TIME_LIMIT = 30;

export const OTPField = ({confirmCode,sendVerification}) => {
let resendOtpTimerInterval: any;
 const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
    ) ;
//to start resent otp option
const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
        if (resendButtonDisabledTime <= 0) {
            clearInterval(resendOtpTimerInterval);
        } else {
            setResendButtonDisabledTime(resendButtonDisabledTime - 1);
        }
    }, 1000);
};

//on click of resend button
const onResendOtpButtonPress = () => {
    //clear input field
    setValue('')
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();

    sendVerification()
};

//declarations for input field
const [value, setValue] = useState('');
const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
});

//start timer on screen on launch
useEffect(() => {
    startResendOtpTimer();
    return () => {
        if (resendOtpTimerInterval) {
            clearInterval(resendOtpTimerInterval);
        }
    };
}, [resendButtonDisabledTime]);

return (
   <View style={styles.root}>
      <Text style={styles.title}>Did you get a code?</Text>
      <CodeField
         ref={ref}
         {...props}
         value={value}
         onChangeText={(text) => {
            setValue(text);
            text.length === 6 && confirmCode(text);
         }}
         autoFocus
         cellCount={CELL_COUNT}
         rootStyle={styles.codeFieldRoot}
         keyboardType="number-pad"
         textContentType="oneTimeCode"
         renderCell={({ index, symbol, isFocused }) => (
            <View
               onLayout={getCellOnLayoutHandler(index)}
               key={index}
               style={[styles.cellRoot, isFocused && styles.focusCell]}>
               <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
               </Text>
            </View>
         )}
      />
      {/* View for resend otp  */}
      {resendButtonDisabledTime > 0 ? (
         <Text style={styles.resendCodeText}>
            Resend Code in {resendButtonDisabledTime} sec
         </Text>
      ) : (
         <TouchableOpacity onPress={onResendOtpButtonPress}>
            <View style={styles.resendCodeContainer}>
               <Text style={styles.resendCode}> Resend Code</Text>
               <Text style={{ marginTop: 24 }}>
                  {' '}
                  in {resendButtonDisabledTime} sec
               </Text>
            </View>
         </TouchableOpacity>
      )}
   </View>
);
}

const styles = StyleSheet.create({
root: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: width - 80,
    marginTop: 16
},
title: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight:'bold'
},

codeFieldRoot: {
    marginTop: 10,
    width: '90%',
    marginLeft: 10,
    marginRight: 10,
},
cellRoot: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
 },
 cellText: {
    color: '#000',
    fontSize: 28,
    textAlign: 'center',
},
focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
},

button: {
    marginTop: 20
},
resendCode: {
    color: '#007AFF',
    marginTop: 24,
},
resendCodeText: {
    marginTop: 24,
},
resendCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
}
})