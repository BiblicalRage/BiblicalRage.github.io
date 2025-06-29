import React, { useState, useEffect } from 'react';

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
      className={className}
      style={style}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

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

// Refinance Calculator Component
const RefinanceCalculator = () => {
  // Current loan state
  const [startingBalance, setStartingBalance] = useState(450000);
  const [startingTerm, setStartingTerm] = useState(30);
  const [yearsElapsed, setYearsElapsed] = useState(5);
  const [currentRate, setCurrentRate] = useState(6.5);
  const [currentLoanBalance, setCurrentLoanBalance] = useState(615000);
  const [remainingTerm, setRemainingTerm] = useState(25);
  
  // New loan state
  const [newRate, setNewRate] = useState(6.5);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(5000);
  const [cashOutAmount, setCashOutAmount] = useState(0);
  const [isCashOut, setIsCashOut] = useState(false);

  // Calculate remaining balance and term
  const calculateRemainingDetails = () => {
    const monthlyRate = currentRate / 100 / 12;
    const totalPayments = startingTerm * 12;
    const paymentsMade = yearsElapsed * 12;
    const remainingPayments = totalPayments - paymentsMade;
    
    // Calculate remaining balance
    if (monthlyRate === 0) {
      const remainingBalance = startingBalance * (remainingPayments / totalPayments);
      setCurrentLoanBalance(Math.round(remainingBalance));
    } else {
      const monthlyPayment = (startingBalance * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                            (Math.pow(1 + monthlyRate, totalPayments) - 1);
      
      let remainingBalance = startingBalance;
      for (let i = 0; i < paymentsMade; i++) {
        const interest = remainingBalance * monthlyRate;
        const principal = monthlyPayment - interest;
        remainingBalance -= principal;
      }
      setCurrentLoanBalance(Math.round(remainingBalance));
    }
    
    setRemainingTerm(remainingPayments / 12);
  };

  // Auto-calculate current monthly payment
  const calculateCurrentMonthlyPayment = () => {
    if (currentLoanBalance <= 0 || currentRate <= 0 || remainingTerm <= 0) return 0;
    
    const monthlyRate = currentRate / 100 / 12;
    const numberOfPayments = remainingTerm * 12;
    
    if (monthlyRate === 0) return currentLoanBalance / numberOfPayments;
    
    const compound = Math.pow(1 + monthlyRate, numberOfPayments);
    return (currentLoanBalance * monthlyRate * compound) / (compound - 1);
  };

  const currentMonthlyPayment = calculateCurrentMonthlyPayment();

  // Calculate new loan amount (remaining balance + cash out)
  const newLoanAmount = currentLoanBalance + cashOutAmount;

  // Auto-calculate new monthly payment
  const calculateNewMonthlyPayment = () => {
    if (newLoanAmount <= 0 || newRate <= 0 || newTerm <= 0) return 0;
    
    const monthlyRate = newRate / 100 / 12;
    const numberOfPayments = newTerm * 12;
    
    if (monthlyRate === 0) return newLoanAmount / numberOfPayments;
    
    const compound = Math.pow(1 + monthlyRate, numberOfPayments);
    return (newLoanAmount * monthlyRate * compound) / (compound - 1);
  };

  const newMonthlyPayment = calculateNewMonthlyPayment();

  // Update calculations when inputs change
  useEffect(() => {
    calculateRemainingDetails();
  }, [startingBalance, startingTerm, yearsElapsed, currentRate]);

  // Calculate refinance savings
  const calculateSavings = () => {
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const annualSavings = monthlySavings * 12;
    const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : 0;
    
    return {
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      breakEvenMonths: Math.round(breakEvenMonths * 10) / 10
    };
  };

  const savings = calculateSavings();

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-4xl mx-auto bg-white">
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 p-3 md:p-4 lg:p-8">
          {/* Inputs */}
          <div className="w-full flex flex-col gap-4 md:gap-6 lg:gap-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Refinance Calculator
            </h2>
            
            <p className="mb-4 md:mb-6 text-center text-sm md:text-base text-slate-600">
              Compare your current mortgage with a new loan to see if refinancing makes sense for you.<br />
              <span className="font-semibold">Estimates only, not a guarantee of approval or savings.</span>
            </p>

            {/* Current Loan Section */}
            <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Current Loan Information</h3>
              
              {/* Starting Balance */}
              <div className="mb-4">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                  Starting Balance
                  <InfoTooltip text="The original loan amount when you first took out your mortgage." />
                </label>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                  <input
                    type="range"
                    min={50000}
                    max={2000000}
                    step={1000}
                    value={startingBalance}
                    onChange={e => setStartingBalance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                  />
                  <FormattedNumberInput
                    value={startingBalance}
                    onChange={setStartingBalance}
                    min={50000}
                    max={2000000}
                    step={1000}
                    className="input w-full md:w-32 text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>

              {/* Starting Term */}
              <div className="mb-4">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                  Starting Term (Years)
                  <InfoTooltip text="The original length of your mortgage loan in years." />
                </label>
                <CustomDropdown
                  value={startingTerm}
                  onChange={setStartingTerm}
                  options={[
                    { value: 10, label: '10 years' },
                    { value: 15, label: '15 years' },
                    { value: 20, label: '20 years' },
                    { value: 25, label: '25 years' },
                    { value: 30, label: '30 years' }
                  ]}
                  className="w-full"
                  style={{ fontWeight: 600 }}
                />
              </div>

              {/* Years Elapsed */}
              <div className="mb-4">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                  Years Elapsed
                  <InfoTooltip text="How many years have passed since you took out your original mortgage." />
                </label>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                  <input
                    type="range"
                    min={0}
                    max={startingTerm}
                    step={1}
                    value={yearsElapsed}
                    onChange={e => setYearsElapsed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                  />
                  <FormattedNumberInput
                    value={yearsElapsed}
                    onChange={setYearsElapsed}
                    min={0}
                    max={startingTerm}
                    step={1}
                    className="input w-full md:w-32 text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>

              {/* Current Interest Rate */}
              <div className="mb-4">
                <div className="flex-1">
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                    Current Interest Rate
                    <InfoTooltip text="Your current mortgage interest rate." />
                  </label>
                  <div className="flex items-center">
                    <input
                      min="2"
                      max="10"
                      step="0.01"
                      className="input w-full text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                      type="number"
                      value={currentRate}
                      onChange={e => setCurrentRate(Number(e.target.value))}
                      style={{ fontWeight: 600 }}
                    />
                    <span className="text-slate-500 ml-2">%</span>
                  </div>
                </div>
              </div>

              {/* Current Payment Display */}
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Current Monthly Payment:</span>
                  <span className="text-lg font-semibold text-slate-800">{formatCurrency(currentMonthlyPayment)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-slate-600">Remaining Balance:</span>
                  <span className="text-sm font-medium text-slate-700">{formatCurrency(currentLoanBalance)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-slate-600">Remaining Term:</span>
                  <span className="text-sm font-medium text-slate-700">{remainingTerm.toFixed(1)} years</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Auto-calculated from your loan details</p>
              </div>
            </div>

            {/* New Loan Section */}
            <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">New Loan</h3>
              
              {/* Cash Out Option */}
              <div className="mb-4">
                <label className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCashOut}
                    onChange={(e) => setIsCashOut(e.target.checked)}
                    className="mr-3 w-4 h-4 text-[var(--color-primary)] bg-slate-100 border-slate-300 rounded focus:ring-[var(--color-primary)] focus:ring-2"
                  />
                  <span className="text-slate-700 font-semibold text-sm md:text-base">Cash-Out Refinance</span>
                </label>
                <p className="text-xs text-slate-500 ml-7 mb-3">Check this if you want to borrow additional money beyond your remaining balance</p>
              </div>

              {/* Cash Out Amount (if enabled) */}
              {isCashOut && (
                <div className="mb-4">
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                    Cash-Out Amount
                    <InfoTooltip text="Additional money you want to borrow beyond your remaining balance." />
                  </label>
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                    <input
                      min={0}
                      max={200000}
                      step={1000}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                      type="range"
                      value={cashOutAmount}
                      onChange={e => setCashOutAmount(Number(e.target.value))}
                    />
                    <FormattedNumberInput
                      value={cashOutAmount}
                      onChange={setCashOutAmount}
                      min={0}
                      max={200000}
                      step={1000}
                      className="input w-full md:w-32 text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">This amount will be added to your remaining balance</p>
                </div>
              )}

              {/* New Interest Rate */}
              <div className="mb-4">
                <div className="flex-1">
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                    New Interest Rate
                    <InfoTooltip text="The interest rate you could get on a new refinanced loan." />
                  </label>
                  <div className="flex items-center">
                    <input
                      min="2"
                      max="10"
                      step="0.01"
                      className="input w-full text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                      type="number"
                      value={newRate}
                      onChange={e => setNewRate(Number(e.target.value))}
                      style={{ fontWeight: 600 }}
                    />
                    <span className="text-slate-500 ml-2">%</span>
                  </div>
                </div>
              </div>

              {/* New Term */}
              <div className="mb-4">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                  New Term (Years)
                  <InfoTooltip text="The length of your new refinanced loan." />
                </label>
                <CustomDropdown
                  value={newTerm}
                  onChange={setNewTerm}
                  options={[
                    { value: 10, label: '10 years' },
                    { value: 15, label: '15 years' },
                    { value: 20, label: '20 years' },
                    { value: 25, label: '25 years' },
                    { value: 30, label: '30 years' }
                  ]}
                  className="w-full"
                  style={{ fontWeight: 600 }}
                />
              </div>

              {/* Closing Costs */}
              <div className="mb-4">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1 text-sm md:text-base">
                  Closing Costs
                  <InfoTooltip text="The total cost to close on your refinanced loan, including fees and charges." />
                </label>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                  <input
                    min={0}
                    max={10000}
                    step={100}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                    type="range"
                    value={closingCosts}
                    onChange={e => setClosingCosts(Number(e.target.value))}
                  />
                  <FormattedNumberInput
                    value={closingCosts}
                    onChange={setClosingCosts}
                    min={0}
                    max={10000}
                    step={100}
                    className="input w-full md:w-32 text-base md:text-lg text-right rounded-full border-2 border-[var(--color-primary)]"
                    style={{ fontWeight: 600 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Typical range: $2,000 - $6,000</p>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="w-full flex flex-col gap-4 md:gap-6">
            {/* New Monthly Payment & Loan Amount */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-700 mb-2 tracking-tight">New Monthly Payment</h3>
              <div className="text-5xl font-extrabold text-[var(--color-primary)] mb-4 tracking-tight">{formatCurrency(newMonthlyPayment)}</div>
              
              {/* New Loan Amount */}
              <div className="w-full mb-4">
                <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-1 text-sm text-center justify-center">
                  New Loan Amount
                  <InfoTooltip text="Total amount of your new refinanced loan." />
                </label>
                <div className="bg-slate-100 rounded-lg px-3 py-2 text-slate-700 font-semibold text-lg text-center">
                  {formatCurrency(newLoanAmount)}
                </div>
                <p className="text-xs text-slate-500 mt-1 text-center">
                  {isCashOut ? `Remaining balance + ${formatCurrency(cashOutAmount)} cash-out` : 'Same as remaining balance'}
                </p>
              </div>
              
              <div className="text-xs text-slate-400">(Estimates only. Actual payment may vary.)</div>
            </div>

            {/* Refinance Summary & Analysis */}
            <div className="bg-slate-50 rounded-2xl shadow p-4 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-700 mb-3 tracking-tight flex items-center gap-1">
                Refinance Summary & Analysis
                <InfoTooltip text="Detailed breakdown of your refinancing savings and costs." />
              </h3>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-center mb-2">
                    <span className="text-sm text-slate-600">Monthly Savings</span>
                    <div className="text-lg font-bold text-slate-800">
                      {formatCurrency(savings.monthlySavings)}
                    </div>
                    <span className="text-xs text-slate-500">(vs. current payment)</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-center mb-2">
                    <span className="text-sm text-slate-600">Break-even</span>
                    <div className="text-lg font-bold text-slate-800">
                      {savings.breakEvenMonths > 0 ? `${savings.breakEvenMonths} months` : 'N/A'}
                    </div>
                    <span className="text-xs text-slate-500">(to recover costs)</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Current Payment:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(currentMonthlyPayment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">New Payment:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(newMonthlyPayment)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                  <span className="text-sm font-semibold text-slate-700">Monthly Savings:</span>
                  <span className={`font-bold text-lg ${savings.monthlySavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {savings.monthlySavings >= 0 ? '+' : ''}{formatCurrency(savings.monthlySavings)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Annual Savings:</span>
                  <span className={`font-semibold ${savings.annualSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(savings.annualSavings)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Closing Costs:</span>
                  <span className="font-semibold">{formatCurrency(closingCosts)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                  <span className="text-sm font-semibold text-slate-700">Net Annual Savings:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(savings.annualSavings - (closingCosts / (savings.breakEvenMonths > 0 ? savings.breakEvenMonths / 12 : 1)))}</span>
                </div>
                {isCashOut && cashOutAmount > 0 && (
                  <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                    <span className="text-sm font-semibold text-slate-700">Cash-Out Amount:</span>
                    <span className="font-bold text-green-600">{formatCurrency(cashOutAmount)}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-600 bg-slate-100 rounded p-2 mt-4">
                <strong>Disclaimer:</strong> This is an estimate based on your inputs only. Actual refinancing costs and savings depend on your specific situation, credit score, and lender terms. Consult with a qualified lender for accurate estimates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefinanceCalculator; 