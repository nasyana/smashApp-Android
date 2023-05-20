/* eslint-disable class-methods-use-this */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable flowtype/require-return-type */
// @noflow
// import autobind from "autobind-decorator";
import React, { useEffect, useState, useRef } from 'react';

import { Feather as Icon } from "@expo/vector-icons";
// import { Text, Theme, View, Firebase } from "../components";
// import type { ScreenProps } from "../components/Types";
// import Loader from "../components/Loader";
// import PhoneInput from "react-native-phone-number-input";
import { observer, inject } from "mobx-react";
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from "expo-firebase-recaptcha";
// import CodeInput from "./CodeInput";

// import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import Firebase from "config/Firebase";

///////////////
import ButtonLinear from 'components/ButtonLinear';
import Input from 'components/Input';
import { scaleH,width} from 'config/scaleAccordingToDevice';
import { StyleSheet ,Dimensions} from 'react-native';
import { View, Text, Image, Assets, Colors, Button, TextField, TouchableOpacity } from 'react-native-ui-lib';
import Routes from 'config/Routes';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Controller, useForm } from 'react-hook-form';


@inject("smashStore")
@observer
export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.phone = React.createRef();
    }

    state = {
        user: undefined,
        phone: "",
        confirmationResult: undefined,
        code: "",
        loading: false,
        verificationId: false,
        iso: "AU",
        formattedNumber: "",
        isAppleLoginAvailable: false
    };

    
    sendVerification = () => {

        // this.props.smashStore.universalLoading = true;

        const phoneProvider = new Firebase.auth.PhoneAuthProvider();

        phoneProvider.verifyPhoneNumber(this.state.phone, this.recaptchaVerifier).then((verificationId) => {
            this.setState({ verificationId });
            console.log("verificationId",verificationId)
            // this.props.smashStore.universalLoading = false;
        });
    }
    
    confirmCode = () => {

        // this.props.smashStore.universalLoading = true;
        // this.setState({ loading: true });
        const { verificationId, code } = this.state;
        const credential = Firebase.auth.PhoneAuthProvider.credential(verificationId, code);
        Firebase.auth()
            .signInWithCredential(credential)
            .then((result) => { });
    }

   
    isNumberValid = (number) => {
        const isValid = this.phone?.current?.isValidNumber(number);

        this.setState({ isValid });
    }

    
    resendVerificationCode = () => {
        // if(!this.state.checkValid){return}

        this.props.smashStore.universalLoading = true;
        // this.setState({ loading: true });
        const phoneProvider = Firebase.auth.PhoneAuthProvider();

        phoneProvider.verifyPhoneNumber(this.state.formattedNumber, this.recaptchaVerifier).then((verificationId) => {
            this.setState({ verificationId });
            console.log("verificationId",verificationId)
            this.props.smashStore.universalLoading = false;
        });
    }

    
    // signInWithApple = () => {
    //     // this.setState({ loading: true });
    //     this.props.smashStore.universalLoading = true
    //     const nonce = Math.random().toString(36).substring(2, 10);

    //     return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
    //         .then((hashedNonce) =>
    //             AppleAuthentication.signInAsync({
    //                 requestedScopes: [
    //                     AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    //                     AppleAuthentication.AppleAuthenticationScope.EMAIL
    //                 ],
    //                 nonce: hashedNonce
    //             })
    //         )
    //         .then((appleCredential) => {
    //             const { identityToken } = appleCredential;
    //             const provider = new Firebase.aauth.OAuthProvider('apple.com');
    //             const credential = provider.credential({
    //                 idToken: identityToken,
    //                 rawNonce: nonce
    //             });
    //             Firebase.aauth().signInWithCredential(credential).then((result) => {
    //                 // this.setState({ loading: false });
    //                 this.props.smashStore.universalLoading = false;
    //                 console.log("Login success: " + result);
    //             });
    //             // Successful sign in is handled by firebase.auth().onAuthStateChanged
    //         })
    //         .catch(({ message }) => {
    //             // this.setState({ loading: false });
    //             this.props.smashStore.universalLoading = false;
    //             alert(`Apple Login Error: ${message}`);
    //         });
    // };



    render() {
        const deviceHeight = Dimensions.get("window").height;
        const deviceWidth = Dimensions.get("window").width;

        const SPACING = 20;

        const ready = this.state.formattedNumber?.length > 11;

        const reg = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

        const num = this.state.formattedNumber.replace(/\D/g, "");

        const checkValid = this.state.isValid;

        const renderIso = this.phone?.current?.getCountryCode();

        let placeholder = "0412 345 678";

        if (renderIso == "NZ") {
            placeholder = "021 123 4567";
        }

        const fontSize = 19;

        return (
            <View
            flex
            backgroundColor={Colors.contentW}
            centerH
            style={{
                paddingTop: scaleH(40),
                paddingBottom: 24 + getBottomSpace(),
            }}>
            {/* <TextField
                placeholder="Phone Number"
                // onChangeText={setPhoneNumber}
                onChangeText={()=>{}}
                keyboardType="phone-pad"
                autoCompleteType="tel"
            /> */}

            <Input 
            // value={value} 
            // onChangeText={onChange}
            keyboardType="phone-pad"
            value={this.state.phone}  
            onChangeText={(text)=>{this.setState({phone:text})}} 
            label={'Phone'} 
            />

            <TouchableOpacity
                 onPress={this.sendVerification}
                //  onPress={()=>{}}
            >
                <Text>Send Verification</Text>
            </TouchableOpacity>

            {/* Verification Code Input */}
            <TextField
                placeholder="Confirmation Code"
                // onChangeText={setCode}
                onChangeText={()=>{}}
                keyboardType="number-pad"
            />
            {/* <TouchableOpacity 
            // onPress={confirmCode}
            onPress={()=>{}}
            >
                <Text>Send Verification</Text>
            </TouchableOpacity> */}

            
            {/* <Input 
            // value={value} 
            // onChangeText={onChange}
            value={"nickname"}  
            onChangeText={()=>{}} 
            label={'Nickname'} 
            />

            <Input 
            // value={value} 
            // onChangeText={onChange}
            value={"Email"}  
            onChangeText={()=>{}} 
            label={'Email'} 
            />

            <Input 
            // value={value} 
            // onChangeText={onChange}
            value={"Password"}  
            onChangeText={()=>{}}
            secureTextEntry={true} 
            label={'Password'} 
            /> */}
                    
            {/* <View
                style={{
                width: '100%',
                paddingLeft: 24,
                flexDirection: 'row',
                }}>
                <Button
                link
                label={'Forgot Password'}
                labelStyle={{ color: Colors.buttonLink, fontSize: 14 }}
                />
            </View> */}

            <ButtonLinear
                title={'Log In'}
                // style={styles.btnSignUp}
                // onPress={onLogin}
                onPress={()=>{}}
            />
            <Image
                source={Assets.icons.or}
                marginV-24
                style={{ marginVertical: scaleH(24) }}
            />
            <Button
                label="SIGN UP WITH FACEBOOK"
                iconSource={Assets.icons.ic_facebook}
                backgroundColor={Colors.facebook}
                // onPress={() => loginWithFacebook()}
                onPress={() => {}}
                style={{ width: width - 48, height: 50 }}
            />
            <View flex />
            {/* <Text R14 color28 center>
                Don't have an account?
                <Text R14 buttonLink
                //  onPress={goToSignup}
                 onPress={()=>{}}
                >
                {' '}
                Sign Up
                </Text>
            </Text> */}

            <FirebaseRecaptchaVerifierModal
                 ref={(ref) => (this.recaptchaVerifier = ref)}
                firebaseConfig={Firebase.app.options}
            />
    </View>
        );
    }
}



