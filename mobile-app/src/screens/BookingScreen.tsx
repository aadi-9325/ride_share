import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function BookingScreen({ navigation }: any) {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book a Ride</Text>
          <Text style={styles.headerSubtitle}>Find riders going your way</Text>
        </View>

        {/* Booking Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Location</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={pickup}
                onChangeText={setPickup}
                placeholder="Enter pickup location"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Destination</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={destination}
                onChangeText={setDestination}
                placeholder="Enter destination"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder="Select date"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="time" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={selectedTime}
                  onChangeText={setSelectedTime}
                  placeholder="Select time"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Find Riders</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Locations</Text>
          <View style={styles.quickLocations}>
            <TouchableOpacity style={styles.locationChip}>
              <Ionicons name="airplane" size={16} color="#3B82F6" />
              <Text style={styles.locationChipText}>Airport</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationChip}>
              <Ionicons name="business" size={16} color="#3B82F6" />
              <Text style={styles.locationChipText}>Office</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationChip}>
              <Ionicons name="school" size={16} color="#3B82F6" />
              <Text style={styles.locationChipText}>College</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationChip}>
              <Ionicons name="home" size={16} color="#3B82F6" />
              <Text style={styles.locationChipText}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Routes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Routes</Text>
          <TouchableOpacity style={styles.recentRoute}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeText}>Delhi → Gurgaon</Text>
              <Text style={styles.routeFrequency}>5 rides this month</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  quickLocations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  locationChipText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  recentRoute: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  routeFrequency: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
})