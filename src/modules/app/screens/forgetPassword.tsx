import React, { useState } from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from "react-native";
import Toast from 'react-native-toast-message';

// @ts-ignore
export default function ForgetPassword({ navigation }) {
    const [email, setEmail] = useState("");

    const validateEmail = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSend = () => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter your email address.',
            });
            return;
        }

        if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid email address.',
            });
            return;
        }

        // Simulate sending a reset password email
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Password reset link sent to your email.',
        });
        navigation.navigate('OTP');
    };

    return (
        <View style={styles.contentContainer}>
            <Image source={require("@src/assets/images/logo.png")} style={styles.logo} />
            <Text style={styles.subheading}>
                Enter your registered email address to receive OTP code.
            </Text>
            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSend}>
                <Text style={styles.buttonText}>Reset</Text>
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
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    button: {
        backgroundColor: "#90733e",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
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
    logo: {
        width: 160,
        height: 155,
        alignSelf: "center",
        marginBottom: 30,
    },
});
