import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const SignUpPhoneVerificationScreen = ({ navigation, route }) => {
  const {
    email,
    firstName,
    location,
    country,
    zipcode,
    gender,
    interests,
    password,
    relationshipType,
    profileImages,
    about,
    answers
  } = route.params;
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    try {
      const response = await axios.post('http://192.168.1.248:3000/send-code', { phone });
      if (response.data.success) {
        setIsCodeSent(true);
        Alert.alert('Verification code sent');
      } else {
        Alert.alert('Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending code:', error.message);
      Alert.alert('Error sending code', error.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('http://192.168.1.248:3000/verify-code', {
        phone,
        code,
        username: firstName,
        email,
        password,
        location: { country, zipcode },
        gender,
        interests,
        relationshipType,
        profileImages,
        about,
        answers
      });
      if (response.data.token) {
        Alert.alert('Registration Successful');
        navigation.navigate('Login');
      } else {
        Alert.alert('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error.message);
      Alert.alert('Error verifying code', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Send Code" onPress={handleSendCode} />
      {isCodeSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={code}
            onChangeText={setCode}
          />
          <Button title="Verify" onPress={handleVerifyCode} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default SignUpPhoneVerificationScreen;
