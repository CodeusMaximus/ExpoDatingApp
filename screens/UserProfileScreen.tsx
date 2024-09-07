 // UserProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const UserProfileScreen = () => {
  const route = useRoute<UserProfileRouteProp>();
  const { userId } = route.params || {};
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('User ID from route params:', userId); 

  useEffect(() => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'Missing authentication token');
          return;
        }

        console.log(`Fetching user profile from URL: http://192.168.1.248:3000/user/${userId}`);
        
        const response = await axios.get(`http://192.168.1.248:3000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data); // Log API response for debugging

        const { username, age, bio, interests, images, profilePicture } = response.data;

        let profileImageUri = require('../assets/default-profile.png');
        if (profilePicture) {
          try {
            const storageRef = ref(getStorage(), `user_pictures/${profilePicture}`);
            profileImageUri = { uri: await getDownloadURL(storageRef) };
          } catch (error) {
            console.error('Error fetching profile picture from Firebase:', error.message);
          }
        }

        setProfile({
          username,
          age,
          bio,
          interests: interests ? interests.join(', ') : '',
          pictures: images || [],
          profileImageUri,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        Alert.alert('Failed to fetch user profile', error.message || 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!profile) {
    return <Text>No profile data found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.picturesContainer}>
        {profile.pictures.map((picture, index) => (
          <Image key={index} source={{ uri: picture }} style={styles.picture} />
        ))}
      </View>
      <Text style={styles.username}>{profile.username}</Text>
      <Text style={styles.details}>Age: {profile.age}</Text>
      <Text style={styles.bio}>Bio: {profile.bio}</Text>
      <Text style={styles.interests}>Interests: {profile.interests}</Text>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 18,
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  interests: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  picturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  picture: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
});

export default UserProfileScreen;
