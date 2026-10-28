import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const MembershipService = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/images/under_construction.png')} // put your image in assets folder
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 400,
    },
});

export default MembershipService;
