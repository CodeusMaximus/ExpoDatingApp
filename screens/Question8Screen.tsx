import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const Question8Screen = ({ navigation, route }) => {
    const { email, firstName, location, country, zipcode, gender, interests, bio, images, password, answers } = route.params;
    const [answer, setAnswer] = useState('');
    const [progress, setProgress] = useState(answers.length / 15);
  
    const handleNext = () => {
      const updatedAnswers = [...answers, answer];
      setProgress(updatedAnswers.length / 15);
  
      if (updatedAnswers.length < 15) {
        navigation.navigate('Question9', { email, firstName, location, country, zipcode, gender, interests, bio, images, password, answers: updatedAnswers });
      } else {
        navigation.navigate('UserName', { email, firstName, location, country, zipcode, gender, interests, bio, images, password, answers: updatedAnswers });
      }
    };
  
   
  
    return (
      <View style={styles.container}>
           <ProgressBar progress={progress} />
      <Text style={styles.title}>Is an astrological sign important to you in a relationship?</Text>
      <TextInput
        style={styles.input}
        placeholder="Your answer"
        value={answer}
        onChangeText={setAnswer}
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  },
});

export default Question8Screen;