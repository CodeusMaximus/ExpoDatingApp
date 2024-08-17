import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const PreferencesScreen = ({ navigation }) => {
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');

  const handleSearch = () => {
    // Query for users based on parameters
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="Age Range"
        value={ageRange}
        onChangeText={setAgeRange}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Interests"
        value={interests}
        onChangeText={setInterests}
      />
      <Button title="Search" onPress={handleSearch} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default PreferencesScreen;
