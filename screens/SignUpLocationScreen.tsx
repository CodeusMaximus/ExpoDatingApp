import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUpLocationScreen = ({ navigation, route }) => {
  const { email, firstName, location, age } = route.params;
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where do you live?</Text>
      <TextInput
        style={styles.input}
        placeholder="State"
        value={state}
        onChangeText={setState}
      />
      <TextInput
        style={styles.input}
        placeholder="City/Town"
        value={city}
        onChangeText={setCity}
      />
      <Button
        title="Next"
        onPress={() => navigation.navigate('SignUpGender', { email, firstName, location, city, state, age })}
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

export default SignUpLocationScreen;