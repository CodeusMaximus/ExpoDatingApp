import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState({ age: '', bio: '', interests: '', pictures: [] });
  const [isEditing, setIsEditing] = useState(false);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://192.168.1.248:3000/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { age, bio, interests, pictures } = response.data.profile || {};
          setProfile({ age: age?.toString() || '', bio: bio || '', interests: interests?.join(', ') || '', pictures: pictures || [] });
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        Alert.alert('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const updatedProfile = new FormData();
      updatedProfile.append('age', profile.age);
      updatedProfile.append('bio', profile.bio);
      updatedProfile.append('interests', profile.interests);

      profile.pictures.forEach((picture, index) => {
        updatedProfile.append('pictures', {
          uri: picture,
          type: 'image/jpeg',
          name: `picture${index}.jpg`,
        } as any);
      });

      const token = await AsyncStorage.getItem('token');
      await axios.put('http://192.168.1.248:3000/profile', updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Failed to update profile');
    }
  };

  const handleAddPhoto = async () => {
    if (profile.pictures.length >= 8) {
      Alert.alert('You can only upload up to 8 photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newPictures = [...profile.pictures, result.assets[0].uri];
      setProfile({ ...profile, pictures: newPictures });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={profile.pictures}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[styles.profilePic, { width, height: width }]} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `image-${index}`}
        style={styles.photoScroll}
      />

      <Button title="Add Photo" onPress={handleAddPhoto} />

      <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editableField}>
        <Text style={styles.infoText}>Age: {isEditing ? <TextInput value={profile.age} onChangeText={(value) => setProfile({ ...profile, age: value })} style={styles.input} keyboardType="numeric" /> : profile.age}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editableField}>
        <Text style={styles.infoText}>Bio: {isEditing ? <TextInput value={profile.bio} onChangeText={(value) => setProfile({ ...profile, bio: value })} style={styles.input} /> : profile.bio}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editableField}>
        <Text style={styles.infoText}>Interests: {isEditing ? <TextInput value={profile.interests} onChangeText={(value) => setProfile({ ...profile, interests: value })} style={styles.input} /> : profile.interests}</Text>
      </TouchableOpacity>

      {isEditing && <Button title="Save" onPress={handleSave} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profilePic: {
    resizeMode: 'cover',
    marginBottom: 20,
  },
  photoScroll: {
    marginBottom: 20,
  },
  editableField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    marginLeft: 10,
    padding: 10,
  },
});

export default ProfileScreen;
