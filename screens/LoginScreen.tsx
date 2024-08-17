import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,ImageBackground, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.248:3000/login', {
        email,
        password
      });

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert('Login Successful');
        navigation.navigate('App'); // Navigate to the Main tabs
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error logging in', error.message);
    }
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin}  />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUpEmail')}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
    },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 2,
    margin: 10,
  },
  button: {
   
    
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width:30,
    height:30

  }
});

export default LoginScreen;
