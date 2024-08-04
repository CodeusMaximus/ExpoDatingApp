import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<UserProfile>({ age: 0, bio: '', interests: [], picture: '' });
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [picture, setPicture] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://192.168.1.248:3000/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { age, bio, interests, picture } = response.data.profile || {};
          setProfile(response.data);
          setAge(age?.toString() || '');
          setBio(bio || '');
          setInterests(interests?.join(', ') || '');
          setPicture(picture || '');
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const updatedProfile = { age: parseInt(age), bio, interests: interests.split(', '), picture };
      const token = await AsyncStorage.getItem('token');
      await axios.put('http://192.168.1.248:3000/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Interests"
        value={interests}
        onChangeText={setInterests}
      />
      <TextInput
        style={styles.input}
        placeholder="Picture URL"
        value={picture}
        onChangeText={setPicture}
      />
      <Button title="Save" onPress={handleSave} />
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

export default ProfileScreen;
