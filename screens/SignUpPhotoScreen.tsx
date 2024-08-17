import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpPhotosScreen = ({ navigation, route }) => {
  const { email, firstName, country, zipcode, gender, interests, password, relationshipTypes, bio } = route.params;
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const savedPhotos = await AsyncStorage.getItem('photos');
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    };

    loadPhotos();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      const newPhotos = [...photos, selectedImageUri];
      setPhotos(newPhotos);
      await AsyncStorage.setItem('photos', JSON.stringify(newPhotos));
    }
  };

  const handleNext = async () => {
    if (photos.length < 1) {
      Alert.alert('Please upload at least one photo.');
      return;
    }

    navigation.navigate('SignUpBio', {
      email,
      firstName,
      country,
      zipcode,
      gender,
      interests,
      password,
      relationshipTypes,
      photos,
      bio,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Photos</Text>
      <Button title="Pick Images from Gallery" onPress={pickImage} />
      <View style={styles.imagesContainer}>
        {photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={styles.image} />
        ))}
      </View>
      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default SignUpPhotosScreen;
