import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android';

const SignUpQuestionScreen = ({ navigation, route }) => {
  const { email, firstName, location, country, zipcode, gender, interests,relationshipTypes, bio, images, password, answers = [] } = route.params;
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(answers.length / 15);

  const handleNext = () => {
    const updatedAnswers = [...answers, answer];
    setProgress(updatedAnswers.length / 15);

    if (updatedAnswers.length < 15) {
      navigation.navigate('Question1', { email, firstName, location, country, zipcode, gender, interests,relationshipTypes, bio, images, password, answers: updatedAnswers });
    } else {
      navigation.navigate('ChooseUserName', { email, firstName, location, country, zipcode, gender, interests,relationshipTypes, bio, images, password, answers: updatedAnswers });
    }
  };

  return (
    <View style={styles.container}>
      {answers.length === 0 ? (
        <>
          <Text style={styles.title}>We want to get to know you better!</Text>
          <Text style={styles.subtitle}>Answer 15 questions to help us find your perfect match.</Text>
          <Button title="Let's Get Started" onPress={handleNext} />
        </>
      ) : (
        <>
          <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={progress} />
          <Text style={styles.title}>Question {answers.length + 1} of 15</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your answer here"
            value={answer}
            onChangeText={setAnswer}
          />
          <Button title="Next" onPress={handleNext} />
          <Button title="Skip this question" onPress={handleNext} />
        </>
      )}
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
  subtitle: {
    fontSize: 18,
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

export default SignUpQuestionScreen;