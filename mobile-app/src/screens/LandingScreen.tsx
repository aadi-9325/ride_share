import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function LandingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="car" size={32} color="#3B82F6" />
            <Text style={styles.logoText}>RideShare</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Share Rides,{'\n'}
            <Text style={styles.heroTitleHighlight}>Split Costs</Text>,{'\n'}
            Save Money
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Join the smart way to travel. Match with verified riders heading your way and save up to 60-85% on every ride.
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.ctaButtonText}>Start Saving Now</Text>
          </TouchableOpacity>

          <Text style={styles.trustText}>
            No fees • Instant matching • Safe rides
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Why Choose RideShare?</Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="people" size={24} color="#3B82F6" />
              <Text style={styles.featureText}>Smart Matching</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
              <Text style={styles.featureText}>Safety First</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cash" size={24} color="#3B82F6" />
              <Text style={styles.featureText}>Cost Savings</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={24} color="#3B82F6" />
              <Text style={styles.featureText}>Instant Booking</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.bottomCTA}>
          <Text style={styles.bottomCTATitle}>Ready to Start Saving?</Text>
          <Text style={styles.bottomCTASubtitle}>
            Join thousands of users already saving money on their daily commutes.
          </Text>
          <TouchableOpacity
            style={styles.bottomCTAButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.bottomCTAButtonText}>Get Started Free</Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 34,
  },
  heroTitleHighlight: {
    color: '#3B82F6',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  trustText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  features: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 24,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#1F2937',
  },
  bottomCTA: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    margin: 20,
    borderRadius: 16,
  },
  bottomCTATitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  bottomCTASubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  bottomCTAButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bottomCTAButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
})