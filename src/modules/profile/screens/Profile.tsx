import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  Animated
} from "react-native";
import { useDispatch } from 'react-redux';
import { LoggedOut } from "@modules/app/redux/appSlice";

const { width } = Dimensions.get('window');

//@ts-ignore
export default function ProfilePage({ navigation }) {
  const dispatch = useDispatch();
  const [scrollY] = useState(new Animated.Value(0));

  const profileOptions = [
    {
      id: 1,
      title: "My Bookings",
      description: "View and manage your lounge reservations",
      icon: "📋",
      route: "Mybookings",
      type: "navigation"
    },
    {
      id: 2,
      title: "Change Password",
      description: "Update your account security settings",
      icon: "🔒",
      route: "ChangePassword",
      type: "navigation"
    },
    {
      id: 3,
      title: "Logout",
      description: "Sign out of your account",
      icon: "🚪",
      route: "Logout",
      type: "action"
    }
  ];

  const handleOptionPress = (option: any) => {
    switch(option.type) {
      case 'navigation':
        navigation.navigate(option.route, { option });
        break;
      case 'action':
        if (option.route === 'Logout') {
          handleLogout();
        }
        break;
      default:
        navigation.navigate(option.route, { option });
    }
  };

  const handleLogout = () => {
    Alert.alert(
        "Confirm Logout",
        "Are you sure you want to sign out of your account?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
              dispatch(LoggedOut());
            }
          }
        ]
    );
  };

  const OptionCard = ({ option, index }: { option: any, index: number }) => {
    const [scaleAnim] = useState(new Animated.Value(1));

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
        <Animated.View
            style={[
              styles.optionCardWrapper,
              { marginTop: index * 10 },
              {
                transform: [{ scale: scaleAnim }],
                opacity: scrollY.interpolate({
                  inputRange: [0, 50 * index, 50 * (index + 1)],
                  outputRange: [0, 1, 1],
                  extrapolate: 'clamp',
                }),
              }
            ]}
        >
          <TouchableOpacity
              style={[
                styles.optionCard,
                option.route === 'Logout' && styles.logoutCard
              ]}
              onPress={() => handleOptionPress(option)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[
                styles.iconContainer,
                option.route === 'Logout' && styles.logoutIconContainer
              ]}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[
                  styles.optionTitle,
                  option.route === 'Logout' && styles.logoutTitle
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  option.route === 'Logout' && styles.logoutDescription
                ]}>
                  {option.description}
                </Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={[
                  styles.arrow,
                  option.route === 'Logout' && styles.logoutArrow
                ]}>›</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
    );
  };

  return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <Animated.ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
        >
          {/* Header Section - Same as HomePage */}
          <View style={styles.header}>
            <Image
                source={require("@src/assets/images/logo.png")}
                style={styles.logo}
            />
            <Text style={styles.welcomeText}>My Account</Text>
            <Text style={styles.subtitle}>
              Manage your profile and preferences
            </Text>
          </View>

          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>John Doe</Text>
                <Text style={styles.userEmail}>john.doe@example.com</Text>
                <View style={styles.membershipBadge}>
                  <Text style={styles.membershipStatus}>Premium Member</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Profile Options Section */}
          <View style={styles.optionsSection}>
            {profileOptions.map((option, index) => (
                <OptionCard
                    key={option.id}
                    option={option}
                    index={index}
                />
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Majestic Lounge • Version 1.0.0
            </Text>
          </View>
        </Animated.ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 110,
    height: 108,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  userInfoSection: {
    padding: 20,
    paddingBottom: 10,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#90733e20",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#90733e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  membershipBadge: {
    backgroundColor: "#90733e20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  membershipStatus: {
    fontSize: 12,
    color: "#90733e",
    fontWeight: "600",
  },
  optionsSection: {
    padding: 20,
    paddingTop: 10,
  },
  optionCardWrapper: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    overflow: "hidden",
  },
  logoutCard: {
    borderWidth: 1,
    borderColor: "#FF636320",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#90733e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoutIconContainer: {
    borderColor: "#FF6363",
  },
  optionIcon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  logoutTitle: {
    color: "#FF6363",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  logoutDescription: {
    color: "#FF636380",
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#90733e",
    fontWeight: "bold",
  },
  logoutArrow: {
    color: "#FF6363",
  },
  footer: {
    alignItems: "center",
    padding: 30,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
