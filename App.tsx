import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

// Import screens
import SignUpEmailScreen from './screens/SignUpEmailScreen';
import SignUpNameScreen from './screens/SignUpNameScreen';
import SignUpLocationServicesScreen from './screens/SignUpLocationServicesScreen';
import SignUpLocationScreen from './screens/SignUpLocationScreen';
import SignUpPasswordScreen from './screens/SignUpPasswordsScreens';
import SignUpGenderScreen from './screens/SignUpGenderScreen';
import SignUpPhoneVerificationScreen from './screens/SignUpPhoneVerificationScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import SwipeScreen from './components/SwipeScreen';

// Import question screens
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import Question5Screen from './screens/Question5Screen';
import Question6Screen from './screens/Question6Screen';
import Question7Screen from './screens/Question7Screen';
import Question8Screen from './screens/Question8Screen';
import Question9Screen from './screens/Question9Screen';
import Question10Screen from './screens/Question10Screen';
import Question11Screen from './screens/Question11Screen';
import Question12Screen from './screens/Question12Screen';
import Question13Screen from './screens/Question13Screen';
import Question14Screen from './screens/Question14Screen';
import Question15Screen from './screens/Question15Screen';
import SignUpDesiredRelationshipTypeScreen from './screens/SignUpDesiredRelationshipType';
import SignUpPhotosScreen from './screens/SignUpPhotoScreen';
import SignUpBioScreen from './screens/SignUpBioScreen';
import SignUpQuestionScreen from './screens/SignUpMatchQuestionScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen} />
    <Stack.Screen name="SignUpName" component={SignUpNameScreen} />
    <Stack.Screen name="SignUpPhoto" component={SignUpPhotosScreen} />
    <Stack.Screen name="SignUpBio" component={SignUpBioScreen} />
    <Stack.Screen name="SignUpQuestion" component={SignUpQuestionScreen} />
    <Stack.Screen name="SignUpRelationshipType" component={SignUpDesiredRelationshipTypeScreen} />
    <Stack.Screen name="SignUpLocationServices" component={SignUpLocationServicesScreen} />
    <Stack.Screen name="SignUpLocation" component={SignUpLocationScreen} />
    <Stack.Screen name="SignUpGender" component={SignUpGenderScreen} />
    <Stack.Screen name="SignUpPassword" component={SignUpPasswordScreen} />
    <Stack.Screen name="Question1" component={Question1Screen} />
    <Stack.Screen name="Question2" component={Question2Screen} />
    <Stack.Screen name="Question3" component={Question3Screen} />
    <Stack.Screen name="Question4" component={Question4Screen} />
    <Stack.Screen name="Question5" component={Question5Screen} />
    <Stack.Screen name="Question6" component={Question6Screen} />
    <Stack.Screen name="Question7" component={Question7Screen} />
    <Stack.Screen name="Question8" component={Question8Screen} />
    <Stack.Screen name="Question9" component={Question9Screen} />
    <Stack.Screen name="Question10" component={Question10Screen} />
    <Stack.Screen name="Question11" component={Question11Screen} />
    <Stack.Screen name="Question12" component={Question12Screen} />
    <Stack.Screen name="Question13" component={Question13Screen} />
    <Stack.Screen name="Question14" component={Question14Screen} />
    <Stack.Screen name="Question15" component={Question15Screen} />
    <Stack.Screen name="SignUpPhoneVerification" component={SignUpPhoneVerificationScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const SwipeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Swipe" component={SwipeScreen} />
  </Stack.Navigator>
);

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Profile') {
          iconName = 'person';
        } else if (route.name === 'Swipe') {
          iconName = 'swap-horizontal';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [{ display: 'flex' }, null],
    })}
  >
    <Tab.Screen name="Profile" component={ProfileStack} />
    <Tab.Screen name="Swipe" component={SwipeStack} />
  </Tab.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={BottomTabs} />
  </Drawer.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      <Stack.Screen name="App" component={DrawerNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <AppNavigator />
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
});
