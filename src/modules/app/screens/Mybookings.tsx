import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    RefreshControl
} from "react-native";

interface Booking {
    id: string;
    loungeName: string;
    location: string;
    date: string;
    time: string;
    guests: number;
    status: 'confirmed' | 'Pending' | 'Completed' | 'Cancelled';
    bookingReference: string;
    amenities: string[];
    totalAmount: number;
    image: string;
}

//@ts-ignore
export default function MyBookings({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'Pending' | 'Completed' | 'Cancelled'>('Pending');

    const bookings: Booking[] = [
        {
            id: '1',
            loungeName: 'Premium Business Lounge',
            location: 'Terminal 1, Gate A12',
            date: '2024-09-20',
            time: '14:30 - 16:30',
            guests: 2,
            status: 'Pending',
            bookingReference: 'ML001234',
            amenities: ['WiFi', 'Buffet', 'Bar', 'Showers'],
            totalAmount: 85,
            image: 'https://example.com/lounge1.jpg'
        },

        {
            id: '2',
            loungeName: 'Executive VIP Lounge',
            location: 'Terminal 2, Gate B8',
            date: '2024-09-25',
            time: '10:00 - 12:00',
            guests: 1,
            status: 'Completed',
            bookingReference: 'ML001235',
            amenities: ['WiFi', 'Premium Dining', 'Spa', 'Private Rooms'],
            totalAmount: 120,
            image: 'https://example.com/lounge2.jpg'
        },
        {
            id: '3',
            loungeName: 'Classic Airport Lounge',
            location: 'Terminal 3, Gate C15',
            date: '2024-09-10',
            time: '08:00 - 10:00',
            guests: 3,
            status: 'Cancelled',
            bookingReference: 'ML001230',
            amenities: ['WiFi', 'Light Refreshments', 'Reading Area'],
            totalAmount: 60,
            image: 'https://example.com/lounge3.jpg'
        }
    ];

    const filteredBookings = bookings.filter(b => b.status === activeTab);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    const handleViewDetails = (booking: Booking) => {
        navigation.navigate('BookingDetails', { booking });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return '#DBBA48';
            case 'Completed': return '#A7E69A';
            case 'Cancelled': return '#ED8A8A';
            default: return '#666';
        }
    };

    const BookingCard = ({ booking }: { booking: Booking }) => (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => handleViewDetails(booking)}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <View style={styles.loungeImageContainer}>
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>🏢</Text>
                    </View>
                </View>
                <View style={styles.bookingInfo}>
                    <Text style={styles.loungeName}>{booking.loungeName}</Text>
                    <Text style={styles.location}>{booking.location}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                        <Text style={styles.statusText}>{booking.status}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📅 Date:</Text>
                    <Text style={styles.detailValue}>{new Date(booking.date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>🕐 Time:</Text>
                    <Text style={styles.detailValue}>{booking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>👥 Guests:</Text>
                    <Text style={styles.detailValue}>{booking.guests}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>💰 Amount:</Text>
                    <Text style={styles.detailValue}>${booking.totalAmount}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>🎫 Reference:</Text>
                    <Text style={styles.detailValue}>{booking.bookingReference}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const EmptyState = ({ type }: { type: string }) => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No {type} Bookings</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {['Pending', 'Completed', 'Cancelled'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab as any)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))
                ) : (
                    <EmptyState type={activeTab} />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: "#FFFFFF",
        margin: 20,
        borderRadius: 15,
        padding: 4,
        elevation: 3,
    },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    activeTab: { backgroundColor: "#90733e" },
    tabText: { fontSize: 16, fontWeight: '600', color: "#666" },
    activeTabText: { color: "#FFFFFF" },
    content: { flex: 1, padding: 20 },
    bookingCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
    },
    cardHeader: { flexDirection: 'row', marginBottom: 15 },
    loungeImageContainer: { marginRight: 15 },
    placeholderImage: {
        width: 60, height: 60, borderRadius: 30, backgroundColor: "#90733e20",
        justifyContent: 'center', alignItems: 'center',
    },
    placeholderText: { fontSize: 24 },
    bookingInfo: { flex: 1 },
    loungeName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    location: { fontSize: 14, color: "#666", marginBottom: 8 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: '600', color: "#FFF" },
    cardDetails: { backgroundColor: "#F8F9FA", borderRadius: 12, padding: 15, marginBottom: 15 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    detailLabel: { fontSize: 14, color: "#666" },
    detailValue: { fontSize: 14, fontWeight: '600', color: "#333" },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { fontSize: 50, marginBottom: 10 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: "#333" },
});
