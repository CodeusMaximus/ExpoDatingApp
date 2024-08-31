import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const SignUpGenderScreen = ({ navigation, route }) => {
  const { email, firstName, location, city, state, age } = route.params;
  const [gender, setGender] = useState('');
  const [interests, setInterests] = useState([]);

  const handleNext = () => {
    if (!gender) {
      Alert.alert('Please select a gender');
      return;
    }

    navigation.navigate('SignUpPassword', { email, firstName, location, city, state,   age,   gender, interests });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us a little about yourself</Text>
      <Button
        title="Man"
        onPress={() => setGender('Man')}
        color={gender === 'Man' ? 'blue' : 'gray'}
      />
      <Button
        title="Woman"
        onPress={() => setGender('Woman')}
        color={gender === 'Woman' ? 'blue' : 'gray'}
      />
      <Button
        title="I want to date Men"
        onPress={() => setInterests((prev) => prev.includes('Men') ? prev.filter(i => i !== 'Men') : [...prev, 'Men'])}
        color={interests.includes('Men') ? 'blue' : 'gray'}
      />
      <Button
        title="I want to date Women"
        onPress={() => setInterests((prev) => prev.includes('Women') ? prev.filter(i => i !== 'Women') : [...prev, 'Women'])}
        color={interests.includes('Women') ? 'blue' : 'gray'}
      />
      <Button title="Next" onPress={handleNext} />
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
});

export default SignUpGenderScreen;