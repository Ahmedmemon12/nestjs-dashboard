export interface CaregiverDetail {
  name: string;
  relation: string;
  phoneNumber: string;
}

export interface UserData {
  id: number;
  parentName: string | null;
  email: string;
  password: string | null;
  isVerified: boolean;
  verificationToken: string | null;
  phoneNumber: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpiry: Date | null;
  refreshToken: string | null;
  watchIds: string[];
  watches?: WatchData[]; // Make it optional and nested
}

export interface WatchData {
  id: number;
  watchId: string;
  name: string;
  brand: string;
  username: string;
  password: string;
  phoneNumber: string | null;
  caregiverDetails: CaregiverDetail[] | null;
  caregiverPhoneNumbers: string | null;
  refreshToken: string | null;
  healthData?: HealthData[]; // Nested health data
  locationData?: LocationData[]; // Nested location data
}

export interface HealthData {
  id: number;
  watchId: string;
  stepCount: number | null;
  heartRate: number | null;
  activeCalories: number | null;
  bloodOxygen: number | null;
  sleepHours: number | null;
  distance: number | null;
  restingHeartRate: number | null;
  floorsClimbed: number | null;
  timestamp: string;
}

export interface LocationData {
  id: number;
  watchId: string;
  latitude: number;
  longitude: number;
  location: string | null;
  timestamp: string;
}
