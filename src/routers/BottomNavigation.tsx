/**
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@modules/app/screens/Home";
import Services from "@modules/app/screens/Services";
import MeetAssistService from "@modules/app/screens/MeetAssistService";
import LoungeService from "@modules/app/screens/LoungeService";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@src/hooks";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarStyle: { backgroundColor: "#FFF" },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
        <Tab.Screen
            name="Services"
            component={Services}
            options={{
                tabBarButton: () => null,   // Hides the button
                headerShown: false,
            }}
        />

        <Tab.Screen
        name="Menu"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
              <Ionicons name="menu-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
