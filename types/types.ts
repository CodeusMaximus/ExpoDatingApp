export interface UserProfile {
    age: number;
    bio: string;
    interests: string[];
    picture: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    email: string;
    profile: UserProfile;
    profilePicture: string;
    profilePictureUri: { uri: string };
  }
 // src/types.ts

// Define the RootStackParamList with all necessary screen parameters
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  SignUpEmail: undefined;
  SignUpName: undefined;
  SignUpPhoto: undefined;
  SignUpBio: undefined;
  SignUpQuestion: undefined;
  SignUpRelationshipType: undefined;
  SignUpLocationServices: undefined;
  SignUpLocation: undefined;
  SignUpGender: undefined;
  SignUpPassword: undefined;
  Question1: undefined;
  Question2: undefined;
  Question3: undefined;
  Question4: undefined;
  Question5: undefined;
  Question6: undefined;
  Question7: undefined;
  Question8: undefined;
  Question9: undefined;
  Question10: undefined;
  Question11: undefined;
  Question12: undefined;
  Question13: undefined;
  Question14: undefined;
  Question15: undefined;
  SignUpPhoneVerification: undefined;
  Discover: undefined;
  Chat: { userId: string };
  Profile: undefined;
  NearbyUsers: undefined;
  OnlineUsers: undefined;
  Matches: undefined;
  TodaysPicks: undefined;
  UserProfile: { userId: string }; // Ensure userId is correctly typed here
  Messages: undefined; // Add other screens as needed
};

// Make the type globally available for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}


  