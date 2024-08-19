import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUpBioScreen = ({ navigation, route }) => {
  const { email, firstName, location, country, zipcode, gender, interests, password, relationshipTypes, images } = route.params;
  const [bio, setBio] = useState('');

  const handleNext = () => {
    navigation.navigate('SignUpQuestion', { 
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
      bio 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us about yourself</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Write something about yourself..."
        value={bio}
        onChangeText={setBio}
        multiline
      />
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
  textArea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default SignUpBioScreen;