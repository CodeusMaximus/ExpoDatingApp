import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, onValue } from 'firebase/database';
import { RootStackParamList } from '../types/types';
import { Entypo } from '@expo/vector-icons'; // Import Entypo for the trash icon

// Sample data for 20 fictitious users
const mockUsers = Array.from({ length: 20 }, (_, index) => ({
  id: `user${index + 1}`,
  name: `User ${index + 1}`,
  online: Math.random() > 0.5,
  newMessage: Math.random() > 0.5,
}));

type User = {
  id: string;
  name: string;
  online: boolean;
  newMessage: boolean;
};

const MessagesScreen = () => {
  const [users, setUsers] = useState<User[]>(mockUsers); // Use mock data for now
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Commented out the API call to use mock data
        // const response = await axios.get('http://192.168.1.248:3000/api/users/messages');
        // const fetchedUsers: User[] = response.data;

        // For demonstration purposes, using mockUsers
        const fetchedUsers: User[] = mockUsers;

        // Check user presence in Firebase Realtime Database
        const db = getDatabase();
        fetchedUsers.forEach((user) => {
          const userRef = ref(db, `status/${user.id}`);
          onValue(userRef, (snapshot) => {
            const isOnline = snapshot.val();
            user.online = !!isOnline;
          });
        });

        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserPress = (userId: string) => {
    navigation.navigate('Chat', { userId });
  };

  const handleDeletePress = (userId: string) => {
    // Add your delete logic here
    console.log(`Delete user with id: ${userId}`);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userContainer}>
      <TouchableOpacity style={styles.userInfo} onPress={() => handleUserPress(item.id)}>
        <Image source={require('../assets/default-profile.png')} style={styles.profileImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={item.online ? styles.onlineText : styles.offlineText}>
            {item.online ? 'Online' : 'Offline'}
          </Text>
          {item.newMessage && <Text style={styles.newMessageText}>New</Text>}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={styles.trashIcon}>
        <Entypo name="trash" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
trashIcon: {
    position: 'absolute',
    right: 0,
    top: 10,
  
},
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineText: {
    color: 'green',
  },
  offlineText: {
    color: 'gray',
  },
  newMessageText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default MessagesScreen;
