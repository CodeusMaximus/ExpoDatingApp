import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const NearbyUsersScreen: React.FC = () => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/nearby-users', {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`, // Replace with your actual auth token
          },
        });
        setNearbyUsers(response.data);
      } catch (error) {
        console.error('Error fetching nearby users:', error);
      }
    };

    fetchNearbyUsers();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={nearbyUsers}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.user}>
            <Text style={styles.username}>{item.username}</Text>
            {/* Display other user details as needed */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  user: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontSize: 18,
  },
});

export default NearbyUsersScreen;
