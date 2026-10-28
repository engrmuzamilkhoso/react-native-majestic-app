import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator
} from "react-native";
import api from "@helpers/api/axios";

const { width } = Dimensions.get('window');

//@ts-ignore
export default function Services({ navigation }) {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get("/lounge_service/list");
                if (response.data.status === "0000") {
                    setServices(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleServicePress = (service: any) => {
        navigation.navigate(service.app_route, { service });
    };

    const ServiceCard = ({ service, index }: { service: any, index: number }) => (
        <TouchableOpacity
            style={[styles.serviceCard, { marginTop: index * 10 }]}
            onPress={() => handleServicePress(service)}
            activeOpacity={0.8}
        >
            <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                    <Text style={styles.serviceIcon}>{service.app_icon}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.serviceTitle}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>{service.app_desc}</Text>
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
                <Text style={styles.welcomeText}>Welcome to Premium Services</Text>
                <Text style={styles.subtitle}>
                    Experience luxury travel with our exclusive services
                </Text>
            </View>

            {/* Services Section */}
            <View style={styles.servicesSection}>
                {loading ? (
                    <ActivityIndicator size="large" color="#90733e" />
                ) : (
                    services.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                        />
                    ))
                )}
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
});
