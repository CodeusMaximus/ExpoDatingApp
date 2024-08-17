import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MessagesScreen: React.FC = () => {
  const [conversations, setConversations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch conversations from the backend
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://your-backend-url/conversations');
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { userId: item.userId, otherUserId: item.otherUserId })}
          >
            <View style={styles.conversation}>
              <Text style={styles.conversationText}>{item.otherUserName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  conversation: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  conversationText: {
    fontSize: 18,
  },
});

export default MessagesScreen;
