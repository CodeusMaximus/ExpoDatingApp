import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeCard from './SwipeCard';
 

interface UserProfile {
  age: number;
  bio: string;
  interests: string[];
  picture: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  profile: UserProfile;
}

const SwipeScreen: React.FC<{ route: any }> = ({ route }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken || '');
    };
    getToken();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get('http://192.168.1.248:3000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    if (token) {
      getUsers();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        renderCard={(card) => <SwipeCard card={card} />}
        onSwipedLeft={(cardIndex) => console.log('Swiped left:', cardIndex)}
        onSwipedRight={(cardIndex) => console.log('Swiped right:', cardIndex)}
        cardIndex={0}
        backgroundColor={'#4FD0E9'}
        stackSize={3}
      />
      <View style={styles.buttonContainer}>
        <Button title="Dislike" color="red" onPress={() => console.log('Dislike')} />
        <Button title="Like" color="green" onPress={() => console.log('Like')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
});

export default SwipeScreen;
