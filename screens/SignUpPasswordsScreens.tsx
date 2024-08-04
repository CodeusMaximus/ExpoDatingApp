import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const SignUpPasswordScreen = ({ navigation, route }) => {
  const { email, firstName, location, country, zipcode, gender, interests } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    navigation.navigate('SignUpRelationshipType', {
      email,
      firstName,
      location,
      country,
      zipcode,
      gender,
      interests,
      password,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
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

export default SignUpPasswordScreen;
