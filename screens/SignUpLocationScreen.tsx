import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUpLocationScreen = ({ navigation, route }) => {
  const { email, firstName, location } = route.params;
  const [country, setCountry] = useState('');
  const [zipcode, setZipcode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where do you live?</Text>
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        style={styles.input}
        placeholder="Zipcode"
        value={zipcode}
        onChangeText={setZipcode}
      />
      <Button
        title="Next"
        onPress={() => navigation.navigate('SignUpGender', { email, firstName, location, country, zipcode })}
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