import ButtonLinear from 'components/ButtonLinear';
import { scaleH, width } from 'config/scaleAccordingToDevice';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Image, Assets, Colors, Button } from 'react-native-ui-lib';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import Input from 'components/Input';
import { Controller, useForm } from 'react-hook-form';
import Firebase from 'config/Firebase';
import { inject, observer } from 'mobx-react';

const SignUp = (props) => {
  const { navigate } = useNavigation();
  const goToLogin = React.useCallback(() => {
    navigate(Routes.Login);
  }, []);
  const { smashStore } = props
  const onLogin = React.useCallback((data) => {
     const { email, password } = data;

     Firebase.auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
           // Signed in
           const user = userCredential.user;
           // console.log("User signed in:", user)
           navigate(Routes.MainTab);
        })
        .catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;
           console.log(errorCode, errorMessage);
        });
  }, []);

  const onSignUp = React.useCallback((data) => {
     const { email, password, rePassword } = data;
     if (password !== rePassword) return;

     Firebase.auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
           // Signed in
           const user = userCredential.user;
           // console.log("User signed in:", user)
           navigate(Routes.MainTab);
        })
        .catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;
           console.log(errorCode, errorMessage);
        });
  }, []);

  useEffect(() => {
    Firebase.auth.onAuthStateChanged((user) => {
      if (user) {
         var uid = user.uid;
         // console.log("User signed in:", uid)
         smashStore.init(uid);
         navigate(Routes.MainTab);
      } else {
        navigate(Routes.Login);
      }
    });
  }, [])

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rePassword: '',
    },
  });

  return (
    <KeyboardAwareScrollView bounces={false} style={styles.container}>
      <View
        flex
        backgroundColor={Colors.contentW}
        centerH
        style={{
          paddingTop: scaleH(40),
          justifyContent: 'flex-end',
        }}>
        <Image
          source={Assets.icons.logoSignUp}
          style={{ marginBottom: scaleH(30) }}
        />
        <Button
          label="SIGN UP WITH FACEBOOK"
          iconSource={Assets.icons.ic_facebook}
          backgroundColor={Colors.facebook}
          style={{ width: width - 48 }}
          enableShadow
        />
        <Image
          source={Assets.icons.or}
          marginV-24
          style={{ marginVertical: scaleH(24) }}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input value={value} onChangeText={onChange} label={'Email'} />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              secureTextEntry={true}
              label={'Password'}
            />
          )}
        />
        <Controller
          control={control}
          name="rePassword"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              secureTextEntry={true}
              label={'Confirm Password'}
            />
          )}
        />
        <ButtonLinear
          title={'Sign Up'}
          style={styles.btnSignUp}
          onPress={handleSubmit(onSignUp)}
        />
        <Text R14 color28 center>
          Already have an account?
          <Text R14 buttonLink onPress={goToLogin}>
            {' '}
            Log In
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default inject("smashStore")(observer(SignUp));

const styles = StyleSheet.create({
  btnSignUp: {
    marginVertical: scaleH(16),
  },
  container: {
    backgroundColor: Colors.contentW,
  },
});
