import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SignUpWelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button
        title="Next"
        onPress={() => navigation.navigate('SignUpEmailScreen')}
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
});

export default SignUpWelcomeScreen;
