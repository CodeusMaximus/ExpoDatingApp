import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChooseUsernameScreen = ({ navigation, route }) => {
  const { age, email, firstName, location, city, state,  gender, interests, bio, images, relationshipTypes, password, answers } = route.params;
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(null); // null to indicate no check has been done yet

  const checkUsernameAvailability = async () => {
    if (!username) {
      Alert.alert('Please enter a username');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.248:3000/check-username', { username });
      setIsAvailable(response.data.isAvailable);
      if (!response.data.isAvailable) {
        Alert.alert('Username is already taken. Please choose another one.');
      } else {
        Alert.alert('Username is available!');
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

    if (isAvailable === null) {
      Alert.alert('Please check the username availability first.');
      return;
    }

    if (isAvailable) {
      await AsyncStorage.setItem('username', username);
      navigation.navigate('SignUpPhoneVerification', {age, 
        email, firstName, location, city, state,  gender, interests, bio, images, password, relationshipTypes, answers, username
      });
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
        onChangeText={(text) => {
          setUsername(text);
          setIsAvailable(null); // Reset availability check when the user types
        }}
        onBlur={checkUsernameAvailability}
      />
      <Button title="Check Availability" onPress={checkUsernameAvailability} />
      <Button title="Next" onPress={handleNext} disabled={isAvailable === false} />
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
