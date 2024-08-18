import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChooseUsernameScreen = ({ navigation, route }) => {
    const { email, firstName, location, country, zipcode, gender, interests, bio, images,relationshipTypes,age, password, answers} = route.params;
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.post('http://192.168.1.248:3000/check-username', { username });
      setIsAvailable(response.data.isAvailable);
      if (!response.data.isAvailable) {
        Alert.alert('Username is already taken. Please choose another one.');
      }
    } catch (error) {
      console.error('Error checking username availability', error);
      Alert.alert('Error', 'There was an error checking username availability.');
    }
  };

  const handleNext = async () => {
    if (!username) {
      Alert.alert('Please enter a username');
      return;
    }

    if (isAvailable) {
      await AsyncStorage.setItem('username', username);
      navigation.navigate('SignUpPhoneVerification', {email, firstName, location, country, zipcode, gender, interests, bio, images, password,relationshipTypes,age, answers });
    } else {
      Alert.alert('Please choose a different username');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        onBlur={checkUsernameAvailability}
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default ChooseUsernameScreen;
