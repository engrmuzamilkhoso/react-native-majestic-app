import React, { useState, useRef } from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from "react-native";
import Toast from "react-native-toast-message";

//@ts-ignore
export default function OTP({navigation}) {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleInputChange = (text: string, index: number) => {
        if (text.length <= 1 && /^\d*$/.test(text)) {
            const updatedOtp = [...otp];
            updatedOtp[index] = text;
            setOtp(updatedOtp);

            // Automatically focus the next input if not the last one
            if (text && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        // Handle backspace to move to previous input
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const isOtpComplete = otp.every(digit => digit !== "") && otp.join("").length === 4;

    const handleSend = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length === 4) {
            navigation.navigate('ChangePassword');
            Toast.show({
                type: "success",
                text1: "Success",
                text2: `OTP verified successfully!`,
                position: 'bottom',
            });
        } else {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please enter all 4 digits of the OTP.",
                position: 'bottom',
            });
        }
    };

    return (
        <View style={styles.contentContainer}>
            <Image source={require("@src/assets/images/logo.png")} style={styles.logo} />

            <Text style={styles.subheading}>
                Enter the 4-digit OTP sent to your registered email address.
            </Text>
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        style={[
                            styles.otpInput,
                            digit ? styles.otpInputFilled : null
                        ]}
                        value={digit}
                        onChangeText={(text) => handleInputChange(text, index)}
                        onKeyPress={({nativeEvent}) => handleKeyPress(nativeEvent.key, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        textAlign="center"
                    />
                ))}
            </View>
            <TouchableOpacity
                style={[
                    styles.button,
                    !isOtpComplete && styles.disabledButton
                ]}
                onPress={handleSend}
                disabled={!isOtpComplete}
            >
                <Text style={[
                    styles.buttonText,
                    !isOtpComplete && styles.disabledButtonText
                ]}>
                    Submit OTP
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
    subheading: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    otpInput: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        width: 50,
        height: 50,
        fontSize: 18,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 2,
        borderColor: "#E0E0E0",
    },
    otpInputFilled: {
        borderColor: "#90733e",
        backgroundColor: "#FFF8F0",
    },
    button: {
        backgroundColor: "#90733e",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
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
    logo: {
        width: 160,
        height: 155,
        alignSelf: "center",
        marginBottom: 30,
    },
});
