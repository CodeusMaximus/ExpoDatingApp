import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import CustomHeader from './components/CustomHeader';

// Import screens
import ChooseUsernameScreen from './screens/GiveUserName';
import SignUpEmailScreen from './screens/SignUpEmailScreen';
import SignUpNameScreen from './screens/SignUpNameScreen';
import SignUpLocationServicesScreen from './screens/SignUpLocationServicesScreen';
import SignUpLocationScreen from './screens/SignUpLocationScreen';
import SignUpPasswordScreen from './screens/SignUpPasswordsScreens';
import SignUpGenderScreen from './screens/SignUpGenderScreen';
import SignUpPhoneVerificationScreen from './screens/SignUpPhoneVerificationScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DiscoverScreen from './screens/Discover';
import MessagesScreen from './screens/Messages';
import NearbyUsersScreen from './screens/Nearby';
import OnlineUsersScreen from './screens/Online';
import ChatScreen from './screens/ChatScreen';
import TodaysPicksScreen from './screens/TodaysPickScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SignUpDesiredRelationshipTypeScreen from './screens/SignUpDesiredRelationshipType';
import SignUpPhotosScreen from './screens/SignUpPhotoScreen';
import SignUpBioScreen from './screens/SignUpBioScreen';
import SignUpQuestionScreen from './screens/SignUpMatchQuestionScreen';
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import Question5Screen from './screens/Question5Screen';
import Question6Screen from './screens/Question6Screen';
import Question7Screen from './screens/Question7Screen';
import Question8Screen from './screens/Question7Screen';
import Question9Screen from './screens/Question9Screen';
import Question10Screen from './screens/Question10Screen';
import Question11Screen from './screens/Question11Screen';
import Question12Screen from './screens/Question12Screen';
import Question13Screen from './screens/Question13Screen';
import Question14Screen from './screens/Question14Screen';
import Question15Screen from './screens/Question15Screen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const defaultHeaderOptions = {
  headerTitle: () => <CustomHeader />,
  headerStyle: {
    height: 80, // Adjust the height as needed
  },
};

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="Register" component={RegisterScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpName" component={SignUpNameScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpPhotos" component={SignUpPhotosScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpBio" component={SignUpBioScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpRelationshipType" component={SignUpDesiredRelationshipTypeScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpLocationServices" component={SignUpLocationServicesScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpLocation" component={SignUpLocationScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpGender" component={SignUpGenderScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpPassword" component={SignUpPasswordScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpQuestion" component={SignUpQuestionScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question1" component={Question1Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question2" component={Question2Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question3" component={Question3Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question4" component={Question4Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question5" component={Question5Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question6" component={Question6Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question7" component={Question7Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question8" component={Question9Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question10" component={Question10Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question11" component={Question11Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question12" component={Question12Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question13" component={Question13Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question14" component={Question14Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="Question15" component={Question15Screen} options={defaultHeaderOptions} />
    <Stack.Screen name="UserName" component={ChooseUsernameScreen} options={defaultHeaderOptions} />
    <Stack.Screen name="SignUpPhoneVerification" component={SignUpPhoneVerificationScreen} options={defaultHeaderOptions} />
  </Stack.Navigator>
);

const BottomTabsScreen = ({ userId }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Discover') {
          iconName = 'search';
        } else if (route.name === 'Messages') {
          iconName = 'mail';
        } else if (route.name === 'Chat') {
          iconName = 'chatbubbles';
        } else if (route.name === 'ProfileScreen') {
          iconName = 'person';
        } else if (route.name === 'Settings') {
          iconName = 'settings';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [{ display: 'flex' }, null],
    })}
  >
    <Tab.Screen name="Discover" component={DiscoverScreen} options={defaultHeaderOptions} />
    <Tab.Screen name="Messages" component={MessagesScreen} options={defaultHeaderOptions} />
    <Tab.Screen
      name="Chat"
      component={ChatScreen}
      options={defaultHeaderOptions}
      initialParams={{ userId }} // Pass the userId as an initial parameter
    />
    <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={defaultHeaderOptions} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={defaultHeaderOptions} />
  </Tab.Navigator>
);

const AppNavigator = ({ userId }) => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      <Stack.Screen name="App" options={{ headerShown: false }}>
        {props => <BottomTabsScreen {...props} userId={userId} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);

export default function App() {
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);
  const [userId, setUserId] = useState('someUserId'); // Replace with actual user ID fetching logic

  const handleSplashScreenFinish = () => {
    setIsSplashScreenVisible(false);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !status.isLooping && 'didJustFinish' in status && status.didJustFinish) {
      handleSplashScreenFinish();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSplashScreenFinish();
    }, 3000); // Change the timeout duration as needed

    return () => clearTimeout(timeout);
  }, []);

  if (isSplashScreenVisible) {
    return (
      <View style={styles.splashContainer}>
        <Video
          source={require('./assets/splash.mp4')}
          style={styles.video}
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <AppNavigator userId={userId} />
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
