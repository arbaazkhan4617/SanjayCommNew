import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../utils/constants';

const HelpSupportScreen = () => {
  const navigation = useNavigation();
  const [expandedSection, setExpandedSection] = useState(null);

  const handleCall = () => {
    Linking.openURL('tel:+919179500312').catch(err => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:sales@sanjaycomm.com?subject=Support Request').catch(err => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.sanjaycommunications.com').catch(err => {
      Alert.alert('Error', 'Unable to open website');
    });
  };

  const faqSections = [
    {
      id: '1',
      question: 'How do I request a quotation?',
      answer: 'You can request a quotation by adding products to your cart and clicking "Get Quotation", or by using the "Buy Now" button on any product page and selecting "Get Quotation".',
    },
    {
      id: '2',
      question: 'What is the warranty period?',
      answer: 'We provide on-site warranty and services of minimum 2 years for every product installed by us.',
    },
    {
      id: '3',
      question: 'How do I request service support?',
      answer: 'You can request service support by navigating to any product category, clicking "Raise Service Request", or by using the "Request Service" option from your cart.',
    },
    {
      id: '4',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including cash, bank transfer, UPI, and credit/debit cards. Payment details will be discussed during the quotation process.',
    },
    {
      id: '5',
      question: 'Do you provide installation services?',
      answer: 'Yes, we provide complete installation services along with on-site warranty and support for all our products.',
    },
    {
      id: '6',
      question: 'How can I track my service request?',
      answer: 'You can track your service requests from the Profile section. You will also receive updates via email and phone.',
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Header title="Help & Support" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="call" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+91-9179500312</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="mail" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>sales@sanjaycomm.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <View style={styles.contactCard}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="location" size={24} color={COLORS.primary} />
            </View>
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ServiceRequest')}
          >
            <Ionicons name="construct" size={24} color={COLORS.primary} />
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Raise Service Request</Text>
              <Text style={styles.actionDescription}>Request service support for your products</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Get Quotation</Text>
              <Text style={styles.actionDescription}>Request a quotation for products in your cart</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqSections.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleSection(faq.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons
                  name={expandedSection === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
              {expandedSection === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Monday - Saturday</Text>
              <Text style={styles.hoursTime}>9:00 AM - 7:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Sunday</Text>
              <Text style={styles.hoursTime}>10:00 AM - 5:00 PM</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    backgroundColor: COLORS.background,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
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
    marginTop: 8,
  },
  websiteButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  actionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  faqItem: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 12,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  hoursCard: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hoursDay: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  hoursTime: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default HelpSupportScreen;
