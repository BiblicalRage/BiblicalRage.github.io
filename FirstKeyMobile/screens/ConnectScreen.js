import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ConnectScreen = ({ route, navigation }) => {
  const {
    selectedProfessionalType,
    setSelectedProfessionalType,
    userZipCode,
    setUserZipCode,
    handleProfessionalZipCodeSubmit,
    isLoading,
    uploadedDocuments,
    shareDocumentsWithLender,
    setShareDocumentsWithLender,
    consentToEmailDocuments,
    setConsentToEmailDocuments,
    optionalMessage,
    setOptionalMessage,
    handleDownloadDocuments,
    sendConnectionEmail,
    showCustomModal
  } = route.params;

  const [showProfessionalModal, setShowProfessionalModal] = useState(false);

  const professionals = {
    lender: [
      {
        id: 1,
        name: 'Jeff Levesque',
        title: 'Loan Officer',
        company: 'ALoan4You.com PLLC',
        nmls: 'NMLS # 2510460',
        corporateNmls: 'Corporate NMLS # 2429344',
        tagline: 'Your trusted guide to a smooth home loan experience.',
        image: 'https://placehold.co/80x80/0077b6/ffffff?text=JL',
        featured: true,
        specialties: ['Conventional Loans', 'FHA Loans', 'VA Loans', 'Jumbo Loans'],
        experience: '15+ years',
        rating: 4.9,
        reviews: 127
      }
    ],
    realtor: [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Real Estate Agent',
        company: 'Century 21 Real Estate',
        license: 'Texas Real Estate License #123456',
        tagline: 'Helping families find their perfect home since 2010.',
        image: 'https://placehold.co/80x80/10b981/ffffff?text=SJ',
        featured: true,
        specialties: ['First-time Buyers', 'Luxury Homes', 'Investment Properties'],
        experience: '13+ years',
        rating: 4.8,
        reviews: 89
      },
      {
        id: 2,
        name: 'Michael Chen',
        title: 'Real Estate Agent',
        company: 'Keller Williams Realty',
        license: 'Texas Real Estate License #789012',
        tagline: 'Expert negotiation and market analysis for your success.',
        image: 'https://placehold.co/80x80/f59e0b/ffffff?text=MC',
        featured: false,
        specialties: ['New Construction', 'Relocation', 'Short Sales'],
        experience: '8+ years',
        rating: 4.7,
        reviews: 56
      }
    ]
  };

  const handleProfessionalSelection = (type) => {
    setSelectedProfessionalType(type);
    setShowProfessionalModal(true);
  };

  const handleZipCodeSubmit = async () => {
    if (!userZipCode || userZipCode.length !== 5) {
      Alert.alert('Invalid Zip Code', 'Please enter a valid 5-digit zip code.');
      return;
    }

    try {
      await handleProfessionalZipCodeSubmit();
    } catch (error) {
      Alert.alert('Error', 'Failed to search for professionals. Please try again.');
    }
  };

  const handleSendConnection = async (professional) => {
    try {
      await sendConnectionEmail(professional.name);
    } catch (error) {
      Alert.alert('Error', 'Failed to send connection request. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Title */}
      <Text style={styles.mainTitle}>Connect with a Professional</Text>
      
      {/* Header Content */}
      <View style={styles.headerContent}>
        <Text style={styles.headerSubtitle}>
          Ready to take the next step? Find a trusted Lender or Realtor.
        </Text>
        <Text style={styles.securityNote}>
          Your information is always private and secure.
        </Text>
      </View>

      {/* Professional Selection */}
      {!selectedProfessionalType && (
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Who would you like to connect with?</Text>
          
          <TouchableOpacity
            style={styles.professionalCard}
            onPress={() => handleProfessionalSelection('lender')}
          >
            <LinearGradient
              colors={['#0077b6', '#005a8b']}
              style={styles.professionalGradient}
            >
              <View style={styles.professionalContent}>
                <Ionicons name="card" size={32} color="white" />
                <Text style={styles.professionalTitle}>Connect with a Lender</Text>
                <Text style={styles.professionalSubtitle}>
                  Get pre-approved and find the best loan terms
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.professionalCard}
            onPress={() => handleProfessionalSelection('realtor')}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.professionalGradient}
            >
              <View style={styles.professionalContent}>
                <Ionicons name="home" size={32} color="white" />
                <Text style={styles.professionalTitle}>Connect with a Realtor</Text>
                <Text style={styles.professionalSubtitle}>
                  Find your dream home with expert guidance
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Professional Details */}
      {selectedProfessionalType && (
        <View style={styles.detailsSection}>
          <View style={styles.backButton}>
            <TouchableOpacity
              style={styles.backButtonInner}
              onPress={() => {
                setSelectedProfessionalType(null);
                setUserZipCode('');
                setOptionalMessage('');
                setShareDocumentsWithLender(false);
                setConsentToEmailDocuments(false);
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#0077b6" />
              <Text style={styles.backButtonText}>Back to Selection</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            Find a {selectedProfessionalType === 'lender' ? 'Lender' : 'Realtor'} Near You
          </Text>
          
          <Text style={styles.sectionSubtitle}>Where are you looking to buy?</Text>
          
          <TextInput
            style={styles.zipCodeInput}
            value={userZipCode}
            onChangeText={setUserZipCode}
            placeholder="e.g., 75069"
            maxLength={5}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleZipCodeSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner} />
                <Text style={styles.searchButtonText}>Searching...</Text>
              </View>
            ) : (
              <Text style={styles.searchButtonText}>Search for Professionals</Text>
            )}
          </TouchableOpacity>

          {/* Professional Cards */}
          <View style={styles.professionalsList}>
            {professionals[selectedProfessionalType].map((professional) => (
              <View key={professional.id} style={styles.professionalDetailCard}>
                {professional.featured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>FEATURED</Text>
                  </View>
                )}

                <View style={styles.professionalHeader}>
                  <View style={styles.professionalImageContainer}>
                    <Text style={styles.professionalImageText}>
                      {professional.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  
                  <View style={styles.professionalInfo}>
                    <Text style={styles.professionalName}>{professional.name}</Text>
                    <Text style={styles.professionalRole}>
                      {professional.title} | {professional.nmls || professional.license}
                    </Text>
                    <Text style={styles.professionalCompany}>{professional.company}</Text>
                    <Text style={styles.professionalTagline}>{professional.tagline}</Text>
                  </View>
                </View>

                <View style={styles.professionalStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{professional.experience}</Text>
                    <Text style={styles.statLabel}>Experience</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{professional.rating}</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{professional.reviews}</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                  </View>
                </View>

                <View style={styles.specialtiesSection}>
                  <Text style={styles.specialtiesTitle}>Specialties:</Text>
                  <View style={styles.specialtiesList}>
                    {professional.specialties.map((specialty, index) => (
                      <View key={index} style={styles.specialtyBadge}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Document Sharing Section */}
                {selectedProfessionalType === 'lender' && uploadedDocuments.length > 0 && (
                  <View style={styles.documentSharingSection}>
                    <Text style={styles.documentSharingTitle}>Document Sharing Options:</Text>
                    <Text style={styles.documentSharingSubtitle}>
                      Would you like to share your uploaded documents with {professional.name}?
                    </Text>
                    
                    <View style={styles.sharingToggle}>
                      <Text style={styles.sharingLabel}>Share my documents</Text>
                      <Switch
                        value={shareDocumentsWithLender}
                        onValueChange={setShareDocumentsWithLender}
                        trackColor={{ false: '#d1d5db', true: '#0077b6' }}
                        thumbColor={shareDocumentsWithLender ? '#ffffff' : '#f4f3f4'}
                      />
                    </View>

                    {shareDocumentsWithLender && (
                      <View style={styles.sharingOptions}>
                        <TouchableOpacity
                          style={styles.downloadOption}
                          onPress={handleDownloadDocuments}
                        >
                          <Ionicons name="download" size={20} color="#0077b6" />
                          <Text style={styles.downloadOptionText}>
                            Download My Documents (Zip File)
                          </Text>
                        </TouchableOpacity>

                        <View style={styles.emailToggle}>
                          <Text style={styles.emailLabel}>
                            Email My Documents (Zip File) to {professional.name}
                          </Text>
                          <Switch
                            value={consentToEmailDocuments}
                            onValueChange={setConsentToEmailDocuments}
                            trackColor={{ false: '#d1d5db', true: '#0077b6' }}
                            thumbColor={consentToEmailDocuments ? '#ffffff' : '#f4f3f4'}
                          />
                        </View>

                        <Text style={styles.consentNote}>
                          By checking this, you consent to attach your compiled document zip file to the email sent to {professional.name}.
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Optional Message */}
                <View style={styles.messageSection}>
                  <Text style={styles.messageLabel}>Optional Message for {professional.name}:</Text>
                  <TextInput
                    style={styles.messageInput}
                    value={optionalMessage}
                    onChangeText={setOptionalMessage}
                    placeholder={`e.g., 'Looking forward to discussing my ${selectedProfessionalType === 'lender' ? 'pre-approval' : 'home search'}!'`}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => handleSendConnection(professional)}
                  disabled={isLoading}
                >
                  <Ionicons name="mail" size={20} color="white" />
                  <Text style={styles.connectButtonText}>
                    Connect with {professional.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    padding: 20,
    paddingTop: 0,
    marginTop: -20,
  },
  headerContent: {
    padding: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  securityNote: {
    fontSize: 14,
    color: '#80dac1',
    fontWeight: '600',
  },
  selectionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  professionalCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  professionalGradient: {
    padding: 24,
  },
  professionalContent: {
    alignItems: 'center',
  },
  professionalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  professionalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  detailsSection: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0077b6',
    marginLeft: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  zipCodeInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#0077b6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
    borderRadius: 10,
    animation: 'spin 1s linear infinite',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  professionalsList: {
    gap: 20,
  },
  professionalDetailCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#0077b6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  professionalHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  professionalImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0077b6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  professionalImageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  professionalRole: {
    fontSize: 14,
    color: '#0077b6',
    fontWeight: '600',
    marginBottom: 2,
  },
  professionalCompany: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  professionalTagline: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  professionalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  specialtiesSection: {
    marginBottom: 16,
  },
  specialtiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0077b6',
  },
  specialtyText: {
    fontSize: 12,
    color: '#0077b6',
    fontWeight: '500',
  },
  documentSharingSection: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#0077b6',
  },
  documentSharingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  documentSharingSubtitle: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 12,
  },
  sharingToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sharingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  sharingOptions: {
    gap: 12,
  },
  downloadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  downloadOptionText: {
    fontSize: 14,
    color: '#0077b6',
    fontWeight: '500',
  },
  emailToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  consentNote: {
    fontSize: 12,
    color: '#dc2626',
    fontStyle: 'italic',
  },
  messageSection: {
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  connectButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConnectScreen; 