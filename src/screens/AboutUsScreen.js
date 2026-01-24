import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

const AboutUsScreen = () => {
  const navigation = useNavigation();

  const handleCall = () => {
    Linking.openURL('tel:+919179500312');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:sales@sanjaycomm.com');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.sanjaycommunications.com');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.companyName}>Sanjay Communications</Text>
          <Text style={styles.brandName}>Integrators</Text>
          <Text style={styles.tagline}>Secure. Smart. Connected.</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who We Are</Text>
          <Text style={styles.paragraph}>
            Founded in 2010, Sanjay Communications is a trusted system integrator and technology solutions provider delivering advanced security, IT, and energy solutions across Madhya Pradesh and beyond.
          </Text>
          <Text style={styles.paragraph}>
            As an authorized partner of <Text style={styles.highlight}>Prama Hikvision India Ltd</Text>, we specialize in comprehensive security and technology solutions for businesses, homes, and institutions.
          </Text>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesGrid}>
            <View style={styles.serviceItem}>
              <Ionicons name="videocam" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>CCTV Surveillance</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="flame" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Fire Alarms</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="finger-print" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Biometrics</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Video Door Phones</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="lock-closed" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Electronic Locks</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="sunny" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Solar Power Plants</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Access Controls</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="wifi" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Networking Solutions</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="laptop" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Computer Systems</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="musical-notes" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Audio Video Solutions</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="tablet-portrait" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Interactive Panels</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="school" size={20} color={COLORS.primary} />
              <Text style={styles.serviceText}>Smart Classrooms</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2000+</Text>
            <Text style={styles.statLabel}>Satisfied Customers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>13+</Text>
            <Text style={styles.statLabel}>Years Experience</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Customer Satisfaction</Text>
          </View>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            To secure lives, empower businesses, and support sustainable growth through cutting-edge technology, expert installation, and dedicated after-sales support.
          </Text>
        </View>

        {/* Warranty Section */}
        <View style={styles.highlightBox}>
          <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
          <Text style={styles.highlightTitle}>On-Site Warranty & Service</Text>
          <Text style={styles.highlightText}>
            We provide on-site warranty and services of minimum 2 years for every product installed by us.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="call" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+91-9179500312</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <Ionicons name="mail" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>sales@sanjaycomm.com</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <Ionicons name="location" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>
                Shop No 1, Kachhpura Over Bridge{'\n'}
                Chowk, Yadav Colony{'\n'}
                Jabalpur, Madhya Pradesh 482002
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.websiteButton} onPress={handleWebsite}>
            <Ionicons name="globe-outline" size={20} color={COLORS.background} />
            <Text style={styles.websiteButtonText}>Visit Our Website</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Sanjay Communications{'\n'}
            All rights reserved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  companyHeader: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.primary,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.background,
    marginBottom: 8,
    opacity: 0.9,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.background,
    fontWeight: '500',
  },
  section: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'justify',
  },
  highlight: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 12,
    paddingRight: 8,
  },
  serviceText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  highlightBox: {
    backgroundColor: COLORS.border,
    padding: 24,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  websiteButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default AboutUsScreen;
