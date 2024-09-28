import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { MaterialIcons } from '@expo/vector-icons'; // Importing Expo icons

interface Profile {
  username: string;
  age: string;
  bio: string;
  interests: string;
  aboutMe?: string;
  whatMatters?: string;
  hobbiesTalents?: string;
  favoriteMoviesMusicFood?: string;
  sevenThings?: string;
  whatLookingFor?: string;
  pictures: string[];
}

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [profile, setProfile] = useState<Profile>({
    username: '',
    age: '',
    bio: '',
    interests: '',
    aboutMe: '',
    whatMatters: '',
    hobbiesTalents: '',
    favoriteMoviesMusicFood: '',
    sevenThings: '',
    whatLookingFor: '',
    pictures: [],
  });

  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingSection, setEditingSection] = useState<string | null>(null); // Track which section is being edited

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await axios.get('http://192.168.1.248:3000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { username, age, bio, interests, images } = response.data;
        setProfile({
          ...profile,
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

  useEffect(() => {
    fetchProfile();
  }, []);

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

        fetchProfile();
      } catch (error) {
        console.error('Failed to upload image to Firebase', error);
        Alert.alert('Failed to upload image');
      }
    }
  };

  const renderDots = () => {
    return profile.pictures.map((_, index) => (
      <View
        key={index}
        style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]}
      />
    ));
  };

  const handleTextChange = (label: string, text: string) => {
    setProfile({ ...profile, [label]: text });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        {profile.pictures.length > 0 ? (
          <>
            <FlatList
              data={profile.pictures}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={[styles.profilePic, { width, height: width }]} />
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

        {/* Add Photo Button Overlay */}
        <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
          <MaterialIcons name="add-a-photo" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Username: {profile.username}</Text>
        <Text style={styles.infoText}>Age: {profile.age}</Text>
        <Text style={styles.infoText}>Bio: {profile.bio}</Text>
        <Text style={styles.infoText}>Interests: {profile.interests}</Text>

        {/* Editable Sections with Pencil Icon */}
        <TextInputSection
          label="aboutMe"
          value={profile.aboutMe}
          isEditing={editingSection === 'aboutMe'}
          setProfile={handleTextChange}
          onEdit={() => setEditingSection('aboutMe')}
        />
        <TextInputSection
          label="whatMatters"
          value={profile.whatMatters}
          isEditing={editingSection === 'whatMatters'}
          setProfile={handleTextChange}
          onEdit={() => setEditingSection('whatMatters')}
        />
        <TextInputSection
          label="hobbiesTalents"
          value={profile.hobbiesTalents}
          isEditing={editingSection === 'hobbiesTalents'}
          setProfile={handleTextChange}
          onEdit={() => setEditingSection('hobbiesTalents')}
        />
        <TextInputSection
          label="favoriteMoviesMusicFood"
          value={profile.favoriteMoviesMusicFood}
          isEditing={editingSection === 'favoriteMoviesMusicFood'}
          setProfile={handleTextChange}
          onEdit={() => setEditingSection('favoriteMoviesMusicFood')}
        />
        <TextInputSection
          label="sevenThings"
          value={profile.sevenThings}
          isEditing={editingSection === 'sevenThings'}
          setProfile={handleTextChange}
          onEdit={() => setEditingSection('sevenThings')}
        />
        <TextInputSection
          label="whatLookingFor"
          value={profile.whatLookingFor}
          isEditing={editingSection === 'whatLookingFor'}
          setProfile={handleTextChange}
          onEdit={() => setEditingSection('whatLookingFor')}
        />

        {editingSection && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setEditingSection(null)}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

// TextInputSection Component with Pencil Icon
const TextInputSection = ({ label, value, isEditing, setProfile, onEdit }) => (
  <View style={styles.editableSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <TouchableOpacity onPress={onEdit}>
        <MaterialIcons name="edit" size={24} color="white" />
      </TouchableOpacity>
    </View>
    {isEditing ? (
      <TextInput
        value={value}
        onChangeText={(text) => setProfile(label, text)}
        style={styles.sectionInput}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top" // Ensures text stays at the top
      />
    ) : (
      <Text style={styles.sectionText}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  flatListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
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
  addPhotoButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    padding: 10,
    zIndex: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editableSection: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#000',
    padding: 10,
  },
  sectionLabel: {
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    width: '100%',
    height: 120,
  },
  sectionText: {
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
