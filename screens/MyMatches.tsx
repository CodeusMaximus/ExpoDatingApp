 import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultProfileImage from '../assets/default-profile.png'; // Ensure the path is correct

// Static data set of 40 unique users for the MatchesScreen with random match percentages
const matches = [
  { id: 1, profilePicture: '', username: 'Alice', age: 25, city: 'New York', town: 'Manhattan', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 2, profilePicture: '', username: 'Bob', age: 30, city: 'Los Angeles', town: 'Hollywood', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 3, profilePicture: '', username: 'Charlie', age: 28, city: 'Chicago', town: 'Lincoln Park', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 4, profilePicture: '', username: 'Diana', age: 22, city: 'Miami', town: 'Downtown', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 5, profilePicture: '', username: 'Eve', age: 27, city: 'San Francisco', town: 'Mission', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 6, profilePicture: '', username: 'Frank', age: 31, city: 'Seattle', town: 'Capitol Hill', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 7, profilePicture: '', username: 'Grace', age: 29, city: 'Austin', town: 'Downtown', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 8, profilePicture: '', username: 'Hank', age: 24, city: 'Denver', town: 'Five Points', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 9, profilePicture: '', username: 'Ivy', age: 26, city: 'Boston', town: 'Beacon Hill', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 10, profilePicture: '', username: 'Jack', age: 32, city: 'Dallas', town: 'Deep Ellum', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 11, profilePicture: '', username: 'Kate', age: 23, city: 'Portland', town: 'Pearl District', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 12, profilePicture: '', username: 'Leo', age: 34, city: 'San Diego', town: 'Gaslamp', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 13, profilePicture: '', username: 'Mona', age: 21, city: 'Phoenix', town: 'Arcadia', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 14, profilePicture: '', username: 'Nina', age: 28, city: 'Las Vegas', town: 'Summerlin', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 15, profilePicture: '', username: 'Oscar', age: 26, city: 'Orlando', town: 'Downtown', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 16, profilePicture: '', username: 'Paul', age: 33, city: 'Atlanta', town: 'Buckhead', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 17, profilePicture: '', username: 'Quinn', age: 27, city: 'Nashville', town: 'Germantown', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 18, profilePicture: '', username: 'Rita', age: 29, city: 'Charlotte', town: 'NoDa', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 19, profilePicture: '', username: 'Sam', age: 22, city: 'Indianapolis', town: 'Fountain Square', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 20, profilePicture: '', username: 'Tina', age: 30, city: 'Salt Lake City', town: 'Sugar House', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 21, profilePicture: '', username: 'Uma', age: 24, city: 'Minneapolis', town: 'Uptown', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 22, profilePicture: '', username: 'Victor', age: 31, city: 'Houston', town: 'Midtown', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 23, profilePicture: '', username: 'Wendy', age: 29, city: 'Philadelphia', town: 'Old City', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 24, profilePicture: '', username: 'Xander', age: 26, city: 'San Antonio', town: 'Downtown', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 25, profilePicture: '', username: 'Yara', age: 32, city: 'San Jose', town: 'Willow Glen', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 26, profilePicture: '', username: 'Zack', age: 27, city: 'Sacramento', town: 'Midtown', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 27, profilePicture: '', username: 'Amy', age: 30, city: 'Oklahoma City', town: 'Bricktown', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 28, profilePicture: '', username: 'Brian', age: 28, city: 'Tampa', town: 'Ybor City', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 29, profilePicture: '', username: 'Chloe', age: 25, city: 'Cleveland', town: 'Ohio City', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 30, profilePicture: '', username: 'Derek', age: 33, city: 'Columbus', town: 'Short North', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 31, profilePicture: '', username: 'Ella', age: 22, city: 'Pittsburgh', town: 'Strip District', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 32, profilePicture: '', username: 'Finn', age: 34, city: 'Kansas City', town: 'Crossroads', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 33, profilePicture: '', username: 'Gina', age: 21, city: 'Detroit', town: 'Downtown', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 34, profilePicture: '', username: 'Henry', age: 29, city: 'St. Louis', town: 'Central West End', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 35, profilePicture: '', username: 'Isla', age: 26, city: 'Cincinnati', town: 'Over-the-Rhine', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 36, profilePicture: '', username: 'James', age: 32, city: 'Buffalo', town: 'Allentown', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 37, profilePicture: '', username: 'Kara', age: 23, city: 'Raleigh', town: 'Warehouse District', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 38, profilePicture: '', username: 'Liam', age: 34, city: 'Richmond', town: 'Scott’s Addition', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 39, profilePicture: '', username: 'Mia', age: 21, city: 'Norfolk', town: 'Ghent', isOnline: true, matchPercentage: Math.floor(Math.random() * 41) + 60 },
  { id: 40, profilePicture: '', username: 'Noah', age: 28, city: 'New Orleans', town: 'French Quarter', isOnline: false, matchPercentage: Math.floor(Math.random() * 41) + 60 },
];

const MatchesScreen = () => {
  const navigation = useNavigation(); // Use navigation hook

  useEffect(() => {
    // Placeholder for Axios call and AsyncStorage setup
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

  // Handler for navigation on user item click
  const handleUserClick = (user) => {
    navigation.navigate('UserProfile', { userId: user.id }); // Ensure 'UserProfile' is registered in your navigation
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item)} style={styles.userContainer}>
      <Image
        source={item.profilePicture ? { uri: item.profilePicture } : defaultProfileImage}
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>
          {item.username} <Text style={styles.matchPercentage}>{item.matchPercentage}%</Text>
        </Text>
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
  matchPercentage: {
    fontSize: 12,
    color: 'green',
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
