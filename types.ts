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
  }
  