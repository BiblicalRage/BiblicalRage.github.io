import React, { useState, useEffect } from 'react';

// Refinance Calculator Component
const RefinanceCalculator = () => {
  // Current loan state
  const [startingBalance, setStartingBalance] = useState(750000);
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

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
    <div className="card w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">Refinance Calculator</h2>
      <p className="mb-4 md:mb-6 text-center text-sm md:text-base text-slate-600">
        Compare your current mortgage with a new loan to see if refinancing makes sense for you.<br />
        <span className="font-semibold">Estimates only, not a guarantee of approval or savings.</span>
      </p>

      {/* Current Loan Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Current Loan Information</h3>
        
        {/* Current Loan Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Starting Balance</label>
            <input 
              type="number" 
              value={startingBalance} 
              onChange={e => setStartingBalance(Number(e.target.value))} 
              className="input mb-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Starting Term (Years)</label>
            <input 
              type="number" 
              value={startingTerm} 
              onChange={e => setStartingTerm(Number(e.target.value))} 
              className="input mb-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Years Elapsed</label>
            <input 
              type="number" 
              value={yearsElapsed} 
              onChange={e => setYearsElapsed(Number(e.target.value))} 
              className="input mb-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
            <input 
              type="number" 
              step="0.1" 
              value={currentRate} 
              onChange={e => setCurrentRate(Number(e.target.value))} 
              className="input mb-2" 
            />
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">New Loan</h3>
        
        {/* Cash Out Option */}
        <div className="mb-4">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isCashOut}
              onChange={(e) => setIsCashOut(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-slate-700">Cash-Out Refinance</span>
          </label>
          {isCashOut && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cash-Out Amount</label>
              <input 
                type="number" 
                value={cashOutAmount} 
                onChange={e => setCashOutAmount(Number(e.target.value))} 
                className="input mb-2" 
                placeholder="0"
              />
              <p className="text-xs text-slate-500">This amount will be added to your remaining balance</p>
            </div>
          )}
        </div>

        {/* New Loan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Loan Amount</label>
            <div className="bg-slate-100 rounded-lg px-3 py-2 text-slate-700 font-medium">
              {formatCurrency(newLoanAmount)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isCashOut ? `Remaining balance + ${formatCurrency(cashOutAmount)} cash-out` : 'Same as remaining balance'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
            <input 
              type="number" 
              step="0.1" 
              value={newRate} 
              onChange={e => setNewRate(Number(e.target.value))} 
              className="input mb-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Term (Years)</label>
            <select 
              value={newTerm} 
              onChange={e => setNewTerm(Number(e.target.value))} 
              className="input mb-2"
            >
              <option value={10}>10 years</option>
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Closing Costs</label>
            <input 
              type="number" 
              value={closingCosts} 
              onChange={e => setClosingCosts(Number(e.target.value))} 
              className="input" 
            />
            <p className="text-xs text-slate-500 mt-1">Typical range: $2,000 - $6,000</p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
        <h3 className="text-base font-semibold text-slate-800 mb-3 text-center">Refinance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Current Payment:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(currentMonthlyPayment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">New Payment:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(newMonthlyPayment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Monthly Savings:</span>
              <span className={`font-semibold ${savings.monthlySavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {savings.monthlySavings >= 0 ? '+' : ''}{formatCurrency(savings.monthlySavings)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Closing Costs:</span>
              <span className="font-semibold">{formatCurrency(closingCosts)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Break-even Time:</span>
              <span className="font-semibold text-blue-600">
                {savings.breakEvenMonths > 0 ? `${savings.breakEvenMonths} months` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Annual Savings:</span>
              <span className={`font-semibold ${savings.annualSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(savings.annualSavings)}
              </span>
            </div>
          </div>
        </div>
        {isCashOut && cashOutAmount > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Cash-Out Amount:</span>
              <span className="font-semibold text-green-600">{formatCurrency(cashOutAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Educational Content */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-800 mb-2">When to Consider Refinancing</h4>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><strong>Lower Interest Rates:</strong> If current rates are significantly lower than your existing rate</li>
          <li><strong>Improved Credit Score:</strong> Better credit may qualify you for better rates</li>
          <li><strong>Change in Loan Type:</strong> Switching from adjustable to fixed rate</li>
          <li><strong>Cash-Out Refinance:</strong> Accessing home equity for major expenses</li>
        </ul>
      </div>

      {/* Disclaimers */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-2">
        <h4 className="font-semibold text-slate-800 mb-2">Important Disclaimers</h4>
        <ul className="list-disc pl-5 text-xs text-slate-500 space-y-1">
          <li>This calculator provides estimates only and is not a guarantee of loan approval</li>
          <li>Actual rates and terms may vary based on credit score, income, and other factors</li>
          <li>Closing costs may include appraisal fees, title insurance, and other charges</li>
          <li>Consult with a mortgage professional for personalized advice</li>
        </ul>
      </div>
    </div>
  );
};

export default RefinanceCalculator; 