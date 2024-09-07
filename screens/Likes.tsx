import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import 'firebase/storage';
import defaultProfileImage from '../assets/default-profile.png'; // Ensure the path is correct

// Firebase configuration (Replace with your Firebase project credentials)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Static data set of 40 unique users for the MatchesScreen
const matches = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  profilePicture: '', // Use empty to ensure default image shows
  username: `User${index + 1}`,
  age: 20 + (index % 10), // Example ages
  city: 'City', // Example city
  town: 'Town', // Example town
  isOnline: index % 2 === 0, // Alternating online status
}));

const MatchesScreen = () => {
  const navigation = useNavigation(); // Use navigation hook

  useEffect(() => {
    // Placeholder for future Axios calls and AsyncStorage setup
    axios.get('https://example.com/api/matches') // Example API call
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    AsyncStorage.setItem('matches', JSON.stringify(matches)) // Example AsyncStorage setup
      .then(() => console.log('Matches saved to AsyncStorage'))
      .catch(error => console.error('Error saving matches to AsyncStorage', error));
  }, []);

  // Handler for navigation on user item click (if needed in the future)
  const handleUserClick = (user) => {
    navigation.navigate('Matches'); // Ensure 'UserProfile' is registered in your navigation
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item)} style={styles.userContainer}>
      <Image
        source={item.profilePicture ? { uri: item.profilePicture } : defaultProfileImage}
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.details}>{item.age}, {item.city}, {item.town}</Text>
        {item.isOnline && <Text style={styles.onlineText}>Online Now!</Text>}
      </View>
      <TouchableOpacity style={styles.messageIcon}>
        <MaterialIcons name="chat" size={24} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Matches</Text>
      <FlatList
        data={matches}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        key={'matches-list'} // Unique key for the list
        showsVerticalScrollIndicator={false}
        numColumns={2} // Display in two columns
        columnWrapperStyle={styles.row} // Ensures items are wrapped correctly in rows
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  userContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 12,
    color: '#666',
  },
  onlineText: {
    fontSize: 12,
    color: 'green',
    marginTop: 5,
  },
  messageIcon: {
    marginTop: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default MatchesScreen;
