import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const SignUpDesiredRelationshipTypeScreen = ({ navigation, route }) => {
  const { email, firstName, location, country, zipcode, gender, interests, password } = route.params;
  const [relationshipTypes, setRelationshipTypes] = useState({
    longTerm: false,
    shortTerm: false,
    hookups: false,
    newFriends: false,
  });

  const handleNext = () => {
    navigation.navigate('SignUpPhotos', { 
      email, 
      firstName, 
      location, 
      country, 
      zipcode, 
      gender, 
      interests, 
      password, 
      relationshipTypes 
    });
  };

  const toggleRadioButton = (type) => {
    setRelationshipTypes((prev) => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desired Relationship Type</Text>
      <View style={styles.radioButtonContainer}>
        <RadioButton
          value="longTerm"
          status={relationshipTypes.longTerm ? 'checked' : 'unchecked'}
          onPress={() => toggleRadioButton('longTerm')}
        />
        <Text>Long Term</Text>
      </View>
      <View style={styles.radioButtonContainer}>
        <RadioButton
          value="shortTerm"
          status={relationshipTypes.shortTerm ? 'checked' : 'unchecked'}
          onPress={() => toggleRadioButton('shortTerm')}
        />
        <Text>Short Term</Text>
      </View>
      <View style={styles.radioButtonContainer}>
        <RadioButton
          value="hookups"
          status={relationshipTypes.hookups ? 'checked' : 'unchecked'}
          onPress={() => toggleRadioButton('hookups')}
        />
        <Text>Hookups</Text>
      </View>
      <View style={styles.radioButtonContainer}>
        <RadioButton
          value="newFriends"
          status={relationshipTypes.newFriends ? 'checked' : 'unchecked'}
          onPress={() => toggleRadioButton('newFriends')}
        />
        <Text>New Friends</Text>
      </View>
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
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default SignUpDesiredRelationshipTypeScreen;
