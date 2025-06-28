import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import screens
import HomeScreen from './screens/HomeScreen';
import DocumentsScreen from './screens/DocumentsScreen';
import Mortgage101Screen from './screens/Mortgage101Screen';
import ConnectScreen from './screens/ConnectScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

export default function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Document management state
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentConsent, setDocumentConsent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Connect screen state
  const [userZipCode, setUserZipCode] = useState('');
  const [selectedProfessionalType, setSelectedProfessionalType] = useState(null);
  const [shareDocumentsWithLender, setShareDocumentsWithLender] = useState(false);
  const [consentToEmailDocuments, setConsentToEmailDocuments] = useState(false);
  const [optionalMessage, setOptionalMessage] = useState('');

  // Mortgage Calculator state (lifted up to persist across tabs)
  const [homePrice, setHomePrice] = useState(330000);
  const [downPayment, setDownPayment] = useState(66000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [extraPayment, setExtraPayment] = useState(0);
  const [mainTaxRate, setMainTaxRate] = useState(0.500780 + 0.3051 + 0.1467 + 1.1799);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.8);
  const [insuranceRate, setInsuranceRate] = useState(0.5);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [hoa, setHoa] = useState(0);
  const [cityTaxRate, setCityTaxRate] = useState(0.500780);
  const [countyTaxRate, setCountyTaxRate] = useState(0.3051);
  const [isdTaxRate, setIsdTaxRate] = useState(1.1799);
  const [collegeTaxRate, setCollegeTaxRate] = useState(0.1467);
  const [homesteadExemption, setHomesteadExemption] = useState(100000);
  const [showDTI, setShowDTI] = useState(false);
  const [showDTIGuidelines, setShowDTIGuidelines] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(6500);
  const [monthlyDebt, setMonthlyDebt] = useState(500);
  const [housingExpenses, setHousingExpenses] = useState(0);
  const [otherDebts, setOtherDebts] = useState(500);
  const [dtiPercentage, setDtiPercentage] = useState(10);
  const [frontEndDTI, setFrontEndDTI] = useState(0);
  const [backEndDTI, setBackEndDTI] = useState(10);
  const [activeTab, setActiveTab] = useState('breakdown');
  const [showAmortization, setShowAmortization] = useState(false);
  const [showAllMonths, setShowAllMonths] = useState(false);
  const [amortizationView, setAmortizationView] = useState('graph');

  // Mortgage101 expand/collapse state
  const [whatIsMortgageExpanded, setWhatIsMortgageExpanded] = useState(false);
  const [interestRatesExpanded, setInterestRatesExpanded] = useState(false);
  const [closingCostsExpanded, setClosingCostsExpanded] = useState(false);
  const [escrowExpanded, setEscrowExpanded] = useState(false);
  const [preApprovalExpanded, setPreApprovalExpanded] = useState(false);
  const [fixedVsAdjustableExpanded, setFixedVsAdjustableExpanded] = useState(false);
  const [creditExpanded, setCreditExpanded] = useState(false);
  const [downPaymentExpanded, setDownPaymentExpanded] = useState(false);
  const [debtReductionExpanded, setDebtReductionExpanded] = useState(false);
  const [incomeOptimizationExpanded, setIncomeOptimizationExpanded] = useState(false);
  const [financialFaqExpanded, setFinancialFaqExpanded] = useState(false);
  const [searchFaqExpanded, setSearchFaqExpanded] = useState(false);
  const [offerFaqExpanded, setOfferFaqExpanded] = useState(false);
  const [longTermFaqExpanded, setLongTermFaqExpanded] = useState(false);
  const [economicIndicatorsExpanded, setEconomicIndicatorsExpanded] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Helper functions
  const showCustomModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleFileUpload = (files) => {
    const newDocs = files.map(file => ({
      name: file.name,
      size: file.size,
      category: determineDocumentCategory(file.name),
      content: `This is simulated content for document: ${file.name}. Real content would be here.`
    }));
    setUploadedDocuments(prev => [...prev, ...newDocs]);
  };

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

  const handleRemoveDocument = (fileName) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.name !== fileName));
    setDocumentConsent(prev => {
      const newConsent = { ...prev };
      delete newConsent[fileName];
      return newConsent;
    });
  };

  const handleDownloadDocuments = async () => {
    if (uploadedDocuments.length === 0) {
      showCustomModal("No documents uploaded to download.");
      return;
    }
    setIsLoading(true);
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      showCustomModal("Documents downloaded successfully!");
    } catch (error) {
      showCustomModal("Error downloading documents.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessionalZipCodeSubmit = async () => {
    if (!userZipCode || userZipCode.length !== 5) {
      showCustomModal("Please enter a valid 5-digit zip code.");
      return;
    }
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      showCustomModal("Found professionals in your area!");
    } catch (error) {
      showCustomModal("Error searching for professionals.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendConnectionEmail = async (professionalName) => {
    setIsLoading(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      showCustomModal(`Connection request sent to ${professionalName}!`);
      setSelectedProfessionalType(null);
      setUserZipCode('');
      setOptionalMessage('');
    } catch (error) {
      showCustomModal("Error sending connection request.");
    } finally {
      setIsLoading(false);
    }
  };

  const requireLogin = (callback) => {
    // Simulate login for mobile
    setUser({ id: 'mobile-user', email: 'mobile@example.com' });
    if (callback) callback();
  };

  // Calculate DTI
  const calculateDTI = () => {
    const totalMonthlyDebt = monthlyDebt + otherDebts;
    const totalMonthlyIncome = monthlyIncome;
    const dti = totalMonthlyIncome > 0 ? (totalMonthlyDebt / totalMonthlyIncome) * 100 : 0;
    setDtiPercentage(dti);
    
    const frontEnd = totalMonthlyIncome > 0 ? (housingExpenses / totalMonthlyIncome) * 100 : 0;
    setFrontEndDTI(frontEnd);
    
    const backEnd = totalMonthlyIncome > 0 ? ((housingExpenses + totalMonthlyDebt) / totalMonthlyIncome) * 100 : 0;
    setBackEndDTI(backEnd);
  };

  useEffect(() => {
    calculateDTI();
  }, [monthlyIncome, monthlyDebt, otherDebts, housingExpenses]);

  // Calculate mortgage payments
  const calculateMortgage = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (loanAmount <= 0 || monthlyRate <= 0) return { payment: 0, totalInterest: 0 };
    
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalInterest = (payment * numberOfPayments) - loanAmount;
    
    return { payment, totalInterest };
  };

  const { payment: principalAndInterest, totalInterest } = calculateMortgage();

  // Custom Tab Bar Component with Gradient
  const CustomTabBar = (props) => (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={['#80dac1', '#5cb0ec']}
        style={styles.tabBarGradient}
      >
        <View style={styles.tabBarContent}>
          {props.state.routes.map((route, index) => {
            const { options } = props.descriptors[route.key];
            const label = options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

            const isFocused = props.state.index === index;

            const onPress = () => {
              const event = props.navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                props.navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              props.navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            let iconName;
            if (route.name === 'Home') {
              iconName = isFocused ? 'home' : 'home-outline';
            } else if (route.name === 'Documents') {
              iconName = isFocused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Learn') {
              iconName = isFocused ? 'school' : 'school-outline';
            } else if (route.name === 'Connect') {
              iconName = isFocused ? 'people' : 'people-outline';
            }

            return (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.tabButton,
                  isFocused && styles.tabButtonActive
                ]}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <Ionicons
                  name={iconName}
                  size={width > 768 ? 28 : 32}
                  color="white"
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        {/* Header - matches website */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              source={require('./assets/firstkey-logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Documents') {
                  iconName = focused ? 'document-text' : 'document-text-outline';
                } else if (route.name === 'Learn') {
                  iconName = focused ? 'school' : 'school-outline';
                } else if (route.name === 'Connect') {
                  iconName = focused ? 'people' : 'people-outline';
                }

                return <Ionicons name={iconName} size={width > 768 ? 28 : 32} color={color} />;
              },
              tabBarActiveTintColor: '#80dac1',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                height: width > 768 ? 60 : 80,
                paddingBottom: width > 768 ? 8 : 12,
                paddingTop: width > 768 ? 8 : 12,
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
              },
              tabBarLabelStyle: {
                fontSize: width > 768 ? 12 : 14,
                fontWeight: '600',
              },
            })}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              initialParams={{
                homePrice, setHomePrice,
                downPayment, setDownPayment,
                downPaymentPct, setDownPaymentPct,
                loanTerm, setLoanTerm,
                interestRate, setInterestRate,
                extraPayment, setExtraPayment,
                mainTaxRate, setMainTaxRate,
                showAdvanced, setShowAdvanced,
                propertyTaxRate, setPropertyTaxRate,
                insuranceRate, setInsuranceRate,
                pmiRate, setPmiRate,
                hoa, setHoa,
                cityTaxRate, setCityTaxRate,
                countyTaxRate, setCountyTaxRate,
                isdTaxRate, setIsdTaxRate,
                collegeTaxRate, setCollegeTaxRate,
                homesteadExemption, setHomesteadExemption,
                showDTI, setShowDTI,
                monthlyIncome, setMonthlyIncome,
                monthlyDebt, setMonthlyDebt,
                housingExpenses, setHousingExpenses,
                otherDebts, setOtherDebts,
                dtiPercentage, setDtiPercentage,
                frontEndDTI, setFrontEndDTI,
                backEndDTI, setBackEndDTI,
                activeTab, setActiveTab,
                showAmortization, setShowAmortization,
                showAllMonths, setShowAllMonths,
                amortizationView, setAmortizationView,
                principalAndInterest,
                totalInterest,
                showCustomModal
              }}
            />
            <Tab.Screen 
              name="Documents" 
              component={DocumentsScreen}
              initialParams={{
                uploadedDocuments,
                handleFileUpload,
                handleRemoveDocument,
                handleDownloadDocuments,
                isLoading,
                documentConsent,
                setDocumentConsent,
                user,
                requireLogin
              }}
            />
            <Tab.Screen 
              name="Learn" 
              component={Mortgage101Screen}
              initialParams={{
                whatIsMortgageExpanded, setWhatIsMortgageExpanded,
                interestRatesExpanded, setInterestRatesExpanded,
                closingCostsExpanded, setClosingCostsExpanded,
                escrowExpanded, setEscrowExpanded,
                preApprovalExpanded, setPreApprovalExpanded,
                fixedVsAdjustableExpanded, setFixedVsAdjustableExpanded,
                creditExpanded, setCreditExpanded,
                downPaymentExpanded, setDownPaymentExpanded,
                debtReductionExpanded, setDebtReductionExpanded,
                incomeOptimizationExpanded, setIncomeOptimizationExpanded,
                financialFaqExpanded, setFinancialFaqExpanded,
                searchFaqExpanded, setSearchFaqExpanded,
                offerFaqExpanded, setOfferFaqExpanded,
                longTermFaqExpanded, setLongTermFaqExpanded,
                economicIndicatorsExpanded, setEconomicIndicatorsExpanded,
              }}
            />
            <Tab.Screen 
              name="Connect" 
              component={ConnectScreen}
              initialParams={{
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
              }}
            />
          </Tab.Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 180,
    marginBottom: 0,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: width > 768 ? 60 : 80,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabBarGradient: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: width > 768 ? 12 : 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 4,
  },
});
