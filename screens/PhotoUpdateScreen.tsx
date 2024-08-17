import React, { useState } from 'react';
import { View, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ProfileScreen: { updatedPhotos: string[] };
  PhotoUpdateScreen: undefined;
};

type PhotoUpdateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PhotoUpdateScreen'
>;

type Props = {
  navigation: PhotoUpdateScreenNavigationProp;
};

const PhotoUpdateScreen: React.FC<Props> = ({ navigation }) => {
  const [photos, setPhotos] = useState<(string | null)[]>(Array(8).fill(null));

  const pickImage = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const updatedPhotos = [...photos];
      updatedPhotos[index] = result.assets[0].uri;
      setPhotos(updatedPhotos);
    } else {
      Alert.alert('Error', 'No image selected or an error occurred');
    }
  };

  const saveAndReturn = () => {
    const nonNullPhotos = photos.filter((photo) => photo !== null) as string[];
    navigation.navigate('ProfileScreen', { updatedPhotos: nonNullPhotos });
  };

  return (
    <View style={styles.container}>
      <View style={styles.photosContainer}>
        {photos.map((photo, index) => (
          <TouchableOpacity key={index} onPress={() => pickImage(index)}>
            <View style={styles.photoBox}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <Ionicons name="add-circle" size={50} color="gray" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Save and Return" onPress={saveAndReturn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoBox: {
    width: '48%',
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default PhotoUpdateScreen;
