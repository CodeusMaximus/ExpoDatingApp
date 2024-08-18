import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsScreen = () => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(require('../assets/default-profile.png'));
    const navigation = useNavigation();
  
    useEffect(() => {
      const fetchProfileData = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const savedProfilePicture = await AsyncStorage.getItem('profilePictureUri');
  
          const response = await axios.get('http://192.168.1.248:3000/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const user = response.data;
          setUsername(user.username || `User${Math.floor(Math.random() * 100000)}`);
  
          if (savedProfilePicture) {
            setProfilePicture({ uri: savedProfilePicture });
          } else if (user.profilePicture && user.profilePicture !== 'default-profile.png') {
            setProfilePicture({ uri: user.profilePicture });
          }
        } catch (error) {
          console.error('Failed to fetch profile data', error.response ? error.response.data : error.message);
        }
      };
  
      fetchProfileData();
    }, []);
  
    const handleSignOut = async () => {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    };
  
    const handleUpdateUsername = () => {
      Alert.alert('Update Username', 'Feature to update username will be implemented here.');
    };
  
    const handleUpdateProfilePicture = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        setProfilePicture({ uri: selectedImageUri });
  
        await AsyncStorage.setItem('profilePictureUri', selectedImageUri);
  
        try {
          const token = await AsyncStorage.getItem('userToken');
          await axios.put(
            'http://192.168.1.248:3000/profile',
            { profilePicture: selectedImageUri },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error('Failed to update profile picture', error.response ? error.response.data : error.message);
          Alert.alert('Error', 'Failed to update profile picture.');
        }
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.profilePictureContainer}>
          <Image source={profilePicture} style={styles.profilePicture} />
          <TouchableOpacity style={styles.pencilIcon} onPress={handleUpdateProfilePicture}>
            <Icon name="pencil" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleUpdateUsername}>
          <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
        <View style={styles.spacer}></View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
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
    profilePictureContainer: {
      position: 'relative',
      marginBottom: 20,
    },
    profilePicture: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    pencilIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 5,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    spacer: {
      flex: 1,
    },
    signOutButton: {
      width: '100%',
      padding: 15,
      backgroundColor: '#007BFF',
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
    },
    signOutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default SettingsScreen
