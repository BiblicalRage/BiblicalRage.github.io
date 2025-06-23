import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Switch,
  Modal,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ route, navigation }) => {
  const {
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
  } = route.params;

  const [showDTIGuidelines, setShowDTIGuidelines] = useState(false);
  const [showAmortizationModal, setShowAmortizationModal] = useState(false);

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

  const { payment: principalAndInterestCalc, totalInterest: totalInterestCalc } = calculateMortgage();

  // Calculate additional costs
  const propertyTax = (homePrice * propertyTaxRate / 100) / 12;
  const insurance = (homePrice * insuranceRate / 100) / 12;
  const pmi = downPaymentPct < 20 ? (homePrice * pmiRate / 100) / 12 : 0;
  const totalMonthlyPayment = principalAndInterestCalc + propertyTax + insurance + pmi + hoa;

  // Calculate DTI
  const calculateDTI = () => {
    const totalMonthlyDebt = monthlyDebt + otherDebts;
    const totalMonthlyIncome = monthlyIncome;
    const dti = totalMonthlyIncome > 0 ? (totalMonthlyDebt / totalMonthlyIncome) * 100 : 0;
    
    const frontEnd = totalMonthlyIncome > 0 ? (totalMonthlyPayment / totalMonthlyIncome) * 100 : 0;
    const backEnd = totalMonthlyIncome > 0 ? ((totalMonthlyPayment + totalMonthlyDebt) / totalMonthlyIncome) * 100 : 0;
    
    return { dti, frontEnd, backEnd };
  };

  const { dti, frontEnd, backEnd } = calculateDTI();

  // Generate amortization schedule
  const generateAmortizationSchedule = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const schedule = [];
    let balance = loanAmount;

    for (let i = 1; i <= Math.min(numberOfPayments, showAllMonths ? numberOfPayments : 12); i++) {
      const interest = balance * monthlyRate;
      let principal = principalAndInterestCalc - interest + extraPayment;
      if (principal > balance) principal = balance;
      balance -= principal;

      schedule.push({
        month: i,
        payment: principalAndInterestCalc + extraPayment,
        principal: principal > 0 ? principal : 0,
        interest: interest > 0 ? interest : 0,
        balance: balance > 0 ? balance : 0,
      });

      if (balance <= 0) break;
    }

    return schedule;
  };

  const amortizationSchedule = generateAmortizationSchedule();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Get DTI status
  const getDTIStatus = (dti) => {
    if (dti <= 28) return { status: 'Excellent', color: '#10b981' };
    if (dti <= 36) return { status: 'Good', color: '#f59e0b' };
    if (dti <= 43) return { status: 'Fair', color: '#f59e0b' };
    return { status: 'Poor', color: '#ef4444' };
  };

  const frontEndStatus = getDTIStatus(frontEnd);
  const backEndStatus = getDTIStatus(backEnd);

  const handleSearchForHome = () => {
    Linking.openURL('https://portal.onehome.com/en-US/properties/map?searchId=new-search&token=eyJPU04iOiJOVFIiLCJ0eXBlIjoiMSIsInNldGlkIjoiNDY0MjUxNCIsInNldGtleSI6Ijg2MyIsImVtYWlsIjoiamVmZl9sZXZlc3F1ZUByb2NrZXRtYWlsLmNvbSIsInJlc291cmNlaWQiOjAsImFnZW50aWQiOjExMTA3NSwiaXNkZWx0YSI6ZmFsc2UsIlZpZXdNb2RlIjoiMSJ9&defaultId=15152313-7125-3ca8-a011-e28f5cf4bc66');
  };

  const handleHomePriceChange = (value) => {
    const numericValue = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
    setHomePrice(numericValue);
    const newDownPayment = (numericValue * downPaymentPct) / 100;
    setDownPayment(newDownPayment);
  };

  const handleDownPaymentChange = (value) => {
    const numericValue = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
    setDownPayment(numericValue);
    const newPercentage = homePrice > 0 ? (numericValue / homePrice) * 100 : 0;
    setDownPaymentPct(newPercentage);
  };

  const handleDownPaymentPctChange = (value) => {
    const numericValue = parseFloat(value) || 0;
    setDownPaymentPct(numericValue);
    const newDownPayment = (homePrice * numericValue) / 100;
    setDownPayment(newDownPayment);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Title */}
      <Text style={styles.mainTitle}>Your Key to Confident Homeownership</Text>
      
      {/* Search for a Home Button */}
      <View style={styles.searchSection}>
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Ready to Find Your Dream Home?</Text>
          <Text style={styles.searchSubtitle}>
            Explore available properties in your area with our trusted partner
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchForHome}
          >
            <Text style={styles.searchButtonText}>Search for a Home</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mortgage Calculator Section */}
      <View style={styles.calculatorSection}>
        <Text style={styles.calculatorTitle}>Your Personalized Readiness Report</Text>
        <Text style={styles.calculatorSubtitle}>
          Input your details below to instantly generate your personalized homebuyer readiness assessment.{'\n'}
          <Text style={styles.boldText}>Score based on your self-reported data. Estimates only, not a guarantee of pre-approval.</Text>
        </Text>
        
        {/* Basic Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Home Price</Text>
          <TextInput
            style={styles.input}
            value={formatCurrency(homePrice).replace('$', '')}
            onChangeText={handleHomePriceChange}
            keyboardType="numeric"
            placeholder="330,000"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Down Payment</Text>
          <View style={styles.downPaymentRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              value={formatCurrency(downPayment).replace('$', '')}
              onChangeText={handleDownPaymentChange}
              keyboardType="numeric"
              placeholder="66,000"
            />
            <TextInput
              style={[styles.input, { width: 80 }]}
              value={downPaymentPct.toString()}
              onChangeText={handleDownPaymentPctChange}
              keyboardType="numeric"
              placeholder="20"
            />
            <Text style={styles.percentLabel}>%</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Loan Term</Text>
          <View style={styles.termButtons}>
            {[15, 20, 30].map((term) => (
              <TouchableOpacity
                key={term}
                style={[
                  styles.termButton,
                  loanTerm === term && styles.termButtonActive
                ]}
                onPress={() => setLoanTerm(term)}
              >
                <Text style={[
                  styles.termButtonText,
                  loanTerm === term && styles.termButtonTextActive
                ]}>
                  {term} years
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Interest Rate</Text>
          <TextInput
            style={styles.input}
            value={interestRate.toString()}
            onChangeText={(value) => setInterestRate(parseFloat(value) || 0)}
            keyboardType="numeric"
            placeholder="6.5"
          />
          <Text style={styles.percentLabel}>%</Text>
        </View>

        {/* Advanced Toggle */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>Advanced Options</Text>
          <Ionicons
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#0077b6"
          />
        </TouchableOpacity>

        {/* Advanced Options */}
        {showAdvanced && (
          <View style={styles.advancedSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Property Tax Rate</Text>
              <TextInput
                style={styles.input}
                value={propertyTaxRate.toString()}
                onChangeText={(value) => setPropertyTaxRate(parseFloat(value) || 0)}
                keyboardType="numeric"
                placeholder="1.8"
              />
              <Text style={styles.percentLabel}>%</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Insurance Rate</Text>
              <TextInput
                style={styles.input}
                value={insuranceRate.toString()}
                onChangeText={(value) => setInsuranceRate(parseFloat(value) || 0)}
                keyboardType="numeric"
                placeholder="0.5"
              />
              <Text style={styles.percentLabel}>%</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>HOA Fees (Monthly)</Text>
              <TextInput
                style={styles.input}
                value={hoa.toString()}
                onChangeText={(value) => setHoa(parseFloat(value) || 0)}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Extra Monthly Payment</Text>
              <TextInput
                style={styles.input}
                value={extraPayment.toString()}
                onChangeText={(value) => setExtraPayment(parseFloat(value) || 0)}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>
        )}

        {/* DTI Toggle */}
        <TouchableOpacity
          style={styles.dtiToggle}
          onPress={() => setShowDTI(!showDTI)}
        >
          <Text style={styles.dtiToggleText}>Debt-to-Income Analysis</Text>
          <Ionicons
            name={showDTI ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#0077b6"
          />
        </TouchableOpacity>

        {/* DTI Section */}
        {showDTI && (
          <View style={styles.dtiSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Income</Text>
              <TextInput
                style={styles.input}
                value={monthlyIncome.toString()}
                onChangeText={(value) => setMonthlyIncome(parseFloat(value) || 0)}
                keyboardType="numeric"
                placeholder="6500"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Debt Payments</Text>
              <TextInput
                style={styles.input}
                value={monthlyDebt.toString()}
                onChangeText={(value) => setMonthlyDebt(parseFloat(value) || 0)}
                keyboardType="numeric"
                placeholder="500"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Other Monthly Debts</Text>
              <TextInput
                style={styles.input}
                value={otherDebts.toString()}
                onChangeText={(value) => setOtherDebts(parseFloat(value) || 0)}
                keyboardType="numeric"
                placeholder="500"
              />
            </View>

            {/* DTI Guidelines Toggle */}
            <TouchableOpacity
              style={styles.guidelinesToggle}
              onPress={() => setShowDTIGuidelines(!showDTIGuidelines)}
            >
              <Text style={styles.guidelinesToggleText}>DTI Guidelines</Text>
              <Ionicons
                name={showDTIGuidelines ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#0077b6"
              />
            </TouchableOpacity>

            {showDTIGuidelines && (
              <View style={styles.guidelinesSection}>
                <Text style={styles.guidelinesTitle}>Debt-to-Income Guidelines:</Text>
                <Text style={styles.guidelinesText}>• Front-end DTI: ≤28% (Excellent)</Text>
                <Text style={styles.guidelinesText}>• Back-end DTI: ≤36% (Excellent)</Text>
                <Text style={styles.guidelinesText}>• Maximum DTI: ≤43% (Conventional)</Text>
                <Text style={styles.guidelinesText}>• FHA Maximum: ≤50% (with conditions)</Text>
              </View>
            )}
          </View>
        )}

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Your Mortgage Breakdown</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Principal & Interest</Text>
            <Text style={styles.resultValue}>{formatCurrency(principalAndInterestCalc)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Property Tax</Text>
            <Text style={styles.resultValue}>{formatCurrency(propertyTax)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Insurance</Text>
            <Text style={styles.resultValue}>{formatCurrency(insurance)}</Text>
          </View>

          {pmi > 0 && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>PMI</Text>
              <Text style={styles.resultValue}>{formatCurrency(pmi)}</Text>
            </View>
          )}

          {hoa > 0 && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>HOA</Text>
              <Text style={styles.resultValue}>{formatCurrency(hoa)}</Text>
            </View>
          )}

          <View style={[styles.resultCard, styles.totalCard]}>
            <Text style={styles.totalLabel}>Total Monthly Payment</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalMonthlyPayment)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total Interest Paid</Text>
            <Text style={styles.resultValue}>{formatCurrency(totalInterestCalc)}</Text>
          </View>
        </View>

        {/* DTI Results */}
        {showDTI && (
          <View style={styles.dtiResultsSection}>
            <Text style={styles.dtiResultsTitle}>Debt-to-Income Analysis</Text>
            
            <View style={styles.dtiResultCard}>
              <Text style={styles.dtiResultLabel}>Front-end DTI</Text>
              <View style={styles.dtiResultRow}>
                <Text style={styles.dtiResultValue}>{formatPercentage(frontEnd)}</Text>
                <View style={[styles.dtiStatusBadge, { backgroundColor: frontEndStatus.color }]}>
                  <Text style={styles.dtiStatusText}>{frontEndStatus.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.dtiResultCard}>
              <Text style={styles.dtiResultLabel}>Back-end DTI</Text>
              <View style={styles.dtiResultRow}>
                <Text style={styles.dtiResultValue}>{formatPercentage(backEnd)}</Text>
                <View style={[styles.dtiStatusBadge, { backgroundColor: backEndStatus.color }]}>
                  <Text style={styles.dtiStatusText}>{backEndStatus.status}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Amortization Toggle */}
        <TouchableOpacity
          style={styles.amortizationToggle}
          onPress={() => setShowAmortizationModal(true)}
        >
          <Text style={styles.amortizationToggleText}>View Amortization Schedule</Text>
          <Ionicons name="chevron-forward" size={20} color="#0077b6" />
        </TouchableOpacity>
      </View>

      {/* Amortization Modal */}
      <Modal
        visible={showAmortizationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Amortization Schedule</Text>
            <TouchableOpacity onPress={() => setShowAmortizationModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.amortizationHeader}>
              <Text style={styles.amortizationHeaderText}>Month</Text>
              <Text style={styles.amortizationHeaderText}>Payment</Text>
              <Text style={styles.amortizationHeaderText}>Principal</Text>
              <Text style={styles.amortizationHeaderText}>Interest</Text>
              <Text style={styles.amortizationHeaderText}>Balance</Text>
            </View>
            
            {amortizationSchedule.map((row, index) => (
              <View key={index} style={styles.amortizationRow}>
                <Text style={styles.amortizationCell}>{row.month}</Text>
                <Text style={styles.amortizationCell}>{formatCurrency(row.payment)}</Text>
                <Text style={styles.amortizationCell}>{formatCurrency(row.principal)}</Text>
                <Text style={styles.amortizationCell}>{formatCurrency(row.interest)}</Text>
                <Text style={styles.amortizationCell}>{formatCurrency(row.balance)}</Text>
              </View>
            ))}
          </ScrollView>
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
    fontSize: 18,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 24,
    marginTop: -20,
    paddingHorizontal: 20,
  },
  searchSection: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  searchCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    alignItems: 'center',
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  searchSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  calculatorSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    margin: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  calculatorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  calculatorSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  downPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  termButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  termButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  termButtonActive: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },
  termButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  termButtonTextActive: {
    color: 'white',
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  advancedToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
  },
  advancedSection: {
    marginTop: 8,
  },
  dtiToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  dtiToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
  },
  dtiSection: {
    marginTop: 8,
  },
  guidelinesToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  guidelinesToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0077b6',
  },
  guidelinesSection: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  guidelinesText: {
    fontSize: 12,
    color: '#1e40af',
    marginBottom: 2,
  },
  resultsSection: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalCard: {
    borderBottomWidth: 2,
    borderBottomColor: '#0077b6',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077b6',
  },
  dtiResultsSection: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dtiResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  dtiResultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dtiResultLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  dtiResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dtiResultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  dtiStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dtiStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  amortizationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  amortizationToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
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
  amortizationHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  amortizationHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  amortizationRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  amortizationCell: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  calculatorPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default HomeScreen; 