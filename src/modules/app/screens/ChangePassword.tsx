import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import Toast from 'react-native-toast-message';

//@ts-ignore
export default function ChangePassword({ navigation }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: "", color: "#999" });
    const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

    const checkPasswordStrength = (password: string) => {
        if (!password) {
            return { score: 0, message: "", color: "#999" };
        }

        let score = 0;
        let feedback: string[] = [];
        let hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        // Length check
        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push("at least 8 characters");
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push("lowercase letters");
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push("uppercase letters");
        }

        // Number check
        if (/\d/.test(password)) {
            score += 1;
        } else {
            feedback.push("numbers");
        }

        // Special character check (MANDATORY)
        if (hasSpecialChar) {
            score += 1;
        } else {
            feedback.push("special characters (!@#$%^&*)");
        }

        // Determine strength and color - Special character is MANDATORY
        let message: string, color: string;

        if (!hasSpecialChar) {
            message = `Requires special characters - Add ${feedback.join(", ")}`;
            color = "#FF4444";
        } else if (score <= 3) {
            message = `Weak - Add ${feedback.slice(0, 2).join(", ")}`;
            color = "#FF4444";
        } else if (score === 4) {
            message = `Medium - Add ${feedback[0] || "more complexity"}`;
            color = "#FFA500";
        } else {
            message = "Strong - Excellent password!";
            color = "#32CD32";
        }

        return { score, message, color };
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        const strength = checkPasswordStrength(text);
        setPasswordStrength(strength);

        // Check password match if confirm password is filled
        if (confirmPassword) {
            setShowPasswordMismatch(text !== confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setShowPasswordMismatch(password !== text && text.length > 0);
    };

    const isFormValid = password &&
        confirmPassword &&
        password === confirmPassword &&
        passwordStrength.score >= 3 &&
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const handleChangePassword = () => {
        if (!password || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill both password fields.',
                position: 'bottom',
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Passwords do not match.',
                position: 'bottom',
            });
            return;
        }

        if (passwordStrength.score < 3) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Please create a stronger password.',
                position: 'bottom',
            });
            return;
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'Password must contain at least one special character.',
                position: 'bottom',
            });
            return;
        }

        // Simulate password change success
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Password changed successfully! Redirecting to login...',
            position: 'bottom',
        });

        // Clear fields
        setPassword("");
        setConfirmPassword("");
        setPasswordStrength({ score: 0, message: "", color: "#999" });
        setShowPasswordMismatch(false);

        // Navigate to login after a short delay to show the success message
        setTimeout(() => {
            navigation.navigate('Login');
        }, 2000);
    };

    return (
        <View style={styles.contentContainer}>
            <Image source={require("@src/assets/images/logo.png")} style={styles.logo} />
            <Text style={styles.subheading}>
                Create a strong password to secure your account.
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="New Password"
                    style={styles.input}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                />
                {password.length > 0 && (
                    <View style={styles.passwordStrengthContainer}>
                        <View style={styles.strengthBarContainer}>
                            <View
                                style={[
                                    styles.strengthBar,
                                    {
                                        width: `${(passwordStrength.score / 5) * 100}%`,
                                        backgroundColor: passwordStrength.color
                                    }
                                ]}
                            />
                        </View>
                        <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                            {passwordStrength.message}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Confirm Password"
                    style={[
                        styles.input,
                        showPasswordMismatch && confirmPassword.length > 0 ? styles.inputError : null
                    ]}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                />
                {showPasswordMismatch && confirmPassword.length > 0 && (
                    <Text style={styles.errorText}>
                        Passwords do not match
                    </Text>
                )}
                {!showPasswordMismatch && confirmPassword.length > 0 && password === confirmPassword && (
                    <Text style={styles.successText}>
                        ✓ Passwords match
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    !isFormValid && styles.disabledButton
                ]}
                onPress={handleChangePassword}
                disabled={!isFormValid}
            >
                <Text style={[
                    styles.buttonText,
                    !isFormValid && styles.disabledButtonText
                ]}>
                    Change Password
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 25,
        justifyContent: "center",
        backgroundColor: "#F5F5F5",
    },
    logo: {
        width: 160,
        height: 155,
        alignSelf: "center",
        marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 10,
    },
    subheading: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 2,
        borderColor: "transparent",
    },
    inputError: {
        borderColor: "#FF4444",
    },
    passwordStrengthContainer: {
        marginTop: 8,
    },
    strengthBarContainer: {
        height: 4,
        backgroundColor: "#E0E0E0",
        borderRadius: 2,
        marginBottom: 5,
    },
    strengthBar: {
        height: "100%",
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: "500",
    },
    errorText: {
        color: "#FF4444",
        fontSize: 12,
        marginTop: 5,
    },
    successText: {
        color: "#32CD32",
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: "#90733e",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#CCCCCC",
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledButtonText: {
        color: "#999999",
    },
});
