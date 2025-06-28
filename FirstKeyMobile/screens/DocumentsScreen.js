import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DocumentsScreen = ({ route, navigation }) => {
  const {
    uploadedDocuments,
    handleFileUpload,
    handleRemoveDocument,
    handleDownloadDocuments,
    isLoading,
    documentConsent,
    setDocumentConsent,
    user,
    requireLogin
  } = route.params;

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('PERSONAL');

  const requiredDocuments = [
    {
      category: "PERSONAL",
      title: "Personal Identification",
      items: [
        "Government-issued photo ID (Driver's License or Passport)",
        "Social Security Card",
        "Birth Certificate"
      ]
    },
    {
      category: "INCOME",
      title: "Income Verification",
      items: [
        "Last 2 years of W-2s",
        "Last 2 years of tax returns",
        "Last 30 days of pay stubs",
        "Proof of additional income (if applicable)"
      ]
    },
    {
      category: "ASSETS",
      title: "Asset Documentation",
      items: [
        "Last 2 months of bank statements",
        "Investment account statements",
        "Retirement account statements",
        "Gift letter (if using gift funds)"
      ]
    },
    {
      category: "DEBTS",
      title: "Debt Information",
      items: [
        "Credit card statements",
        "Auto loan statements",
        "Student loan statements",
        "Other debt obligations"
      ]
    },
    {
      category: "PROPERTY",
      title: "Property Information",
      items: [
        "Purchase agreement (if under contract)",
        "Homeowners insurance quote",
        "Property tax information"
      ]
    }
  ];

  const determineDocumentCategory = (fileName) => {
    const lowerFileName = fileName.toLowerCase();
    if (lowerFileName.includes('id') || lowerFileName.includes('passport') || lowerFileName.includes('license')) {
      return 'PERSONAL';
    } else if (lowerFileName.includes('pay') || lowerFileName.includes('w2') || lowerFileName.includes('tax')) {
      return 'INCOME';
    } else if (lowerFileName.includes('bank') || lowerFileName.includes('statement') || lowerFileName.includes('investment')) {
      return 'ASSETS';
    } else if (lowerFileName.includes('credit') || lowerFileName.includes('debt') || lowerFileName.includes('loan')) {
      return 'DEBTS';
    } else if (lowerFileName.includes('property') || lowerFileName.includes('home') || lowerFileName.includes('insurance')) {
      return 'PROPERTY';
    }
    return 'PERSONAL';
  };

  const handleFilePicker = async () => {
    if (!user) {
      requireLogin(() => {
        setShowUploadModal(true);
      });
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const files = result.assets.map(asset => ({
          name: asset.name,
          size: asset.size,
          uri: asset.uri,
          category: determineDocumentCategory(asset.name),
          content: `This is simulated content for document: ${asset.name}. Real content would be here.`
        }));
        
        handleFileUpload(files);
        setShowUploadModal(false);
        Alert.alert('Success', `${files.length} document(s) uploaded successfully!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick documents. Please try again.');
    }
  };

  const handleRemoveDocumentLocal = (fileName) => {
    Alert.alert(
      'Remove Document',
      `Are you sure you want to remove "${fileName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            handleRemoveDocument(fileName);
            Alert.alert('Success', 'Document removed successfully!');
          }
        }
      ]
    );
  };

  const handleDownloadAll = async () => {
    if (uploadedDocuments.length === 0) {
      Alert.alert('No Documents', 'No documents uploaded to download.');
      return;
    }

    try {
      await handleDownloadDocuments();
    } catch (error) {
      Alert.alert('Error', 'Failed to download documents. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category) => {
    const colors = {
      PERSONAL: '#3b82f6',
      INCOME: '#10b981',
      ASSETS: '#f59e0b',
      DEBTS: '#ef4444',
      PROPERTY: '#8b5cf6'
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      PERSONAL: 'person',
      INCOME: 'cash',
      ASSETS: 'wallet',
      DEBTS: 'card',
      PROPERTY: 'home'
    };
    return icons[category] || 'document';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Title */}
      <Text style={styles.mainTitle}>Document Management</Text>
      
      {/* Header Content */}
      <View style={styles.headerContent}>
        <Text style={styles.headerSubtitle}>
          Upload and manage your documents securely.
        </Text>
        <Text style={styles.securityNote}>
          Your information is always private and secure.
        </Text>
      </View>

      {/* Required Documents Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Documents</Text>
        <Text style={styles.sectionSubtitle}>
          Here's what you'll need to gather for your mortgage application:
        </Text>

        {requiredDocuments.map((category, index) => (
          <View key={index} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category.category) }]}>
                <Ionicons name={getCategoryIcon(category.category)} size={20} color="white" />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.categoryItems}>
              {category.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.categoryItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.categoryItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Upload Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Documents</Text>
        
        {user ? (
          <View style={styles.uploadSection}>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => setShowUploadModal(true)}
            >
              <Ionicons name="cloud-upload" size={32} color="#0077b6" />
              <Text style={styles.uploadButtonText}>Select Documents</Text>
              <Text style={styles.uploadButtonSubtext}>
                PDF, Word, or Image files
              </Text>
            </TouchableOpacity>

            {uploadedDocuments.length > 0 && (
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={handleDownloadAll}
                disabled={isLoading}
              >
                <Ionicons name="download" size={20} color="white" />
                <Text style={styles.downloadButtonText}>
                  {isLoading ? 'Processing...' : 'Download All Documents'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.loginSection}>
            <View style={styles.loginCard}>
              <Ionicons name="lock-closed" size={48} color="#6b7280" />
              <Text style={styles.loginTitle}>Login Required</Text>
              <Text style={styles.loginSubtitle}>
                Please log in to upload or download documents
              </Text>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => requireLogin()}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Uploaded Documents Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uploaded Documents</Text>
        
        {uploadedDocuments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateText}>No documents uploaded yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Upload your documents to get started
            </Text>
          </View>
        ) : (
          <View style={styles.documentsList}>
            {uploadedDocuments.map((doc, index) => (
              <View key={index} style={styles.documentCard}>
                <View style={styles.documentInfo}>
                  <View style={styles.documentHeader}>
                    <Ionicons name="document" size={24} color={getCategoryColor(doc.category)} />
                    <View style={styles.documentDetails}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <View style={styles.documentMeta}>
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(doc.category) }]}>
                          <Text style={styles.categoryBadgeText}>{doc.category}</Text>
                        </View>
                        <Text style={styles.documentSize}>{formatFileSize(doc.size)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.documentActions}>
                  <View style={styles.consentToggle}>
                    <Text style={styles.consentLabel}>Share</Text>
                    <Switch
                      value={documentConsent[doc.name] || false}
                      onValueChange={(value) => setDocumentConsent(prev => ({
                        ...prev,
                        [doc.name]: value
                      }))}
                      trackColor={{ false: '#d1d5db', true: '#0077b6' }}
                      thumbColor={documentConsent[doc.name] ? '#ffffff' : '#f4f3f4'}
                    />
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveDocumentLocal(doc.name)}
                  >
                    <Ionicons name="trash" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Documents</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Select the type of documents you're uploading:
            </Text>
            
            <View style={styles.categorySelector}>
              {requiredDocuments.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category.category && styles.categoryOptionSelected
                  ]}
                  onPress={() => setSelectedCategory(category.category)}
                >
                  <View style={[
                    styles.categoryOptionIcon,
                    { backgroundColor: getCategoryColor(category.category) }
                  ]}>
                    <Ionicons 
                      name={getCategoryIcon(category.category)} 
                      size={20} 
                      color="white" 
                    />
                  </View>
                  <Text style={[
                    styles.categoryOptionText,
                    selectedCategory === category.category && styles.categoryOptionTextSelected
                  ]}>
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.uploadActionButton}
              onPress={handleFilePicker}
            >
              <Ionicons name="cloud-upload" size={24} color="white" />
              <Text style={styles.uploadActionButtonText}>
                Select Documents for {requiredDocuments.find(c => c.category === selectedCategory)?.title}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 40,
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
  section: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoryItems: {
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryItemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  uploadSection: {
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#0077b6',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
    marginTop: 8,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  downloadButton: {
    backgroundColor: '#0077b6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    alignItems: 'center',
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#0077b6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  documentsList: {
    gap: 12,
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  documentInfo: {
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  documentSize: {
    fontSize: 12,
    color: '#6b7280',
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  consentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consentLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  removeButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  categorySelector: {
    gap: 12,
    marginBottom: 32,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  categoryOptionSelected: {
    borderColor: '#0077b6',
    backgroundColor: '#f0f9ff',
  },
  categoryOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  categoryOptionTextSelected: {
    color: '#0077b6',
    fontWeight: '600',
  },
  uploadActionButton: {
    backgroundColor: '#0077b6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DocumentsScreen; 