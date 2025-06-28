import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Mortgage101Screen = ({ route }) => {
  const {
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
  } = route.params;

  const ExpandableSection = ({ title, content, expanded, onToggle }) => (
    <View style={styles.expandableSection}>
      <TouchableOpacity
        style={styles.expandableHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.expandableTitle}>{title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#374151"
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.expandableContent}>
          <Text style={styles.expandableText}>{content}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mortgage 101</Text>
        <Text style={styles.headerSubtitle}>
          Everything you need to know about mortgages
        </Text>
      </View>

      {/* Content Sections */}
      <View style={styles.content}>
        <ExpandableSection
          title="What is a Mortgage?"
          content="A mortgage is a loan used to purchase real estate. The property itself serves as collateral for the loan. You make monthly payments over a set period (typically 15-30 years) until the loan is fully paid off."
          expanded={whatIsMortgageExpanded}
          onToggle={() => setWhatIsMortgageExpanded(!whatIsMortgageExpanded)}
        />

        <ExpandableSection
          title="Understanding Interest Rates"
          content="Interest rates determine how much you'll pay in addition to the principal loan amount. Lower rates mean lower monthly payments and less total interest paid over the life of the loan."
          expanded={interestRatesExpanded}
          onToggle={() => setInterestRatesExpanded(!interestRatesExpanded)}
        />

        <ExpandableSection
          title="Closing Costs Explained"
          content="Closing costs are fees paid at the end of the home buying process. They typically include loan origination fees, appraisal fees, title insurance, and other administrative costs."
          expanded={closingCostsExpanded}
          onToggle={() => setClosingCostsExpanded(!closingCostsExpanded)}
        />

        <ExpandableSection
          title="Escrow Accounts"
          content="An escrow account holds funds for property taxes and insurance. Your lender collects a portion of these costs with each mortgage payment to ensure they're paid on time."
          expanded={escrowExpanded}
          onToggle={() => setEscrowExpanded(!escrowExpanded)}
        />

        <ExpandableSection
          title="Pre-Approval Process"
          content="Pre-approval is a lender's commitment to loan you a specific amount. It shows sellers you're a serious buyer and helps you understand your budget before house hunting."
          expanded={preApprovalExpanded}
          onToggle={() => setPreApprovalExpanded(!preApprovalExpanded)}
        />

        <ExpandableSection
          title="Fixed vs. Adjustable Rates"
          content="Fixed-rate mortgages have the same interest rate for the entire loan term. Adjustable-rate mortgages (ARMs) have rates that can change periodically, usually starting lower but potentially increasing."
          expanded={fixedVsAdjustableExpanded}
          onToggle={() => setFixedVsAdjustableExpanded(!fixedVsAdjustableExpanded)}
        />

        <ExpandableSection
          title="Credit Score Impact"
          content="Your credit score significantly affects your mortgage rate. Higher scores typically qualify for lower rates, saving thousands over the life of the loan."
          expanded={creditExpanded}
          onToggle={() => setCreditExpanded(!creditExpanded)}
        />

        <ExpandableSection
          title="Down Payment Strategies"
          content="While 20% down payments avoid private mortgage insurance (PMI), many programs allow lower down payments. Consider your savings, monthly budget, and long-term goals when deciding."
          expanded={downPaymentExpanded}
          onToggle={() => setDownPaymentExpanded(!downPaymentExpanded)}
        />

        <ExpandableSection
          title="Debt Reduction Tips"
          content="Lowering your debt-to-income ratio can improve your mortgage terms. Focus on paying off high-interest debt and avoid taking on new debt before applying for a mortgage."
          expanded={debtReductionExpanded}
          onToggle={() => setDebtReductionExpanded(!debtReductionExpanded)}
        />

        <ExpandableSection
          title="Income Optimization"
          content="Stable, verifiable income is crucial for mortgage approval. Lenders prefer consistent employment history and may require additional documentation for variable income sources."
          expanded={incomeOptimizationExpanded}
          onToggle={() => setIncomeOptimizationExpanded(!incomeOptimizationExpanded)}
        />

        <ExpandableSection
          title="Financial Planning FAQ"
          content="How much house can I afford? What emergency fund should I maintain? How do I budget for homeownership costs? These are common questions that require personalized financial planning."
          expanded={financialFaqExpanded}
          onToggle={() => setFinancialFaqExpanded(!financialFaqExpanded)}
        />

        <ExpandableSection
          title="House Hunting FAQ"
          content="What should I look for in a neighborhood? How do I evaluate property condition? What are red flags to watch for? Smart house hunting involves research and patience."
          expanded={searchFaqExpanded}
          onToggle={() => setSearchFaqExpanded(!searchFaqExpanded)}
        />

        <ExpandableSection
          title="Making Offers FAQ"
          content="How do I determine a fair offer price? What contingencies should I include? How do I negotiate effectively? Understanding the offer process can save you money and stress."
          expanded={offerFaqExpanded}
          onToggle={() => setOfferFaqExpanded(!offerFaqExpanded)}
        />

        <ExpandableSection
          title="Long-Term Homeownership"
          content="What maintenance costs should I expect? How do I build equity? When should I consider refinancing? Long-term planning helps maximize your investment."
          expanded={longTermFaqExpanded}
          onToggle={() => setLongTermFaqExpanded(!longTermFaqExpanded)}
        />

        <ExpandableSection
          title="Economic Indicators"
          content="How do interest rates affect the housing market? What economic factors influence home prices? Understanding market conditions helps with timing your purchase."
          expanded={economicIndicatorsExpanded}
          onToggle={() => setEconomicIndicatorsExpanded(!economicIndicatorsExpanded)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  expandableSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  expandableTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  expandableContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  expandableText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default Mortgage101Screen; 