import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const SignUpEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const checkEmailAvailability = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid email format. Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.248:3000/check-email', { email });
      setIsAvailable(response.data.isAvailable);
      if (!response.data.isAvailable) {
        Alert.alert('Email is already registered. Please use a different email.');
      }
    } catch (error) {
      console.error('Error checking email availability', error);
      Alert.alert('Error', 'There was an error checking email availability.');
    }
  };

  const handleNext = () => {
    if (!email) {
      Alert.alert('Please enter an email');
      return;
    }

    if (isAvailable) {
      navigation.navigate('SignUpName', { email });
    } else {
      Alert.alert('Please use a different email');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={checkEmailAvailability} // Check availability when the user stops typing
      />
      <Button title="Next" onPress={handleNext} />
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

export default SignUpEmailScreen;