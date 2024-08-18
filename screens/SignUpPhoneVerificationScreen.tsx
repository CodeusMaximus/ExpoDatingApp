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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phone) {
      Alert.alert('Please enter a phone number');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://192.168.1.248:3000/send-code', { phone });
      setIsLoading(false);
      if (response.data.success) {
        setIsCodeSent(true);
        Alert.alert('Verification code sent');
      } else {
        Alert.alert('Failed to send verification code');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error sending code:', error.message);
      Alert.alert('Error sending code', error.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
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
      setIsLoading(false);
      if (response.data.token) {
        Alert.alert('Registration Successful');
        navigation.navigate('Login');
      } else {
        Alert.alert('Invalid verification code');
      }
    } catch (error) {
      setIsLoading(false);
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
        keyboardType="phone-pad"
        onChangeText={setPhone}
        editable={!isLoading}
      />
      <Button title="Send Code" onPress={handleSendCode} disabled={isLoading} />
      {isCodeSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={code}
            keyboardType="number-pad"
            onChangeText={setCode}
            editable={!isLoading}
          />
          <Button title="Verify" onPress={handleVerifyCode} disabled={isLoading} />
        </>
      )}
      {isLoading && <Text>Loading...</Text>}
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