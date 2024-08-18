import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

const SignUpLocationServicesScreen = ({ navigation, route }) => {
  const { email, firstName } = route.params;

  const handleEnableLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'Location permission is required to continue.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        navigation.navigate('SignUpLocation', { email, firstName, location });
      } else {
        Alert.alert('Location Error', 'Unable to retrieve location.');
      }
    } catch (error) {
      console.error('Error enabling location services:', error);
      Alert.alert('Error', 'There was an error enabling location services.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Location Services</Text>
      <Button title="Enable Location Services" onPress={handleEnableLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SignUpLocationServicesScreen;