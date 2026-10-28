import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import api from '@helpers/api/axios';

type RootState = {
    AppReducer: {
        user: {
            id: number;
        };
    };
};

type Service = {
    id: string;
    title: string;
    pricing: {
        adults: number;
        children: number;
        infants: number;
    };
    description?: string;
    available: boolean;
};

type Counters = {
    adults: number;
    children: number;
    infants: number;
};

export default function MeetAssistService() {
    const user = useSelector((state: RootState) => state.AppReducer.user);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [serviceCounters, setServiceCounters] = useState<Record<string, Counters>>({});

    // Modal and booking states
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [flightNumber, setFlightNumber] = useState('');

    // Date picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [hasSelectedDate, setHasSelectedDate] = useState(false);

    // Time picker states
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [hasSelectedTime, setHasSelectedTime] = useState(false);
    const categoryId = 3;
    const serviceId = 2;
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products/list', {
                params: {
                    category_id: categoryId,
                    service_id: serviceId,
                },
            });

            if (response.data.status === '0000') {
                const mapped: Service[] = response.data.data.map((item: any) => ({
                    id: String(item.id),
                    title: item.name,
                    description: item.description,
                    pricing: {
                        adults: parseFloat(item.price),
                        children: item.child_price || 0,
                        infants: item.infant_price || 0,
                    },
                    available: true,
                }));

                setServices(mapped);

                const initialCounters: Record<string, Counters> = {};
                mapped.forEach((service) => {
                    initialCounters[service.id] = {
                        adults: 1,
                        children: 0,
                        infants: 0,
                    };
                });
                setServiceCounters(initialCounters);
            } else {
                setServices([]);
            }
        } catch (err) {
            console.error('Error fetching services:', err);
            setServices([]);
        }
        setLoading(false);
    };

    const updateCounter = (
        serviceId: string,
        type: keyof Counters,
        operation: 'increment' | 'decrement'
    ) => {
        setServiceCounters((prev) => {
            const currentState = prev[serviceId] || {
                adults: 1,
                children: 0,
                infants: 0,
            };

            let newValue = currentState[type];
            if (operation === 'increment') {
                newValue += 1;
            } else if (operation === 'decrement') {
                if (type === 'adults' && newValue <= 1) return prev;
                if (newValue > 0) newValue -= 1;
            }

            return {
                ...prev,
                [serviceId]: {
                    ...currentState,
                    [type]: newValue,
                },
            };
        });
    };

    const calculateTotal = (service: Service) => {
        const counters = serviceCounters[service.id] || { adults: 1, children: 0, infants: 0 };
        const pricing = service.pricing;

        return (
            counters.adults * pricing.adults +
            counters.children * pricing.children +
            counters.infants * pricing.infants
        );
    };

    const formatDate = (): string => {
        const month = String(selectedMonth).padStart(2, '0');
        const day = String(selectedDay).padStart(2, '0');
        return `${selectedYear}-${month}-${day}`;
    };

    const formatTime = (): string => {
        const hours = String(selectedHour).padStart(2, '0');
        const minutes = String(selectedMinute).padStart(2, '0');
        return `${hours}:${minutes}:00`;
    };

    const handleBooking = (service: Service) => {
        setSelectedService(service);
        setFlightNumber('');
        const now = new Date();
        setSelectedYear(now.getFullYear());
        setSelectedMonth(now.getMonth() + 1);
        setSelectedDay(now.getDate());
        setSelectedHour(12);
        setSelectedMinute(0);
        setHasSelectedDate(false);
        setHasSelectedTime(false);
        setShowBookingModal(true);
    };

    const confirmDateSelection = () => {
        setHasSelectedDate(true);
        setShowDatePicker(false);
    };

    const confirmTimeSelection = () => {
        setHasSelectedTime(true);
        setShowTimePicker(false);
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const submitBooking = () => {
        if (!hasSelectedDate || !flightNumber || !hasSelectedTime) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (!selectedService) return;

        const counters = serviceCounters[selectedService.id];
        const total = calculateTotal(selectedService);

        const finalBookingData = {
            service_id: serviceId,
            customer_id: user.id,
            category_id: categoryId,
            product_id: parseInt(selectedService.id),
            departure_date: formatDate(),
            flight_number: flightNumber,
            departure_time: formatTime(),
            adult_qty: counters.adults,
            child_qty: counters.children,
            infant_qty: counters.infants,
            total_amount: total,
        };

        console.log('Final Booking Data:', finalBookingData);

        setShowBookingModal(false);
        Alert.alert('Success', 'Booking submitted successfully!');
    };

    const Counter = ({value,onIncrement,onDecrement,canDecrement = true}: {
        value: number;
        onIncrement: () => void;
        onDecrement: () => void;
        canDecrement?: boolean;
    }) => (
        <View style={styles.counterContainer}>
            <TouchableOpacity
                style={[styles.counterButton, !canDecrement && styles.disabledButton]}
                onPress={onDecrement}
                disabled={!canDecrement}
            >
                <Text style={[styles.counterButtonText, !canDecrement && styles.disabledText]}>
                    −
                </Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{value}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
                <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );

    const PassengerRow = ({
                              label,
                              value,
                              onIncrement,
                              onDecrement,
                              canDecrement,
                              price,
                          }: {
        label: string;
        value: number;
        onIncrement: () => void;
        onDecrement: () => void;
        canDecrement: boolean;
        price: number;
    }) => (
        <View style={styles.passengerType}>
            <Text style={styles.passengerLabel}>{label}</Text>
            <View style={styles.passengerRight}>
                <Counter
                    value={value}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                    canDecrement={canDecrement}
                />
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>PKR {price.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );

    const ServiceCard = ({ service }: { service: Service }) => {
        const counters = serviceCounters[service.id] || { adults: 1, children: 0, infants: 0 };
        const total = calculateTotal(service);

        if (!service.available) return null;

        return (
            <View style={styles.serviceCard}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                {service.description && (
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                )}

                <View style={styles.serviceRow}>
                    <PassengerRow
                        label="Adults (10+)"
                        value={counters.adults}
                        onIncrement={() => updateCounter(service.id, 'adults', 'increment')}
                        onDecrement={() => updateCounter(service.id, 'adults', 'decrement')}
                        canDecrement={counters.adults > 1}
                        price={service.pricing.adults}
                    />
                    <PassengerRow
                        label="Children (3-10)"
                        value={counters.children}
                        onIncrement={() => updateCounter(service.id, 'children', 'increment')}
                        onDecrement={() => updateCounter(service.id, 'children', 'decrement')}
                        canDecrement={counters.children > 0}
                        price={service.pricing.children}
                    />
                    <PassengerRow
                        label="Infants (0-3)"
                        value={counters.infants}
                        onIncrement={() => updateCounter(service.id, 'infants', 'increment')}
                        onDecrement={() => updateCounter(service.id, 'infants', 'decrement')}
                        canDecrement={counters.infants > 0}
                        price={service.pricing.infants}
                    />
                </View>

                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleBooking(service)}
                >
                    <Text style={styles.bookButtonText}>
                        Book now for PKR {total.toLocaleString()}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 3; i++) {
            years.push(currentYear + i);
        }
        return years.map((year) => (
            <TouchableOpacity
                key={year}
                style={[styles.pickerItem, selectedYear === year && styles.pickerItemSelected]}
                onPress={() => setSelectedYear(year)}
            >
                <Text style={[styles.pickerItemText, selectedYear === year && styles.pickerItemTextSelected]}>
                    {year}
                </Text>
            </TouchableOpacity>
        ));
    };

    const renderMonths = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((month, index) => (
            <TouchableOpacity
                key={index}
                style={[styles.pickerItem, selectedMonth === index + 1 && styles.pickerItemSelected]}
                onPress={() => setSelectedMonth(index + 1)}
            >
                <Text style={[styles.pickerItemText, selectedMonth === index + 1 && styles.pickerItemTextSelected]}>
                    {month}
                </Text>
            </TouchableOpacity>
        ));
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.pickerItem, selectedDay === i && styles.pickerItemSelected]}
                    onPress={() => setSelectedDay(i)}
                >
                    <Text style={[styles.pickerItemText, selectedDay === i && styles.pickerItemTextSelected]}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }
        return days;
    };

    const renderHours = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.pickerItem, selectedHour === i && styles.pickerItemSelected]}
                    onPress={() => setSelectedHour(i)}
                >
                    <Text style={[styles.pickerItemText, selectedHour === i && styles.pickerItemTextSelected]}>
                        {String(i).padStart(2, '0')}
                    </Text>
                </TouchableOpacity>
            );
        }
        return hours;
    };

    const renderMinutes = () => {
        const minutes = [];
        for (let i = 0; i < 60; i += 5) {
            minutes.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.pickerItem, selectedMinute === i && styles.pickerItemSelected]}
                    onPress={() => setSelectedMinute(i)}
                >
                    <Text style={[styles.pickerItemText, selectedMinute === i && styles.pickerItemTextSelected]}>
                        {String(i).padStart(2, '0')}
                    </Text>
                </TouchableOpacity>
            );
        }
        return minutes;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#90733e" />
                <Text style={styles.loadingText}>Loading services...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {services.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No services available for flights
                        </Text>
                    </View>
                ) : (
                    services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))
                )}
            </ScrollView>

            {/* Booking Modal */}
            <Modal
                visible={showBookingModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowBookingModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>Complete Booking Details</Text>

                            {/* Date Picker */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Departure Date <Text style={styles.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text
                                        style={[
                                            styles.datePickerText,
                                            !hasSelectedDate && styles.placeholderText,
                                        ]}
                                    >
                                        {hasSelectedDate ? formatDate() : 'Select Date'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Flight Number */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Flight Number <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., PK123"
                                    value={flightNumber}
                                    onChangeText={setFlightNumber}
                                />
                            </View>

                            {/* Time Picker */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Departure Time <Text style={styles.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text
                                        style={[
                                            styles.datePickerText,
                                            !hasSelectedTime && styles.placeholderText,
                                        ]}
                                    >
                                        {hasSelectedTime ? formatTime() : 'Select Time'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Booking Summary */}
                            {selectedService && (
                                <View style={styles.summaryBox}>
                                    <Text style={styles.summaryTitle}>Booking Summary</Text>
                                    <Text style={styles.summaryText}>
                                        Service: {selectedService.title}
                                    </Text>
                                    <Text style={styles.summaryText}>
                                        Adults: {serviceCounters[selectedService.id]?.adults || 1}
                                    </Text>
                                    <Text style={styles.summaryText}>
                                        Children: {serviceCounters[selectedService.id]?.children || 0}
                                    </Text>
                                    <Text style={styles.summaryText}>
                                        Infants: {serviceCounters[selectedService.id]?.infants || 0}
                                    </Text>
                                    <Text style={styles.summaryTotal}>
                                        Total: PKR {calculateTotal(selectedService).toLocaleString()}
                                    </Text>
                                </View>
                            )}

                            {/* Buttons */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowBookingModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={submitBooking}
                                >
                                    <Text style={styles.submitButtonText}>Submit Booking</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Custom Date Picker Modal */}
            <Modal
                visible={showDatePicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.pickerModalOverlay}>
                    <View style={styles.pickerModalContent}>
                        <Text style={styles.pickerTitle}>Select Date</Text>

                        <View style={styles.pickerRow}>
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerColumnTitle}>Year</Text>
                                <ScrollView style={styles.pickerScrollView}>
                                    {renderYears()}
                                </ScrollView>
                            </View>

                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerColumnTitle}>Month</Text>
                                <ScrollView style={styles.pickerScrollView}>
                                    {renderMonths()}
                                </ScrollView>
                            </View>

                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerColumnTitle}>Day</Text>
                                <ScrollView style={styles.pickerScrollView}>
                                    {renderDays()}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.pickerButtons}>
                            <TouchableOpacity
                                style={styles.pickerCancelButton}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.pickerCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pickerConfirmButton}
                                onPress={confirmDateSelection}
                            >
                                <Text style={styles.pickerConfirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Custom Time Picker Modal */}
            <Modal
                visible={showTimePicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowTimePicker(false)}
            >
                <View style={styles.pickerModalOverlay}>
                    <View style={styles.pickerModalContent}>
                        <Text style={styles.pickerTitle}>Select Time</Text>

                        <View style={styles.pickerRow}>
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerColumnTitle}>Hour</Text>
                                <ScrollView style={styles.pickerScrollView}>
                                    {renderHours()}
                                </ScrollView>
                            </View>

                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerColumnTitle}>Minute</Text>
                                <ScrollView style={styles.pickerScrollView}>
                                    {renderMinutes()}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.pickerButtons}>
                            <TouchableOpacity
                                style={styles.pickerCancelButton}
                                onPress={() => setShowTimePicker(false)}
                            >
                                <Text style={styles.pickerCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pickerConfirmButton}
                                onPress={confirmTimeSelection}
                            >
                                <Text style={styles.pickerConfirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: { borderBottomColor: '#90733e' },
    tabText: { fontSize: 16, fontWeight: '500', color: '#666' },
    activeTabText: { color: '#90733e', fontWeight: 'bold' },
    scrollArea: { flex: 1 },
    serviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    serviceTitle: { fontSize: 18, fontWeight: 'bold', color: '#90733e', marginBottom: 8 },
    serviceDescription: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
    serviceRow: { marginBottom: 20 },
    passengerType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    passengerLabel: { fontSize: 14, color: '#666', flex: 1 },
    passengerRight: { flexDirection: 'row', alignItems: 'center' },
    counterContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
    counterButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    disabledButton: { backgroundColor: '#F8F8F8', borderColor: '#F0F0F0' },
    counterButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    disabledText: { color: '#CCC' },
    counterValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 6,
        minWidth: 20,
        textAlign: 'center',
    },
    priceTag: {
        width: 80,
        backgroundColor: '#90733e',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priceText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
    bookButton: {
        backgroundColor: '#90733e',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#90733e',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#FF0000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#F8F9FA',
    },
    datePickerButton: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#F8F9FA',
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#999',
    },
    summaryBox: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 15,
        marginVertical: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#90733e',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    summaryTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#90733e',
        marginTop: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#90733e',
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#90733e',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#90733e',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Custom Picker Styles
    pickerModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    pickerModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    pickerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#90733e',
        marginBottom: 20,
        textAlign: 'center',
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pickerColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
    pickerColumnTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    pickerScrollView: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
    },
    pickerItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    pickerItemSelected: {
        backgroundColor: '#90733e',
    },
    pickerItemText: {
        fontSize: 16,
        color: '#333',
    },
    pickerItemTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    pickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pickerCancelButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#90733e',
        marginRight: 10,
        alignItems: 'center',
    },
    pickerCancelButtonText: {
        color: '#90733e',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerConfirmButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#90733e',
        alignItems: 'center',
    },
    pickerConfirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
