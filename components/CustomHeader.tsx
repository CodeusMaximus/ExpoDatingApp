// src/components/CustomHeader.tsx
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomHeader = () => {
  const navigation = useNavigation();

  const goToSettings = () => {
    navigation.navigate('Settings'); // Direct navigation to SettingsScreen
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TouchableOpacity onPress={goToSettings} style={styles.iconContainer}>
        <Icon name="cog" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 80,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  iconContainer: {
    padding: 10,
  },
});

export default CustomHeader;
