import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Text, Image, KeyboardAvoidingView } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface User {
  username: string;
  profilePictureUri: any;
}

interface Message {
  id: string;
  type: 'text' | 'image' | 'audio' | 'document';
  content: string;
}

const ChatScreen = ({ route }: { route: ChatScreenRouteProp }) => {
  const { userId } = route.params;
  console.log('Received userId:', userId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [user, setUser] = useState<User>({
    username: 'Default Username', // Default username
    profilePictureUri: require('../assets/default-profile.png'), // Local default image
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://192.168.1.248:3000/api/chats/${userId}`);
        console.log('User data fetched successfully:', response.data); // Log fetched data

        const { profilePicture, username } = response.data.user;
        let profilePictureUri = require('../assets/default-profile.png'); // Default fallback

        if (profilePicture && profilePicture.startsWith('https://')) {
          profilePictureUri = { uri: profilePicture }; // Use the URL directly
          console.log('Using provided profile picture URL:', profilePicture);
        } else if (profilePicture) {
          try {
            const storage = getStorage();
            const storageRef = ref(storage, `profile_pictures/${profilePicture}`);
            const url = await getDownloadURL(storageRef);
            profilePictureUri = { uri: url };
            console.log('Profile picture URL fetched from Firebase:', url);
          } catch (error) {
            console.error('Error fetching profile picture from Firebase:', error.message);
          }
        }

        setUser({
          username: username || 'Default Username',
          profilePictureUri,
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch user and messages:', error);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      console.error('User ID is undefined');
    }
  }, [userId]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access audio is required!');
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        console.log('Recording saved:', sound);
        setRecording(null);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const sendMessage = async () => {
    if (text.trim() === '') return; // Prevent sending empty messages

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: text,
    };

    // Add message to the state
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // Implement your message sending logic here (e.g., send to backend server)
      console.log('Message sent:', text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }

    setText(''); // Clear the input field
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        console.log('Image selected:', result.uri);
        // Handle image upload or message sending
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        console.log('Document selected:', result.uri);
        // Handle document upload or message sending
      }
    } catch (error) {
      console.error('Failed to pick document:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <Image source={user.profilePictureUri} style={styles.profilePicture} />
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            {item.type === 'text' ? (
              <Text>{item.content}</Text>
            ) : item.type === 'image' ? (
              <Image source={{ uri: item.content }} style={styles.messageImage} />
            ) : item.type === 'audio' ? (
              <Text>Audio Message</Text>
            ) : (
              <Text>Document</Text>
            )}
          </View>
        )}
        style={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={startRecording}>
          <Ionicons name="mic" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopRecording}>
          <Ionicons name="stop" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickDocument}>
          <Ionicons name="document-text" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  message: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: 10,
    borderRadius: 4,
  },
});

export default ChatScreen;
