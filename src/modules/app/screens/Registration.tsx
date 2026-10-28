import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar,
    Modal,
    ScrollView,
    Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { SetUser } from "@modules/app/redux/appSlice";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import api from "@helpers/api/axios";

// @ts-ignore
export default function Registration({ navigation }) {
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cnic, setCnic] = useState("");
    const [contact, setContact] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessages, setModalMessages] = useState<string[]>([]);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !cnic || !contact) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "All fields are required",
                position: "bottom"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/register", {
                name: firstName,
                lname: lastName,
                email,
                password,
                cnic,
                contact,
            });

            if (response.data.status === "0000") {
                const { user, token } = response.data.data;
                dispatch(SetUser({ ...user, token }));
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Registration successful!",
                    position: "bottom"
                });
                navigation.navigate("Home");
            } else if (response.data.status === "0004") {
                const errors = response.data.data[0];
                const messages: string[] = [];
                Object.keys(errors).forEach((field) => messages.push(...errors[field]));
                setModalMessages(messages);
                setModalVisible(true);
            } else {
                Toast.show({
                    type: "error",
                    text1: "Registration Failed",
                    text2: response.data.message || "Please try again",
                    position: "bottom",
                });
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data?.message || "Something went wrong",
                position: "bottom"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f6f3" />

            {/* Scrollable Form */}
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.scrollContent}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoGlow} />
                        <View style={styles.logoOuter}>
                            <View style={styles.logoMiddle}>
                                <View style={styles.logoInner}>
                                    <Image
                                        source={require("@src/assets/images/logo.png")}
                                        style={styles.logo}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        <Text style={styles.subtitleText}>Create your account to get started</Text>

                        {/* First Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FIRST NAME</Text>
                            <TextInput
                                placeholder="First Name"
                                style={styles.input}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        {/* Last Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>LAST NAME</Text>
                            <TextInput
                                placeholder="Last Name"
                                style={styles.input}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <TextInput
                                placeholder="Email"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                <TextInput
                                    secureTextEntry
                                    placeholder="Enter your password"
                                    placeholderTextColor="#c4b9a8"
                                    style={[styles.input, { flex: 1 }]}
                                    value={password}
                                    onChangeText={setPassword}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* CNIC */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CNIC</Text>
                            <TextInput
                                placeholder="CNIC"
                                style={styles.input}
                                value={cnic}
                                onChangeText={setCnic}
                            />
                        </View>

                        {/* Contact */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CONTACT</Text>
                            <TextInput
                                placeholder="Contact Number"
                                style={styles.input}
                                value={contact}
                                onChangeText={setContact}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>Sign up</Text>
                                    <View style={styles.arrowCircle}>
                                        <FontAwesome name="arrow-right" size={14} color="#fff" />
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                            style={styles.signupButton}
                        >
                            <Text style={styles.signupText}>
                                Already have an account?{" "}
                                <Text style={styles.signupLink}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <Text style={modalStyles.title}>Validation Error</Text>
                        {modalMessages.map((msg, idx) => (
                            <Text key={idx} style={modalStyles.message}>• {msg}</Text>
                        ))}
                        <TouchableOpacity
                            style={modalStyles.button}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={modalStyles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Modal Styles
const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    container: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        elevation: 5
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#90733e"
    },
    message: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5
    },
    button: {
        marginTop: 15,
        alignSelf: "flex-end",
        backgroundColor: "#90733e",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold"
    },
});

// Registration Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f6f3"
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    // Logo
    logoSection: {
        alignItems: "center",
        marginBottom: 36,
        position: "relative"
    },
    logoGlow: {
        position: "absolute",
        width: 170,
        height: 170,
        borderRadius: 90,
        backgroundColor: "#90733e",
        opacity: 0.08,
        top: -5
    },
    logoOuter: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "rgba(144,115,62,0.06)",
        justifyContent: "center",
        alignItems: "center"
    },
    logoMiddle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "rgba(144,115,62,0.1)",
        justifyContent: "center",
        alignItems: "center"
    },
    logoInner: {
        width: 120,
        height: 120,
        borderRadius: 70,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#90733e",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: "contain"
    },
    // Form Card
    formCard: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 32,
        padding: 24,
        elevation: 6,
        marginBottom: 20,
    },
    subtitleText: {
        fontSize: 14,
        color: "#6a6a6a",
        marginBottom: 24
    },
    inputGroup: {
        marginBottom: 16
    },
    label: {
        fontSize: 11,
        fontWeight: "700",
        color: "#4a4a4a",
        marginBottom: 8
    },
    input: {
        backgroundColor: "#faf9f7",
        borderRadius: 18,
        paddingHorizontal: 16,
        height: 52,
        fontSize: 14,
        color: "#1a1a1a"
    },
    // Button
    loginButton: {
        backgroundColor: "#90733e",
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        overflow: "hidden"
    },
    buttonContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 24
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },
    arrowCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.3)",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonDisabled: {
        opacity: 0.6
    },
    signupButton: {
        alignItems: "center",
        marginTop: 16
    },
    signupText: {
        fontSize: 14,
        color: "#6a6a6a"
    },
    signupLink: {
        fontWeight: "700",
        color: "#90733e"
    },
});
