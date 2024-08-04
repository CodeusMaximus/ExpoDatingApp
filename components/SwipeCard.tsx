import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { User } from '../types';

interface SwipeCardProps {
  card: User;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ card }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: card.profile.picture }} style={styles.image} />
      <Text style={styles.text}>{card.username}</Text>
      <Text>{card.profile.bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  text: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default SwipeCard;
