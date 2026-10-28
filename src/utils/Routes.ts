/**
 * Enum representing the available routes in the application.
 */
export enum Routes {
  Home = 'Home',
  Services = 'Services',
  Login = 'Login',
  Profile = 'Profile',
  Settings = 'Settings',
  Post = 'Post',
  ForgetPassword = 'ForgetPassword',
  OTP = 'OTP',
  ChangePassword = 'ChangePassword',
  Registration = 'Registration',
  MeetAssistService = 'MeetAssistService',
  LoungeService = 'LoungeService',
  MembershipService = 'MembershipService',
  Mybookings = 'Mybookings',
}

/**
 * Represents the parameter types for the root stack navigation.
 */
export type RootStackParams = {
  [Routes.Home]: undefined;
  [Routes.Login]: undefined;
  [Routes.ForgetPassword]: undefined;
  [Routes.OTP]: undefined;
  [Routes.ChangePassword]: undefined;
  [Routes.Registration]: undefined;
  [Routes.Services]: undefined;
  [Routes.MeetAssistService]: undefined;
  [Routes.LoungeService]: undefined;
  [Routes.MembershipService]: undefined;
  [Routes.Mybookings]: undefined;
};

/**
 * Represents the parameter types for the profile stack routes.
 */
export type ProfileStackParams = {
  [Routes.Profile]: undefined;
  [Routes.Settings]: undefined;
  [Routes.Post]: { id: string, username: string };
};

/**
 * Represents the navigation parameters for the root stack.
 */
export type NavigationParams = RootStackParams;

export default Routes
