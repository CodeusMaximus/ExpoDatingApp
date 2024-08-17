import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LikesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Likes</Text>
      {/* Display user's current likes */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default LikesScreen;
