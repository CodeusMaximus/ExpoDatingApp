import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebaseconfig';

interface Profile {
  username: string;
  age: string;
  bio: string;
  interests: string;
  pictures: string[];
}

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [profile, setProfile] = useState<Profile>({
    username: '',
    age: '',
    bio: '',
    interests: '',
    pictures: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.get('http://192.168.1.248:3000/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { username, age, bio, interests, images } = response.data;
          setProfile({
            username: username || '',
            age: age?.toString() || '',
            bio: bio || '',
            interests: interests?.join(', ') || '',
            pictures: images || [],
          });
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
      const updatedProfile = { ...profile };

      const token = await AsyncStorage.getItem('userToken');
      await axios.put('http://192.168.1.248:3000/update-profile', updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
      try {
        const selectedImageUri = result.assets[0].uri;
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
        const fileName = `user_pictures/${Date.now()}_image.jpg`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);

        const newPictures = [...profile.pictures, imageUrl];
        setProfile({ ...profile, pictures: newPictures });

        const token = await AsyncStorage.getItem('userToken');
        await axios.put('http://192.168.1.248:3000/update-profile', { images: newPictures }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Failed to upload image to Firebase', error);
        Alert.alert('Failed to upload image');
      }
    }
  };

  const handleDeletePhoto = async (imageUri: string) => {
    try {
      const imageRef = ref(storage, imageUri);
      await deleteObject(imageRef);

      const updatedPictures = profile.pictures.filter((picture) => picture !== imageUri);
      setProfile({ ...profile, pictures: updatedPictures });

      const token = await AsyncStorage.getItem('userToken');
      await axios.put('http://192.168.1.248:3000/update-profile', { images: updatedPictures }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {
      console.error('Failed to delete image', error);
      Alert.alert('Failed to delete image');
    }
  };

  const renderDots = () => {
    return profile.pictures.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          currentIndex === index ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profile.pictures.length > 0 ? (
        <>
          <FlatList
            data={profile.pictures}
            renderItem={({ item }) => (
              <TouchableOpacity onLongPress={() => handleDeletePhoto(item)}>
                <Image
                  source={{ uri: item }}
                  style={[styles.profilePic, { width, height: width }]}
                />
              </TouchableOpacity>
            )}
            horizontal
            pagingEnabled
            onScroll={(event) => {
              const scrollPosition = event.nativeEvent.contentOffset.x;
              const currentIndex = Math.floor(scrollPosition / width);
              setCurrentIndex(currentIndex);
            }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `image-${index}`}
            contentContainerStyle={styles.flatListContainer}
          />
          <View style={styles.dotsContainer}>{renderDots()}</View>
        </>
      ) : (
        <Image
          source={require('../assets/default-profile.png')}
          style={[styles.profilePic, { width, height: width }]}
        />
      )}

      <Button title="Add Photo" onPress={handleAddPhoto} />

      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editableField}>
          <Text style={styles.infoText}>
            Username: {isEditing ? (
              <TextInput
                value={profile.username}
                onChangeText={(value) => setProfile({ ...profile, username: value })}
                style={styles.input}
              />
            ) : (
              profile.username
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editableField}>
          <Text style={styles.infoText}>
            Age: {isEditing ? (
              <TextInput
                value={profile.age}
                onChangeText={(value) => setProfile({ ...profile, age: value })}
                style={styles.input}
                keyboardType="numeric"
              />
            ) : (
              profile.age
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editableField}>
          <Text style={styles.infoText}>
            Bio: {isEditing ? (
              <TextInput
                value={profile.bio}
                onChangeText={(value) => setProfile({ ...profile, bio: value })}
                style={styles.input}
              />
            ) : (
              profile.bio
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editableField}>
          <Text style={styles.infoText}>
            Interests: {isEditing ? (
              <TextInput
                value={profile.interests}
                onChangeText={(value) => setProfile({ ...profile, interests: value })}
                style={styles.input}
              />
            ) : (
              profile.interests
            )}
          </Text>
        </TouchableOpacity>

        {isEditing && <Button title="Save" onPress={handleSave} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 0,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    paddingTop: 0,
  },
  flatListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    resizeMode: 'cover',
    marginBottom: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    width: '100%',
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
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default ProfileScreen;
 