import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Activity: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  ProfilePhoto: undefined;
  EmailVerification: undefined;
  Recovery: undefined;
  ResetPassword: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  PublicProfile: { profileId?: string } | undefined;
  ReportProfile: { profileId: string };
  EditProfile: undefined;
  ServicePreview: { kind: 'meeting' | 'job' };
  MeetingCreate: undefined;
  MeetingJoin: undefined;
  MeetingDetail: { meetingId: string };
  JobCreate: undefined;
  JobMarket: undefined;
  JobDetail: { jobId: string };
  Notifications: undefined;
};
