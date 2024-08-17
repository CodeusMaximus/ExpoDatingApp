 // src/screens/TodaysPicksScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TodaysPicksScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Today's Picks</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TodaysPicksScreen;
