 // src/components/HorizontalScrollComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HorizontalScrollComponent = () => {
  const navigation = useNavigation();

  return (
    <ScrollView horizontal style={styles.horizontalScroll}>
      <TouchableOpacity
        style={styles.circularScreen}
        onPress={() => navigation.navigate('NearbyUsers')}
      >
        <Text style={styles.screenText}>Nearby</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.circularScreen}
        onPress={() => navigation.navigate('OnlineUsers')}
      >
        <Text style={styles.screenText}>Online</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.circularScreen}
        onPress={() => navigation.navigate('Matches')}
      >
        <Text style={styles.screenText}>Matches</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.circularScreen}
        onPress={() => navigation.navigate('TodaysPicks')}
      >
        <Text style={styles.screenText}>Today's Picks</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.circularScreen}
        onPress={() => navigation.navigate('TodaysPicks')}
      >
        <Text style={styles.screenText}>Today's Picks</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.circularScreen}
        onPress={() => navigation.navigate('TodaysPicks')}
      >
        <Text style={styles.screenText}>Today's Picks</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.circularScreen}
        onPress={() => navigation.navigate('TodaysPicks')}
      >
        <Text style={styles.screenText}>Today's Picks</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalScroll: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    height: 100,
  },
  circularScreen: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  screenText: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default HorizontalScrollComponent;
