import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const SignUpPhotosScreen = ({ navigation, route }) => {
  const { email, firstName, location, country, zipcode, gender, interests, password, relationshipTypes } = route.params;
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, ...result.selected]);
    }
  };

  const handleNext = () => {
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
      images
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Photos</Text>
      <ScrollView horizontal>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </ScrollView>
      <Button title="Pick Images" onPress={pickImage} />
      <Button title="Next" onPress={handleNext} />
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
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default SignUpPhotosScreen;
