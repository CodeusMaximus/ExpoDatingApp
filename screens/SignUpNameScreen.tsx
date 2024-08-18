import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUpNameScreen = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const { email } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your first name?</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Button
        title="Next"
        onPress={() => navigation.navigate('SignUpLocationServices', { email, firstName })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    width: '80%',
  },
});

export default SignUpNameScreen;