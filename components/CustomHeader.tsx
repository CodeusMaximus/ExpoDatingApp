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
      <TouchableOpacity onPress={goToSettings}  style={styles.cog}  >
        <Icon name="cog" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
     height: 80,
     justifyContent: 'center' 
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  cog: {  
    


  }
  
});

export default CustomHeader;
