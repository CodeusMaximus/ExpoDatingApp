import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import HorizontalScrollComponent from '../components/HorizontalScroll';
import CustomHeader from '../components/CustomHeader';

 

const DiscoverScreen = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'User 1', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'User 2', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'User 3', image: 'https://via.placeholder.com/150' },
  ]);
  const [desiredUsers, setDesiredUsers] = useState([]);
  const [undesiredUsers, setUndesiredUsers] = useState([]);

  const handleSwipeRight = (index) => {
    setDesiredUsers([...desiredUsers, users[index]]);
  };

  const handleSwipeLeft = (index) => {
    setUndesiredUsers([...undesiredUsers, users[index]]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.horizontalScrollContainer}>
        <HorizontalScrollComponent />
      </View>
      <View style={styles.swiperContainer}>
       <Swiper
          cards={users}
          renderCard={(user) => (
            <View style={styles.card}>
              <Image source={{ uri: user.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{user.name}</Text>
            </View>
          )}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          backgroundColor={'#fff'}
          cardVerticalMargin={50}
          stackSize={3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e06767',
     
  },
  horizontalScrollContainer: {
    height: 100, // Adjust the height as needed
  },
  swiperContainer: {
    flex: 1, // This makes the swiper take the remaining space
    
  },
  card: {
    flex: 1,
    borderRadius: 10,
    shadowRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
     
  },
  cardTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 20,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
});

export default DiscoverScreen;
