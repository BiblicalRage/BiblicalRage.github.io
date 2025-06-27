import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Custom Modal Component for better user feedback
const CustomModal = ({ visible, message, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 m-5 max-w-sm w-full flex flex-col items-center">
        <p className="mb-6 text-center text-slate-700 text-base">{message}</p>
        <button
          className="btn w-full"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format percentage
const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

// Helper function to format tax rate to max 5 decimal places
const formatTaxRate = (value) => {
  return Number(value).toFixed(5).replace(/\.?0+$/, '');
};

// Helper function to format numbers with International System of Numeration
const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(number);
};

// Helper function to parse formatted number back to raw number
const parseFormattedNumber = (formattedString) => {
  return Number(formattedString.replace(/,/g, ''));
};

// Info icon with tooltip
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <span
        className="text-slate-400 hover:text-slate-500 cursor-pointer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
        role="button"
        aria-label="Info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </span>
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm text-slate-600">
          {text}
        </div>
      )}
    </span>
  );
};

const COLORS = ["#0077b6", "#6d28d9", "#10b981", "#f59e42", "#facc15"];

function generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfPayments, principalAndInterest, extraPayment = 0) {
  let balance = loanAmount;
  const schedule = [];
  let totalInterest = 0;
  let payoffMonth = 0;
  for (let i = 1; i <= numberOfPayments; i++) {
    const interest = balance * monthlyInterestRate;
    let principal = principalAndInterest - interest + extraPayment;
    if (principal > balance) principal = balance;
    balance -= principal;
    totalInterest += interest > 0 ? interest : 0;
    schedule.push({
      month: i,
      payment: principalAndInterest + extraPayment,
      principal: principal > 0 ? principal : 0,
      interest: interest > 0 ? interest : 0,
      balance: balance > 0 ? balance : 0,
    });
    if (balance <= 0) {
      payoffMonth = i;
        break;
    }
  }
  return { schedule, totalInterest, payoffMonth };
}

// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, className, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left border border-slate-300 rounded-lg bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
        style={style}
      >
        <span>{selectedOption ? selectedOption.label : 'Select...'}</span>
        <svg
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                option.value === selectedValue ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Formatted Number Input Component
const FormattedNumberInput = ({ value, onChange, min, max, step, className, style, placeholder, disabled }) => {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  const [isEditing, setIsEditing] = useState(false);

  // Update display value when prop value changes
  useEffect(() => {
    if (!isEditing) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setDisplayValue(value.toString());
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsedValue = parseFormattedNumber(displayValue);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      onChange(parsedValue);
      setDisplayValue(formatNumber(parsedValue));
    } else {
      setDisplayValue(formatNumber(value));
    }
  };

  const handleChange = (e) => {
    let inputValue = e.target.value.replace(/[^\d]/g, '');
    // Remove leading zeros except for single zero
    if (inputValue.length > 1 && inputValue.startsWith('0')) {
      inputValue = inputValue.replace(/^0+/, '');
    }
    // If empty or just zeros, set to 0
    if (inputValue === '' || inputValue === '0') {
      inputValue = '0';
    }
    setDisplayValue(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      min={min}
      max={max}
      step={step}
      className={className}
      style={style}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

// Custom Tax Rate Input Component for decimal values
const TaxRateInput = ({ value, onChange, min, max, step, className, style, placeholder, disabled }) => {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Update display value when prop value changes
  useEffect(() => {
    if (!isEditing) {
      setDisplayValue(value.toString());
    }
  }, [value, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setDisplayValue(value.toString());
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsedValue = parseFloat(displayValue);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      onChange(parsedValue);
      setDisplayValue(parsedValue.toString());
    } else {
      setDisplayValue(value.toString());
    }
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setDisplayValue(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      min={min}
      max={max}
      step={step}
      className={className}
      style={style}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

const MortgageCalculator = ({
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
  showDTIGuidelines, setShowDTIGuidelines,
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
  amortizationView, setAmortizationView
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState('monthly'); // 'monthly' or 'biweekly'

  // Keep down payment and percent in sync
  const handleHomePriceChange = (value) => {
    setHomePrice(value);
    setDownPayment(Math.round((downPaymentPct / 100) * value));
  };
  const handleDownPaymentChange = (value) => {
    setDownPayment(value);
    setDownPaymentPct(Math.round((value / homePrice) * 100));
  };
  const handleDownPaymentPctChange = (value) => {
    setDownPaymentPct(value);
    setDownPayment(Math.round((value / 100) * homePrice));
  };

  // Calculations
  // Tax breakdown calculations
  const totalTaxRate = cityTaxRate + countyTaxRate + isdTaxRate + collegeTaxRate;
  const appraisedValue = homePrice;
  const taxableValue = Math.max(appraisedValue - homesteadExemption, 0);
  const annualTaxes = taxableValue * (totalTaxRate / 100);
  const propertyTaxes = annualTaxes / 12;

  const loanAmount = homePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  let principalAndInterest = 0;
  if (monthlyInterestRate > 0) {
    const compound = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    principalAndInterest = loanAmount * (monthlyInterestRate * compound) / (compound - 1);
  } else {
    principalAndInterest = loanAmount / numberOfPayments;
  }
  const homeInsurance = (homePrice * (insuranceRate / 100)) / 12;
  const pmi = (downPaymentPct < 20) ? (loanAmount * (pmiRate / 100)) / 12 : 0;
  const requiredMonthlyPayment = principalAndInterest + propertyTaxes + homeInsurance + pmi + hoa;
  const totalMonthly = requiredMonthlyPayment + Number(extraPayment);

  const breakdownData = [
    { name: "Principal & Interest", value: principalAndInterest },
    { name: "Property Taxes", value: propertyTaxes },
    { name: "PMI", value: pmi },
    { name: "Home Insurance", value: homeInsurance },
    { name: "HOA Fees", value: hoa },
    { name: "Extra Payment", value: Number(extraPayment) },
  ];

  // Amortization schedule (principal & interest + extra payment)
  const { schedule: amortization, totalInterest, payoffMonth } = generateAmortizationSchedule(
    loanAmount,
    monthlyInterestRate,
    numberOfPayments,
    principalAndInterest,
    Number(extraPayment)
  );

  // For comparison: total interest and payoff with no extra payment
  const { totalInterest: baseInterest, payoffMonth: basePayoffMonth } = generateAmortizationSchedule(
    loanAmount,
    monthlyInterestRate,
    numberOfPayments,
    principalAndInterest,
    0
  );

  // Generate base amortization schedule for comparison
  const { schedule: baseAmortization } = generateAmortizationSchedule(
    loanAmount,
    monthlyInterestRate,
    numberOfPayments,
    principalAndInterest,
    0
  );

  // Calculate biweekly amortization for comparison
  const biweeklyExtraPayment = (principalAndInterest / 12) + Number(extraPayment); // Biweekly extra + additional payments
  const { schedule: biweeklyAmortization, totalInterest: biweeklyTotalInterest, payoffMonth: biweeklyPayoffMonth } = generateAmortizationSchedule(
    loanAmount,
    monthlyInterestRate,
    numberOfPayments,
    principalAndInterest,
    biweeklyExtraPayment
  );

  // Use selected schedule for display
  const displayAmortization = selectedSchedule === 'biweekly' ? biweeklyAmortization : amortization;
  const displayTotalInterest = selectedSchedule === 'biweekly' ? biweeklyTotalInterest : totalInterest;
  const displayPayoffMonth = selectedSchedule === 'biweekly' ? biweeklyPayoffMonth : payoffMonth;

  const interestSaved = baseInterest - displayTotalInterest;
  const monthsSaved = basePayoffMonth - displayPayoffMonth;

  // DTI Calculations
  const calculateDTI = () => {
    if (monthlyIncome > 0) {
      // Front-end DTI: required housing payment / monthly income
      const frontEnd = (requiredMonthlyPayment / monthlyIncome) * 100;
      
      // Back-end DTI: (required housing payment + other debts) / monthly income
      const backEnd = ((requiredMonthlyPayment + otherDebts) / monthlyIncome) * 100;
      
      setDtiPercentage(backEnd);
      setFrontEndDTI(frontEnd);
      setBackEndDTI(backEnd);
      return { frontEndDTI: frontEnd, backEndDTI: backEnd };
    }
    setDtiPercentage(0);
    setFrontEndDTI(0);
    setBackEndDTI(0);
    return { frontEndDTI: 0, backEndDTI: 0 };
  };

  const getDTIStatus = (dti) => {
    if (dti <= 28) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (dti <= 36) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (dti <= 43) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (dti <= 50) return { status: 'Poor', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { status: 'Very Poor', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  // Pre-qualification calculator
  const calculatePreQualification = () => {
    if (monthlyIncome <= 0) return { maxHomePrice: 0, maxLoanAmount: 0, confidence: 'low' };
    
    // Step 1: Calculate Gross Monthly Income (GMI)
    const gmi = monthlyIncome; // Already in monthly format
    
    // Step 2: Calculate Total Monthly Debt Payments (Non-Housing)
    const totalNonHousingDebt = otherDebts; // User inputs this directly
    
    // Step 3: Determine Max Allowable Total Monthly Debt Payment
    // Using 45% back-end DTI for conventional loans (more realistic than 43%)
    const maxBackEndDTI = 0.45;
    const maxTotalMonthlyDebtPayment = gmi * maxBackEndDTI;
    
    // Step 4: Calculate Max Allowable Monthly Housing Payment
    const maxAllowableHousingPayment = maxTotalMonthlyDebtPayment - totalNonHousingDebt;
    
    if (maxAllowableHousingPayment <= 0) {
      return { 
        maxHomePrice: 0, 
        maxLoanAmount: 0, 
        confidence: 'low',
        reason: 'Your existing debt payments exceed the maximum allowed debt-to-income ratio.'
      };
    }
    
    // Step 5: Break down the Max Allowable Housing Payment (PITI + Extras)
    // We need to estimate taxes, insurance, and PMI to find the max P&I payment
    
    // For this calculation, we'll use an iterative approach with a reasonable starting point
    // Start with the assumption that P&I is about 70% of total housing payment
    let estimatedPandI = maxAllowableHousingPayment * 0.7;
    
    // Use current interest rate and loan term to estimate a starting loan amount
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    let estimatedLoanAmount = 0;
    if (monthlyInterestRate > 0) {
      const compound = Math.pow(1 + monthlyInterestRate, numberOfPayments);
      estimatedLoanAmount = estimatedPandI * (compound - 1) / (monthlyInterestRate * compound);
    } else {
      estimatedLoanAmount = estimatedPandI * numberOfPayments;
    }
    
    // Estimate a starting home price (assuming 5% down payment)
    let estimatedHomePrice = estimatedLoanAmount / 0.95;
    
    // Now calculate the actual monthly costs for this estimated home price
    const estimatedAnnualTaxes = estimatedHomePrice * (totalTaxRate / 100);
    const estimatedMonthlyTaxes = estimatedAnnualTaxes / 12;
    
    const estimatedAnnualInsurance = estimatedHomePrice * (insuranceRate / 100);
    const estimatedMonthlyInsurance = estimatedAnnualInsurance / 12;
    
    // Estimate PMI (0.5% annually for conventional loans with <20% down)
    const downPaymentPct = 0.05; // Assume 5% down for this calculation
    const estimatedMonthlyPMI = downPaymentPct < 0.20 ? (estimatedLoanAmount * 0.005) / 12 : 0;
    
    // Calculate actual P&I payment available
    const actualPandI = maxAllowableHousingPayment - estimatedMonthlyTaxes - estimatedMonthlyInsurance - estimatedMonthlyPMI - hoa;
    
    if (actualPandI <= 0) {
      return { 
        maxHomePrice: 0, 
        maxLoanAmount: 0, 
        confidence: 'low',
        reason: 'After accounting for estimated taxes, insurance, and other costs, no funds remain for principal and interest.'
      };
    }
    
    // Step 6: Calculate Max Loan Amount using the actual P&I payment
    let maxLoanAmount = 0;
    if (monthlyInterestRate > 0) {
      const compound = Math.pow(1 + monthlyInterestRate, numberOfPayments);
      maxLoanAmount = actualPandI * (compound - 1) / (monthlyInterestRate * compound);
    } else {
      maxLoanAmount = actualPandI * numberOfPayments;
    }
    
    // Step 7: Calculate Max Purchase Price
    // Use a reasonable down payment assumption for pre-qualification (5%)
    const assumedDownPaymentPct = 0.05; // 5% down payment
    const maxHomePrice = maxLoanAmount / (1 - assumedDownPaymentPct);
    
    // Calculate actual DTI ratios for confidence assessment
    const actualMonthlyHousingPayment = actualPandI + estimatedMonthlyTaxes + estimatedMonthlyInsurance + estimatedMonthlyPMI + hoa;
    const actualBackEndDTI = ((actualMonthlyHousingPayment + totalNonHousingDebt) / gmi) * 100;
    const actualFrontEndDTI = (actualMonthlyHousingPayment / gmi) * 100;
    
    // Determine confidence level
    let confidence = 'medium';
    let confidenceReason = '';
    
    if (actualBackEndDTI <= 36 && actualFrontEndDTI <= 28) {
      confidence = 'high';
      confidenceReason = 'Your DTI ratios are well within conventional loan guidelines.';
    } else if (actualBackEndDTI <= 45 && actualFrontEndDTI <= 31) {
      confidence = 'medium';
      confidenceReason = 'Your DTI ratios are within FHA guidelines but may need compensating factors for conventional loans.';
    } else {
      confidence = 'low';
      confidenceReason = 'Your DTI ratios exceed standard guidelines. Consider reducing debt or increasing income.';
    }
    
    return {
      maxHomePrice: Math.round(maxHomePrice),
      maxLoanAmount: Math.round(maxLoanAmount),
      confidence,
      confidenceReason,
      actualBackEndDTI: Math.round(actualBackEndDTI * 10) / 10,
      actualFrontEndDTI: Math.round(actualFrontEndDTI * 10) / 10,
      estimatedMonthlyPayment: Math.round(actualMonthlyHousingPayment),
      estimatedDownPayment: Math.round(maxHomePrice * assumedDownPaymentPct)
    };
  };

  // Use pre-qualification DTI for display in DTI section
  const preQualification = calculatePreQualification();
  const dtiStatus = getDTIStatus(preQualification.actualBackEndDTI);

  // Prepare amortization data for display and chart
  const displaySchedule = showAllMonths ? displayAmortization : displayAmortization.slice(0, 12);
  const payoffYear = Math.ceil(displayPayoffMonth / 12);
  
  // For chart comparison, show the selected schedule with and without additional payments
  const selectedScheduleWithoutExtra = selectedSchedule === 'biweekly' 
    ? generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfPayments, principalAndInterest, principalAndInterest / 12).schedule
    : generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfPayments, principalAndInterest, 0).schedule;
  
  const chartData = groupAmortizationByYearFullTerm(displayAmortization, selectedScheduleWithoutExtra, loanTerm, payoffYear);

  // Calculate DTI when income, debt, or housing expenses change
  useEffect(() => {
    calculateDTI();
  }, [monthlyIncome, otherDebts, housingExpenses, totalMonthly]);

  // Helper to group amortization data by year for the graph, always up to full loan term
  function groupAmortizationByYearFullTerm(amortization, baseAmortization, loanTermYears, payoffYear) {
    const years = [];
    // Always show fixed 5-year increments: 1, 5, 10, 15, 20, 25, 30
    const fixedYears = [1, 5, 10, 15, 20, 25, 30];
    
    fixedYears.forEach(year => {
      if (year <= loanTermYears) {
        const monthIdx = year * 12 - 1;
        const extra = amortization[Math.min(monthIdx, amortization.length - 1)] || { balance: 0 };
        const base = baseAmortization[Math.min(monthIdx, baseAmortization.length - 1)] || { balance: 0 };
        years.push({
          year,
          balance: year < payoffYear ? extra.balance : 0,
          originalBalance: base.balance,
          isPayoffYear: year === payoffYear
        });
      }
    });
    return years;
  }

  // Helper to format months as years and months
  function formatYearsMonths(months) {
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    let result = '';
    if (years > 0) result += `${years} year${years > 1 ? 's' : ''}`;
    if (years > 0 && remMonths > 0) result += ', ';
    if (remMonths > 0) result += `${remMonths} month${remMonths > 1 ? 's' : ''}`;
    return result || '0 months';
  }

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-4xl mx-auto bg-white">
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 p-3 md:p-4 lg:p-8">
          {/* Inputs */}
          <div className="w-full flex flex-col gap-4 md:gap-6 lg:gap-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Mortgage Calculator
            </h2>
            
            {/* Debt-to-Income Ratio Section - AT THE TOP */}
            <div className="bg-white rounded-2xl shadow p-3 md:p-4 border border-slate-100">
              <button
                onClick={() => setShowDTI(!showDTI)}
                className="w-full transition duration-200 font-semibold text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-none flex items-center justify-center relative md:rounded-[18px] md:px-[0.75em] md:py-[0.75em] md:text-[1.05rem]"
                style={{
                  borderRadius: '14px',
                  padding: '0.6em 1.2em',
                  background: 'linear-gradient(90deg, #80dac1 0%, #5cb0ec 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                  margin: 0,
                  border: '1.5px solid #000',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'transform 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                Debt-to-Income Ratio Calculator
              </button>
              
              {showDTI && (
                <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                        Monthly Income
                        <InfoTooltip text="Your total monthly income before taxes. Include all sources: salary, bonuses, rental income, etc." />
                      </label>
                      <div className="flex items-center">
                        <span className="text-slate-500 mr-2">$</span>
                        <FormattedNumberInput
                          value={monthlyIncome}
                          onChange={setMonthlyIncome}
                          min={0}
                          max={100000}
                          step={100}
                          className="input w-full text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                          style={{ fontWeight: 600 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                        Current Housing Expenses
                        <InfoTooltip text="Your current monthly housing expenses (rent, utilities, etc.) that will be replaced by the new mortgage payment." />
                      </label>
                      <div className="flex items-center">
                        <span className="text-slate-500 mr-2">$</span>
                        <FormattedNumberInput
                          value={housingExpenses}
                          onChange={setHousingExpenses}
                          min={0}
                          max={10000}
                          step={50}
                          className="input w-full text-base md:text-lg text-right rounded-full border-2 border-[var(--color-accent)]"
                          style={{ fontWeight: 600 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                        Other Monthly Debts
                        <InfoTooltip text="Your total monthly debt payments including credit cards, car loans, student loans, etc. (excluding housing expenses)." />
                      </label>
                      <div className="flex items-center">
                        <span className="text-slate-500 mr-2">$</span>
                        <FormattedNumberInput
                          value={otherDebts}
                          onChange={setOtherDebts}
                          min={0}
                          max={10000}
                          step={50}
                          className="input w-full text-base md:text-lg text-right rounded-full border-2 border-[var(--color-accent)]"
                          style={{ fontWeight: 600 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <div className="w-full">
                        <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                          Total Current Debts
                          <InfoTooltip text="Sum of current housing expenses plus other debts. This represents your current monthly debt obligations." />
                        </label>
                        <div className="flex items-center">
                          <span className="text-slate-500 mr-2">$</span>
                          <input
                            type="number"
                            value={housingExpenses + otherDebts}
                            className="input w-full text-base md:text-lg text-right rounded-full border-2 border-slate-300 bg-slate-50"
                            style={{ fontWeight: 600 }}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pre-Qualification Estimate */}
                  <div className="bg-slate-50 rounded-lg p-3 md:p-4 border border-slate-200 mt-3 md:mt-4">
                    <h4 className="font-semibold text-slate-800 mb-2 md:mb-3 flex items-center gap-1 text-sm md:text-base">
                      Pre-Qualification Estimate
                      <InfoTooltip text="Based on FHA lending guidelines and your current financial profile. This estimate assumes good credit and stable employment." />
                    </h4>
                    
                    {(() => {
                      if (preQualification.maxHomePrice <= 0) {
                        return (
                          <div className="text-center py-4">
                            <p className="text-red-700 font-medium mb-2">Unable to calculate pre-qualification</p>
                            <p className="text-sm text-red-600">
                              {preQualification.reason || 'Your current debt-to-income ratio may be too high for conventional lending. Consider reducing debts or increasing income.'}
                            </p>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="text-center">
                              <span className="text-sm text-slate-600">Likely Pre-Qualification Amount</span>
                              <div className="text-2xl font-bold text-slate-800 mt-1">
                                {formatCurrency(preQualification.maxHomePrice)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Max Loan Amount:</span>
                              <span className="font-semibold">{formatCurrency(preQualification.maxLoanAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Down Payment (5%):</span>
                              <span className="font-semibold">{formatCurrency(preQualification.estimatedDownPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Estimated Monthly Payment:</span>
                              <span className="font-semibold">{formatCurrency(preQualification.estimatedMonthlyPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Back-End DTI:</span>
                              <span className="font-semibold">{preQualification.actualBackEndDTI}%</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-slate-600 bg-slate-100 rounded p-2">
                            <strong>Disclaimer:</strong> This is an estimate based on your inputs only. Actual pre-qualification depends on credit score, employment history, down payment, and other factors. Consult with a qualified lender for accurate pre-qualification.
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Home Price */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                Desired home price
                <InfoTooltip text="The total price of the home you want to purchase. This includes the cost of the property itself." />
              </label>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <input
                  type="range"
                  min={50000}
                  max={2000000}
                  step={1000}
                  value={homePrice}
                  onChange={e => handleHomePriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
                <FormattedNumberInput
                  value={homePrice}
                  onChange={handleHomePriceChange}
                  min={50000}
                  max={2000000}
                  step={1000}
                  className="input w-full md:w-32 text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                  style={{ fontWeight: 600 }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$50,000</span>
                <span>$2,000,000</span>
              </div>
            </div>
            {/* Down Payment */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                Down payment
                <InfoTooltip text="The amount you will pay upfront. 20% is traditional, but many loans allow less." />
              </label>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <input
                  type="range"
                  min={0}
                  max={homePrice}
                  step={1000}
                  value={downPayment}
                  onChange={e => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--color-accent)]"
                />
                <FormattedNumberInput
                  value={downPayment}
                  onChange={handleDownPaymentChange}
                  min={0}
                  max={homePrice}
                  step={1000}
                  className="input w-full md:w-32 text-base md:text-lg text-right rounded-full border-2 border-[var(--color-accent)]"
                  style={{ fontWeight: 600 }}
                />
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-semibold">(</span>
                  <FormattedNumberInput
                    value={downPaymentPct}
                    onChange={handleDownPaymentPctChange}
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-16 text-base md:text-lg text-right border-none bg-transparent text-slate-500 font-semibold focus:outline-none"
                    style={{ fontWeight: 600 }}
                  />
                  <span className="text-slate-500 font-semibold">%)</span>
                </div>
              </div>
            </div>
            {/* Loan Term & Interest Rate */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1">
                <label className="block text-slate-700 font-semibold mb-1 text-sm md:text-base">Loan term</label>
                <CustomDropdown
                  value={loanTerm}
                  onChange={setLoanTerm}
                  options={[
                    { value: 10, label: '10 years' },
                    { value: 15, label: '15 years' },
                    { value: 20, label: '20 years' },
                    { value: 30, label: '30 years' },
                  ]}
                  className="w-full"
                  style={{ fontWeight: 600 }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                  Interest rate
                  <InfoTooltip text="The annual interest rate for your mortgage. This affects your monthly payment and total interest paid." />
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={2}
                    max={10}
                    step={0.01}
                    value={interestRate}
                    onChange={e => setInterestRate(Number(e.target.value))}
                    className="input w-full text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                    style={{ fontWeight: 600 }}
                  />
                  <span className="text-slate-500 ml-2">%</span>
                </div>
              </div>
            </div>
            {/* Tax Rate (main, non-advanced) */}
            <div className="mt-3 md:mt-4">
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                Tax Rate
                <InfoTooltip text="The total property tax rate as a percentage. Adjust in advanced options for more detail." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.000001}
                  value={formatTaxRate(mainTaxRate)}
                  onChange={e => setMainTaxRate(Number(e.target.value))}
                  className="input w-full text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                  style={{ fontWeight: 600 }}
                  disabled={showAdvanced}
                />
                <span className="text-slate-500 ml-2">%</span>
              </div>
            </div>
            {/* Advanced Options */}
            <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full transition duration-200 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-none flex items-center justify-center relative"
                style={{
                  borderRadius: '18px',
                  padding: '0.75em 1.5em',
                  background: 'linear-gradient(90deg, #80dac1 0%, #5cb0ec 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                  margin: 0,
                  border: '1.5px solid #000',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  transition: 'transform 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                Show Advanced Options
              </button>
            </div>
            {showAdvanced && (
              <div className="mt-4 space-y-4 animate-fade-in">
                {/* Tax Section */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-2">
                  <h4 className="font-semibold text-slate-700 mb-2">Property Tax Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-slate-700 text-sm font-medium mb-1">City Tax Rate (%)</label>
                      <TaxRateInput value={cityTaxRate} onChange={setCityTaxRate} min={0} max={5} step={0.000001} className="input w-full text-right" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-sm font-medium mb-1">County Tax Rate (%)</label>
                      <TaxRateInput value={countyTaxRate} onChange={setCountyTaxRate} min={0} max={5} step={0.000001} className="input w-full text-right" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-sm font-medium mb-1">ISD Tax Rate (%)</label>
                      <TaxRateInput value={isdTaxRate} onChange={setIsdTaxRate} min={0} max={5} step={0.000001} className="input w-full text-right" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-sm font-medium mb-1">Community College Tax Rate (%)</label>
                      <TaxRateInput value={collegeTaxRate} onChange={setCollegeTaxRate} min={0} max={5} step={0.000001} className="input w-full text-right" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-slate-700 text-sm font-medium mb-1">Homestead Exemption ($)</label>
                    <FormattedNumberInput value={homesteadExemption} onChange={setHomesteadExemption} min={0} max={appraisedValue} step={100} className="input w-full text-right" />
                  </div>
                </div>
                {/* Insurance & PMI Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Home insurance rate</label>
                    <div className="flex items-center">
                      <TaxRateInput value={insuranceRate} onChange={setInsuranceRate} min={0} max={5} step={0.01} className="input w-full text-lg text-right rounded-full border-2 border-[var(--color-accent)]" />
                      <span className="text-slate-500 ml-2">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">PMI rate</label>
                    <div className="flex items-center">
                      <TaxRateInput value={pmiRate} onChange={setPmiRate} min={0} max={5} step={0.01} className="input w-full text-lg text-right rounded-full border-2 border-[var(--color-primary)]" />
                      <span className="text-slate-500 ml-2">%</span>
                    </div>
                  </div>
                </div>
                {/* HOA Fees */}
                <div className="mb-2">
                  <label className="block text-slate-700 font-semibold mb-1">HOA fees ($/mo)</label>
                  <FormattedNumberInput value={hoa} onChange={setHoa} min={0} max={2000} step={1} className="input w-full text-lg text-right rounded-full border-2 border-[var(--color-accent)]" />
                </div>
              </div>
            )}
          </div>
          {/* Right: Results */}
          <div className="w-full flex flex-col gap-4 md:gap-6">
            {/* Estimated Payment */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-700 mb-2 tracking-tight">Estimated Monthly Payment</h3>
              <div className="text-5xl font-extrabold text-[var(--color-primary)] mb-2 tracking-tight">{formatCurrency(totalMonthly)}</div>
              <div className="text-xs text-slate-400">(Estimates only. Actual payment may vary.)</div>
            </div>
            {/* Pie Chart */}
            <div className="bg-slate-50 rounded-2xl shadow p-4 flex flex-col items-center border border-slate-100">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={breakdownData.filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {breakdownData.filter(d => d.value > 0).map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Pie Chart Legend with Values */}
              <div className="w-full mt-4 flex flex-col gap-2">
                {breakdownData.filter(d => d.value > 0).map((entry, idx) => (
                  <div key={entry.name} className="flex flex-row items-center px-2 text-base text-slate-700 w-full">
                    <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
                      <span className="inline-block w-4 h-4 rounded-full" style={{ background: COLORS[idx % COLORS.length], border: '2px solid #fff', boxShadow: '0 0 0 1.5px ' + COLORS[idx % COLORS.length] }}></span>
                      <span className="truncate">{entry.name}</span>
                    </div>
                    <span className="font-semibold whitespace-nowrap ml-4">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Debt-to-Income Analysis */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-1">
                Debt-to-Income Analysis
                <InfoTooltip text="Based on Fannie Mae and Freddie Mac guidelines. Front-end DTI (housing expenses) should be ≤28% and back-end DTI (total debt) should be ≤36% for conventional loans." />
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-center mb-2">
                    <span className="text-sm text-slate-600">Front-end DTI</span>
                    <div className="text-lg font-bold text-slate-800">
                      {monthlyIncome > 0 ? `${((requiredMonthlyPayment / monthlyIncome) * 100).toFixed(1)}%` : 'N/A'}
                    </div>
                    <span className="text-xs text-slate-500">(Housing Expenses)</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-center mb-2">
                    <span className="text-sm text-slate-600">Back-end DTI</span>
                    <div className="text-lg font-bold text-slate-800">
                      {monthlyIncome > 0 ? `${(((requiredMonthlyPayment + otherDebts) / monthlyIncome) * 100).toFixed(1)}%` : 'N/A'}
                    </div>
                    <span className="text-xs text-slate-500">(Total Debt)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-600">Monthly Income:</span>
                <span className="font-semibold">{formatCurrency(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-600">Required Monthly Payment:</span>
                <span className="font-semibold">{formatCurrency(requiredMonthlyPayment)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-600">Other Debts:</span>
                <span className="font-semibold">{formatCurrency(otherDebts)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-sm font-semibold text-slate-700">Total Monthly Debt:</span>
                <span className="font-bold text-slate-800">{formatCurrency(requiredMonthlyPayment + otherDebts)}</span>
              </div>

              <div className="text-xs text-slate-600 bg-slate-100 rounded p-2">
                <strong>Disclaimer:</strong> This is an estimate based on your inputs only. Actual pre-qualification depends on credit score, employment history, down payment, and other factors. Consult with a qualified lender for accurate pre-qualification.
              </div>

              {/* DTI Guidelines Dropdown */}
              <div className="mt-4">
                <button
                  onClick={() => setShowDTIGuidelines(!showDTIGuidelines)}
                  className="w-full text-left p-3 bg-slate-200 rounded-lg border border-slate-300 hover:bg-slate-300 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-700">DTI Guidelines</span>
                  <svg 
                    className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${showDTIGuidelines ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDTIGuidelines && (
                  <div className="mt-2 p-3 bg-slate-100 rounded-lg border border-slate-200 animate-fade-in">
                    <div className="text-sm text-slate-700 space-y-2">
                      <div>
                        <p className="font-semibold text-slate-800">Conventional Loans (Fannie Mae/Freddie Mac):</p>
                        <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
                          <li><strong>Standard Guidelines:</strong> Typically look for a Front-end DTI (housing expenses) of ≤28%-31% and a Back-end DTI (total debt) of ≤36%.</li>
                          <li><strong>Flexibility with Automated Underwriting:</strong> Through the use of Automated Underwriting Systems (AUS), borrowers with strong compensating factors (e.g., high credit scores, significant cash reserves after closing, large down payments, stable employment) can often qualify with a Back-end DTI of up to 49.99% or occasionally 50%.</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">FHA Loans:</p>
                        <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
                          <li><strong>Standard Guidelines:</strong> Generally target a Front-end DTI (housing expenses) of ≤31% and a Back-end DTI (total debt) of ≤43%.</li>
                          <li><strong>Enhanced Flexibility:</strong> FHA loans are known for greater leniency. With strong compensating factors (e.g., high credit scores, substantial reserves), FHA's underwriting system can approve higher DTIs, commonly into the mid-50% range (e.g., up to 56.9% back-end DTI).</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Payment */}
            <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                Additional Payments
                <InfoTooltip text="Any extra amount you plan to pay toward your mortgage principal each month. This will reduce your total interest and pay off your loan faster." />
              </label>
              <div className="flex items-center">
                <FormattedNumberInput value={extraPayment} onChange={setExtraPayment} min={0} max={5000} step={10} className="input w-20 text-lg text-right rounded-full border-2 border-[var(--color-primary)]" />
                <select 
                  className="ml-2 px-2 py-1 pr-6 text-sm text-slate-500 focus:outline-none"
                  defaultValue="monthly"
                >
                  <option value="monthly">/month</option>
                  <option value="one-time">one-time</option>
                  <option value="quarterly">/quarter</option>
                  <option value="yearly">/year</option>
                </select>
              </div>
              
              {/* Biweekly Payment Schedule Option */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-1">
                  Payment Schedule Options
                  <InfoTooltip text="Compare monthly vs biweekly payment schedules. Biweekly payments (26 per year) can reduce your loan term and total interest." />
                </label>
                
                {(() => {
                  // Calculate biweekly payment (monthly payment / 2)
                  const biweeklyPayment = principalAndInterest / 2;
                  
                  // Calculate biweekly schedule impact
                  // 26 biweekly payments per year = 13 monthly payments worth
                  // This effectively adds 1 extra monthly payment per year
                  const extraMonthlyPaymentPerYear = principalAndInterest;
                  const totalExtraPayments = Math.floor(loanTerm) * extraMonthlyPaymentPerYear;
                  
                  // Calculate new loan term with biweekly payments PLUS additional payments
                  const biweeklyAmortization = generateAmortizationSchedule(
                    loanAmount,
                    monthlyInterestRate,
                    numberOfPayments,
                    principalAndInterest,
                    (extraMonthlyPaymentPerYear / 12) + Number(extraPayment) // Biweekly extra + user's additional payments
                  );
                  
                  const biweeklyPayoffMonth = biweeklyAmortization.payoffMonth;
                  const biweeklyTotalInterest = biweeklyAmortization.totalInterest;
                  const biweeklyYearsSaved = (loanTerm * 12 - biweeklyPayoffMonth) / 12;
                  const biweeklyInterestSaved = totalInterest - biweeklyTotalInterest;
                  
                  // Calculate biweekly-only impact (without additional payments) for comparison
                  const biweeklyOnlyAmortization = generateAmortizationSchedule(
                    loanAmount,
                    monthlyInterestRate,
                    numberOfPayments,
                    principalAndInterest,
                    extraMonthlyPaymentPerYear / 12 // Just biweekly extra, no additional payments
                  );
                  
                  const biweeklyOnlyInterestSaved = totalInterest - biweeklyOnlyAmortization.totalInterest;
                  const biweeklyOnlyYearsSaved = (loanTerm * 12 - biweeklyOnlyAmortization.payoffMonth) / 12;
                  
                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className={`rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                            selectedSchedule === 'monthly' 
                              ? 'bg-slate-100 border-2 border-slate-300' 
                              : 'bg-slate-50 border border-slate-200'
                          }`}
                          onClick={() => setSelectedSchedule('monthly')}
                        >
                          <h5 className="text-sm font-semibold text-slate-700 mb-2">Monthly Schedule</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payment:</span>
                              <span className="font-semibold">{formatCurrency(principalAndInterest)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payments/year:</span>
                              <span className="font-semibold">12</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Total interest:</span>
                              <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 font-semibold">Total amount paid:</span>
                              <span className="font-bold">{formatCurrency(loanAmount + totalInterest)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payoff time:</span>
                              <span className="font-semibold">{formatYearsMonths(payoffMonth)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Years saved:</span>
                              <span className={`font-semibold ${(basePayoffMonth - payoffMonth) / 12 > 0 ? 'text-teal-600' : 'text-slate-700'}`}>
                                {(basePayoffMonth - payoffMonth) / 12 > 0 ? ((basePayoffMonth - payoffMonth) / 12).toFixed(1) : '0'} years
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Interest saved:</span>
                              <span className={`font-semibold ${interestSaved > 0 ? 'text-teal-600' : 'text-slate-700'}`}>
                                {interestSaved > 0 ? formatCurrency(interestSaved) : '$0'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className={`rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                            selectedSchedule === 'biweekly' 
                              ? 'bg-slate-100 border-2 border-slate-300' 
                              : 'bg-slate-50 border border-slate-200'
                          }`}
                          onClick={() => setSelectedSchedule('biweekly')}
                        >
                          <h5 className="text-sm font-semibold text-slate-700 mb-2">Biweekly Schedule</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payment:</span>
                              <span className="font-semibold">{formatCurrency(biweeklyPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payments/year:</span>
                              <span className="font-semibold">26</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Total interest:</span>
                              <span className="font-semibold">{formatCurrency(biweeklyTotalInterest)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 font-semibold">Total amount paid:</span>
                              <span className="font-bold">{formatCurrency(loanAmount + biweeklyTotalInterest)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payoff time:</span>
                              <span className="font-semibold">{formatYearsMonths(biweeklyPayoffMonth)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Years saved:</span>
                              <span className={`font-semibold ${biweeklyYearsSaved > 0 ? 'text-teal-600' : 'text-slate-700'}`}>
                                {biweeklyYearsSaved.toFixed(1)} years
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Interest saved:</span>
                              <span className={`font-semibold ${biweeklyInterestSaved > 0 ? 'text-teal-600' : 'text-slate-700'}`}>
                                {formatCurrency(biweeklyInterestSaved)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Biweekly Savings Summary */}
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <h6 className="text-sm font-semibold text-slate-700 mb-2">Biweekly Schedule Benefits</h6>
                        <p className="text-xs text-slate-500 mt-2">
                          Biweekly payments add 1 extra monthly payment per year, reducing your loan term and total interest.
                          {extraPayment > 0 && ` Combined with your additional ${formatCurrency(extraPayment)}/month payment.`}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            {/* Amortization Schedule */}
            <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-700">Amortization Schedule</h4>
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setAmortizationView('graph')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      amortizationView === 'graph' 
                        ? 'bg-white text-slate-700 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Graph
                  </button>
                  <button
                    onClick={() => setAmortizationView('table')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      amortizationView === 'table' 
                        ? 'bg-white text-slate-700 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {amortizationView === 'graph' ? (
                  /* Balance Chart */
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-slate-700 mb-2">Loan Balance Over Time</h5>
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          tick={({ x, y, payload }) => (
                            <text
                              x={x}
                              y={y + 10}
                              textAnchor="middle"
                              fontSize={12}
                              fontWeight={400}
                              fill="#222"
                            >
                              {payload.value}
                            </text>
                          )}
                          label={{ value: 'Year', position: 'insideBottom', offset: -5, fontSize: 13 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }} 
                          tickFormatter={(value) => {
                            if (value >= 1000000) {
                              return `$${(value / 1000000).toFixed(1)}M`;
                            } else if (value >= 1000) {
                              return `$${(value / 1000).toFixed(0)}K`;
                            }
                            return `$${value.toLocaleString()}`;
                          }}
                          label={{ value: 'Balance', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                        />
                        <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={v => `Year ${v}`} />
                        <Line 
                          type="monotone" 
                          dataKey="originalBalance" 
                          stroke="#0077b6" 
                          strokeWidth={2} 
                          name={`${selectedSchedule === 'biweekly' ? 'Biweekly' : 'Monthly'} Schedule`}
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="#80dac1" 
                          strokeWidth={2} 
                          name={`${selectedSchedule === 'biweekly' ? 'Biweekly' : 'Monthly'} + Additional Payments`}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-blue-600"></div>
                        <span>{selectedSchedule === 'biweekly' ? 'Biweekly' : 'Monthly'} Schedule</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-teal-400"></div>
                        <span>{selectedSchedule === 'biweekly' ? 'Biweekly' : 'Monthly'} + Additional Payments</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Schedule Table */
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left py-2 px-2 font-semibold text-slate-800 w-16">Month</th>
                          <th className="text-right py-2 px-2 font-semibold text-slate-800 w-24">Balance</th>
                          <th className="text-right py-2 px-2 font-semibold text-slate-800 w-20">Payment</th>
                          <th className="text-right py-2 px-2 font-semibold text-slate-800 w-20">Interest</th>
                          <th className="text-right py-2 px-2 font-semibold text-slate-800 w-20">Principal</th>
                          <th className="text-right py-2 px-2 font-semibold text-slate-800 w-24">End Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displaySchedule.map((month, index) => (
                          <tr key={index} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            month.month % 12 === 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}>
                            <td className={`py-2 px-2 font-medium ${
                              month.month % 12 === 0 ? 'text-blue-700 font-semibold' : 'text-slate-700'
                            }`}>
                              {month.month}
                              {month.month % 12 === 0 && (
                                <span className="ml-1 text-xs text-blue-600 font-normal">
                                  (Y{Math.floor(month.month / 12)})
                                </span>
                              )}
                            </td>
                            <td className="text-right py-2 px-2 font-mono text-slate-700">{formatCurrency(month.balance + month.principal)}</td>
                            <td className="text-right py-2 px-2 font-mono text-slate-700">{formatCurrency(month.payment)}</td>
                            <td className="text-right py-2 px-2 font-mono text-slate-700">{formatCurrency(month.interest)}</td>
                            <td className="text-right py-2 px-2 font-mono text-slate-700">{formatCurrency(month.principal)}</td>
                            <td className="text-right py-2 px-2 font-mono text-slate-700">{formatCurrency(month.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* Show More/Less Button - only for table view */}
                {amortizationView === 'table' && displayAmortization.length > 12 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllMonths(!showAllMonths)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      {showAllMonths ? 'Show First 12 Months' : `Show All ${displayAmortization.length} Months`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;