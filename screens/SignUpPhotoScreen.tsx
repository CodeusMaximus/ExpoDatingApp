import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const SignUpPhotosScreen = ({ navigation, route }) => {
  const { email, firstName, location, country, zipcode, gender, interests, password, relationshipTypes } = route.params;
  const [images, setImages] = useState([]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'Camera roll permissions are required to upload images.');
      }
    };

    requestPermissions();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission not granted', 'Camera roll permissions are required to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImages([...images, selectedImageUri]);
    }
  };

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Error', 'Please upload at least one image before proceeding.');
      return;
    }

    navigation.navigate('SignUpBio', {
      email,
      firstName,
      location,
      country,
      zipcode,
      gender,
      interests,
      password,
      relationshipTypes,
      images,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Photos</Text>
      <View style={styles.imageContainer}>
        {images.length > 0 && (
          <Image source={{ uri: images[0] }} style={styles.image} />
        )}
      </View>
      <Button title="Pick Images" onPress={pickImage} />
      <Button title="Next" onPress={handleNext} />
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
    textAlign: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 250,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});

export default SignUpPhotosScreen;
