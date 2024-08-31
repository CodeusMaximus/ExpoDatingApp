import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Importing chat icon from MaterialIcons
import defaultProfileImage from '../assets/default-profile.png'; // Ensure the path is correct

// Full data set of 40 unique users each
const likedUsers = [
  { id: 1, profilePicture: '', username: 'Alice', age: 25, city: 'New York', town: 'Manhattan', isOnline: true },
  { id: 2, profilePicture: '', username: 'Bob', age: 30, city: 'Los Angeles', town: 'Hollywood', isOnline: false },
  { id: 3, profilePicture: '', username: 'Charlie', age: 28, city: 'Chicago', town: 'Lincoln Park', isOnline: true },
  { id: 4, profilePicture: '', username: 'Diana', age: 22, city: 'Miami', town: 'Downtown', isOnline: true },
  { id: 5, profilePicture: '', username: 'Eve', age: 27, city: 'San Francisco', town: 'Mission', isOnline: false },
  { id: 6, profilePicture: '', username: 'Frank', age: 31, city: 'Seattle', town: 'Capitol Hill', isOnline: true },
  { id: 7, profilePicture: '', username: 'Grace', age: 29, city: 'Austin', town: 'Downtown', isOnline: false },
  { id: 8, profilePicture: '', username: 'Hank', age: 24, city: 'Denver', town: 'Five Points', isOnline: true },
  { id: 9, profilePicture: '', username: 'Ivy', age: 26, city: 'Boston', town: 'Beacon Hill', isOnline: false },
  { id: 10, profilePicture: '', username: 'Jack', age: 32, city: 'Dallas', town: 'Deep Ellum', isOnline: true },
  { id: 11, profilePicture: '', username: 'Kate', age: 23, city: 'Portland', town: 'Pearl District', isOnline: false },
  { id: 12, profilePicture: '', username: 'Leo', age: 34, city: 'San Diego', town: 'Gaslamp', isOnline: true },
  { id: 13, profilePicture: '', username: 'Mona', age: 21, city: 'Phoenix', town: 'Arcadia', isOnline: true },
  { id: 14, profilePicture: '', username: 'Nina', age: 28, city: 'Las Vegas', town: 'Summerlin', isOnline: false },
  { id: 15, profilePicture: '', username: 'Oscar', age: 26, city: 'Orlando', town: 'Downtown', isOnline: true },
  { id: 16, profilePicture: '', username: 'Paul', age: 33, city: 'Atlanta', town: 'Buckhead', isOnline: true },
  { id: 17, profilePicture: '', username: 'Quinn', age: 27, city: 'Nashville', town: 'Germantown', isOnline: false },
  { id: 18, profilePicture: '', username: 'Rita', age: 29, city: 'Charlotte', town: 'NoDa', isOnline: true },
  { id: 19, profilePicture: '', username: 'Sam', age: 22, city: 'Indianapolis', town: 'Fountain Square', isOnline: false },
  { id: 20, profilePicture: '', username: 'Tina', age: 30, city: 'Salt Lake City', town: 'Sugar House', isOnline: true },
  { id: 21, profilePicture: '', username: 'Uma', age: 24, city: 'Minneapolis', town: 'Uptown', isOnline: true },
  { id: 22, profilePicture: '', username: 'Victor', age: 31, city: 'Houston', town: 'Midtown', isOnline: false },
  { id: 23, profilePicture: '', username: 'Wendy', age: 29, city: 'Philadelphia', town: 'Old City', isOnline: true },
  { id: 24, profilePicture: '', username: 'Xander', age: 26, city: 'San Antonio', town: 'Downtown', isOnline: false },
  { id: 25, profilePicture: '', username: 'Yara', age: 32, city: 'San Jose', town: 'Willow Glen', isOnline: true },
  { id: 26, profilePicture: '', username: 'Zack', age: 27, city: 'Sacramento', town: 'Midtown', isOnline: true },
  { id: 27, profilePicture: '', username: 'Amy', age: 30, city: 'Oklahoma City', town: 'Bricktown', isOnline: false },
  { id: 28, profilePicture: '', username: 'Brian', age: 28, city: 'Tampa', town: 'Ybor City', isOnline: true },
  { id: 29, profilePicture: '', username: 'Chloe', age: 25, city: 'Cleveland', town: 'Ohio City', isOnline: true },
  { id: 30, profilePicture: '', username: 'Derek', age: 33, city: 'Columbus', town: 'Short North', isOnline: false },
  { id: 31, profilePicture: '', username: 'Ella', age: 22, city: 'Pittsburgh', town: 'Strip District', isOnline: true },
  { id: 32, profilePicture: '', username: 'Finn', age: 34, city: 'Kansas City', town: 'Crossroads', isOnline: true },
  { id: 33, profilePicture: '', username: 'Gina', age: 21, city: 'Detroit', town: 'Downtown', isOnline: false },
  { id: 34, profilePicture: '', username: 'Henry', age: 29, city: 'St. Louis', town: 'Central West End', isOnline: true },
  { id: 35, profilePicture: '', username: 'Isla', age: 26, city: 'Cincinnati', town: 'Over-the-Rhine', isOnline: false },
  { id: 36, profilePicture: '', username: 'James', age: 32, city: 'Buffalo', town: 'Allentown', isOnline: true },
  { id: 37, profilePicture: '', username: 'Kara', age: 23, city: 'Raleigh', town: 'Warehouse District', isOnline: false },
  { id: 38, profilePicture: '', username: 'Liam', age: 34, city: 'Richmond', town: 'Scott’s Addition', isOnline: true },
  { id: 39, profilePicture: '', username: 'Mia', age: 21, city: 'Norfolk', town: 'Ghent', isOnline: true },
  { id: 40, profilePicture: '', username: 'Noah', age: 28, city: 'New Orleans', town: 'French Quarter', isOnline: false },
];

