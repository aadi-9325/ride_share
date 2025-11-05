import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function DashboardScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.subtitle}>Ready to share a ride?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Booking')}
          >
            <Ionicons name="add-circle" size={32} color="#3B82F6" />
            <Text style={styles.actionTitle}>Book a Ride</Text>
            <Text style={styles.actionSubtitle}>Find riders going your way</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people" size={32} color="#10B981" />
            <Text style={styles.actionTitle}>My Rides</Text>
            <Text style={styles.actionSubtitle}>Track active rides</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.rideInfo}>
                <Text style={styles.rideRoute}>Delhi → Gurgaon</Text>
                <Text style={styles.rideTime}>Today, 9:30 AM</Text>
              </View>
              <Text style={styles.rideStatus}>Completed</Text>
            </View>
            <Text style={styles.savingsText}>Saved ₹280 (62%)</Text>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.rideInfo}>
                <Text style={styles.rideRoute}>Mumbai → Navi Mumbai</Text>
                <Text style={styles.rideTime}>Yesterday, 6:15 PM</Text>
              </View>
              <Text style={styles.rideStatusCompleted}>Completed</Text>
            </View>
            <Text style={styles.savingsText}>Saved ₹180 (58%)</Text>
          </View>
        </View>

        {/* Savings Summary */}
        <View style={styles.savingsCard}>
          <Text style={styles.savingsTitle}>Total Savings This Month</Text>
          <Text style={styles.savingsAmount}>₹2,450</Text>
          <Text style={styles.savingsSubtitle}>You've saved money on 12 rides!</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rideInfo: {
    flex: 1,
  },
  rideRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  rideTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  rideStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  rideStatusCompleted: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  savingsText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  savingsCard: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#EFF6FF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  savingsTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  savingsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  savingsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
})