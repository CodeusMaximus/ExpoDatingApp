import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const Question13Screen = ({ navigation, route }) => {
    const { email, firstName, location, city, state,  gender, interests, bio, images, password, answers, age,  } = route.params;
    const [answer, setAnswer] = useState('');
    const [progress, setProgress] = useState(answers.length / 15);
  
    const handleNext = () => {
      const updatedAnswers = [...answers, answer];
      setProgress(updatedAnswers.length / 15);
  
      if (updatedAnswers.length < 15) {
        navigation.navigate('Question14', {age,  email, firstName, location, city, state,  gender, interests, bio, images, password, answers: updatedAnswers });
      } else {
        navigation.navigate('UserName', {age,  email, firstName, location, city, state,  gender, interests, bio, images, password, answers: updatedAnswers });
      }
    };
  
   
  
    return (
      <View style={styles.container}>
           <ProgressBar progress={progress} />
      <Text style={styles.title}>What are your favorite hobbies?</Text>
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

export default Question13Screen;