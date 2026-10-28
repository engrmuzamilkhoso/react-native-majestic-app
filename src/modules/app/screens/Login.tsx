import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar,
} from "react-native";
import { useDispatch } from "react-redux";
import { SetUser } from "@modules/app/redux/appSlice";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import api from "@helpers/api/axios";

// @ts-ignore
export default function Login({ navigation }) {
    const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("admin@admin.com");
    const [password, setPassword] = useState("admin123@");
    const [loading, setLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // 👇 Refs for focusing TextInputs
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please type email & password",
                position: "bottom",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });

            if (response.data.status === "0000") {
                const { user, token } = response.data.data;
                dispatch(SetUser({ ...user, token }));
                setTimeout(() => {
                    navigation.navigate("Home");
                }, 100);

            } else {
                Toast.show({
                    type: "error",
                    text1: "Login Failed",
                    text2: response.data.message || "Invalid credentials",
                    position: "bottom",
                });
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data?.message || "Something went wrong",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f6f3" />

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
                <Text style={styles.subtitleText}>
                    Sign in to your account and continue your journey
                </Text>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        EMAIL ADDRESS
                        {emailFocused && <Text style={styles.activeDot}> •</Text>}
                    </Text>
                    <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
                        <TouchableOpacity
                            onPress={() => emailInputRef.current && emailInputRef.current.focus()}
                            activeOpacity={0.7}
                            style={[styles.iconContainer, emailFocused && styles.iconActive]}
                        >
                            <FontAwesome
                                name="envelope-o"
                                size={16}
                                color={emailFocused ? "#90733e" : "#a89780"}
                            />
                        </TouchableOpacity>
                        <TextInput
                            ref={emailInputRef}
                            placeholder="you@example.com"
                            placeholderTextColor="#c4b9a8"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>
                            PASSWORD
                            {passwordFocused && <Text style={styles.activeDot}> •</Text>}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ForgetPassword")}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.forgotLink}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
                        <TouchableOpacity
                            onPress={() => passwordInputRef.current && passwordInputRef.current.focus()}
                            activeOpacity={0.7}
                            style={[styles.iconContainer, passwordFocused && styles.iconActive]}
                        >
                            <FontAwesome
                                name="lock"
                                size={18}
                                color={passwordFocused ? "#90733e" : "#a89780"}
                            />
                        </TouchableOpacity>
                        <TextInput
                            ref={passwordInputRef}
                            placeholder="Enter your password"
                            placeholderTextColor="#c4b9a8"
                            style={styles.input}
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            style={styles.eyeButton}
                            activeOpacity={0.7}
                        >
                            <FontAwesome
                                name={passwordVisible ? "eye" : "eye-slash"}
                                size={16}
                                color="#a89780"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginButton, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.9}
                >
                    <View style={styles.buttonGlow} />
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>Sign In</Text>
                            <View style={styles.arrowCircle}>
                                <FontAwesome name="arrow-right" size={14} color="#fff" />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Sign Up Link */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("Registration")}
                    style={styles.signupButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupLink}>Create Account</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f6f3", justifyContent: "center", alignItems: "center", padding: 24 },
    logoSection: { alignItems: "center", marginBottom: 36, position: "relative" },
    logoGlow: { position: "absolute", width: 170, height: 170, borderRadius: 90, backgroundColor: "#90733e", opacity: 0.08, top: -5 },
    logoOuter: { width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(144,115,62,0.06)", justifyContent: "center", alignItems: "center" },
    logoMiddle: { width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(144,115,62,0.1)", justifyContent: "center", alignItems: "center" },
    logoInner: { width: 120, height: 120, borderRadius: 70, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", shadowColor: "#90733e", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 },
    logo: { width: 80, height: 80, resizeMode: "contain" },
    formCard: { width: "100%", backgroundColor: "#fff", borderRadius: 32, padding: 24, elevation: 6 },
    subtitleText: { fontSize: 14, color: "#6a6a6a", marginBottom: 24 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: "700", color: "#4a4a4a", marginBottom: 8 },
    activeDot: { color: "#90733e", fontSize: 16 },
    labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    forgotLink: { fontSize: 12, fontWeight: "600", color: "#90733e" },
    inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#faf9f7", borderRadius: 18, borderWidth: 2, borderColor: "#ebe8e3", height: 52, paddingHorizontal: 16 },
    inputFocused: { borderColor: "#90733e", backgroundColor: "#fff" },
    iconContainer: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#f5f3f0", alignItems: "center", justifyContent: "center", marginRight: 12 },
    iconActive: { backgroundColor: "rgba(144,115,62,0.1)" },
    input: { flex: 1, fontSize: 14, color: "#1a1a1a" },
    eyeButton: { padding: 8, marginLeft: 4 },
    loginButton: { backgroundColor: "#90733e", height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center", marginTop: 12, overflow: "hidden" },
    buttonGlow: { position: "absolute", width: "120%", height: "200%", backgroundColor: "#90733e", opacity: 0.15, borderRadius: 26, top: -24, left: -12 },
    buttonContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 24 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    arrowCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.3)", justifyContent: "center", alignItems: "center" },
    buttonDisabled: { opacity: 0.6 },
    signupButton: { alignItems: "center", marginTop: 16 },
    signupText: { fontSize: 14, color: "#6a6a6a" },
    signupLink: { fontWeight: "700", color: "#90733e" },
});
