import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions
} from "react-native";

const { width } = Dimensions.get('window');
import { useSelector } from "react-redux";
import { RootState } from "@store/index"; // adjust path to your store

//@ts-ignore
export default function HomePage({ navigation }) {
  //const user = useSelector((state: RootState) => state.AppReducer.user);
  const services = [
    {
      id: 1,
      title: "Book a lounge",
      description: "Reserve airport lounges worldwide for a premium travel experience",
      icon: "🛋️",
      gradient: ["#90733e", "#90733e"],
      route: "Services"
    },
    {
      id: 2,
      title: "Membership Card",
      description: "Enjoy priority services and exclusive benefits with your membership",
      icon: "💳",
      gradient: ["#90733e", "#7A5F35"],
      route: "MembershipService"
    }


  ];

  const handleServicePress = (service: any) => {

    // Navigate to specific service route based on service type
    switch(service.id) {
      case 1:
        navigation.navigate('Services', { service });
        break;
      case 2:
        navigation.navigate('MembershipService', { service });
        break;
      default:
        // Fallback to generic service details
        navigation.navigate('Home', { service });
    }
  };

  // Alternative implementation using the route property
  const handleServicePressAlternative = (service: any) => {
    navigation.navigate(service.route, { service });
  };

  const ServiceCard = ({ service, index }: { service: any, index: number }) => (
      <TouchableOpacity
          style={[styles.serviceCard, { marginTop: index * 10 }]}
          onPress={() => handleServicePress(service)}
          activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.serviceIcon}>{service.icon}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
  );

  return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
              source={require("@src/assets/images/logo.png")}
              style={styles.logo}
          />
          <Text style={styles.welcomeText}>Welcome to Majestic Lounge</Text>
          <Text style={styles.subtitle}>
            Experience luxury travel with our exclusive services
          </Text>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          {services.map((service, index) => (
              <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
              />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Premium Services • Your Comfort, Our Priority
          </Text>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
  servicesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    lineHeight: 22,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    overflow: "hidden",
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
  serviceIcon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#90733e",
    fontWeight: "bold",
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