const usersWhoLikedMe = [
  { id: 41, profilePicture: '', username: 'Olivia', age: 24, city: 'San Francisco', town: 'SOMA', isOnline: true },
  { id: 42, profilePicture: '', username: 'Pete', age: 31, city: 'New York', town: 'Brooklyn', isOnline: false },
  { id: 43, profilePicture: '', username: 'Quincy', age: 30, city: 'Houston', town: 'Downtown', isOnline: true },
  { id: 44, profilePicture: '', username: 'Rachel', age: 28, city: 'Chicago', town: 'Magnificent Mile', isOnline: true },
  { id: 45, profilePicture: '', username: 'Steve', age: 25, city: 'Dallas', town: 'Uptown', isOnline: false },
  { id: 46, profilePicture: '', username: 'Tanya', age: 27, city: 'Boston', town: 'Seaport', isOnline: true },
  { id: 47, profilePicture: '', username: 'Ulysses', age: 26, city: 'Atlanta', town: 'Midtown', isOnline: true },
  { id: 48, profilePicture: '', username: 'Violet', age: 23, city: 'Denver', town: 'LoDo', isOnline: false },
  { id: 49, profilePicture: '', username: 'Walter', age: 32, city: 'Seattle', town: 'Pike Place', isOnline: true },
  { id: 50, profilePicture: '', username: 'Xena', age: 29, city: 'Portland', town: 'Pearl District', isOnline: false },
  { id: 51, profilePicture: '', username: 'Yosef', age: 28, city: 'Phoenix', town: 'Downtown', isOnline: true },
  { id: 52, profilePicture: '', username: 'Zara', age: 30, city: 'Las Vegas', town: 'The Strip', isOnline: true },
  { id: 53, profilePicture: '', username: 'Aaron', age: 21, city: 'San Diego', town: 'Gaslamp', isOnline: false },
  { id: 54, profilePicture: '', username: 'Becky', age: 31, city: 'Philadelphia', town: 'Center City', isOnline: true },
  { id: 55, profilePicture: '', username: 'Caleb', age: 33, city: 'Miami', town: 'South Beach', isOnline: true },
  { id: 56, profilePicture: '', username: 'Dana', age: 22, city: 'Orlando', town: 'Downtown', isOnline: false },
  { id: 57, profilePicture: '', username: 'Eli', age: 34, city: 'Austin', town: 'Downtown', isOnline: true },
  { id: 58, profilePicture: '', username: 'Fiona', age: 25, city: 'Nashville', town: 'The Gulch', isOnline: true },
  { id: 59, profilePicture: '', username: 'Gabe', age: 29, city: 'Charlotte', town: 'Uptown', isOnline: false },
  { id: 60, profilePicture: '', username: 'Haley', age: 24, city: 'St. Louis', town: 'Downtown', isOnline: true },
  { id: 61, profilePicture: '', username: 'Ian', age: 27, city: 'Indianapolis', town: 'Broad Ripple', isOnline: true },
  { id: 62, profilePicture: '', username: 'Jess', age: 23, city: 'Minneapolis', town: 'North Loop', isOnline: false },
  { id: 63, profilePicture: '', username: 'Kyle', age: 30, city: 'Milwaukee', town: 'Third Ward', isOnline: true },
  { id: 64, profilePicture: '', username: 'Lana', age: 26, city: 'Cincinnati', town: 'Over-the-Rhine', isOnline: true },
  { id: 65, profilePicture: '', username: 'Max', age: 32, city: 'Buffalo', town: 'Elmwood Village', isOnline: false },
  { id: 66, profilePicture: '', username: 'Nate', age: 34, city: 'Cleveland', town: 'Downtown', isOnline: true },
  { id: 67, profilePicture: '', username: 'Opal', age: 28, city: 'Kansas City', town: 'Westport', isOnline: true },
  { id: 68, profilePicture: '', username: 'Penny', age: 24, city: 'Detroit', town: 'Midtown', isOnline: false },
  { id: 69, profilePicture: '', username: 'Ron', age: 33, city: 'Memphis', town: 'Beale Street', isOnline: true },
  { id: 70, profilePicture: '', username: 'Sara', age: 21, city: 'Norfolk', town: 'Downtown', isOnline: true },
  { id: 71, profilePicture: '', username: 'Theo', age: 22, city: 'Raleigh', town: 'Downtown', isOnline: false },
  { id: 72, profilePicture: '', username: 'Uma', age: 34, city: 'Richmond', town: 'Downtown', isOnline: true },
  { id: 73, profilePicture: '', username: 'Vic', age: 25, city: 'New Orleans', town: 'French Quarter', isOnline: true },
  { id: 74, profilePicture: '', username: 'Wes', age: 27, city: 'Tampa', town: 'Ybor City', isOnline: false },
  { id: 75, profilePicture: '', username: 'Xavier', age: 29, city: 'Orlando', town: 'Lake Eola', isOnline: true },
  { id: 76, profilePicture: '', username: 'Yvette', age: 30, city: 'Los Angeles', town: 'Hollywood', isOnline: true },
  { id: 77, profilePicture: '', username: 'Zane', age: 22, city: 'San Francisco', town: 'Marina', isOnline: false },
  { id: 78, profilePicture: '', username: 'Amber', age: 31, city: 'Dallas', town: 'Deep Ellum', isOnline: true },
  { id: 79, profilePicture: '', username: 'Blake', age: 33, city: 'San Diego', town: 'Little Italy', isOnline: true },
  { id: 80, profilePicture: '', username: 'Cody', age: 23, city: 'Austin', town: '6th Street', isOnline: false },
];

const LikedUsersScreen = () => {
  const [activeTab, setActiveTab] = useState('liked'); // 'liked' or 'likedMe'
  const navigation = useNavigation(); // Use navigation hook

  const renderUserItem = ({ item }) => (
    <View style={styles.userContainer}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
          onPress={() => {
            setActiveTab('liked');
          }} // Switch to 'liked' tab
        >
          <Text style={styles.tabText}>Users I've Liked</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'likedMe' && styles.activeTab]}
          onPress={() => {
            setActiveTab('likedMe');
          }} // Switch to 'likedMe' tab
        >
          <Text style={styles.tabText}>Users Who Liked Me</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === 'liked' ? likedUsers : usersWhoLikedMe}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        key={`flatlist-${activeTab}`} // Unique key to force re-render
        showsVerticalScrollIndicator={false}
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
  tabs: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
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
    paddingLeft: 10,
  },
});

export default LikedUsersScreen;
