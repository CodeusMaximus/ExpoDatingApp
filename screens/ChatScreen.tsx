import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Example to fetch messages (to be replaced with your fetch logic)
    setMessages([{ id: 1, type: 'text', content: 'Hello!' }]);
  }, []);

  const sendMessage = (content, type = 'text') => {
    const newMessage = { id: Date.now(), type, content };
    setMessages([...messages, newMessage]);
    setText('');
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        sendMessage(uri, 'audio');
        setRecording(null);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        sendMessage(result.uri, 'image');
      }
    } catch (err) {
      console.error('Error picking image', err);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.assets && result.assets.length > 0) {
        sendMessage(result.assets[0].uri, 'file');
      }
    } catch (err) {
      console.error('Error picking document', err);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={item.type === 'text' ? styles.textMessage : styles.mediaMessage}>
            <Text>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickDocument}>
          <Ionicons name="document" size={24} color="black" />
        </TouchableOpacity>
        {recording ? (
          <TouchableOpacity onPress={stopRecording}>
            <Ionicons name="stop-circle" size={24} color="red" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            <Ionicons name="mic" size={24} color="black" />
          </TouchableOpacity>
        )}
        <Button title="Send" onPress={() => sendMessage(text)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  textMessage: {
    padding: 10,
    backgroundColor: '#DCF8C6',
    borderRadius: 5,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  mediaMessage: {
    padding: 10,
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ChatScreen;
