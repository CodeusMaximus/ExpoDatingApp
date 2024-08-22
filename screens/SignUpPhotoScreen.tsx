import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SignUpPhotoScreen = ({ navigation, route }) => {
  const { email, firstName, location, country, zipcode, gender, interests, password, relationshipTypes } = route.params;
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImageUri(selectedImageUri);

      try {
        // Convert the image URI to a blob
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        // Create a reference to the Firebase storage location
        const storageRef = ref(storage, `profile_pictures/${Date.now()}_profile.jpg`);

        // Upload the blob to Firebase
        const snapshot = await uploadBytes(storageRef, blob);

        // Get the download URL
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Save the image URL to AsyncStorage
        await AsyncStorage.setItem('profilePictureUri', imageUrl);

        // Navigate to the next screen with the image URL
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
          images: [imageUrl],
        });
      } catch (error) {
        console.error('Error uploading image:', error.message);
        Alert.alert('Upload Error', `Failed to upload image: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Photo</Text>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Pick an Image" onPress={pickImage} />
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});

export default SignUpPhotoScreen;
