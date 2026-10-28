import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppSelector } from "@src/store";
import translate from "@helpers/localization";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@src/hooks";
import { navigationRef } from "../helpers/router";
import Login from "@modules/app/screens/Login";
import ForgetPassword from "@modules/app/screens/forgetPassword";
import OTP from "@modules/app/screens/OTP";
import ChangePassword from "@modules/app/screens/ChangePassword";
import Registration from "@modules/app/screens/Registration";
import Home from "@modules/app/screens/Home";
import MeetAssistService from "@modules/app/screens/MeetAssistService";
import LoungeService from "@modules/app/screens/LoungeService";
import MembershipService from "@modules/app/screens/MembershipService";
import Services from "@modules/app/screens/Services";
import MyBookings from "@modules/app/screens/Mybookings";
import BottomNavigation from "./BottomNavigation";
import { ScreenOptions } from "@utils/ScreenOptions";
import Routes, { RootStackParams } from "@utils/Routes";

enableScreens();

const Stack = createStackNavigator<RootStackParams>();

function RootNavigation() {
  const isSignedIn = useAppSelector((s) => s.AppReducer?.isSignedIn);
  const userColorScheme = useAppSelector((s) => s?.AppReducer?.userColorScheme);
  const theme = useTheme();
  const isDarkTheme = userColorScheme === "dark";

  const navigationTheme = {
    dark: isDarkTheme,
    colors: {
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.notification,
    },
  };

  return (
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <Stack.Navigator
              initialRouteName={isSignedIn ? Routes.Home : Routes.Login}
              screenOptions={{ ...ScreenOptions, headerTintColor: theme.primary }}
          >
            {isSignedIn ? (
                <>
                  {/*<Stack.Screen*/}
                  {/*  name={Routes.Services}*/}
                  {/*  component={BottomNavigation}*/}
                  {/*  options={{*/}
                  {/*    gestureEnabled: false,*/}
                  {/*    headerShown: false,*/}
                  {/*    headerTitle: translate("navigation.home"),*/}
                  {/*  }}*/}
                  {/*/>*/}
                  <Stack.Screen
                      name={Routes.Home}
                      component={BottomNavigation}
                      options={{
                        gestureEnabled: false,
                        headerShown: false,
                        headerTitle: translate("navigation.home"),
                      }}
                  />
                  <Stack.Screen
                      name={Routes.Services}
                      component={Services}
                      options={{
                        gestureEnabled: false,
                        headerShown: false,
                        headerTitle: translate("navigation.service"),
                      }}
                  />
                  {/* Service screens for signed-in users */}
                  <Stack.Screen
                      name={Routes.MeetAssistService}
                      component={MeetAssistService}
                      options={{
                        gestureEnabled: false,
                        headerShown: true,
                        headerTitle: translate("navigation.meetAssist"),
                      }}
                  />
                  <Stack.Screen
                      name={Routes.LoungeService}
                      component={LoungeService}
                      options={{
                        gestureEnabled: false,
                        headerShown: true,
                        headerTitle: translate("navigation.loungeService"),
                      }}
                  />
                  <Stack.Screen
                      name={Routes.MembershipService}
                      component={MembershipService}
                      options={{
                        gestureEnabled: false,
                        headerShown: true,
                        headerTitle: translate("navigation.membershipService"),
                      }}
                  />
                  <Stack.Screen
                      name={Routes.Mybookings}
                      component={MyBookings}
                      options={{
                        gestureEnabled: false,
                        headerShown: true,
                        headerTitle: translate("navigation.myBooking"),
                      }}
                  />


                </>
            ) : (
                <>

                  <Stack.Screen
                      name={Routes.Login}
                      component={Login}
                      options={{ headerShown: false }}
                  />
                  <Stack.Screen
                      name={Routes.ForgetPassword}
                      component={ForgetPassword}
                      options={{
                        headerTitle: "Forget Password",
                        headerTintColor: theme.primary,
                      }}
                  />
                  <Stack.Screen
                      name={Routes.OTP}
                      component={OTP}
                      options={{
                        headerTitle: "OTP",
                        headerTintColor: theme.primary,
                      }}
                  />
                  <Stack.Screen
                      name={Routes.ChangePassword}
                      component={ChangePassword}
                      options={{
                        headerTitle: "Change Password",
                        headerTintColor: theme.primary,
                      }}
                  />
                  <Stack.Screen
                      name={Routes.Registration}
                      component={Registration}
                      options={{
                        headerShown: false,
                        gestureEnabled : false,
                      }}
                      // options={{
                      //   headerTitle: "Registration",
                      //   headerTintColor: theme.primary,
                      // }}
                  />

                  {/* Service screens for non-signed-in users (if needed) */}
                  <Stack.Screen
                      name={Routes.MeetAssistService}
                      component={MeetAssistService}
                      options={{
                        headerTitle: "Meet & Assist Service",
                        headerTintColor: theme.primary,
                      }}
                  />
                  <Stack.Screen
                      name={Routes.LoungeService}
                      component={LoungeService}
                      options={{
                        headerTitle: "Lounge Service",
                        headerTintColor: theme.primary,
                      }}
                  />
                  <Stack.Screen
                      name={Routes.MembershipService}
                      component={MembershipService}
                      options={{
                        headerTitle: "Membership Service",
                        headerTintColor: theme.primary,
                      }}
                  />
                </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}

export default RootNavigation;
