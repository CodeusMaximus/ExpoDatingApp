import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Animated, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-deck-swiper';
import HorizontalScrollComponent from '../components/HorizontalScroll';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Import only necessary Firebase functions
import { RootStackParamList } from '../types/types';

type DiscoverScreenNavigationProp = NavigationProp<RootStackParamList, 'Chat'>;

const DiscoverScreen = () => {
  const [users, setUsers] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const heartScale = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef(null);
  const navigation = useNavigation<DiscoverScreenNavigationProp>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'Missing authentication token');
          return;
        }

        const response = await axios.get('http://192.168.1.248:3000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Fetched users:', response.data); // Log the full response to verify structure

        // Retrieve user images from Firebase
        const usersWithImages = await Promise.all(
          response.data.map(async (user) => {
            let profilePictureUri = require('../assets/default-profile.png'); // Default image
            
            if (user.profilePicture) {
              try {
                const storage = getStorage(); // Direct usage of Firebase storage
                const storageRef = ref(storage, user.profilePicture);
                const imageUrl = await getDownloadURL(storageRef);
                profilePictureUri = { uri: imageUrl };
              } catch (error) {
                console.error(`Failed to fetch profile picture for user ${user.username}:`, error.message);
              }
            }
            return { ...user, profilePictureUri };
          })
        );

        setUsers(usersWithImages.filter(user => user !== null)); // Remove any invalid users
      } catch (error) {
        console.error('Failed to fetch users:', error);
        Alert.alert('Failed to fetch users', error.message || 'An error occurred while fetching users.');
      }
    };

    fetchUsers();
  }, []);

  const handleHeartClick = (userId) => {
    setLikedCards((prev) => ({
      ...prev,
      [userId]: true, // Mark the card as liked
    }));

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSwipeRight = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeRight();
    }
  };

  const handleSwipeLeft = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeLeft();
    }
  };
  const handleChatNavigation = (userId) => {
    if (userId) {
      console.log('Navigating to Chat with user ID:', userId); // Debug log
      navigation.navigate('Chat', { userId }); // Pass userId directly
    } else {
      console.error('Invalid user ID for Chat navigation:', userId);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.horizontalScrollContainer}>
          <HorizontalScrollComponent />
        </View>
        <View style={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            cards={users}
            renderCard={(user) =>
              user ? (
                <View key={user.id} style={styles.card}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Navigating to UserProfile with userId:', user.id); // Debug log
                      navigation.navigate('UserProfile', { userId: user.id });
                    }}
                  >
                    <Image source={user.profilePictureUri} style={styles.cardImage} />
                    <View style={styles.overlay}>
                      <Text style={styles.cardTitle}>
                        {user.username}, {user.age}
                      </Text>
                      <Text style={styles.cardLocation}>
                        {user.city}, {user.state}
                      </Text>
                      {likedCards[user.id] && <Text style={styles.likedText}>Liked!</Text>}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.redButton} onPress={handleSwipeLeft}>
                      <Text style={styles.buttonText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.heartButton} onPress={() => handleHeartClick(user.id)}>
                      <Text style={styles.heartText}>♥</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chatButton}  onPress={() => handleChatNavigation(user.id)}>
                      <Text style={styles.buttonText}>💬</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.greenButton} onPress={handleSwipeRight}>
                      <Text style={styles.buttonText}>→</Text>
                    </TouchableOpacity>
                  </View>
                  <Animated.View style={[styles.largeHeartContainer, { transform: [{ scale: heartScale }] }]}>
                    <Text style={styles.largeHeart}>❤️</Text>
                  </Animated.View>
                </View>
              ) : (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>No more users</Text>
                </View>
              )
            }
            onSwipedRight={(index) => console.log('Swiped right on:', users[index])}
            onSwipedLeft={(index) => console.log('Swiped left on:', users[index])}
            backgroundColor={'#fff'}
            cardVerticalMargin={0}
            stackSize={3}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  horizontalScrollContainer: {
    height: 100,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 60,
  },
  card: {
    height: '75%',
    width: '100%',
    borderRadius: 10,
    shadowRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: '#FFFFFF',
  },
  cardImage: {
    width: '100%',
    height: '90%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  likedText: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  redButton: {
    width: 50,
    height: 50,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  greenButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  heartButton: {
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  chatButton: {
    width: 50,
    height: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  heartText: {
    color: '#e74c3c',
    fontSize: 24,
  },
  largeHeartContainer: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  largeHeart: {
    fontSize: 100,
    color: '#e74c3c',
  },
});

export default DiscoverScreen;
