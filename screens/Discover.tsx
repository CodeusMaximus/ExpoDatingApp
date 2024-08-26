import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import HorizontalScrollComponent from '../components/HorizontalScroll';

const generateMockUsers = (count) => {
  const mockUsers = [];
  for (let i = 1; i <= count; i++) {
    mockUsers.push({
      id: i,
      name: `User ${i}`,
      age: Math.floor(Math.random() * 20) + 20, // Random age between 20 and 40
      location: `City ${i}`,
      image: `https://via.placeholder.com/150?text=User+${i}`,
    });
  }
  return mockUsers;
};

const DiscoverScreen = () => {
  const [users, setUsers] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const heartScale = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef(null);

  const navigation = useNavigation();

  useEffect(() => {
    const generatedUsers = generateMockUsers(100);
    setUsers(generatedUsers);
  }, []);

  const handleHeartClick = (userId) => {
    setLikedCards((prev) => ({
      ...prev,
      [userId]: true, // Mark the card as liked
    }));
    console.log(`Card ${userId} liked!`, { ...likedCards, [userId]: true }); // Log liked status

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

  const handleChatNavigation = () => {
    navigation.navigate('Chat');
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
                  <Image source={{ uri: user.image }} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>
                        {user.name}, {user.age}
                      </Text>
                      {likedCards[user.id] && <Text style={styles.likedText}>Liked!</Text>}
                    </View>
                    <Text style={styles.cardLocation}>{user.location}</Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.redButton} onPress={handleSwipeLeft}>
                        <Text style={styles.buttonText}>←</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.heartButton} onPress={() => handleHeartClick(user.id)}>
                        <Text style={styles.heartText}>♥</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.chatButton} onPress={handleChatNavigation}>
                        <Text style={styles.buttonText}>💬</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.greenButton} onPress={handleSwipeRight}>
                        <Text style={styles.buttonText}>→</Text>
                      </TouchableOpacity>
                    </View>
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
    backgroundColor: '#e06767',
  },
  container: {
    flex: 1,
  },
  horizontalScrollContainer: {
    height: 100, // Adjust the height as needed
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 60,
  },
  card: {
    height: '70%',
    width: '90%',
    borderRadius: 10,
    shadowRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 30,
  },
  cardImage: {
    width: '100%',
    height: '65%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
    backgroundColor: '#fff',
    width: '100%',
    paddingTop: 20,
    borderColor:'#000000',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
  },
  likedText: {
    color: '#e74c3c',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    opacity: 0.8,
  },
});

export default DiscoverScreen;
